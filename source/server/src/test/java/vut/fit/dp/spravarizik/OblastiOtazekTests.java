package vut.fit.dp.spravarizik;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.Kategorie;
import vut.fit.dp.spravarizik.domain.OblastOtazky;
import vut.fit.dp.spravarizik.repository.OblastOtazkyRepository;
import vut.fit.dp.spravarizik.service.OblastOtazkyService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * Testy na oblasti otazek
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class OblastiOtazekTests {

    @Autowired
    private OblastOtazkyService oblastOtazkyService;

    @Autowired
    private OblastOtazkyRepository oblastOtazkyRepository;

    /**
     * Pridani oblast
     * */
    @Test
    public void newOblast() throws Exception {
        OblastOtazky oblastOtazky = new OblastOtazky();
        oblastOtazky.setNazev("TEST");

        oblastOtazkyService.saveOrUpdate(oblastOtazky);

        Optional<OblastOtazky> newOblast = oblastOtazkyRepository.findByNazev("TEST");
        assertThat(newOblast.get().getNazev(), equalTo("TEST"));
    }

    /**
     * Edtace oblasti
     * */
    @Test
    public void editOblast() throws Exception {
        Optional<OblastOtazky> editOblast = oblastOtazkyRepository.findByNazev("Zainteresované strany");

        editOblast.get().setNazev("TEST NEW NAZEV");

        oblastOtazkyService.saveOrUpdate(editOblast.get());

        Optional<OblastOtazky> newOblast = oblastOtazkyRepository.findByNazev("TEST NEW NAZEV");
        assertThat(newOblast.get().getNazev(), equalTo("TEST NEW NAZEV"));
        assertThat(newOblast.get().getId(), comparesEqualTo(editOblast.get().getId()));
    }


    /**
     * Smazani oblasti
     * */
    @Test
    public void deleteOblast() throws Exception {
        Optional<OblastOtazky> editOblast = oblastOtazkyRepository.findByNazev("Zaměstnanci");

        Iterable<OblastOtazky> oblasti = oblastOtazkyService.findAll();
        List<OblastOtazky> result = new ArrayList<OblastOtazky>();
        oblasti.forEach(result::add);

        oblastOtazkyService.delete(editOblast.get().getId());

        Iterable<OblastOtazky> oblasti2 = oblastOtazkyService.findAll();
        List<OblastOtazky> result2 = new ArrayList<OblastOtazky>();
        oblasti2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));

        List<String> stringOblasti= new ArrayList<String>();
        for (OblastOtazky oblastOtazky : result2) {
            stringOblasti.add(oblastOtazky.getNazev());
        }
        assertThat(stringOblasti, contains("Finance", "Zainteresované strany", "Rozvrh", "Technologie"));
    }


    /**
     * Vsechny oblasti
     * */
    @Test
    public void allOblasti() throws Exception {
        Iterable<OblastOtazky> oblasti = oblastOtazkyService.findAll();
        List<OblastOtazky> result = new ArrayList<OblastOtazky>();
        oblasti.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(5));
    }

    /**
     * Jedna oblast dle id
     * */
    @Test
    public void idOblasti() throws Exception {
        Optional<OblastOtazky> oblast = oblastOtazkyService.findById(Long.valueOf(4));

        assertThat(oblast.get().getId(), comparesEqualTo(Long.valueOf(4)));
        assertThat(oblast.get().getNazev(), equalTo("Rozvrh"));
    }
}
