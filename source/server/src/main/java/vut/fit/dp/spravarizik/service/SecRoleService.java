package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.BezpRole;
import vut.fit.dp.spravarizik.repository.SecRoleRepository;

import java.util.Optional;

/**
 * Service sluzba pro bezpecnostni roli. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class SecRoleService {

    @Autowired
    private SecRoleRepository secRoleRepository;


    /**
     * Vrati seznam vsech roli
     * */
    public Iterable<BezpRole> findAll() {
        return secRoleRepository.findAll();
    }

    /**
     * Vrati pozadovaneho roli podle id, nebo null prokud tam neni
     * */
    public Optional<BezpRole> findById(Long id) {
        return secRoleRepository.findById(id);
    }

}
