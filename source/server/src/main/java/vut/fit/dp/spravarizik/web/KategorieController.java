package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.Kategorie;

import vut.fit.dp.spravarizik.service.KategorieService;

import vut.fit.dp.spravarizik.web.SpolecneFunkce;

import javax.validation.Valid;
import java.util.Optional;

/**
 * Trida pro kontroler kategorie. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class KategorieController {

    @Autowired
    KategorieService kategorieService;

    /**
     * Funkce pro pridani nebo updatovani kategorie rizika
     * @param kategorie Objekt kategorie
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Kategorie
     * */
    @PostMapping("/kategorie")
    public ResponseEntity<?> addKategorie(@Valid @RequestBody Kategorie kategorie, BindingResult result) {

        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Kategorie newKategorie = kategorieService.saveOrUpdate(kategorie);

        return new ResponseEntity<Kategorie>(newKategorie, HttpStatus.CREATED);
    }

    /**
     * Vrati vsechny kategorie v databazi
     * */
    @GetMapping("/kategories")
    public Iterable<Kategorie> getAll() {
        return kategorieService.findAll();
    }

    /**
     * Vrati jednu kategorii podle jejiho id
     * @param id id dane kategorie
     * */
    @GetMapping("/kategorie/{id}")
    public ResponseEntity<?> getKategorieById(@PathVariable Long id) {

        //test zda v DB je
        Optional<Kategorie> kategorie = kategorieService.findById(id);

        if (!kategorie.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<Kategorie>>(kategorie, HttpStatus.OK);
    }

    /**
     * Funkce na smazani kategorie dle pozadovane id
     * @param id id kategorie
     * */
    @DeleteMapping("/kategorie/{id}")
    public ResponseEntity<?> deleteKategorie(@PathVariable Long id) {

        kategorieService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }
}
