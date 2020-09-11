package vut.fit.dp.spravarizik;

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
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.repository.KategorieRepository;
import vut.fit.dp.spravarizik.service.KategorieService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * Testy na kategorii rizika
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class KategorieTests {

    @Autowired
    private KategorieService kategorieService;

    @Autowired
    private KategorieRepository kategorieRepository;

    /**
     * Pridani kategorie
     * */
    @Test
    public void newKategorie() throws Exception {
        Kategorie kategorie = new Kategorie();
        kategorie.setNazev("TEST");
        kategorie.setPopis("TEST POPIS");

        kategorieService.saveOrUpdate(kategorie);

        Optional<Kategorie> newKategorie = kategorieRepository.findByNazev("TEST");
        assertThat(newKategorie.get().getNazev(), equalTo("TEST"));
        assertThat(newKategorie.get().getPopis(), equalTo("TEST POPIS"));
    }

    /**
     * Edtace kategorie
     * */
    @Test
    public void editKategorie() throws Exception {

        Optional<Kategorie> editKategorie = kategorieRepository.findByNazev("Technologie");

        editKategorie.get().setNazev("TEST NEW NAZEV");

        kategorieService.saveOrUpdate(editKategorie.get());

        Optional<Kategorie> newKategorie = kategorieRepository.findByNazev("TEST NEW NAZEV");
        assertThat(newKategorie.get().getNazev(), equalTo("TEST NEW NAZEV"));
        assertThat(newKategorie.get().getId(), comparesEqualTo(editKategorie.get().getId()));

    }

    /**
     * Smazani kategorie
     * */
    @Test
    public void deleteKategorie() throws Exception {

        Optional<Kategorie> editKategorie = kategorieRepository.findByNazev("Kvalita");

        Iterable<Kategorie> kategories = kategorieService.findAll();
        List<Kategorie> result = new ArrayList<Kategorie>();
        kategories.forEach(result::add);

        kategorieService.delete(editKategorie.get().getId());

        Iterable<Kategorie> kategories2 = kategorieService.findAll();
        List<Kategorie> result2 = new ArrayList<Kategorie>();
        kategories2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));

        List<String> stringKategorie = new ArrayList<String>();
        for (Kategorie kategorie : result2) {
            stringKategorie.add(kategorie.getNazev());
        }
        assertThat(stringKategorie, contains("Nezařazeno", "Obchod", "Finance", "Technologie", "Rozvrh", "Komuninace", "Zaměstnanci"));



    }

    /**
     * Vsechny kategorie
     * */
    @Test
    public void allKategorie() throws Exception {
        Iterable<Kategorie> kategories = kategorieService.findAll();
        List<Kategorie> result = new ArrayList<Kategorie>();
        kategories.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(8));

    }

    /**
     * Jedna kategorie dle id
     * */
    @Test
    public void idKategorie() throws Exception {

        Optional<Kategorie> kateogrie = kategorieService.findById(Long.valueOf(3));

        assertThat(kateogrie.get().getId(), comparesEqualTo(Long.valueOf(3)));
        assertThat(kateogrie.get().getNazev(), equalTo("Finance"));

    }
}
