package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.DotazOtazOdpo;
import vut.fit.dp.spravarizik.domain.DotaznikOtazka;
import vut.fit.dp.spravarizik.domain.id.DotazOtazOdpoId;
import vut.fit.dp.spravarizik.domain.id.DotaznikOtazkaId;

import java.util.List;

/**
 * Repository pro tabulku DotazOtazOdpo, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface DotazOtazOdpoRepository extends JpaRepository<DotazOtazOdpo, DotazOtazOdpoId> {

    //najdi podle id projektu
    List<DotazOtazOdpo> findByIdProjektID(long projektID);

    //najdi podle projektu, uzivatele a rizika
    List<DotazOtazOdpo> findByIdProjektIDAndIdUzivatelIDAndIdDotaznikID(long projektID, long UzivatelID, long DotaznikID);
}
