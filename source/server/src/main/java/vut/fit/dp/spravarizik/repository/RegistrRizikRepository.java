package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.RegistrRizik;

import java.util.Optional;

/**
 * Repository pro tabulku RegistrRizik, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface RegistrRizikRepository extends JpaRepository<RegistrRizik, Long> {

    //najit rizko podle nazvu
    Optional<RegistrRizik> findByNazev(String nazev);
}
