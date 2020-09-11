package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.*;
import vut.fit.dp.spravarizik.repository.*;
import vut.fit.dp.spravarizik.uniteClass.ProjectCard;
import vut.fit.dp.spravarizik.uniteClass.ProjectOfUser;

import java.util.*;
/**
 * Service sluzba pro projekt. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd. Krome projektu ale obsluhuje i dalsi tridy, ktere maji primou navaznost/zavislost
 * na projektu - kartu projektu, swot a prideleni uzivatelu k projektu, pridelena rizika k projektu
 *
 * @author Sara Skutova
 * */
@Service
public class ProjektService {

    @Autowired
    ProjektRepository projektRepository;

    @Autowired
    UzivProjektRepository uzivProjektRepository;

    @Autowired
    UzivProjektRizikoRepozitory uzivProjektRizikoRepozitory;

    @Autowired
    SWOTRepository swotRepository;

    @Autowired
    UzivatelRepository uzivatelRepository;

    @Autowired
    DotazOtazOdpoRepository dotazOtazOdpoRepository;

    @Autowired
    DotaznikRepository dotaznikRepository;

    @Autowired
    OtazkaRepository otazkaRepository;

    @Autowired
    OdpovedRepository odpovedRepository;

    /**
     * Preposle objekt projektu k ulozeni. Pri editaci se k novemu objektu pripoji zavisle seznamy potomku - musi jinak se
     * SMAZOU. Pokud jde o novy projekt a pridavaji se zaroven i s pridelenymi resiteli (plati i na managera), tak se zaroven tvori i objekty
     * UzivProjekt a tem se musi priradit projekt a uzivatel
     * */
    public Projekt saveOrUpdate (Projekt projekt) {

        //pripojeni seznamu potomku
        Optional<Projekt> testProject = projektRepository.findById(projekt.getId());
        if(testProject.isPresent()) {
            projekt.setItemUzProj(testProject.get().getItemUzProj());
            projekt.setItemUzProjRiz(testProject.get().getItemUzProjRiz());
            projekt.setItemDOO(testProject.get().getItemDOO());
            projekt.setSwot(testProject.get().getSwot());
            projekt.setDotaznikProjektu(testProject.get().getDotaznikProjektu());
        }
        else { //tohle je pro pridavani projektu spolecne i s resiteli a managerem
            for (UzivProjekt uzivProjekt : projekt.getItemUzProj()) {
                uzivProjekt.setProjekt(projekt);
                Optional<Uzivatel> uzivatel = uzivatelRepository.findById(uzivProjekt.getUzivatel().getId());
                if (uzivatel.isPresent()) { //tohle by vzdy melo vyjit
                    uzivProjekt.setUzivatel(uzivatel.get());

                }
            }
        }

        return projektRepository.save(projekt);
    }

    /**
     * Pro uloneni swot, pokud by to bylo u te funkce pred tim, tak nerozeznam jen tak, zda se swod zmenilo nebo ne - hrozi
     * ze se swod bude premazavat
     * */
    public Projekt saveOrUpdateSWOT(Projekt projekt) {

        //pripojeni seznamu potomku
        Optional<Projekt> testProject = projektRepository.findById(projekt.getId());
        if(testProject.isPresent()) {
            projekt.setItemUzProj(testProject.get().getItemUzProj());
            projekt.setItemUzProjRiz(testProject.get().getItemUzProjRiz());
            projekt.setItemDOO(testProject.get().getItemDOO());
            projekt.setDotaznikProjektu(testProject.get().getDotaznikProjektu());
        }

        return projektRepository.save(projekt);
    }

    /**
     * Pro ulozeni prirazeni na projektu
     * */
    public Projekt saveSurvey(Projekt projekt) {

        Optional<Dotaznik> dotaznik = dotaznikRepository.findById(projekt.getDotaznikProjektu().getId());
        if(dotaznik.isPresent()) {
            projekt.setDotaznikProjektu(dotaznik.get());
        }

        //pripojeni seznamu potomku
        Optional<Projekt> testProject = projektRepository.findById(projekt.getId());
        if(testProject.isPresent()) {
            projekt.setItemUzProj(testProject.get().getItemUzProj());
            projekt.setItemUzProjRiz(testProject.get().getItemUzProjRiz());
        }

        return projektRepository.save(projekt);
    }


