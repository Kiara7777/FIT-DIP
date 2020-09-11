package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.UzivProjektRiziko;
import vut.fit.dp.spravarizik.domain.id.UzivProjRizikId;

import java.util.List;
import java.util.Optional;

/**
 * Repository pro tabulku UzivProjektRiziko, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface UzivProjektRizikoRepozitory extends JpaRepository<UzivProjektRiziko, UzivProjRizikId> {

    //najdi rizika na danem projektu
    Iterable<UzivProjektRiziko> findByIdProjekt(long projekt);

    //najdi zanam dle projektu a rizika
    Optional<UzivProjektRiziko> findByIdProjektAndIdRiziko(long projekt, long riziko);

}
