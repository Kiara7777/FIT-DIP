package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.Dotaznik;
import vut.fit.dp.spravarizik.domain.Otazka;
import vut.fit.dp.spravarizik.service.DotaznikService;
import vut.fit.dp.spravarizik.service.OtazkaService;
import vut.fit.dp.spravarizik.uniteClass.DotaznikCard;
import vut.fit.dp.spravarizik.uniteClass.ProjectCard;

import javax.validation.Valid;
import java.util.Optional;

/**
 * Trida pro kontroler Dotazniku. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class DotaznikController {



    @Autowired
    private DotaznikService dotaznikService;

    /**
     * Funkce pro pridani nebo updatovani dotazniku
     * @param dotaznik Objekt dotazniku
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Otazka
     * */
    @PostMapping("/survey")
    public ResponseEntity<?> addDotaznik(@Valid @RequestBody Dotaznik dotaznik, BindingResult result) {

        //kontrola na errory pri pokusu o prekladu JSON objeku na pozadovany objekt @RequestBody
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Dotaznik newDotaznik = dotaznikService.saveOrUpdate(dotaznik);

        return new ResponseEntity<Dotaznik>(newDotaznik, HttpStatus.CREATED);
    }


    /**
     * Vrati vsechny dotazniky ulozene v databazi
     * */
    @GetMapping("/surveys")
    public Iterable<Dotaznik> getAll() {
        return dotaznikService.findAll();
    }

    /**
     * Vrati vsechny karty dotazniku, jsou do umele vytvorene objekty obsahujici informace o dotazniku
     * */
    @GetMapping("/surveys/cards")
    public Iterable<DotaznikCard> getAllDotaznikCard() {
        return dotaznikService.findAllCard();
    }

    /**
     * Vrati jeden dotaznik podle jeho id
     * @param id id daneho dotazniku
     * */
    @GetMapping("/survey/{id}")
    public ResponseEntity<?> getDotaznikById(@PathVariable Long id) {

        Optional<Dotaznik> dotaznik = dotaznikService.findById(id);

        if (!dotaznik.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<Dotaznik>>(dotaznik, HttpStatus.OK);
    }

    /**
     * Funkce na smazani dotaznik dle pozadovane id
     * @param id id dotazniku
     * */
    @DeleteMapping("/survey/{id}")
    public ResponseEntity<?> deleteDotaznik(@PathVariable Long id) {

        dotaznikService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }

}
