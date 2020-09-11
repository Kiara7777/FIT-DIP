package vut.fit.dp.spravarizik.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.repository.RoleRepository;
import vut.fit.dp.spravarizik.repository.UzivatelRepository;

import java.util.Optional;

/**
 * Implementuje vlastni UserDetailService, diky tomuto ziska spring security potrebna data
 * Iplementuje se proto, ze Spring Security nema primou podporu pro JPA
 * Pokracovani inspirace z: https://www.youtube.com/watch?v=TNt3GHuayXs&list=PLqq-6Pq4lTTYTEooakHchTGglSvkZAjnE&index=8&ab_channel=JavaBrains
 *
 * @author Sara Skutova
 */
@Service
public class MyUserDetailsService implements UserDetailsService {


    @Autowired
    UzivatelRepository uzivatelRepository;

    @Autowired
    RoleRepository roleRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {

        Optional<Uzivatel> uzivatel = uzivatelRepository.findByLogin(login);

        uzivatel.orElseThrow(() -> new UsernameNotFoundException("Spatne prihlaseni"));

        return new MyUserDetails(uzivatel.get());

    }
}
