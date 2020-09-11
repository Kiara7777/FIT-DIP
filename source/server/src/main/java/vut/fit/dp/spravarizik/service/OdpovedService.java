package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.Odpoved;
import vut.fit.dp.spravarizik.repository.OdpovedRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service sluzba pro odpoved. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class OdpovedService {

    @Autowired
    private OdpovedRepository odpovedRepository;

    public List<Odpoved> list() {
        return odpovedRepository.findAll();
    }

    /**
     * Preposle objekt objektu k ulozeni. Pokud role uz v DB je, tak se pred ulozenim vyhleda, a prekopiruji se z ni
     * seznam otazek, ke kterym je prirazena. A take specialni objekt odpovedi na projektu.
     * */
    public Odpoved saveOrUpdate(Odpoved odpoved) {

        Optional<Odpoved> test = findById(odpoved.getId());

        if (test.isPresent()) {
            odpoved.setItem(test.get().getItem());
            odpoved.setItemDOO(test.get().getItemDOO());
        }

        return odpovedRepository.save(odpoved);
    }

    /**
     * Vrati seznam vsech odpovedi
     * */
    public Iterable<Odpoved> findAll() {
        return odpovedRepository.findAll();
    }

    /**
     * Vrati pozadovaneho odpoved podle id, nebo null prokud tam neni
     * */
    public Optional<Odpoved> findById(Long id) {
        return odpovedRepository.findById(id);
    }

    /**
     * Smaze odpoved podle jejiho id
     * */
    public void delete(Long id) {

        Optional<Odpoved> odpoved = findById(id);

        if(odpoved.isPresent())
            odpovedRepository.delete(odpoved.get());
    }
}
