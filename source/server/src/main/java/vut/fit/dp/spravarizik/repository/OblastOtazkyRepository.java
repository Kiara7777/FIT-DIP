package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.OblastOtazky;

import java.util.Optional;

/**
 * Repository pro tabulku OblastOtazky, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface OblastOtazkyRepository extends JpaRepository<OblastOtazky, Long> {

    //najdi podle nazvu oblasti
    Optional<OblastOtazky> findByNazev(String nazev);
}