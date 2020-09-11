package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.Odpoved;
import vut.fit.dp.spravarizik.domain.Otazka;
import vut.fit.dp.spravarizik.domain.Projekt;
import vut.fit.dp.spravarizik.service.OdpovedService;
import vut.fit.dp.spravarizik.service.OtazkaService;

import javax.validation.Valid;
import java.util.Optional;

/**
 * Trida pro kontroler Otazek. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class OtazkaController {


    @Autowired
    private OtazkaService otazkaService;

    /**
     * Funkce pro pridani nebo updatovani otazky
     * @param otazka Objekt potazky
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Otazka
     * */
    @PostMapping("/question")
    public ResponseEntity<?> addOtazka(@Valid @RequestBody Otazka otazka, BindingResult result) {

        //kontrola na errory pri pokusu o prekladu JSON objeku na pozadovany objekt @RequestBody
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Otazka newOtazka = otazkaService.saveOrUpdate(otazka);

        return new ResponseEntity<Otazka>(newOtazka, HttpStatus.CREATED);
    }


    /**
     * Vrati vsechny otazky ulozene v databazi
     * */
    @GetMapping("/questions")
    public Iterable<Otazka> getAll() {
        return otazkaService.findAll();
    }

    /**
     * Vrati jedenu otazku podle jejiho id
     * @param id id dane otazky
     * */
    @GetMapping("/question/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable Long id) {

        Optional<Otazka> otazka = otazkaService.findById(id);

        if (!otazka.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<Otazka>>(otazka, HttpStatus.OK);
    }

    /**
     * Funkce na smazani otazky dle pozadovane id
     * @param id id otazky
     * */
    @DeleteMapping("/question/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {

        otazkaService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }


}
