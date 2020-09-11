package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Otazka;

import java.util.Optional;

/**
 * Repository pro tabulku Otazka, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface OtazkaRepository extends JpaRepository<Otazka, Long> {

    //najdi podle textu otazky
    Optional<Otazka> findByTextOtazky(String textOtazky);
}
