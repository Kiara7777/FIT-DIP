package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.OblastOtazky;
import vut.fit.dp.spravarizik.repository.OblastOtazkyRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service sluzba pro oblasti otazek. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class OblastOtazkyService {

    @Autowired
    private OblastOtazkyRepository oblastOtazkyRepository;

    public List<OblastOtazky> list() {
        return oblastOtazkyRepository.findAll();
    }

    /**
     * Prida nebo updatuje oblast, pokud jiz obsahuje prirazene otazky, tak se tak znova ulozi
     * */
    public OblastOtazky saveOrUpdate(OblastOtazky oblastOtazky) {

        Optional<OblastOtazky> test = oblastOtazkyRepository.findById(oblastOtazky.getId());
        if (test.isPresent())
            oblastOtazky.setItems(test.get().getItems());

        return oblastOtazkyRepository.save(oblastOtazky);
    }

    /**
     * Vrati seznam vsech oblasti
     * */
    public Iterable<OblastOtazky> findAll() {
        return oblastOtazkyRepository.findAll();
    }

    /**
     * Vrati oblast dle id
     * */
    public Optional<OblastOtazky> findById(Long id) {
        return oblastOtazkyRepository.findById(id);
    }

    /**
     * Smaze oblast podle jejiho id
     * */
    public void delete(Long id) {

        Optional<OblastOtazky> oblastOtazky = findById(id);

        if(oblastOtazky.isPresent())
            oblastOtazkyRepository.delete(oblastOtazky.get());
    }
}
