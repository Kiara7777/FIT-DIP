package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Dotaznik;

import java.util.Optional;

/**
 * Repository pro tabulku Dotaznik, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface DotaznikRepository extends JpaRepository<Dotaznik, Long> {

    //najdi podle nazvu dotazniku
    Optional<Dotaznik> findByNazev(String nazev);
}
