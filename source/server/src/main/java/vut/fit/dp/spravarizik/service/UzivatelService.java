package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.repository.RoleRepository;
import vut.fit.dp.spravarizik.repository.UzivatelRepository;

import java.util.Optional;

/**
 * Service sluzba pro uzivatele. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class UzivatelService {

    @Autowired
    private UzivatelRepository uzivatelRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Preposle objekt uzivatele k ulozeni. Pokud objektu chybi role, tak automaticky prideli roli - NEZARAZENO
     * Zaroven take zajisti, aby pri editaci byly vsechny zavisle seznami spravne znovu prideleny
     * */
    public Uzivatel saveOrUpdate (Uzivatel uzivatel) {

        //prideleni role pokud neni zadana
        if(uzivatel.getRole() == null) {
            Optional<Role> role = roleRepository.findById(Long.valueOf(1));

            if (role.isPresent())
                uzivatel.setRole(role.get());

        }
        else { //prideleni objektu role uzivateli (ze klienta se zasila pouze id, ne cely objekt, musi se dodatecne  pridelit)
            Optional<Role> role = roleRepository.findById(uzivatel.getRole().getId());

            if (role.isPresent())
                uzivatel.setRole(role.get());

        }

        //test zda uzivatel existuje + zajisteni spravneho propojeni potomku - JINAK SI TO BUDE MYSLET ZE POTOMCI JSOU OPUSTENI A SMAZE JE TO!
        Optional<Uzivatel> testUzivatel = uzivatelRepository.findById(uzivatel.getId());
        if(testUzivatel.isPresent()) {
            uzivatel.setUzivProj(testUzivatel.get().getUzivProj());
            uzivatel.setItemUzProjRiz(testUzivatel.get().getItemUzProjRiz());
            uzivatel.setItemDOO(testUzivatel.get().getItemDOO());
        }


        return uzivatelRepository.save(uzivatel);
    }

    /**
     * Vrati celkovy pocet uzivatelu v DB
     * */
    public Long getUsersCount() {
        return uzivatelRepository.count();
    }


    /**
     * Vrati seznam vsech uzivatel
     * */
    public Iterable<Uzivatel> findAll() {
        return uzivatelRepository.findAll();
    }

    /**
     * Vrati pozadovaneho uzivatele podle jeho id, nebo null prokud tam neni
     * */
    public Optional<Uzivatel> findById(Long id) {
        return uzivatelRepository.findById(id);
    }

    /**
     * Smaze uzivatele podle jeho id
     * */
    public void delete(Long id) {
        Optional<Uzivatel> uzivatel = findById(id);

        if(uzivatel.isPresent()) {
            uzivatelRepository.delete(uzivatel.get());
        }
    }
}
