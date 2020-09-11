package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.OtazkaOdpovedi;
import vut.fit.dp.spravarizik.domain.id.OtazkaOdpovedId;

import java.util.List;

/**
 * Repository pro tabulku OtazkaOdpovedi, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface OtazkaOdpovediRepozitory extends JpaRepository<OtazkaOdpovedi, OtazkaOdpovedId> {

    //najdi podle id otazky
    List<OtazkaOdpovedi> findByIdIdOtazky(long idOtazky);
}