    /**
     * Funcke pro ulozeni informaci ja uzivatel odpovidal na dany dotaznik, defakto by projekt nemel mit odpoved od daneho uzivatele na dany dotaznik, ale pro pripad
     * se to radeji zkontroluje, smaze a nahrajou nove hodnoty
     * */
    public List<DotazOtazOdpo> saveOrUpdateSurveyInfo(List<DotazOtazOdpo> dotazOtazOdpos, long idProj, long idSurv, long idUser) {

        Optional<Projekt> projekt = projektRepository.findById(idProj);
        Optional<Dotaznik> dotaznik = dotaznikRepository.findById(idSurv);
        Optional<Uzivatel> uzivatel = uzivatelRepository.findById(idUser);
        if (projekt.isPresent() && dotaznik.isPresent() && uzivatel.isPresent()) {
/*
            List<DotazOtazOdpo> helpList = new ArrayList<>();

            //////////////////////////////////////////////MOZNA NENI POTREBA//////////////////////////////////////////////////////
            System.out.println(projekt.get().getItemDOO().size() + " DOO SIZE PRED");

            //iterator na zacatku ukazuje pred prvni item, hasNext testuje zda ma nejaky dalsi item, next ziska nasledujici item
            for (Iterator<DotazOtazOdpo> iterator = projekt.get().getItemDOO().iterator(); iterator.hasNext();) {
                DotazOtazOdpo test = iterator.next();
                //test zda uz uzivatel odpovedel, zacina se od uzivatele aby to bylo rychlejsi
                // to testovanai na projekt je asi redundantni - TODO popremyslej
                if (test.getUzivatelDOO().getId() == idUser && test.getDotaznikDOO().getId() == idSurv && test.getProjektDOO().getId() == idProj) {
                    //iterator.remove(); //odstrani to dany prvek
                    //projekt.get().removeFromDOO(test);
                    helpList.add(test);

                }
            }
            System.out.println(projekt.get().getItemDOO().size() + " DOO SIZE PO");

            for (DotazOtazOdpo dotazOtazOdpo : helpList) {
                projekt.get().removeFromDOO(dotazOtazOdpo);
            }

            helpList.clear();
            projekt.get().getItemDOO().clear();*/
            //////////////////////////////////////////////MOZNA NENI POTREBA//////////////////////////////////////////////////////
            List<DotazOtazOdpo> testList = dotazOtazOdpoRepository.findByIdProjektIDAndIdUzivatelIDAndIdDotaznikID(idProj, idUser, idSurv);
            dotazOtazOdpoRepository.deleteAll(testList);



            for(DotazOtazOdpo dotazOtazOdpo : dotazOtazOdpos) {
                dotazOtazOdpo.setProjektDOO(projekt.get());
                dotazOtazOdpo.setDotaznikDOO(dotaznik.get());
                dotazOtazOdpo.setUzivatelDOO(uzivatel.get());
                Optional<Otazka> otazka = otazkaRepository.findById(dotazOtazOdpo.getOtazkaDOO().getId());
                if (otazka.isPresent()) {
                    dotazOtazOdpo.setOtazkaDOO(otazka.get());
                }
                Optional<Odpoved> odpoved = odpovedRepository.findById(dotazOtazOdpo.getOdpovedDOO().getId());
                if (odpoved.isPresent()) {
                    dotazOtazOdpo.setOdpovedDOO(odpoved.get());
                }
            }
        }

        return dotazOtazOdpoRepository.saveAll(dotazOtazOdpos);


    }

