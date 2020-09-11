package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.*;
import vut.fit.dp.spravarizik.repository.DotaznikOtazkaRepository;
import vut.fit.dp.spravarizik.repository.DotaznikRepository;
import vut.fit.dp.spravarizik.repository.OtazkaRepository;
import vut.fit.dp.spravarizik.repository.ProjektRepository;
import vut.fit.dp.spravarizik.uniteClass.DotaznikCard;
import vut.fit.dp.spravarizik.uniteClass.ProjectCard;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service sluzba pro dotaznik. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class DotaznikService {

    @Autowired
    private DotaznikRepository dotaznikRepository;

    @Autowired
    private DotaznikOtazkaRepository dotaznikOtazkaRepository;

    @Autowired
    private OtazkaRepository otazkaRepository;

    @Autowired
    private ProjektRepository projektRepository;

    /**
     * Prida nebo updatuje dotaznik, bude tam spolecne i s otazkama
     * */
    public Dotaznik saveOrUpdate(Dotaznik dotaznik) {

        for (DotaznikOtazka dotaznikOtazka : dotaznik.getOtazky()) {
            dotaznikOtazka.setDotaznik(dotaznik);
            Optional<Otazka> otazka = otazkaRepository.findById(dotaznikOtazka.getOtazkaDotazniku().getId());
            if (otazka.isPresent()) {
                dotaznikOtazka.setOtazkaDotazniku(otazka.get());
            }
        }

        Optional<Dotaznik> test = dotaznikRepository.findById(dotaznik.getId());
        if (test.isPresent()) {
            //spojit itemDOO a dotazProjekt
            dotaznik.setItemDOO(test.get().getItemDOO());
            dotaznik.setProjekts(test.get().getProjekts());

            for(DotaznikOtazka dotaznikOtazka : dotaznikOtazkaRepository.findByIdDotaznikID(dotaznik.getId())) {
                dotaznikOtazkaRepository.delete(dotaznikOtazka);
            }
            dotaznikOtazkaRepository.flush();
        }


        return dotaznikRepository.save(dotaznik);
    }

    /**
     * Vrati seznam vsech dotazniku
     * */
    public Iterable<Dotaznik> findAll() {
        return dotaznikRepository.findAll();
    }

    /**
     * Vrati vsechny carty s informacemi o dotaznicich
     * */
    public Iterable<DotaznikCard> findAllCard() {
        List<Dotaznik> dotazniky = dotaznikRepository.findAll();
        List<DotaznikCard> cards = new ArrayList<DotaznikCard>();

        for(Dotaznik dotaznik : dotazniky) {
            int pocetOtazek = dotaznik.getOtazky().size();
            int pocetProjektu = dotaznik.getProjekts().size();
            boolean jePouzit = pocetProjektu > 0;
            DotaznikCard card = new DotaznikCard(dotaznik.getId(), dotaznik.getNazev(), dotaznik.getPopis(), pocetOtazek, jePouzit);
            cards.add(card);
        }

        return cards;
    }

    /**
     * Vrati pozadovany dotaznik podle id, nebo null prokud tam neni
     * */
    public Optional<Dotaznik> findById(Long id) {
        return dotaznikRepository.findById(id);
    }

    /**
     * Smaze dotaznik podle jeho id
     * */
    public void delete(Long id) {

        Optional<Dotaznik> dotaznik = findById(id);

        if(dotaznik.isPresent()) {
            for(Projekt projekt : dotaznik.get().getProjekts()){
                projekt.setDotaznikProjektu(null);
                projektRepository.save(projekt);
            }
            dotaznikRepository.delete(dotaznik.get());
        }
    }
}

