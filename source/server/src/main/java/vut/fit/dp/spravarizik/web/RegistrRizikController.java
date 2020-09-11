package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.RegistrRizik;

import vut.fit.dp.spravarizik.service.RegistrRizikService;


import javax.validation.Valid;

import java.util.Optional;

/**
 * Trida pro kontroler RegistruRizik. Tohle odpovida na volani klienta na API
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class RegistrRizikController {


    @Autowired
    RegistrRizikService registrRizikService;

    /**
     * Funkce pro pridani nebo updatovani rizika v registru
     * @param registrRizik Objekt rizika v registru
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt RegistrRizik
     * */
    @PostMapping("/risk")
    public ResponseEntity<?> addRisk(@Valid @RequestBody RegistrRizik registrRizik, BindingResult result) {

        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        RegistrRizik newRegistrRizik = registrRizikService.saveOrUpdate(registrRizik);

        return new ResponseEntity<RegistrRizik>(newRegistrRizik, HttpStatus.CREATED);

    }

    /**
     * Vrati vsechny rizika v databazi
     * */
    @GetMapping("/risks")
    public Iterable<RegistrRizik> getAll() {
        return registrRizikService.findAll();
    }

    /**
     * Vrati pocet zaznamu rizik v tabulce
     * */
    @GetMapping("/risks/count")
    public ResponseEntity<?> getUsersCount() {
        Long count = registrRizikService.getRisksCount();
        return new ResponseEntity<Long>(count,  HttpStatus.OK);
    }


    /**
     * Vrati jedno riziko podle jeho id
     * @param id id daneho rizika
     * */
    @GetMapping("/risk/{id}")
    public ResponseEntity<?> getRiskById(@PathVariable Long id) {
        Optional<RegistrRizik> registrRizik = registrRizikService.findById(id);

        if (!registrRizik.isPresent()) {
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Optional<RegistrRizik>>(registrRizik, HttpStatus.OK);
    }


    /**
     * Funkce na smazani rizika dle pozadovaneho id
     * @param id id rizika
     * */
    @DeleteMapping("/risk/{id}")
    public ResponseEntity<?> deleteRisk(@PathVariable Long id) {

        registrRizikService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }

}
