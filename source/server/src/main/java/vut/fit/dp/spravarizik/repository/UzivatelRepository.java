package vut.fit.dp.spravarizik.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vut.fit.dp.spravarizik.domain.Uzivatel;

import java.util.Optional;

/**
 * Repository pro tabulku Uzivatel, umoznuje manipulaci s tabulkou bez psani dotazu
 * DAO Data access object uroven
 *
 * @author Sara Skutova
 * */
@Repository
public interface UzivatelRepository extends JpaRepository<Uzivatel, Long> {

    //JPA to podle nazvu samo zvladne najit potrebne informace(potrebny zaznam)
    //https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#reference
    Optional<Uzivatel> findByLogin(String login);

}
