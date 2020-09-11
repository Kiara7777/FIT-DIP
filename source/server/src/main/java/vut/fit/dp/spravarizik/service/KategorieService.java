package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.Kategorie;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.repository.KategorieRepository;

import java.util.Optional;

/**
 * Service sluzba pro kategorii rizika. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class KategorieService {

    @Autowired
    private KategorieRepository kategorieRepository;

    /**
     * Preposle objekt kategorie k ulozeni. Pri editaci objektu se zajistuje aby v novem zaznamu byli pritomni i vsechna
     * rizika
     * */
    public Kategorie saveOrUpdate(Kategorie kategorie) {

        Optional<Kategorie> testKategorie = kategorieRepository.findById(kategorie.getId());
        if (testKategorie.isPresent())
            kategorie.setRizika(testKategorie.get().getRizika());

        return kategorieRepository.save(kategorie);
    }

    /**
     * Vrati seznam vsech kategorii
     * */
    public Iterable<Kategorie> findAll() {
        return kategorieRepository.findAll();
    }

    /**
     * Vrati pozadovanou kategorii podle id, nebo null prokud tam neni
     * */
    public Optional<Kategorie> findById(Long id) {
        return kategorieRepository.findById(id);
    }

    /**
     * Smaze kategorii podle id
     * */
    public void delete(Long id) {

        Optional<Kategorie> kategorie = findById(id);

        if(kategorie.isPresent())
            kategorieRepository.delete(kategorie.get());
    }
}
