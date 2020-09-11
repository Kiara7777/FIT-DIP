package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.OblastOtazky;
import vut.fit.dp.spravarizik.service.OblastOtazkyService;

import javax.validation.Valid;
import java.util.Optional;

/**
 * Trida pro kontroler OblastOtazky. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class OblastOtazkyController {

    @Autowired
    private OblastOtazkyService oblastOtazkyService;


    /**
     * Funkce pro pridani nebo updatovani oblastiOtazky
     * @param oblastOtazky Objekt oblasti otazky
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Role
     * */
    @PostMapping("/questionArea")
    public ResponseEntity<?> addQuestionArea(@Valid @RequestBody OblastOtazky oblastOtazky, BindingResult result) {

        //BindingResult pomaha ziskat informace z Validace
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        OblastOtazky newOblastOtazky = oblastOtazkyService.saveOrUpdate(oblastOtazky);

        return new ResponseEntity<OblastOtazky>(newOblastOtazky, HttpStatus.CREATED);
    }


    /**
     * Vrati vsechny Oblasti otazek v databazi
     * */
    @GetMapping("/questionAreas")
    public Iterable<OblastOtazky> getAll() {
        return oblastOtazkyService.findAll();
    }

    /**
     * Vrati jednu oblast otazky podle jejiho id
     * @param id id dane oblasti
     * */
    @GetMapping("/questionArea/{id}")
    public ResponseEntity<?> getQuestionAreaById(@PathVariable Long id) {

        Optional<OblastOtazky> oblastOtazky = oblastOtazkyService.findById(id);

        if (!oblastOtazky.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<OblastOtazky>>(oblastOtazky, HttpStatus.OK);
    }

    /**
     * Funkce na smazani oblasti otazky dle pozadovane id
     * @param id id role
     * */
    @DeleteMapping("/questionArea/{id}")
    public ResponseEntity<?> deleteQuestionArea(@PathVariable Long id) {

        oblastOtazkyService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }

}
