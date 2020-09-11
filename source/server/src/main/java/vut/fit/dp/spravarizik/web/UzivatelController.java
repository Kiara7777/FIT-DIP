package vut.fit.dp.spravarizik.web;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.security.MyUserDetails;
import vut.fit.dp.spravarizik.service.UzivatelService;

import vut.fit.dp.spravarizik.uniteClass.LoginResponseObj;
import vut.fit.dp.spravarizik.web.SpolecneFunkce;

import javax.validation.Valid;
import java.util.Optional;

/**
 * Trida pro kontroler uzivatele. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class UzivatelController {

    @Autowired
    UzivatelService uzivatelService;

    /**
     * Funkce pro pridani nebo updatovani uzivatele
     * @param uzivatel Objekt uzivatele
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Uzivatele
     * */
    @PostMapping("/user")
    public ResponseEntity<?> addUzivatel(@Valid @RequestBody Uzivatel uzivatel, BindingResult result) {

        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Uzivatel newUzivatel = uzivatelService.saveOrUpdate(uzivatel);

        return new ResponseEntity<Uzivatel>(newUzivatel, HttpStatus.OK);

    }

    /**
     * Vrati vsechny uzivatele v databazi
     * */
    @GetMapping("/users")
    public Iterable<Uzivatel> getAll() {
        return uzivatelService.findAll();
    }

    /**
     * Vrati bezpecnostni informace od uzivatele
     * */
    @GetMapping("/info")
    public ResponseEntity<?> getSecInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails details = (MyUserDetails) authentication.getPrincipal();
        LoginResponseObj myData = new LoginResponseObj(details.getId(), details.getSecRole());
        return new ResponseEntity<LoginResponseObj>(myData, HttpStatus.OK);
    }

    /**
     * Vrati pocet zaznamu uzivatelu v tabulce
     * */
    @GetMapping("/users/count")
    public ResponseEntity<?> getUsersCount() {
        Long count = uzivatelService.getUsersCount();
        return new ResponseEntity<Long>(count,  HttpStatus.OK);
    }

    /**
     * Vrati jednoho uzivatele pohle jeho id
     * @param id id daneho uzivatele
     * */
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<Uzivatel> uzivatel = uzivatelService.findById(id);

        if (!uzivatel.isPresent()) {
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Optional<Uzivatel>>(uzivatel, HttpStatus.OK);
    }

    /**
     * Vrati objekt aktualne prihlasenenho uzivatele
     * */
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails details = (MyUserDetails) authentication.getPrincipal();
        Optional<Uzivatel> uzivatel = uzivatelService.findById(details.getId());

        if (!uzivatel.isPresent()) {
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Optional<Uzivatel>>(uzivatel, HttpStatus.OK);
    }


    /**
     * Funkce na smazani uzivatle dle pozadovaneho id
     * @param id id uzivatele
     * */
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {

        uzivatelService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }
}
