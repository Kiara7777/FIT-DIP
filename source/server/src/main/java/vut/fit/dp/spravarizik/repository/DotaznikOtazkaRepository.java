package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Dotaznik;
import vut.fit.dp.spravarizik.domain.DotaznikOtazka;
import vut.fit.dp.spravarizik.domain.id.DotaznikOtazkaId;

import java.util.List;

/**
 * Repository pro tabulku DotaznikOtazka, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface DotaznikOtazkaRepository extends JpaRepository<DotaznikOtazka, DotaznikOtazkaId> {

    //najdi podle id dotazniku
    List<DotaznikOtazka> findByIdDotaznikID(long dotaznikID);
}
