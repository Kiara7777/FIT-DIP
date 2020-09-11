package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.Odpoved;
import vut.fit.dp.spravarizik.service.OdpovedService;

import javax.validation.Valid;
import java.util.Optional;

/**
 * Trida pro kontroler Odovedi. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class OdpovedController {

    @Autowired
    private OdpovedService odpovedService;

    /**
     * Funkce pro pridani nebo updatovani odpovedi
     * @param odpoved Objekt odpovedi
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Role
     * */
    @PostMapping("/answer")
    public ResponseEntity<?> addOdpoved(@Valid @RequestBody Odpoved odpoved, BindingResult result) {

        //BindingResult pomaha ziskat informace z Validace
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Odpoved newOdpoved = odpovedService.saveOrUpdate(odpoved);

        return new ResponseEntity<Odpoved>(newOdpoved, HttpStatus.CREATED);
    }


    /**
     * Vrati vsechny odpovedi v databazi
     * */
    @GetMapping("/answers")
    public Iterable<Odpoved> getAll() {
        return odpovedService.findAll();
    }

    /**
     * Vrati jednu odpoved podle jejiho id
     * @param id id dane odpovedi
     * */
    @GetMapping("/answer/{id}")
    public ResponseEntity<?> getAnswerById(@PathVariable Long id) {

        Optional<Odpoved> odpoved = odpovedService.findById(id);

        if (!odpoved.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<Odpoved>>(odpoved, HttpStatus.OK);
    }

    /**
     * Funkce na smazani odpovedi dle pozadovane id
     * @param id id odpovedi
     * */
    @DeleteMapping("/answer/{id}")
    public ResponseEntity<?> deleteAnswer(@PathVariable Long id) {

        odpovedService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }
}
