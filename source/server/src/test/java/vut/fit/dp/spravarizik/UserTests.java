package vut.fit.dp.spravarizik;

import org.h2.engine.User;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;
import vut.fit.dp.spravarizik.domain.BezpRole;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.repository.RoleRepository;
import vut.fit.dp.spravarizik.repository.UzivatelRepository;
import vut.fit.dp.spravarizik.service.UzivatelService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * Testy na uzivatele
 * @author Sara Skutova
 * */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class UserTests {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UzivatelRepository uzivatelRepository;

    @Autowired
    private UzivatelService uzivatelService;

    /**
     * Pridani noveho uzivatele
     * */
    @Test
    public void newUser() throws Exception {
        Optional<Role> role = roleRepository.findById(Long.valueOf(1));

        Uzivatel uzivatel = new Uzivatel();
        uzivatel.setLogin("xtest00");
        uzivatel.setPasswd("passwd");
        uzivatel.setEmail("test@test.cz");
        uzivatel.setNazev("Test Test");
        uzivatel.setRole(role.get());

        uzivatelService.saveOrUpdate(uzivatel);

        Optional<Uzivatel> newUzivatel = uzivatelRepository.findByLogin("xtest00");
        assertThat(newUzivatel.get().getNazev(), equalTo("Test Test"));
    }

    /**
     * Editace uzivatele
     * */
    @Test
    public void editUser() throws Exception {

        Optional<Uzivatel> editUzivatel = uzivatelRepository.findByLogin("xnovak00");
        editUzivatel.get().setNazev("Test Test NEW");

        uzivatelService.saveOrUpdate(editUzivatel.get());

        Optional<Uzivatel> newUzivatel = uzivatelRepository.findByLogin("xnovak00");
        assertThat(newUzivatel.get().getNazev(), equalTo("Test Test NEW"));
        assertThat(newUzivatel.get().getId(), comparesEqualTo(Long.valueOf(2)));
    }

    /**
     * Smazani uzivatele
     * */
    @Test
    public void deleteUser() throws Exception {
        uzivatelService.delete(Long.valueOf(1));
        Iterable<Uzivatel> users = uzivatelService.findAll();
        List<Uzivatel> result = new ArrayList<Uzivatel>();
        users.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(4));

        List<String> stringUsers = new ArrayList<String>();
        for (Uzivatel uzivatel : result) {
            stringUsers.add(uzivatel.getLogin());
        }
        assertThat(stringUsers, contains("xnovak00", "xriger00", "xhodso00", "xlogin00"));
    }

    /**
     * Pridani noveho uzivatele bez role
     * */
    @Test
    public void newUserWithoutRole() throws Exception {

        Uzivatel uzivatel = new Uzivatel();
        uzivatel.setLogin("xtest00");
        uzivatel.setPasswd("passwd");
        uzivatel.setEmail("test@test.cz");
        uzivatel.setNazev("Test Test");

        uzivatelService.saveOrUpdate(uzivatel);

        Optional<Uzivatel> newUzivatel = uzivatelRepository.findByLogin("xtest00");
        assertThat(newUzivatel.get().getNazev(), equalTo("Test Test"));
        assertThat(newUzivatel.get().getRole().getNazev(), equalTo("Nepřiřazeno"));
    }

    /**
     * Editace role uzivatele
     * */
    @Test
    public void editUserRole() throws Exception {
        Optional<Uzivatel> editUser = uzivatelRepository.findById(Long.valueOf(1));

        assertThat(editUser.get().getRole().getNazev(), equalTo("Člen týmu"));

        Optional<Role> role = roleRepository.findById(Long.valueOf(4));
        editUser.get().setRole(role.get());

        uzivatelService.saveOrUpdate(editUser.get());

        Optional<Uzivatel> newUzivatel = uzivatelService.findById(Long.valueOf(1));
        assertThat(newUzivatel.get().getRole().getNazev(), equalTo("Projektový administrátor"));
    }

    /**
     * Ziskani vsech uzivatelu
     * */
    @Test
    public void allUsers() throws Exception {

        Iterable<Uzivatel> users = uzivatelService.findAll();
        List<Uzivatel> result = new ArrayList<Uzivatel>();
        users.forEach(result::add);

        assertThat(result.size(), comparesEqualTo(5));
    }

    /**
     * Ziskani uzivatele dle id
     * */
    @Test
    public void idUser() throws Exception {
        Optional<Uzivatel> user = uzivatelService.findById(Long.valueOf(1));

        assertThat(user.get().getId(), comparesEqualTo(Long.valueOf(1)));
        assertThat(user.get().getNazev(), equalTo("Diana Laris"));
    }





}