    /**
     * Ulozeni objektu UzivProjekt. Vyuziva se kdyz se k projektu prirazuji/odhlasuji uzivatele mimo vytvareni projektu.
     * Presneji se jedna o ulozeni managera/vedouciho projektu.
     * */
    public UzivProjekt saveOrUpdate(UzivProjekt uzivProjekt, Long id) {
        // 2 vecy
        //upravit stareho managera - datum konce = datum zacatku noveho, aktivni zmenit na false
            //stary manager je aktivni a je vedouci na aktualnim projektu, mel by byt pouze jeden, ale ztim je to jako pole
        //ulozit noveho/updatovat managera - proste to jenom ulozit
        Optional<UzivProjekt> oldMng = uzivProjektRepository.findByIdProjectIDAndVedouciTrueAndAktivniTrue(id);
        if (oldMng.isPresent()) {
            UzivProjekt mng = oldMng.get();
            mng.setDateEnd(uzivProjekt.getDateStart());
            mng.setAktivni(false);
            uzivProjektRepository.save(mng);
        }
        return uzivProjektRepository.save(uzivProjekt);
    }

    /**
     * ULozeni objektu UzivProjektRiziko. Pouzivate se pro pridavani i pro editaci rizika.
     * */
    public UzivProjektRiziko saveOrUpdate(UzivProjektRiziko uzivProjektRiziko, Long id) {
        //editace a pridavani bude prakticky to same
        //vyhleda riziko projektu podle id projektu a id rizika
        Optional<UzivProjektRiziko> test = uzivProjektRizikoRepozitory.findByIdProjektAndIdRiziko(id, uzivProjektRiziko.getIdRizikoR().getId());
        if (test.isPresent()) { //tohle riziko uz k projektu bylo prideleno
            // je spravce stale stejnej? jenom se zmeni hodnoty atributu staci ulozit
            if (test.get().getIdUzivatelR().getId() != uzivProjektRiziko.getIdUzivatelR().getId()) { //je tam jinaci spravce, hodnota se musi odstranit, jinak to bude delat problemy, kdyz
                uzivProjektRizikoRepozitory.delete(test.get());
            }
        }

        return uzivProjektRizikoRepozitory.save(uzivProjektRiziko);
    }

    /**
     * Ulozeni seznamu resitelu. Vyuziva se kdyz se k projektu prirazuji/odhlasuji uzivatele mimo vytvareni projektu.
     * Jedna se ulozeni resitelu, tady se neuklada manager.
     * */
    public List<UzivProjekt> saveOrUpdateUsers(List<UzivProjekt> uzivProjekts, Long id) {
        //nacist vsechny aktivni co tam jsou
        List<UzivProjekt> oldUziv = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(id);
        List<UzivProjekt> saveUziv = new ArrayList<>();
        Date today = Calendar.getInstance().getTime();

        for(UzivProjekt uzProj : oldUziv) {
            //prohleda poslane pole, hleda shohdu na uzivatelske ID uzivatele, vrati prvnni vyskyt o objektu Option, pokud nenalezne, tak Option bude prazdny
            Optional<UzivProjekt> uziv = uzivProjekts.stream().filter(user -> user.getUzivatel().getId() == uzProj.getUzivatel().getId()).findFirst();
            if (!uziv.isPresent()) { //uzivatel se nenasel - musi se "smazat"
                UzivProjekt updateItem = uzProj;
                updateItem.setDateEnd(today);
                updateItem.setAktivni(false);
                saveUziv.add(updateItem);
            }
        }

        uzivProjektRepository.saveAll(saveUziv);
        return uzivProjektRepository.saveAll(uzivProjekts);
    }

    /**
     * Sluzba na tvorbu karty projektu. Nacte projekt a manazera daneho projektu. Ze ziskanych informaci pak vytvori pozadovanou katru.
     * To provede pro kazdy projekt. Vsechny karty pak vrati.
     * */
    public Iterable<ProjectCard> findAllProjectCards() {
        Iterable<Projekt> proj = projektRepository.findAll();
        List<ProjectCard> projectCards = new ArrayList<ProjectCard>();

        //pro kazdu projekt vytvori kartu
        for(Projekt projekt : proj) {
            //List<UzivProjekt> uzivProjekts = uzivProjektRepository.findByIdProjektAndVedouciTrue(projekt);
            Optional<UzivProjekt> uzivProjekts = uzivProjektRepository.findByIdProjectIDAndVedouciTrueAndAktivniTrue(projekt.getId());
            if(uzivProjekts.isPresent()) {
                ProjectCard newProjectCard = new ProjectCard(projekt, uzivProjekts.get().getUzivatel().getNazev());
                projectCards.add(newProjectCard);
            }
            else { //neco se stalo, asi manazer byl smazanej
                ProjectCard newProjectCard = new ProjectCard(projekt, "");
                projectCards.add(newProjectCard);
            }
        }

        return projectCards;
    }

