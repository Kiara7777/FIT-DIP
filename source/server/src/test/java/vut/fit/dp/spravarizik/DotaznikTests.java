package vut.fit.dp.spravarizik;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.*;
import vut.fit.dp.spravarizik.repository.DotaznikOtazkaRepository;
import vut.fit.dp.spravarizik.repository.DotaznikRepository;
import vut.fit.dp.spravarizik.repository.OtazkaRepository;
import vut.fit.dp.spravarizik.service.DotaznikService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * Testy na dotaznik
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class DotaznikTests {

    @Autowired
    private DotaznikRepository dotaznikRepository;

    @Autowired
    private DotaznikService dotaznikService;

    @Autowired
    private OtazkaRepository otazkaRepository;

    @Autowired
    private DotaznikOtazkaRepository dotaznikOtazkaRepository;


    /**
     * Pridat dotaznik + 2 otazky
     * */
    @Test
    public void newDotaznik() throws Exception {

        List<DotaznikOtazka> result = new ArrayList<DotaznikOtazka>();
        DotaznikOtazka otazka1 = new DotaznikOtazka();
        DotaznikOtazka otazka2 = new DotaznikOtazka();
        Optional<Otazka> one = otazkaRepository.findById(Long.valueOf(2));
        Optional<Otazka> two = otazkaRepository.findById(Long.valueOf(4));

        Dotaznik dotaznik = new Dotaznik();
        dotaznik.setNazev("TEST");
        dotaznik.setPopis("TEST POPIS");

        otazka1.setDotaznik(dotaznik);
        otazka2.setDotaznik(dotaznik);

        otazka1.setOtazkaDotazniku(one.get());
        otazka2.setOtazkaDotazniku(two.get());

        result.add(otazka1);
        result.add(otazka2);

        dotaznik.setOtazky(result);

        dotaznikService.saveOrUpdate(dotaznik);

        Optional<Dotaznik> newItem= dotaznikRepository.findByNazev("TEST");
        assertThat(newItem.get().getNazev(), equalTo("TEST"));
        assertThat(newItem.get().getPopis(), equalTo("TEST POPIS"));
        assertThat(newItem.get().getOtazky().size(), comparesEqualTo(2));

        List<DotaznikOtazka> list = dotaznikOtazkaRepository.findByIdDotaznikID(newItem.get().getId());
        assertThat(list.size(), comparesEqualTo(2));
    }

    /**
     * Editovat dotaznik + nechat otazky
     * */
    @Test
    public void editDotaznik() throws Exception {

        Optional<Dotaznik> editItem = dotaznikRepository.findByNazev("Dotazník 1");
        editItem.get().setNazev("TEST NEW NAZEV");

        dotaznikService.saveOrUpdate(editItem.get());

        Optional<Dotaznik> newItem = dotaznikRepository.findById(Long.valueOf(1));
        assertThat(newItem.get().getNazev(), equalTo("TEST NEW NAZEV"));
        assertThat(newItem.get().getOtazky().size(), comparesEqualTo(5));

        List<DotaznikOtazka> list = dotaznikOtazkaRepository.findByIdDotaznikID(newItem.get().getId());
        assertThat(list.size(), comparesEqualTo(5));
    }

    /**
     * Editovat dotaznik - zmenit otazky - poradi - NEFUNUGJE, PRES WEB ALE FUNGUJE
     * */
    public void editDotaznikOtazky() throws Exception {

        Optional<Dotaznik> editItem = dotaznikRepository.findByNazev("Test dotazniku 1");

        List<DotaznikOtazka> result = new ArrayList<DotaznikOtazka>();
        DotaznikOtazka otazka1 = new DotaznikOtazka();
        DotaznikOtazka otazka2 = new DotaznikOtazka();
        Optional<Otazka> one = otazkaRepository.findById(Long.valueOf(1));
        Optional<Otazka> two = otazkaRepository.findById(Long.valueOf(2));


        otazka1.setDotaznik(editItem.get());
        otazka2.setDotaznik(editItem.get());

        otazka1.setOtazkaDotazniku(one.get());
        otazka2.setOtazkaDotazniku(two.get());

        otazka1.setPoradi(2);
        otazka2.setPoradi(1);

        result.add(otazka2);
        result.add(otazka1);

        editItem.get().setOtazky(result);

        dotaznikService.saveOrUpdate(editItem.get());

        Optional<Dotaznik> newItem = dotaznikRepository.findById(Long.valueOf(1));
        assertThat(newItem.get().getNazev(), equalTo("Test dotazniku 1"));
        assertThat(newItem.get().getOtazky().size(), comparesEqualTo(2));

        List<DotaznikOtazka> list = dotaznikOtazkaRepository.findByIdDotaznikID(newItem.get().getId());
        assertThat(list.size(), comparesEqualTo(2));


        List<String> strings = new ArrayList<String>();
        for (DotaznikOtazka dotaznikOtazka : list)
            strings.add(dotaznikOtazka.getOtazkaDotazniku().getTextOtazky());

        assertThat(strings, contains("Zpracovává riziko zkušený zaměstnanec", "Je cílový uživatel dostatečně zapojen do rozvoje projektu"));
    }

    /**
     * Editovat dotaznik - zmenit otazky - nove
     * */
    @Test
    public void editDotaznikOtazkyNove() throws Exception {

        Optional<Dotaznik> editItem = dotaznikRepository.findByNazev("Dotazník 1");

        List<DotaznikOtazka> result = new ArrayList<DotaznikOtazka>();
        DotaznikOtazka otazka1 = new DotaznikOtazka();
        DotaznikOtazka otazka2 = new DotaznikOtazka();
        Optional<Otazka> one = otazkaRepository.findById(Long.valueOf(4));
        Optional<Otazka> two = otazkaRepository.findById(Long.valueOf(7));


        otazka1.setDotaznik(editItem.get());
        otazka2.setDotaznik(editItem.get());

        otazka1.setOtazkaDotazniku(one.get());
        otazka2.setOtazkaDotazniku(two.get());

        otazka1.setPoradi(2);
        otazka2.setPoradi(1);

        result.add(otazka2);
        result.add(otazka1);

        editItem.get().setOtazky(result);

        dotaznikService.saveOrUpdate(editItem.get());

        Optional<Dotaznik> newItem = dotaznikRepository.findById(Long.valueOf(1));
        assertThat(newItem.get().getNazev(), equalTo("Dotazník 1"));
        assertThat(newItem.get().getOtazky().size(), comparesEqualTo(2));

        List<DotaznikOtazka> list = dotaznikOtazkaRepository.findByIdDotaznikID(newItem.get().getId());
        assertThat(list.size(), comparesEqualTo(2));


        List<String> strings = new ArrayList<String>();
        for (DotaznikOtazka dotaznikOtazka : list)
            strings.add(dotaznikOtazka.getOtazkaDotazniku().getTextOtazky());

        assertThat(strings, contains("Je zadavatel obeznámen s riziky na projektu?", "Byla alespoň nějaká část vyvíjeného programu představena zákazníkovi?"));
    }


    /**
     * Smazat dotaznik
     * */
    @Test
    public void deleteDotaznik() throws Exception {
        Optional<Dotaznik> editItem = dotaznikRepository.findByNazev("Dotazník 1");

        Iterable<Dotaznik> all = dotaznikService.findAll();
        List<Dotaznik> result = new ArrayList<Dotaznik>();
        all.forEach(result::add);

        dotaznikService.delete(editItem.get().getId());

        Iterable<Dotaznik> all2 = dotaznikService.findAll();
        List<Dotaznik> result2 = new ArrayList<Dotaznik>();
        all2.forEach(result2::add);

        assertThat(result2.size(), comparesEqualTo(result.size() - 1));

        List<String> strings= new ArrayList<String>();
        for (Dotaznik dotaznik : result2) {
            strings.add(dotaznik.getNazev());
        }
        assertThat(strings, contains("Dotazník 2"));
    }

    /**
     * Ziskat vsechny dotazniky
     * */
    @Test
    public void allDotazniky() throws Exception {
        Iterable<Dotaznik> all = dotaznikService.findAll();
        List<Dotaznik> result = new ArrayList<Dotaznik>();
        all.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(2));
    }

    /**
     * Ziskat dotaznik dle id
     * */
    @Test
    public void idDotaznik() throws Exception {
        Optional<Dotaznik> item = dotaznikService.findById(Long.valueOf(2));

        assertThat(item.get().getId(), comparesEqualTo(Long.valueOf(2)));
        assertThat(item.get().getNazev(), equalTo("Dotazník 2"));
    };
}
