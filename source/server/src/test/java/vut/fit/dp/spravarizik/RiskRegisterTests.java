package vut.fit.dp.spravarizik;

import org.hibernate.Hibernate;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.Kategorie;
import vut.fit.dp.spravarizik.domain.RegistrRizik;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.repository.KategorieRepository;
import vut.fit.dp.spravarizik.repository.RegistrRizikRepository;
import vut.fit.dp.spravarizik.repository.RoleRepository;
import vut.fit.dp.spravarizik.repository.UzivatelRepository;
import vut.fit.dp.spravarizik.service.RegistrRizikService;
import vut.fit.dp.spravarizik.service.UzivatelService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * Testy na registr rizik
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
public class RiskRegisterTests {

    @Autowired
    private KategorieRepository kategorieRepository;

    @Autowired
    private RegistrRizikRepository registrRizikRepository;

    @Autowired
    private RegistrRizikService registrRizikService;

    /**
     * Tvorba noveho rizika
     * */
    @Test
    public void newRisk() throws Exception {
        Optional<Kategorie> kategorie = kategorieRepository.findById(Long.valueOf(4));

        RegistrRizik registrRizik = new RegistrRizik();
        registrRizik.setNazev("TEST NAZEV");
        registrRizik.setPopis("TEST POPIS");
        registrRizik.setMozneReseni("RESENI");
        registrRizik.setKategorie(kategorie.get());

        registrRizikService.saveOrUpdate(registrRizik);

        Optional<RegistrRizik> newRisk = registrRizikRepository.findByNazev("TEST NAZEV");
        assertThat(newRisk.get().getNazev(), equalTo("TEST NAZEV"));
        assertThat(newRisk.get().getKategorie().getId(), comparesEqualTo(kategorie.get().getId()));
    }

    /**
     * Editace rizika
     * */
    @Test
    public void editRisk() throws Exception {
        Optional<RegistrRizik> editRisk = registrRizikRepository.findByNazev("Nepodržení termínu dodání");
        editRisk.get().setNazev("TEST NAZEV EDIT");

        registrRizikService.saveOrUpdate(editRisk.get());

        Optional<RegistrRizik> newRisk = registrRizikRepository.findByNazev("TEST NAZEV EDIT");
        assertThat(newRisk.get().getNazev(), equalTo("TEST NAZEV EDIT"));
        assertThat(newRisk.get().getKategorie().getId(), comparesEqualTo(Long.valueOf(6)));
    }

    /**
     * Smazani rizika
     * */
    @Test
    public void deleteRisk() throws Exception {
        Optional<RegistrRizik> editRisk = registrRizikRepository.findByNazev("Nízká výsledná kvalita");

        Iterable<RegistrRizik> risks = registrRizikService.findAll();
        List<RegistrRizik> result = new ArrayList<RegistrRizik>();
        risks.forEach(result::add);

        registrRizikService.delete(editRisk.get().getId());

        Iterable<RegistrRizik> risks2 = registrRizikService.findAll();
        List<RegistrRizik> result2 = new ArrayList<RegistrRizik>();
        risks2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));

        List<String> stringRisk = new ArrayList<String>();
        for (RegistrRizik registrRizik : result2) {
            stringRisk.add(registrRizik.getNazev());
        }
        assertThat(stringRisk, contains("Překročení rozpočtu", "Nepodržení termínu dodání", "Špatná komunikace se zákazníkem",
        "Nedostatečná pracovní aktivita zaměstnance", "Neznalost technologií", "Pandemie infekční nemoci",
        "Hlavní finanční akcionář zkrachoval", "Nefunkční program", "Změna vedení firmy"));
    }

    /**
     * Tvorba rizika bez kategorie
     * */
    @Test
    public void newRiskWithoutCategory() throws Exception {
        RegistrRizik registrRizik = new RegistrRizik();
        registrRizik.setNazev("TEST NAZEV TEST");
        registrRizik.setPopis("TEST POPIS");
        registrRizik.setMozneReseni("RESENI");

        registrRizikService.saveOrUpdate(registrRizik);

        Optional<RegistrRizik> newRisk = registrRizikRepository.findByNazev("TEST NAZEV TEST");
        assertThat(newRisk.get().getNazev(), equalTo("TEST NAZEV TEST"));
        assertThat(newRisk.get().getKategorie().getNazev(), equalTo("Nezařazeno"));
    }

    /**
     * Editace kategorie na riziku
     * */
    @Test
    public void editRiskCategory() throws Exception {
        Optional<RegistrRizik> editRisk = registrRizikRepository.findById(Long.valueOf(2));

        assertThat(editRisk.get().getKategorie().getNazev(), equalTo("Rozvrh"));

        Optional<Kategorie> kategorie = kategorieRepository.findById(Long.valueOf(4));
        editRisk.get().setKategorie(kategorie.get());

        registrRizikService.saveOrUpdate(editRisk.get());

        Optional<RegistrRizik> newRisk = registrRizikService.findById(Long.valueOf(2));
        assertThat(newRisk.get().getKategorie().getNazev(), equalTo("Technologie"));
    }

    /**
     * Vsechna rizika
     * */
    @Test
    public void allRisk() throws Exception {
        Iterable<RegistrRizik> risks = registrRizikService.findAll();
        List<RegistrRizik> result = new ArrayList<RegistrRizik>();
        risks.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(10));
    }

    /**
     * Riziko dle id
     * */
    @Test
    public void idRisk() throws Exception {

        Optional<RegistrRizik> editRisk = registrRizikService.findById(Long.valueOf(2));

        assertThat(editRisk.get().getId(), comparesEqualTo(Long.valueOf(2)));
        assertThat(editRisk.get().getNazev(), equalTo("Nepodržení termínu dodání"));

    }
}
