package vut.fit.dp.spravarizik;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.parameters.P;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.*;
import vut.fit.dp.spravarizik.domain.serializer.ProjektSerializer;
import vut.fit.dp.spravarizik.repository.*;
import vut.fit.dp.spravarizik.service.ProjektService;

import javax.swing.text.html.Option;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.function.LongFunction;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.Matchers.contains;

/**
 * Testy na projekt
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class ProjektTests {

    @Autowired
    private ProjektRepository projektRepository;

    @Autowired
    private ProjektService projektService;

    @Autowired
    private SWOTRepository swotRepository;

    @Autowired
    private UzivatelRepository uzivatelRepository;

    @Autowired
    private UzivProjektRepository uzivProjektRepository;

    @Autowired
    private RegistrRizikRepository registrRizikRepository;

    @Autowired
    private UzivProjektRizikoRepozitory uzivProjektRizikoRepozitory;

    @Autowired
    private DotaznikRepository dotaznikRepository;

    @Autowired
    private DotazOtazOdpoRepository dotazOtazOdpoRepository;

    ///////////////////////////ZAKLADNI INFA////////////////////////////////
    /**
     * Pridani projektu
     * */
    @Test
    public void newProjekt() throws Exception {
        Projekt projekt = new Projekt();
        projekt.setNazev("TEST");
        projekt.setPopis("TEST POPIS");
        projekt.setAktivni(true);
        projekt.setStart(Date.valueOf(LocalDate.now()));
        projekt.setKonec(Date.valueOf(LocalDate.now().plusDays(20)));

        projektService.saveOrUpdate(projekt);

        Optional<Projekt> newItem = projektRepository.findByNazev("TEST");
        assertThat(newItem.get().getNazev(), equalTo("TEST"));
    }

    /**
     * Editace projektu - zakladni informace
     * */
    @Test
    public void editProjekt() throws Exception {
        Optional<Projekt> editItem = projektRepository.findByNazev("Informační systém");

        editItem.get().setPopis("TEST NEW POPIS");
        editItem.get().setNazev("TEST NEW NAZEV");
        editItem.get().setKonec(Date.valueOf(LocalDate.now().plusDays(20)));
        editItem.get().setAktivni(false);

        projektService.saveOrUpdate(editItem.get());

        Optional<Projekt> newItem = projektRepository.findById(editItem.get().getId());
        assertThat(newItem.get().getNazev(), equalTo("TEST NEW NAZEV"));
        assertThat(newItem.get().isAktivni(), is(equalTo(false)));
    }

    /**
     * Smazni projektu
     * */
    @Test
    public void deleteProjekt() throws Exception {
        Optional<Projekt> editItem = projektRepository.findByNazev("Informační systém");

        Iterable<Projekt> all = projektService.findAll();
        List<Projekt> result = new ArrayList<Projekt>();
        all.forEach(result::add);

        projektService.delete(editItem.get().getId());

        Iterable<Projekt> all2 = projektService.findAll();
        List<Projekt> result2 = new ArrayList<Projekt>();
        all2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));

        List<String> strings= new ArrayList<String>();
        for (Projekt projekt : result2) {
            strings.add(projekt.getNazev());
        }
        assertThat(strings, contains("Podpůrný nástroj pro řízení rizik v projektu"));
    }

    /**
     * Vsechny projekty
     * */
    @Test
    public void allProjekty() throws Exception {
        Iterable<Projekt> all = projektService.findAll();
        List<Projekt> result = new ArrayList<Projekt>();
        all.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(2));
    }

    /**
     * Projekt dle id
     * */
    @Test
    public void idProjektu() throws Exception {
        Optional<Projekt> item = projektService.findById(Long.valueOf(2));

        assertThat(item.get().getId(), comparesEqualTo(Long.valueOf(2)));
        assertThat(item.get().getNazev(), equalTo("Podpůrný nástroj pro řízení rizik v projektu"));
    };

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////SWOT///////////////////////////////////////

    /**
     * Pridani swot ke projektu
     * */
    @Test
    public void createSWOT() throws Exception {
        Optional<Projekt> editItem = projektRepository.findByNazev("Podpůrný nástroj pro řízení rizik v projektu");
        SWOT swot = new SWOT();
        swot.setSilne("TEST S");
        swot.setSlabe("TEST Sl");
        swot.setHrozby("TEST H");
        swot.setPrilezitosti("TEST P");
        swot.setProjekt(editItem.get());

        editItem.get().setSwot(swot);

        projektService.saveOrUpdateSWOT(editItem.get());

        Optional<Projekt> item = projektService.findById(editItem.get().getId());
        assertThat(item.get().getNazev(), equalTo("Podpůrný nástroj pro řízení rizik v projektu"));
        assertThat(item.get().getSwot().getPrilezitosti(), equalTo("TEST P"));

    }

    /**
     * Editace swot
     * */
    @Test
    public void editSWOT() throws Exception {
        Optional<Projekt> editItem = projektRepository.findByNazev("Informační systém");

        editItem.get().getSwot().setHrozby("TEST_H");

        projektService.saveOrUpdateSWOT(editItem.get());

        Optional<Projekt> item = projektService.findById(editItem.get().getId());
        assertThat(item.get().getNazev(), equalTo("Informační systém"));
        assertThat(item.get().getSwot().getHrozby(), equalTo("TEST_H"));

    }

    /**
     * Odstraneni swot
     * */
    @Test
    public void deleteSWOT() throws Exception {
        Optional<Projekt> editItem = projektRepository.findByNazev("Informační systém");

        projektService.deleteSwot(editItem.get().getId());

        Optional<Projekt> item = projektService.findById(editItem.get().getId());
        assertThat(item.get().getNazev(), equalTo("Informační systém"));
        assertThat(item.get().getSwot(), nullValue());

    }
    ////////////////////////////////////////////////////////////////////////
    /////////////////////////UZIVATELE/////////////////////////////////////

    /**
     * Vytvoreni projektu i s managerem
     * */
    @Test
    public void newProjektWithManager() throws Exception {

        Optional<Uzivatel> uzivatel = uzivatelRepository.findByLogin("xriger00");

        Projekt projekt = new Projekt();
        projekt.setNazev("TEST");
        projekt.setPopis("TEST POPIS");
        projekt.setAktivni(true);
        projekt.setStart(Date.valueOf(LocalDate.now()));
        projekt.setKonec(Date.valueOf(LocalDate.now().plusDays(20)));

        UzivProjekt uzivProjekt = new UzivProjekt();
        uzivProjekt.setUzivatel(uzivatel.get());
        uzivProjekt.setProjekt(projekt);
        uzivProjekt.setAktivni(true);
        uzivProjekt.setVedouci(true);
        uzivProjekt.setDateStart(Date.valueOf(LocalDate.now()));

        List<UzivProjekt> list = new ArrayList<>();
        list.add(uzivProjekt);

        projekt.setItemUzProj(list);

        projektService.saveOrUpdate(projekt);

        Optional<Projekt> newItem = projektRepository.findByNazev("TEST");
        assertThat(newItem.get().getNazev(), equalTo("TEST"));
        assertThat(newItem.get().getItemUzProj().size(), comparesEqualTo(1));

        Optional<UzivProjekt> mana = uzivProjektRepository.findByIdProjectIDAndVedouciTrueAndAktivniTrue(newItem.get().getId());
        assertThat(mana.get().getUzivatel().getRole().getNazev(), equalTo("Projektový manažer"));
        assertThat(mana.get().getUzivatel().getNazev(), equalTo("Alan Riger"));

    }

    /**
     * Zmena managera
     * */
    @Test
    public void editProjektWithManager() throws Exception {

        Optional<Uzivatel> uzivatel = uzivatelRepository.findByLogin("xhodso00");
        Optional<Projekt> editItem = projektRepository.findByNazev("Informační systém");


        UzivProjekt uzivProjekt = new UzivProjekt();
        uzivProjekt.setUzivatel(uzivatel.get());
        uzivProjekt.setProjekt(editItem.get());
        uzivProjekt.setAktivni(true);
        uzivProjekt.setVedouci(true);
        uzivProjekt.setDateStart(Date.valueOf(LocalDate.now()));


        projektService.saveOrUpdate(uzivProjekt, editItem.get().getId());

        Optional<Projekt> newItem = projektRepository.findByNazev("Informační systém");
        assertThat(newItem.get().getNazev(), equalTo("Informační systém"));
        assertThat(newItem.get().getItemUzProj().size(), comparesEqualTo(3));

        Optional<UzivProjekt> mana = uzivProjektRepository.findByIdProjectIDAndVedouciTrueAndAktivniTrue(newItem.get().getId());
        assertThat(mana.get().getUzivatel().getRole().getNazev(), equalTo("Projektový manažer"));
        assertThat(mana.get().getUzivatel().getNazev(), equalTo("Bianca Hodson"));

        List<UzivProjekt> list = uzivProjektRepository.findByIdProjectID(editItem.get().getId());
        assertThat(list.size(), comparesEqualTo(4));

    }

    /**
     * Vytvoreni projektu s resitely
     * */
    @Test
    public void newProjektWithUsers() throws Exception {

        Optional<Uzivatel> a = uzivatelRepository.findByLogin("xlaris00");
        Optional<Uzivatel> b = uzivatelRepository.findByLogin("xnovak00");

        Projekt projekt = new Projekt();
        projekt.setNazev("TEST");
        projekt.setPopis("TEST POPIS");
        projekt.setAktivni(true);
        projekt.setStart(Date.valueOf(LocalDate.now()));
        projekt.setKonec(Date.valueOf(LocalDate.now().plusDays(20)));

        UzivProjekt uzivProjekt1 = new UzivProjekt();
        uzivProjekt1.setUzivatel(a.get());
        uzivProjekt1.setProjekt(projekt);
        uzivProjekt1.setAktivni(true);
        uzivProjekt1.setVedouci(false);
        uzivProjekt1.setDateStart(Date.valueOf(LocalDate.now()));

        UzivProjekt uzivProjekt2 = new UzivProjekt();
        uzivProjekt2.setUzivatel(b.get());
        uzivProjekt2.setProjekt(projekt);
        uzivProjekt2.setAktivni(true);
        uzivProjekt2.setVedouci(false);
        uzivProjekt2.setDateStart(Date.valueOf(LocalDate.now()));

        List<UzivProjekt> list = new ArrayList<>();
        list.add(uzivProjekt1);
        list.add(uzivProjekt2);

        projekt.setItemUzProj(list);

        projektService.saveOrUpdate(projekt);

        Optional<Projekt> newItem = projektRepository.findByNazev("TEST");
        assertThat(newItem.get().getNazev(), equalTo("TEST"));
        assertThat(newItem.get().getItemUzProj().size(), comparesEqualTo(2));

        List<UzivProjekt> users = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(newItem.get().getId());

        List<String> strings= new ArrayList<String>();
        for (UzivProjekt uzivProjekts : users) {
            strings.add(uzivProjekts.getUzivatel().getLogin());
        }

        assertThat(users.size(), comparesEqualTo(2));
        assertThat(strings, contains("xlaris00", "xnovak00"));

    }

    /**
     * Zmena resitelu - pridani noveho
     * */
    @Test
    public void editProjektWithUsersAdd() throws Exception {

        Optional<Uzivatel> uzivatel = uzivatelRepository.findByLogin("xlaris00");
        Optional<Projekt> editItem = projektRepository.findByNazev("Podpůrný nástroj pro řízení rizik v projektu");


        UzivProjekt uzivProjekt = new UzivProjekt();
        uzivProjekt.setUzivatel(uzivatel.get());
        uzivProjekt.setProjekt(editItem.get());
        uzivProjekt.setAktivni(true);
        uzivProjekt.setVedouci(false);
        uzivProjekt.setDateStart(Date.valueOf(LocalDate.now()));

        List<UzivProjekt> uzTamJsou = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(editItem.get().getId());
        uzTamJsou.add(uzivProjekt);


        projektService.saveOrUpdateUsers(uzTamJsou, editItem.get().getId());


        Optional<UzivProjekt> mana = uzivProjektRepository.findByIdProjectIDAndVedouciTrueAndAktivniTrue(editItem.get().getId());
        assertThat(mana.get().getUzivatel().getRole().getNazev(), equalTo("Projektový manažer"));
        assertThat(mana.get().getUzivatel().getNazev(), equalTo("Bianca Hodson"));

        List<UzivProjekt> list = uzivProjektRepository.findByIdProjectID(editItem.get().getId());
        assertThat(list.size(), comparesEqualTo(2));

        List<UzivProjekt> users = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(editItem.get().getId());

        List<String> strings= new ArrayList<String>();
        for (UzivProjekt uzivProjekts : users) {
            strings.add(uzivProjekts.getUzivatel().getLogin());
        }

        assertThat(users.size(), comparesEqualTo(1));
        assertThat(strings, contains("xlaris00"));

        Optional<Projekt> testItem = projektRepository.findByNazev("Podpůrný nástroj pro řízení rizik v projektu");
        assertThat(testItem.get().getItemUzProj().size(), comparesEqualTo(2));


    }

    /**
     * Odebrani resitelu
     * */
    @Test
    public void removeUserFromProjekt() throws Exception {

        Optional<Projekt> editItem = projektRepository.findByNazev("Informační systém");

        List<UzivProjekt> uzTamJsou = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(editItem.get().getId());
        uzTamJsou.remove(0);


        projektService.saveOrUpdateUsers(uzTamJsou, editItem.get().getId());


        List<UzivProjekt> list = uzivProjektRepository.findByIdProjectID(editItem.get().getId());
        assertThat(list.size(), comparesEqualTo(3));

        List<UzivProjekt> users = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(editItem.get().getId());

        List<String> strings= new ArrayList<String>();
        for (UzivProjekt uzivProjekts : users) {
            strings.add(uzivProjekts.getUzivatel().getLogin());
        }

        assertThat(users.size(), comparesEqualTo(1));
        assertThat(strings, contains("xnovak00"));

    }

    /**
     * Pridat jednoho + odstranit jednnuho
     * */
    @Test
    public void editProjektWithUsersAddRemove() throws Exception {

        Optional<Uzivatel> uzivatel = uzivatelRepository.findByLogin("xhodso00");
        Optional<Projekt> editItem = projektRepository.findByNazev("Informační systém");


        UzivProjekt uzivProjekt = new UzivProjekt();
        uzivProjekt.setUzivatel(uzivatel.get());
        uzivProjekt.setProjekt(editItem.get());
        uzivProjekt.setAktivni(true);
        uzivProjekt.setVedouci(false);
        uzivProjekt.setDateStart(Date.valueOf(LocalDate.now()));

        List<UzivProjekt> uzTamJsou = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(editItem.get().getId());
        uzTamJsou.remove(0);
        uzTamJsou.add(uzivProjekt);


        projektService.saveOrUpdateUsers(uzTamJsou, editItem.get().getId());


        Optional<UzivProjekt> mana = uzivProjektRepository.findByIdProjectIDAndVedouciTrueAndAktivniTrue(editItem.get().getId());
        assertThat(mana.get().getUzivatel().getRole().getNazev(), equalTo("Projektový manažer"));
        assertThat(mana.get().getUzivatel().getNazev(), equalTo("Alan Riger"));

        List<UzivProjekt> list = uzivProjektRepository.findByIdProjectID(editItem.get().getId());
        assertThat(list.size(), comparesEqualTo(4));

        List<UzivProjekt> users = uzivProjektRepository.findByIdProjectIDAndVedouciFalseAndAktivniTrue(editItem.get().getId());

        List<String> strings= new ArrayList<String>();
        for (UzivProjekt uzivProjekts : users) {
            strings.add(uzivProjekts.getUzivatel().getLogin());
        }

        assertThat(users.size(), comparesEqualTo(2));
        assertThat(strings, contains( "xnovak00", "xhodso00"));

        Optional<Projekt> testItem = projektRepository.findByNazev("Informační systém");
        assertThat(testItem.get().getItemUzProj().size(), comparesEqualTo(4));

    }
    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////RIZIKA////////////////////////////////////////////

    /**
     * Pridani rizika
     * */
    @Test
    public void addRisk() throws Exception {

        Optional<RegistrRizik> risk = registrRizikRepository.findById(Long.valueOf(2));
        Optional<Uzivatel> uzivatel = uzivatelRepository.findByLogin("xhodso00");
        Optional<Projekt> projekt = projektRepository.findById(Long.valueOf(2));

        UzivProjektRiziko a = new UzivProjektRiziko();
        a.setIdProjektR(projekt.get());
        a.setIdUzivatelR(uzivatel.get());
        a.setIdRizikoR(risk.get());
        a.setPlanReseni("TEST RESENI");
        a.setPriorita(Long.valueOf(2));
        a.setPopisDopadu("TEST DOPADU");
        a.setDopad(Long.valueOf(2));
        a.setPravdepodobnost(Long.valueOf(2));
        a.setStav(Long.valueOf(2));

        projektService.saveOrUpdate(a, projekt.get().getId());

        Optional<UzivProjektRiziko> newRisk = uzivProjektRizikoRepozitory.findByIdProjektAndIdRiziko(projekt.get().getId(), risk.get().getId());
        assertThat(newRisk.get().getIdRizikoR().getId(), comparesEqualTo(risk.get().getId()));
        assertThat(newRisk.get().getPlanReseni(), equalTo("TEST RESENI"));

        Optional<Projekt> newProjekt = projektRepository.findById(Long.valueOf(2));
        assertThat(newProjekt.get().getItemUzProjRiz().size(), comparesEqualTo(1));
    }

    /**
     * Editace rizika
     * */
    @Test
    public void editRiskProjekt() throws Exception {

        Optional<Projekt> projekt = projektRepository.findById(Long.valueOf(1));

        UzivProjektRiziko riziko = projekt.get().getItemUzProjRiz().get(0);

        riziko.setPlanReseni("EDITOVANY_PLAN_RESENI");

        projektService.saveOrUpdate(riziko, projekt.get().getId());

        Optional<UzivProjektRiziko> newRisk = uzivProjektRizikoRepozitory.findByIdProjektAndIdRiziko(projekt.get().getId(), riziko.getIdRizikoR().getId());
        assertThat(newRisk.get().getIdRizikoR().getId(), comparesEqualTo(riziko.getIdRizikoR().getId()));
        assertThat(newRisk.get().getPlanReseni(), equalTo("EDITOVANY_PLAN_RESENI"));

        Optional<Projekt> newProjekt = projektRepository.findById(Long.valueOf(1));
        assertThat(newProjekt.get().getItemUzProjRiz().size(), comparesEqualTo(3));

        Optional<Projekt> newProjekt2 = projektRepository.findById(Long.valueOf(2));
        assertThat(newProjekt2.get().getItemUzProjRiz().size(), comparesEqualTo(0));
    }

    /**
     * Editace rizika - zmena resitele
     * */
    @Test
    public void editRiskProjektWithUser() throws Exception {

        Optional<Projekt> projekt = projektRepository.findById(Long.valueOf(1));
        Optional<Uzivatel> uzivatel = uzivatelRepository.findById(Long.valueOf(2));

        UzivProjektRiziko riziko = projekt.get().getItemUzProjRiz().get(0);

        assertThat(riziko.getIdUzivatelR().getLogin(), equalTo("xriger00"));

        riziko.setIdUzivatelR(uzivatel.get());

        projektService.saveOrUpdate(riziko, projekt.get().getId());

        Optional<UzivProjektRiziko> newRisk = uzivProjektRizikoRepozitory.findByIdProjektAndIdRiziko(projekt.get().getId(), riziko.getIdRizikoR().getId());
        assertThat(newRisk.get().getIdRizikoR().getId(), comparesEqualTo(riziko.getIdRizikoR().getId()));
        assertThat(newRisk.get().getIdUzivatelR().getLogin(), equalTo("xnovak00"));

        Optional<Projekt> newProjekt = projektRepository.findById(Long.valueOf(1));
        assertThat(newProjekt.get().getItemUzProjRiz().size(), comparesEqualTo(3));

        Optional<Projekt> newProjekt2 = projektRepository.findById(Long.valueOf(2));
        assertThat(newProjekt2.get().getItemUzProjRiz().size(), comparesEqualTo(0));
    }

    /**
     * Odebrani rizika
     * */
    @Test
    public void deleteRisk() throws Exception {

        Optional<Projekt> projekt = projektRepository.findById(Long.valueOf(1));
        UzivProjektRiziko riziko = projekt.get().getItemUzProjRiz().get(0);

        Iterable<UzivProjektRiziko> all = uzivProjektRizikoRepozitory.findAll();
        List<UzivProjektRiziko> result = new ArrayList<UzivProjektRiziko>();
        all.forEach(result::add);

        projekt.get().removeRisk(riziko);

        projektService.deleteRisk(projekt.get().getId(), riziko.getIdRizikoR().getId());

        Optional<UzivProjektRiziko> newRisk = uzivProjektRizikoRepozitory.findByIdProjektAndIdRiziko(projekt.get().getId(), riziko.getIdRizikoR().getId());
        assertThat(newRisk.isPresent(), is(false));

        Iterable<UzivProjektRiziko> all2 = uzivProjektRizikoRepozitory.findAll();
        List<UzivProjektRiziko> result2 = new ArrayList<UzivProjektRiziko>();
        all2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));
        assertThat(result2.size(), comparesEqualTo(2));

        Optional<Projekt> newProjekt = projektRepository.findById(Long.valueOf(1));
        assertThat(newProjekt.get().getItemUzProjRiz().size(), comparesEqualTo(2));

        Optional<Projekt> newProjekt2 = projektRepository.findById(Long.valueOf(2));
        assertThat(newProjekt2.get().getItemUzProjRiz().size(), comparesEqualTo(0));


    }

    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////DOTAZNIK/////////////////////////////////////////////

    /**
     * Pridat dotaznik
     * */
    @Test
    public void addDotaznik() throws Exception {

        Optional<Dotaznik> dotaznik = dotaznikRepository.findById(Long.valueOf(2));
        Optional<Projekt> projekt = projektRepository.findById(Long.valueOf(2));

        assertThat(projekt.get().getDotaznikProjektu(), nullValue());

        projekt.get().setDotaznikProjektu(dotaznik.get());

        projektService.saveSurvey(projekt.get());

        Optional<Projekt> newProjekt = projektRepository.findById(Long.valueOf(2));
        assertThat(newProjekt.get().getDotaznikProjektu(), notNullValue());
        assertThat(newProjekt.get().getDotaznikProjektu().getId(), comparesEqualTo(Long.valueOf(2)));

        assertThat(newProjekt.get().getItemDOO().size(), comparesEqualTo(0));
    }

    /**
     * Odebrat dotaznik
     * */
    @Test
    public void removeDotaznik() throws Exception {

        Optional<Projekt> projekt = projektRepository.findById(Long.valueOf(1));

        assertThat(projekt.get().getDotaznikProjektu(), notNullValue());
        assertThat(projekt.get().getDotaznikProjektu().getId(), comparesEqualTo(Long.valueOf(1)));

        projektService.removeSurvey(projekt.get().getId());

        Optional<Projekt> newProjekt = projektRepository.findById(Long.valueOf(1));
        assertThat(newProjekt.get().getDotaznikProjektu(), nullValue());

        assertThat(newProjekt.get().getItemDOO().size(), comparesEqualTo(0));
    }

    /**
     * Odpovedet na dotaznik
     * */
    @Test
    public void addDotaznikOdpovedi() throws Exception {
        Optional<Projekt> projekt = projektRepository.findById(Long.valueOf(1));
        Optional<Uzivatel> uzivate = uzivatelRepository.findById(Long.valueOf(3));

        List<DotazOtazOdpo> dotazOtazOdpos = new ArrayList<DotazOtazOdpo>();
        for (DotaznikOtazka otazka : projekt.get().getDotaznikProjektu().getOtazky()) {
            DotazOtazOdpo item = new DotazOtazOdpo();
            item.setProjektDOO(projekt.get());
            item.setUzivatelDOO(uzivate.get());
            item.setDotaznikDOO(projekt.get().getDotaznikProjektu());

            item.setOtazkaDOO(otazka.getOtazkaDotazniku());
            item.setOdpovedDOO(otazka.getOtazkaDotazniku().getOdpovedi().get(0).getOdpoved());

            dotazOtazOdpos.add(item);
        }

        assertThat(dotazOtazOdpos.size(), comparesEqualTo(5));

        projektService.saveOrUpdateSurveyInfo(dotazOtazOdpos, projekt.get().getId(), projekt.get().getDotaznikProjektu().getId(), uzivate.get().getId());


        Optional<Projekt> newItem = projektRepository.findById(Long.valueOf(1));
        List<DotazOtazOdpo> testDotaz = dotazOtazOdpoRepository.findByIdProjektIDAndIdUzivatelIDAndIdDotaznikID(projekt.get().getId(), uzivate.get().getId(), projekt.get().getDotaznikProjektu().getId());

        assertThat(testDotaz.size(), comparesEqualTo(5));
        assertThat(testDotaz.get(0).getOdpovedDOO().getId(), comparesEqualTo(Long.valueOf(1)));
        assertThat(testDotaz.get(1).getOdpovedDOO().getId(), comparesEqualTo(Long.valueOf(1)));
        assertThat(testDotaz.get(2).getOdpovedDOO().getId(), comparesEqualTo(Long.valueOf(1)));
        assertThat(testDotaz.get(3).getOdpovedDOO().getId(), comparesEqualTo(Long.valueOf(1)));
        assertThat(testDotaz.get(4).getOdpovedDOO().getId(), comparesEqualTo(Long.valueOf(1)));


    }

    /**
     * Smazat odpovedi dotazniku
     * */

    /**
     * Odebrat dotaznik, ale nechat odpovedi - TODO
     * */

}
