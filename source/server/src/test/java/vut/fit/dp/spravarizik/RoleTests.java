package vut.fit.dp.spravarizik;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Assert;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.BezpRole;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.serializer.RoleSerializer;
import vut.fit.dp.spravarizik.repository.RoleRepository;
import vut.fit.dp.spravarizik.repository.SecRoleRepository;
import vut.fit.dp.spravarizik.repository.UzivatelRepository;
import vut.fit.dp.spravarizik.service.RoleService;
import vut.fit.dp.spravarizik.service.SecRoleService;
import vut.fit.dp.spravarizik.web.RoleController;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.*;
//import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testy na roli
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
class RoleTests {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SecRoleRepository secRoleRepository;

    @Autowired
    private RoleService roleService;

    /**
     * Test pridani nove role
     * */
    @Test
    public void newRole() throws Exception {
        Optional<BezpRole> bezpRole = secRoleRepository.findById(Long.valueOf(1));

        Role role = new Role();
        role.setNazev("Test Role");
        role.setSecurityRole(bezpRole.get());

        roleService.saveOrUpdate(role);

        Optional<Role> newRole = roleRepository.findByNazev("Test Role");
        assertThat(newRole.get().getNazev(), equalTo("Test Role"));
    }

    /**
     * Test editace role
     * */
    @Test
    public void editRole() throws Exception {

        Optional<Role> editRole = roleRepository.findByNazev("Projektový manažer");
        editRole.get().setNazev("Edit Role");

        roleService.saveOrUpdate(editRole.get());

        Optional<Role> newRole = roleRepository.findByNazev("Edit Role");
        assertThat(newRole.get().getNazev(), equalTo("Edit Role"));
        assertThat(newRole.get().getId(), comparesEqualTo(Long.valueOf(3)));
    }

    /**
     * Test smazani role
     * */
    @Test
    public void deleteRole() throws Exception {
        roleService.delete(Long.valueOf(3));
        Iterable<Role> roles = roleService.findAll();
        List<Role> result = new ArrayList<Role>();
        roles.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(3));

        List<String> stringRoles = new ArrayList<String>();
        for (Role role : result) {
            stringRoles.add(role.getNazev());
        }
        assertThat(stringRoles, contains("Nepřiřazeno", "Člen týmu", "Projektový administrátor"));
    }


    /**
     * Test pridani nove role bez bezpecnostni role
     * */
    @Test
    public void newRoleWithoutSecurity() throws Exception {


        Role role = new Role();
        role.setNazev("Test Role");

        roleService.saveOrUpdate(role);

        Optional<Role> newRole = roleRepository.findByNazev("Test Role");
        assertThat(newRole.get().getNazev(), equalTo("Test Role"));
        assertThat(newRole.get().getSecurityRole().getNazev(), equalTo("USER"));
    }

    /**
     * Zmena bezpecnostni role
     * */
    @Test
    public void editRoleSecurity() throws Exception {
        Optional<Role> editRole = roleRepository.findById(Long.valueOf(1));

        assertThat(editRole.get().getSecurityRole().getNazev(), equalTo("USER"));

        Optional<BezpRole> bezpRole = secRoleRepository.findById(Long.valueOf(2));
        editRole.get().setSecurityRole(bezpRole.get());

        roleService.saveOrUpdate(editRole.get());

        Optional<Role> newRole = roleRepository.findById(Long.valueOf(1));
        assertThat(editRole.get().getSecurityRole().getNazev(), equalTo("MANAGER"));

    }


    /**
     * Test ziskani vsech roli
     * */
    @Test
    public void allRole() throws Exception {

        Iterable<Role> roles = roleService.findAll();
        List<Role> result = new ArrayList<Role>();
        roles.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(4));
    }

    /**
     * Ziskani role dle id
     * */
    @Test
    public void idRole() throws Exception {
        Optional<Role> editRole = roleRepository.findById(Long.valueOf(1));

        assertThat(editRole.get().getId(), comparesEqualTo(Long.valueOf(1)));
        assertThat(editRole.get().getNazev(), equalTo("Nepřiřazeno"));
    }
}
