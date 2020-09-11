package vut.fit.dp.spravarizik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.BezpRole;
import vut.fit.dp.spravarizik.repository.RoleRepository;
import vut.fit.dp.spravarizik.repository.SecRoleRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service sluzba pro roli. Spojuje Kontroler s Repozitarem. Zde se provadeji veskere upravujici
 * aspekty dat pred odeslanim/ulozenim atd.
 *
 * @author Sara Skutova
 * */
@Service
public class RoleService {

    //        return roleRepository.save(role);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SecRoleRepository secRoleRepository;

    //jenom funkce na testovani TODO SMAZAT
    public List<Role> list() {
        return roleRepository.findAll();
    }

    /**
     * Preposle objekt role k ulozeni. Pokud role uz v DB je, tak se pred ulozenim vyhleda, a prekopiruji se z ni
     * seznam uzivatelu, kteri danou roli maji.
     * */
    public Role saveOrUpdate(Role role) {

        Optional<Role> testRole = findById(role.getId());

        if(testRole.isPresent())
            role.setUzivatele(testRole.get().getUzivatele());

        if(role.getSecurityRole() == null) {
            Optional<BezpRole> sec = secRoleRepository.findById(Long.valueOf(1));
            if (sec.isPresent())
                role.setSecurityRole(sec.get());
        } else {
            Optional<BezpRole> sec = secRoleRepository.findById(role.getSecurityRole().getId());
            if(sec.isPresent())
                role.setSecurityRole(sec.get());
        }


        return roleRepository.save(role);
    }

    /**
     * Vrati seznam vsech roli
     * */
    public Iterable<Role> findAll() {
        return roleRepository.findAll();
    }

    /**
     * Vrati pozadovaneho roli podle id, nebo null prokud tam neni
     * */
    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    /**
     * Smaze roli podle jejiho id
     * */
    public void delete(Long id) {

        Optional<Role> role = findById(id);

        if(role.isPresent())
            roleRepository.delete(role.get());
    }
}


