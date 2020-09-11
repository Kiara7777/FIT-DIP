package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Role;

import java.util.Optional;

/**
 * Repository pro tabulku Role, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    //najdi roli podle nazvu
    Optional<Role> findByNazev(String nazev);
}
