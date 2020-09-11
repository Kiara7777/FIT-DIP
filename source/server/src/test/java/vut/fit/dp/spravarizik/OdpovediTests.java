package vut.fit.dp.spravarizik;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.OblastOtazky;
import vut.fit.dp.spravarizik.domain.Odpoved;
import vut.fit.dp.spravarizik.repository.OdpovedRepository;
import vut.fit.dp.spravarizik.service.OdpovedService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * Testy na odpovedi
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class OdpovediTests {

    @Autowired
    private OdpovedRepository odpovedRepository;

    @Autowired
    private OdpovedService odpovedService;

    /**
     * Pridani odpoved
     * */
    @Test
    public void newOdpoved() throws Exception {
        Odpoved odpoved = new Odpoved();
        odpoved.setTextOdpovedi("TEST");

        odpovedService.saveOrUpdate(odpoved);

        Optional<Odpoved> newItem = odpovedRepository.findByTextOdpovedi("TEST");
        assertThat(newItem.get().getTextOdpovedi(), equalTo("TEST"));
    }

    /**
     * Edtace odpovedi
     * */
    @Test
    public void editOdpoved() throws Exception {
        Optional<Odpoved> editItem = odpovedRepository.findByTextOdpovedi("Ne");;

        editItem.get().setTextOdpovedi("TEST EDIT");

        odpovedService.saveOrUpdate(editItem.get());

        Optional<Odpoved> newItem = odpovedRepository.findByTextOdpovedi("TEST EDIT");
        assertThat(newItem.get().getTextOdpovedi(), equalTo("TEST EDIT"));
        assertThat(newItem.get().getId(), comparesEqualTo(editItem.get().getId()));
    }


    /**
     * Smazani odpovedi
     * */
    @Test
    public void deleteOdpoved() throws Exception {
        Optional<Odpoved> editItem = odpovedRepository.findByTextOdpovedi("Ano");;

        Iterable<Odpoved> all = odpovedService.findAll();
        List<Odpoved> result = new ArrayList<Odpoved>();
        all.forEach(result::add);

        odpovedService.delete(editItem.get().getId());

        Iterable<Odpoved> all2 = odpovedService.findAll();
        List<Odpoved> result2 = new ArrayList<Odpoved>();
        all2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));

        List<String> strings = new ArrayList<String>();
        for (Odpoved odpoved : result2) {
            strings.add(odpoved.getTextOdpovedi());
        }
        assertThat(strings, contains("Ne", "Možná", "Nevím"));
    }


    /**
     * Vsechny odpovedi
     * */
    @Test
    public void allOdpovedi() throws Exception {
        Iterable<Odpoved> all = odpovedService.findAll();
        List<Odpoved> result = new ArrayList<Odpoved>();
        all.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(4));
    }

    /**
     * Jedna oblast dle id
     * */
    @Test
    public void idOdpovedi() throws Exception {
        Optional<Odpoved> one = odpovedService.findById(Long.valueOf(2));

        assertThat(one.get().getId(), comparesEqualTo(Long.valueOf(2)));
        assertThat(one.get().getTextOdpovedi(), equalTo("Ne"));
    }
}
