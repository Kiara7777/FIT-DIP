package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.*;
import vut.fit.dp.spravarizik.repository.KategorieRepository;
import vut.fit.dp.spravarizik.repository.ProjektRepository;
import vut.fit.dp.spravarizik.repository.RegistrRizikRepository;
import vut.fit.dp.spravarizik.repository.UzivatelRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service sluzba pro registr rizik aka rizika. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class RegistrRizikService {

    @Autowired
    private RegistrRizikRepository registrRizikRepository;

    @Autowired
    private KategorieRepository kategorieRepository;

    @Autowired
    UzivatelRepository uzivatelRepository;

    @Autowired
    ProjektRepository projektRepository;

    /**
     * Preposle objekt rizika k ulozeni. Pokud riziko nema kategorii, tak se automaticky priradi kategorie neprirazeno. Pri
     * editaci se zkopiruji zaznamy potomku z databaze do prave ukladaneho objektu - jinak se smazou.
     * */
    public RegistrRizik saveOrUpdate(RegistrRizik registrRizik) {

        //prideleni kategorie pokud neni zadana
        if(registrRizik.getKategorie() == null) {
            Optional<Kategorie> kategorie = kategorieRepository.findById(Long.valueOf(1));

            if (kategorie.isPresent())
                registrRizik.setKategorie(kategorie.get());

        }
        else { //prideleni objektu kategorie riziki (ze klienta se zasila pouze id, ne cely objekt, musi se dodatecne  pridelit)
            Optional<Kategorie> kategorie = kategorieRepository.findById(registrRizik.getKategorie().getId());

            if (kategorie.isPresent())
                registrRizik.setKategorie(kategorie.get());

        }

        //tohle je pro editaci objektu co uz v DB je, musi se provest dodatecna prirazeni jinac se nechtit smazou zaznamy zavisle na tomto riziky
        Optional<RegistrRizik> testRegistrRizik = registrRizikRepository.findById(registrRizik.getId());
        if(testRegistrRizik.isPresent()) {

            List<UzivProjektRiziko> listItems = testRegistrRizik.get().getItemUzProjRiz();


            if (registrRizik.getItemUzProjRiz().size() != 0) {
                for (UzivProjektRiziko uzivProjektRiziko : registrRizik.getItemUzProjRiz()) { //kazdemu itemu co tam je, ale realne tam z appky rpijde max 1

                    /////// OBJEKTU CO MI PRISEL S RIZIKEM PRIRADIM POTREBNE POLICKA ////////
                    //ulozeni rizika
                    uzivProjektRiziko.setIdRizikoR(registrRizik);

                    //ulozeni uzivatele
                    Optional<Uzivatel> uzivatel = uzivatelRepository.findById(uzivProjektRiziko.getIdUzivatelR().getId());
                    if (uzivatel.isPresent())
                        uzivProjektRiziko.setIdUzivatelR(uzivatel.get());

                    //ulozeni projektu
                    Optional<Projekt> projekt = projektRepository.findById(uzivProjektRiziko.getIdProjektR().getId());
                    if (projekt.isPresent())
                        uzivProjektRiziko.setIdProjektR(projekt.get());


                    /////////// POKUD UZ DANY OBJEKT SE V DB, TAK SE MU PREKOPIRUJI HODNOTY - muzou se zmennit, ale i nemusi/////////////////
                    //test zda uz riziko neni k projektu prideleno

                    Optional<UzivProjektRiziko> test = listItems.stream()
                            .filter(item -> item.getIdProjektR().getId() == uzivProjektRiziko.getIdProjektR().getId() &&
                                    item.getIdRizikoR().getId() == uzivProjektRiziko.getIdRizikoR().getId()).findFirst();

                    //dane riziko se uz tam naslo
                    if (test.isPresent()) {
                        if (!test.get().equals(uzivProjektRiziko)) {
                            if (test.get().getIdUzivatelR().getId() == uzivProjektRiziko.getIdUzivatelR().getId()) {//jestli se zmenily jenom atributy ale spravce je stejnej
                                int index = listItems.indexOf(test.get());
                                listItems.get(index).setStav(uzivProjektRiziko.getStav());
                                listItems.get(index).setPriorita(uzivProjektRiziko.getPriorita());
                                listItems.get(index).setPravdepodobnost(uzivProjektRiziko.getPravdepodobnost());
                                listItems.get(index).setDopad(uzivProjektRiziko.getDopad());
                                listItems.get(index).setPopisDopadu(uzivProjektRiziko.getPopisDopadu());
                                listItems.get(index).setPlanReseni(uzivProjektRiziko.getPlanReseni());

                            } else {
                                listItems.remove(test.get());
                                listItems.add(uzivProjektRiziko);
                            }
                        }

                    } else { //je to neco noveho, dane riziko se jeste k projektu nepriradilo
                        listItems.add(uzivProjektRiziko);
                    }





/*                for (UzivProjektRiziko item : listItems) {
                    if (item.getIdProjektR().getId() == uzivProjektRiziko.getIdProjektR().getId() &&
                            item.getIdRizikoR().getId() == uzivProjektRiziko.getIdRizikoR().getId()) {
                        jeTam = true;
                        //riziku u je k nejakemu riziku prideleno, prekopiruji se hodnot
                        item.setIdUzivatelR(uzivProjektRiziko.getIdUzivatelR());
                        item.setDopad(uzivProjektRiziko.getDopad());
                        item.setPlanReseni(uzivProjektRiziko.getPlanReseni());
                        item.setPopisDopadu(uzivProjektRiziko.getPopisDopadu());
                        item.setPravdepodobnost(uzivProjektRiziko.getPravdepodobnost());
                        item.setPriorita(uzivProjektRiziko.getPriorita());
                        item.setStav(uzivProjektRiziko.getStav());
                        break;
                    }
                }

                if (!jeTam)//nenaslo to riziko v zadnem projektu, pridat item do listu
                    listItems.add(uzivProjektRiziko);*/
                }
            }
            //ulozim seznam zpet
            registrRizik.setItemUzProjRiz(listItems);

        }
        else { //jedna se o nove riziko s novy prirazenim k projektu`
            //priradi se projekt a uzivatel a aktualni riziko a posle to sveta
            for (UzivProjektRiziko uzivProjektRiziko : registrRizik.getItemUzProjRiz()) { //melo by tam byt jenom jedno

                //ulozeni rizika
                uzivProjektRiziko.setIdRizikoR(registrRizik);

                //ulozeni uzivatele
                Optional<Uzivatel> uzivatel = uzivatelRepository.findById(uzivProjektRiziko.getIdUzivatelR().getId());
                if (uzivatel.isPresent())
                    uzivProjektRiziko.setIdUzivatelR(uzivatel.get());

                //ulozeni projektu
                Optional<Projekt> projekt = projektRepository.findById(uzivProjektRiziko.getIdProjektR().getId());
                if (projekt.isPresent())
                    uzivProjektRiziko.setIdProjektR(projekt.get());
            }
        }

        return registrRizikRepository.save(registrRizik);
    }

    /**
     * Vrati celkovy pocet rizik v DB
     * */
    public Long getRisksCount() {
        return registrRizikRepository.count();
    }

    /**
     * Vrati seznam vsech rizik
     * */
    public Iterable<RegistrRizik> findAll() {
        return registrRizikRepository.findAll();
    }

    /**
     * Vrati pozadovane riziko podle jeho id, nebo null prokud tam neni
     * */
    public Optional<RegistrRizik> findById(Long id) {
        return registrRizikRepository.findById(id);
    }

    /**
     * Smaze riziko podle jeho id
     * */
    public void delete(Long id) {

        Optional<RegistrRizik> registrRizik = findById(id);

        if(registrRizik.isPresent())
            registrRizikRepository.delete(registrRizik.get());
    }
}
