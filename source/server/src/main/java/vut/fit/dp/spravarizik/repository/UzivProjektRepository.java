package vut.fit.dp.spravarizik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Projekt;
import vut.fit.dp.spravarizik.domain.UzivProjekt;
import vut.fit.dp.spravarizik.domain.id.UzivProjektId;

import java.util.List;
import java.util.Optional;

/**
 * Repository pro tabulku UzivProjekt, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface UzivProjektRepository extends JpaRepository<UzivProjekt, UzivProjektId> {

    //najit vedouciho podle projektu
    List<UzivProjekt> findByProjektAndVedouciTrue(Projekt projekt);

    //najdle aktivniho vedouciho na projektu
    Optional<UzivProjekt> findByIdProjectIDAndVedouciTrueAndAktivniTrue(long projectID);

    //najdi vsechny  pracujici na projektu
    List<UzivProjekt> findByIdProjectID(long projectID);

    //najdi nevedouci aktivni resitele projektu
    List<UzivProjekt> findByIdProjectIDAndVedouciFalseAndAktivniTrue(long projectID);

    //najdi zanam dle id uzivatele, ktery neni vedouci a je aktivni
    List<UzivProjekt> findByIdUzivatelIDAndVedouciFalseAndAktivniTrue(long uzivatelID);

    //najdi zaznma dle id uzivatele a id projektu a musi by aktivni
    Optional<UzivProjekt> findByIdUzivatelIDAndIdProjectIDAndAktivniTrue(long uzivatelID, long projectID);

}
