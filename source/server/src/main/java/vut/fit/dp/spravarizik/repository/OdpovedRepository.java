package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Odpoved;

import java.util.Optional;

/**
 * Repository pro tabulku Odpoved, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface OdpovedRepository extends JpaRepository<Odpoved, Long> {

    //najdi podle textu otazky
    Optional<Odpoved> findByTextOdpovedi(String textOdpovedi);
}
