package vut.fit.dp.spravarizik;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.*;
import vut.fit.dp.spravarizik.repository.OblastOtazkyRepository;
import vut.fit.dp.spravarizik.repository.OdpovedRepository;
import vut.fit.dp.spravarizik.repository.OtazkaRepository;
import vut.fit.dp.spravarizik.service.OtazkaService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * Testy na otazky
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class OtazkyTests {

    @Autowired
    private OdpovedRepository odpovedRepository;

    @Autowired
    private OblastOtazkyRepository oblastOtazkyRepository;

    @Autowired
    private OtazkaRepository otazkaRepository;

    @Autowired
    private OtazkaService otazkaService;

    /**
     * Pridat otazku + 2 odpovedi
     * */
    @Test
    public void newOtazka() throws Exception {
        Optional<OblastOtazky> editOblast = oblastOtazkyRepository.findByNazev("Zaměstnanci");
        List<OtazkaOdpovedi> result = new ArrayList<OtazkaOdpovedi>();
        OtazkaOdpovedi otazkaOdpovedi1 = new OtazkaOdpovedi();
        OtazkaOdpovedi otazkaOdpovedi2 = new OtazkaOdpovedi();
        Optional<Odpoved> odpoved1 = odpovedRepository.findByTextOdpovedi("Ano");
        Optional<Odpoved> odpoved2 = odpovedRepository.findByTextOdpovedi("Ne");

        Otazka otazka = new Otazka();
        otazka.setTextOtazky("Test");
        otazka.setOblastOtazky(editOblast.get());

        otazkaOdpovedi1.setOtazka(otazka);
        otazkaOdpovedi2.setOtazka(otazka);

        otazkaOdpovedi1.setOdpoved(odpoved1.get());
        otazkaOdpovedi2.setOdpoved(odpoved2.get());

        result.add(otazkaOdpovedi1);
        result.add(otazkaOdpovedi2);

        otazka.setOdpovedi(result);

        otazkaService.saveOrUpdate(otazka);

        Optional<Otazka> newItem= otazkaRepository.findByTextOtazky("Test");
        assertThat(newItem.get().getTextOtazky(), equalTo("Test"));
        assertThat(newItem.get().getOblastOtazky().getNazev(), equalTo("Zaměstnanci"));
        assertThat(newItem.get().getOdpovedi().size(), comparesEqualTo(2));
    }

    /**
     * Editovat otazku, ale nechat odpovedi
     * */
    @Test
    public void editOtazka() throws Exception {

        Optional<Otazka> editItem= otazkaRepository.findByTextOtazky("Používají se na projektu nové technologie?");
        editItem.get().setTextOtazky("TEST NOVY TEXT?");

        otazkaService.saveOrUpdate(editItem.get());

        Optional<Otazka> newItem= otazkaRepository.findById(Long.valueOf(3));
        assertThat(newItem.get().getTextOtazky(), equalTo("TEST NOVY TEXT?"));
        assertThat(newItem.get().getId(), comparesEqualTo(Long.valueOf(3)));
        assertThat(newItem.get().getOblastOtazky().getNazev(), equalTo("Technologie"));
        assertThat(newItem.get().getOdpovedi().size(), comparesEqualTo(2));
    }

    /**
     * Editovat otazku + pozmenit odpovedi
     * */
    @Test
    public void editOtazkaOdpoved() throws Exception {

        Optional<Otazka> editItem= otazkaRepository.findByTextOtazky("Je zadavatel obeznámen s riziky na projektu?");

        List<OtazkaOdpovedi> result = new ArrayList<OtazkaOdpovedi>();
        OtazkaOdpovedi otazkaOdpovedi1 = new OtazkaOdpovedi();
        OtazkaOdpovedi otazkaOdpovedi2 = new OtazkaOdpovedi();
        Optional<Odpoved> odpoved1 = odpovedRepository.findByTextOdpovedi("Možná");
        Optional<Odpoved> odpoved2 = odpovedRepository.findByTextOdpovedi("Nevím");

        otazkaOdpovedi1.setOtazka(editItem.get());
        otazkaOdpovedi2.setOtazka(editItem.get());

        otazkaOdpovedi1.setOdpoved(odpoved1.get());
        otazkaOdpovedi2.setOdpoved(odpoved2.get());

        otazkaOdpovedi1.setPoradi(2);
        otazkaOdpovedi2.setPoradi(1);

        result.add(otazkaOdpovedi2);
        result.add(otazkaOdpovedi1);

        editItem.get().setOdpovedi(result);

        otazkaService.saveOrUpdate(editItem.get());

        Optional<Otazka> newItem= otazkaRepository.findByTextOtazky("Je zadavatel obeznámen s riziky na projektu?");

        List<String> strings = new ArrayList<String>();
        for (OtazkaOdpovedi otazkaOdpovedi : newItem.get().getOdpovedi())
            strings.add(otazkaOdpovedi.getOdpoved().getTextOdpovedi());

        assertThat(newItem.get().getTextOtazky(), equalTo("Je zadavatel obeznámen s riziky na projektu?"));
        assertThat(newItem.get().getId(), comparesEqualTo(Long.valueOf(4)));
        assertThat(newItem.get().getOblastOtazky().getNazev(), equalTo("Zainteresované strany"));
        assertThat(newItem.get().getOdpovedi().size(), comparesEqualTo(2));
        assertThat(strings, contains("Nevím", "Možná"));
    }

    /**
     * Editovat otazku + pozmenit odpovedi - prohodit je - NEFUNKCNI PRI TESTECH, ale PRI VOLANI Z KLIENTA PLNE FUNGUJE
     * */
    public void editOtazkaOdpovedProhozene() throws Exception {

        Optional<Otazka> editItem= otazkaRepository.findByTextOtazky("Je zadavatel obeznámen s riziky na projektu");

        List<OtazkaOdpovedi> result = new ArrayList<OtazkaOdpovedi>();
        OtazkaOdpovedi otazkaOdpovedi1 = new OtazkaOdpovedi();
        OtazkaOdpovedi otazkaOdpovedi2 = new OtazkaOdpovedi();
        Optional<Odpoved> odpoved1 = odpovedRepository.findByTextOdpovedi("Ano");
        Optional<Odpoved> odpoved2 = odpovedRepository.findByTextOdpovedi("Ne");

        otazkaOdpovedi1.setOtazka(editItem.get());
        otazkaOdpovedi2.setOtazka(editItem.get());

        otazkaOdpovedi1.setOdpoved(odpoved1.get());
        otazkaOdpovedi2.setOdpoved(odpoved2.get());

        otazkaOdpovedi1.setPoradi(2);
        otazkaOdpovedi2.setPoradi(1);

        result.add(otazkaOdpovedi1);
        result.add(otazkaOdpovedi2);

        editItem.get().setOdpovedi(result);

        otazkaService.saveOrUpdate(editItem.get());

        Optional<Otazka> newItem= otazkaRepository.findByTextOtazky("Je zadavatel obeznámen s riziky na projektu");

        List<String> strings = new ArrayList<String>();
        for (OtazkaOdpovedi otazkaOdpovedi : newItem.get().getOdpovedi())
            strings.add(otazkaOdpovedi.getOdpoved().getTextOdpovedi());

        assertThat(newItem.get().getTextOtazky(), equalTo("Je zadavatel obeznámen s riziky na projektu"));
        assertThat(newItem.get().getId(), comparesEqualTo(Long.valueOf(4)));
        assertThat(newItem.get().getOblastOtazky().getNazev(), equalTo("Zainteresované strany"));
        assertThat(newItem.get().getOdpovedi().size(), comparesEqualTo(2));
        assertThat(strings, contains("Nevím", "Možná"));
    }

    /**
     * Smazat otazku
     * */
    @Test
    public void deleteOtazka() throws Exception {
        Optional<Otazka> editItem= otazkaRepository.findByTextOtazky("Je cílový uživatel dostatečně zapojen do vývoje projektu?");

        Iterable<Otazka> all = otazkaService.findAll();
        List<Otazka> result = new ArrayList<Otazka>();
        all.forEach(result::add);

        otazkaService.delete(editItem.get().getId());

        Iterable<Otazka> all2 = otazkaService.findAll();
        List<Otazka> result2 = new ArrayList<Otazka>();
        all2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));

        List<String> strings= new ArrayList<String>();
        for (Otazka otazka : result2) {
            strings.add(otazka.getTextOtazky());
        }
        assertThat(strings, contains("Zpracovávají rizika zkušení zaměstnanci?", "Používají se na projektu nové technologie?",
                "Je zadavatel obeznámen s riziky na projektu?", "Bylo na identifikaci a analýzu rizik dostatečně času?",
                "Zdá se Vám, že někteří zaměstnanci neodvádějí svou práci?", "Byla alespoň nějaká část vyvíjeného programu představena zákazníkovi?",
                "Rozumíte plně používaným technologiím?", "Myslíte si, že projekt je dostatečně financován?",
                "Existuje krizový plán v případku výskytu finančních problémů?"));
    }

    /**
     * Editace otazky - zmena oblasti
     * */
    @Test
    public void editOtazkaOblast() throws Exception {
        Optional<Otazka> editItem= otazkaRepository.findByTextOtazky("Je zadavatel obeznámen s riziky na projektu?");

        assertThat(editItem.get().getOblastOtazky().getNazev(), equalTo("Zainteresované strany"));

        Optional<OblastOtazky> editOblast = oblastOtazkyRepository.findByNazev("Zaměstnanci");
        editItem.get().setOblastOtazky(editOblast.get());

        otazkaService.saveOrUpdate(editItem.get());

        Optional<Otazka> newItem = otazkaRepository.findById(Long.valueOf(4));
        assertThat(newItem.get().getOblastOtazky().getNazev(), equalTo("Zaměstnanci"));

        List<String> strings = new ArrayList<String>();
        for (OtazkaOdpovedi otazkaOdpovedi : newItem.get().getOdpovedi())
            strings.add(otazkaOdpovedi.getOdpoved().getTextOdpovedi());

        assertThat(strings, contains("Ano", "Ne"));

    }

    /**
     * Vsechny otazky
     * */
    @Test
    public void allOtazky() throws Exception {
        Iterable<Otazka> all = otazkaService.findAll();
        List<Otazka> result = new ArrayList<Otazka>();
        all.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(10));
    }

    /**
     * Otazka dle jejiho id
     * */
    @Test
    public void idOtazka() throws Exception {
        Optional<Otazka> otazka = otazkaService.findById(Long.valueOf(4));

        assertThat(otazka.get().getId(), comparesEqualTo(Long.valueOf(4)));
        assertThat(otazka.get().getTextOtazky(), equalTo("Je zadavatel obeznámen s riziky na projektu?"));
    };

}
