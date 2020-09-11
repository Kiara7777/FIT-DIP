package vut.fit.dp.spravarizik.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import vut.fit.dp.spravarizik.domain.UzivProjekt;
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.repository.UzivProjektRepository;
import vut.fit.dp.spravarizik.repository.UzivatelRepository;

import java.util.Optional;

/**
 * Trida primarne slouzici pro test zda uzivatel muze pristoupit k datum daneho projektu
 * inspirace zde: https://stackoverflow.com/questions/51712724/how-to-allow-a-user-only-access-their-own-data-in-spring-boot-spring-security
 *
 * @author Sara Skutova
 * */
@Component("userTest")
public class UserTest {

    @Autowired
    UzivProjektRepository uzivProjektRepository;

    @Autowired
    UzivatelRepository uzivatelRepository;

    public boolean userCanAccessProject(Long idProject, Authentication authentication) throws AccessDeniedException {
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();

        Optional<Uzivatel> test = uzivatelRepository.findById(userDetails.getId());
        if (!test.isPresent())
            return false;

        Uzivatel uzivatel = test.get();


        if (uzivatel.getRole().getSecurityRole().getNazev().equals("ADMIN") || uzivatel.getRole().getSecurityRole().getNazev().equals("MANAGER")) {
            return true;
        }
        else {
            Optional<UzivProjekt> uzivProjekt = uzivProjektRepository.findByIdUzivatelIDAndIdProjectIDAndAktivniTrue(uzivatel.getId(), idProject);
            if (uzivProjekt.isPresent())
                return true;
        }

        return false;
    }
}
