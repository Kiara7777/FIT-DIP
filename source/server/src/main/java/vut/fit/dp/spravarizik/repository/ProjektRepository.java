package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Projekt;

import java.util.List;
import java.util.Optional;

/**
 * Repository pro tabulku Projekt, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface ProjektRepository extends JpaRepository<Projekt, Long> {

    //najdi aktivni projekty
    List<Projekt> findByAktivniTrue();

    //najdi neaktivni projekty
    List<Projekt> findByAktivniFalse();

    //najdi projekt podle nazvu
    Optional<Projekt> findByNazev(String nazev);
}