    /**
     * Najde vsechny projekty na kterych pracuje dany uzivatel - jeho stav je aktivni, a vrati karty techto projektu
     * */
    public Iterable<ProjectCard> findAllProjectCardsOfUser(long id) {
        List<UzivProjekt> uzivProjekts = uzivProjektRepository.findByIdUzivatelIDAndVedouciFalseAndAktivniTrue(id);
        List<ProjectCard> projectCards = new ArrayList<ProjectCard>();

        //projit vsechno, najit projekty, a ziskat infa
        for (UzivProjekt uzivProjekt : uzivProjekts) {
            Projekt projekt = uzivProjekt.getProjekt();
            Optional<UzivProjekt> manager = uzivProjektRepository.findByIdProjectIDAndVedouciTrueAndAktivniTrue(projekt.getId());
            if(manager.isPresent()) {
                ProjectCard newProjectCard = new ProjectCard(projekt, manager.get().getUzivatel().getNazev());
                projectCards.add(newProjectCard);
            }
            else { //neco se stalo, asi manazer byl smazanej
                ProjectCard newProjectCard = new ProjectCard(projekt, "");
                projectCards.add(newProjectCard);
            }
        }

        return projectCards;
    }

    /**
     * Pro daneho uzivatele - dle id, vyhleda jeho aktivni projekty, a vrati custom object ProjectOfUser
     * */
    public Iterable<ProjectOfUser> findAllProjectsOfUser(long id) {
        Iterable<Projekt>projekts = projektRepository.findByAktivniTrue();
        List<ProjectOfUser> projectOfUsers = new ArrayList<>();

        for (Projekt projekt : projekts) {
            List<UzivProjekt> uzivProjekts = projekt.getItemUzProj(); // ti co na projektu pracuji
            Optional<UzivProjekt> uzivProjekt = uzivProjekts.stream().filter(user -> user.isAktivni() && user.getUzivatel().getId() == id).findFirst(); //tohle by melo najit uzivatele, zda na tom projektu pracuje
            if (uzivProjekt.isPresent()) {
                ProjectOfUser projectOfUser = new ProjectOfUser(projekt.getId(), projekt.getNazev(), uzivProjekt.get().getDateStart(), true);
                projectOfUsers.add(projectOfUser);
            }
        }

        return projectOfUsers;
    }

    /**
     * Pro daneho managera - dle id, vyhleda jeho aktivni projekty, a vrati custom object ProjectOfUser
     * */
    public Iterable<ProjectOfUser> findAllProjectsOfManager(long id, boolean active) {

        List<Projekt> projekts = new ArrayList<>();

        //vyhledavaji se aktivni projekty
        if (active){
            projekts = projektRepository.findByAktivniTrue();
        } else { //neaktivni projekty
            projekts = projektRepository.findByAktivniFalse();
        }

        List<ProjectOfUser> projectOfUsers = new ArrayList<>();

        for (Projekt projekt : projekts) {
            List<UzivProjekt> uzivProjekts = projekt.getItemUzProj(); // ti co na projektu pracuji
            Optional<UzivProjekt> uzivProjekt = uzivProjekts.stream().filter(user -> user.isAktivni() && user.isVedouci() && user.getUzivatel().getId() == id).findFirst(); //tohle by melo najit uzivatele, zda na tom projektu pracuje a je vedouci
            if (uzivProjekt.isPresent()) {
                if (active) {
                    ProjectOfUser projectOfUser = new ProjectOfUser(projekt.getId(), projekt.getNazev(), projekt.getStart(), true);
                    projectOfUsers.add(projectOfUser);
                } else {
                    ProjectOfUser projectOfUser = new ProjectOfUser(projekt.getId(), projekt.getNazev(), projekt.getKonec(), false);
                    projectOfUsers.add(projectOfUser);
                }
            }
        }

        return projectOfUsers;
    }

