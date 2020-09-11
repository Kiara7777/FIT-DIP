package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Kategorie;

import java.util.Optional;

/**
 * Repository pro tabulku Kategorie, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface KategorieRepository extends JpaRepository<Kategorie, Long> {

    //najdi kategorii podle nazvu
    Optional<Kategorie> findByNazev(String nazev);
}
