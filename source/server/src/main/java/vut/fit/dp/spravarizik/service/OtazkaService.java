package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.OblastOtazky;
import vut.fit.dp.spravarizik.domain.Odpoved;
import vut.fit.dp.spravarizik.domain.Otazka;
import vut.fit.dp.spravarizik.domain.OtazkaOdpovedi;
import vut.fit.dp.spravarizik.repository.OblastOtazkyRepository;
import vut.fit.dp.spravarizik.repository.OdpovedRepository;
import vut.fit.dp.spravarizik.repository.OtazkaOdpovediRepozitory;
import vut.fit.dp.spravarizik.repository.OtazkaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service sluzba pro otazku. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class OtazkaService {

    @Autowired
    OtazkaRepository otazkaRepository;

    @Autowired
    OblastOtazkyRepository oblastOtazkyRepository;

    @Autowired
    OdpovedRepository odpovedRepository;

    @Autowired
    OtazkaOdpovediRepozitory otazkaOdpovediRepozitory;

    /**
     * Preposle objekt otazky k ulozeni. Pri editacci nebude zalezet jake otazky a v jakem poradi uz v DB, bude vsechno znova
     * TODO mozna se na to jeste jednou koukni
     * */
    public Otazka saveOrUpdate(Otazka otazka) {

        Optional<OblastOtazky> oblastOtazky = oblastOtazkyRepository.findById(otazka.getOblastOtazky().getId());
        if (oblastOtazky.isPresent()) {
            otazka.setOblastOtazky(oblastOtazky.get());
        }

        for (OtazkaOdpovedi item : otazka.getOdpovedi()) {
            item.setOtazka(otazka);
            Optional<Odpoved> odpoved = odpovedRepository.findById(item.getOdpoved().getId());
            if (odpoved.isPresent()) //melo by snad vzdy vyjit
                item.setOdpoved(odpoved.get());
        }

        Optional<Otazka> test = findById(otazka.getId());

        //update
        if (test.isPresent()) {
            otazka.setItemDOO(test.get().getItemDOO());
            otazka.setDotazniky(test.get().getDotazniky());
            List<OtazkaOdpovedi> neco = otazkaOdpovediRepozitory.findByIdIdOtazky(test.get().getId());
            for (OtazkaOdpovedi odpovedi : otazkaOdpovediRepozitory.findByIdIdOtazky(test.get().getId())) {
                otazkaOdpovediRepozitory.delete(odpovedi);
                otazkaOdpovediRepozitory.flush();
            }
        }

        return otazkaRepository.saveAndFlush(otazka);
    }

    /**
     * Vrati seznam vsech otazek
     * */
    public Iterable<Otazka> findAll() {
        return otazkaRepository.findAll();
    }

    /**
     * Vrati pozadovaneho otazku podle id, nebo null prokud tam neni
     * */
    public Optional<Otazka> findById(Long id) {
        return otazkaRepository.findById(id);
    }

    /**
     * Smaze otazku podle jejiho id
     * */
    public void delete(Long id) {

        Optional<Otazka> otazka = findById(id);

        if(otazka.isPresent())
            otazkaRepository.delete(otazka.get());
    }
}