    /**
     * Vrati projekty podle aktivity
     * */
    public Iterable<ProjectOfUser> findAllProjectsOfActivity(boolean activity) {
        List<Projekt> projekts = new ArrayList<>();

        //vyhledavaji se aktivni projekty
        if (activity){
            projekts = projektRepository.findByAktivniTrue();
        } else { //neaktivni projekty
            projekts = projektRepository.findByAktivniFalse();
        }

        List<ProjectOfUser> projectOfUsers = new ArrayList<>();

        for (Projekt projekt : projekts) {
            if (activity) {
                ProjectOfUser projectOfUser = new ProjectOfUser(projekt.getId(), projekt.getNazev(), projekt.getStart(), true);
                projectOfUsers.add(projectOfUser);
            } else {
                ProjectOfUser projectOfUser = new ProjectOfUser(projekt.getId(), projekt.getNazev(), projekt.getKonec(), false);
                projectOfUsers.add(projectOfUser);
            }
        }

        return projectOfUsers;
    }

    /**
     * Vrati vsechna data dotazniku, ktery byl pridelen k projektu - jedna se o informace jak uzivatel odpovidal na dotaznik
     * */
    public Iterable<DotazOtazOdpo> findAllSurveyData(long id) {
        return dotazOtazOdpoRepository.findByIdProjektID(id);
    }


    /**
     * Vrati vsechna rizika pridelena k danemu projektu
     * */
    public Iterable<UzivProjektRiziko> findAllProjectRisks(long id) {
        return uzivProjektRizikoRepozitory.findByIdProjekt(id);
    }

    /**
     * Vrati vsechny uzivatele daneho projektu
     * */
    public Iterable<UzivProjekt> findAllProjectUsers(long id) {
        return uzivProjektRepository.findByIdProjectID(id);
    }

    /**
     * Vrati vsechny projekty
     * */
    public Iterable<Projekt> findAll() {
        return projektRepository.findAll();
    }

    /**
     * Vrati pozadovany projekt dle jeho id
     * */
    public Optional<Projekt> findById(Long id) {
        return projektRepository.findById(id);
    }

    /**
     * Smaze pozadovany projekt dle jeho id
     * */
    public void delete(Long id) {
        Optional<Projekt> projekt = findById(id);

        if(projekt.isPresent()) {
            projektRepository.delete(projekt.get());
        }
    }

    /**
     * Smaze SWOT analyzu daneho projektu. Pro spravne smazani se jak ze swot tabulky, tak se musi i ulozit novy objekt
     * projektu bez SWOT.
     * */
    public void deleteSwot(Long id) {
        Optional<Projekt> projekt = findById(id);

        if(projekt.isPresent()) {
            Projekt test = projekt.get();
            if(test.getSwot() != null) {
                SWOT swot = test.getSwot();
                test.setSwot(null);
                projektRepository.save(test);
                swotRepository.delete(swot);
            }
        }
    }


    /**
     * Smaze riziko z projektu. Neboli odstrani dany zaznam z tabulky UzivProjektRiziko
     * */
    public void deleteRisk(Long id, Long idRisk) {
        Optional<UzivProjektRiziko> uzivProjektRiziko = uzivProjektRizikoRepozitory.findByIdProjektAndIdRiziko(id, idRisk);
        if (uzivProjektRiziko.isPresent()) {
            uzivProjektRizikoRepozitory.delete(uzivProjektRiziko.get());
            uzivProjektRizikoRepozitory.flush();
        }
    }


    /**
     * Odstrani dotaznik z projektu
     * */
    public void removeSurvey(Long id) {
        Optional<Projekt> projekt = projektRepository.findById(id);
        if (projekt.isPresent()) {
            Projekt newProject = projekt.get();
            newProject.setDotaznikProjektu(null);
            newProject.getItemDOO().clear();
            projektRepository.save(newProject);
        }
    }

}
