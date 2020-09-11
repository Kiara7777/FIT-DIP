package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import vut.fit.dp.spravarizik.domain.*;
import vut.fit.dp.spravarizik.security.MyUserDetails;
import vut.fit.dp.spravarizik.service.ProjektService;
import vut.fit.dp.spravarizik.uniteClass.ProjectCard;
import vut.fit.dp.spravarizik.uniteClass.ProjectOfUser;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Trida pro kontroler Projektu. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class ProjektController {


    @Autowired
    ProjektService projektService;

    /**
     * Funkce pro pridani nebo updatovani projektu
     * @param projekt Objekt projektu
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Projekt
     * */
    @PostMapping("/project")
    public ResponseEntity<?> addProject(@Valid @RequestBody Projekt projekt, BindingResult result) {

        //kontrola na errory pri pokusu o prekladu JSON objeku na pozadovany objekt @RequestBody
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Projekt newProjekt = projektService.saveOrUpdate(projekt);

        return new ResponseEntity<Projekt>(newProjekt, HttpStatus.CREATED);
    }

    /**
     * Funkce pro prirazeni dotazniku do projektu
     * @param projekt Objekt projektu
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Projekt
     * */
    @PostMapping("/project/survey")
    public ResponseEntity<?> addProjectSurvey(@Valid @RequestBody Projekt projekt, BindingResult result) {

        //kontrola na errory pri pokusu o prekladu JSON objeku na pozadovany objekt @RequestBody
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Projekt newProjekt = projektService.saveSurvey(projekt);

        return new ResponseEntity<Projekt>(newProjekt, HttpStatus.CREATED);
    }

    /**
     * Funkce na pridani informace o tom jak uzivatel na dotaznik prirazeny k projektu odpovidal
     * */
    @PostMapping("/project/{idProj}/survey/{idSurv}/user/{idUser}")
    public ResponseEntity<?> addSurveyInfo(@Valid @RequestBody List<DotazOtazOdpo> dotazOtazOdpos, BindingResult result, @PathVariable Long idProj, @PathVariable Long idSurv, @PathVariable Long idUser) {
        //kontrola na errory pri pokusu o prekladu JSON objeku na pozadovany objekt @RequestBody
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        List<DotazOtazOdpo> newDotazOtazOdpos = projektService.saveOrUpdateSurveyInfo(dotazOtazOdpos, idProj, idSurv, idUser);

        return new ResponseEntity<List<DotazOtazOdpo>>(newDotazOtazOdpos, HttpStatus.CREATED);
    }

    /**
     * Funkce pro pridani nebo updatovani swot v projektu, projekt ma nove swod schovane v sobe
     * @param projekt Objekt projektu
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Projekt
     * */
    @PostMapping("/project/swot")
    public ResponseEntity<?> addProjectSWOT(@Valid @RequestBody Projekt projekt, BindingResult result) {

        //kontrola na errory pri pokusu o prekladu JSON objeku na pozadovany objekt @RequestBody
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Projekt newProjekt = projektService.saveOrUpdateSWOT(projekt);

        return new ResponseEntity<Projekt>(newProjekt, HttpStatus.CREATED);
    }


    /**
     * Funkce pro pridani nebo updatovani managera projektu, uzivatele projektu jsou uchovavani v tabulce UzicProjekt a reprezentovani stejnym objektem
     * @param uzivProjekt Objekt uzivProjekt, reprezentuje managera projektu
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt UzivProjekt
     * */
    @PostMapping("/project/{id}/manager")
    public ResponseEntity<?> addManagerToProjekt(@Valid @RequestBody UzivProjekt uzivProjekt, BindingResult result, @PathVariable Long id) {

        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        UzivProjekt newUzivProjekt = projektService.saveOrUpdate(uzivProjekt, id);

        return new ResponseEntity<UzivProjekt>(newUzivProjekt, HttpStatus.CREATED);
    }

    /**
     * Funkce pro pridani nabo updatovani rizika na projektu, Rizika projetku jsou uchovavane v tabulce UserProjekttRisk, reprezentovane stejnym objektem
     * */
    @PostMapping("/project/{id}/risk")
    public ResponseEntity<?> addRiskToProjekt(@Valid @RequestBody UzivProjektRiziko uzivProjektRiziko, BindingResult result, @PathVariable Long id) {
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        UzivProjektRiziko newUzivProjektRiziko = projektService.saveOrUpdate(uzivProjektRiziko, id);

        return new ResponseEntity<UzivProjektRiziko>(newUzivProjektRiziko, HttpStatus.CREATED);
    }


    /**
     * Funkce pro pridani nebo updatovani resitelu projektu, uzivatele projektu jsou uchovavani v tabulce UzicProjekt a reprezentovani stejnym objektem
     * @param uzivProjekts Seznam uzivProjekt, reprezentuje seznam resitel projektu
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt UzivProjekt
     * */
    @PostMapping("/project/{id}/users")
    public ResponseEntity<?> addUsersToProjekt(@Valid @RequestBody List<UzivProjekt> uzivProjekts, BindingResult result, @PathVariable Long id) {

        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        List<UzivProjekt> newUzivProjekts = projektService.saveOrUpdateUsers(uzivProjekts, id);

        return new ResponseEntity<List<UzivProjekt>>(newUzivProjekts, HttpStatus.CREATED);
    }





    /**
     * Vrati vsechny specialni objekty projektu, ktere reprezentuji projekty, na kterych aktulane pracuje aktualne prihlaseny uzivatel
     * dane projekty musi byt aktivnii
     * */
    @GetMapping("/projects/active/user")
    public Iterable<ProjectOfUser> getProjectsOfUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails details = (MyUserDetails) authentication.getPrincipal();
        return projektService.findAllProjectsOfUser(details.getId());
    }

    /**
     * Vrati vsechny specialni objekty projektu, ktere reprezentuji projekty, na kterych aktulane pracuje akteualne prihlaseny manager
     * dane projekty mohou byt activni nebo neaktivni, misto toho kdy ale manager zacal na projektu pracovat, tak se zobrazi datum zacatku projektu ci konce (dle aktivity)
     * */
    @GetMapping("/projects/active/{isActive}/manager")
    public Iterable<ProjectOfUser> getProjectsOfManager(@PathVariable boolean isActive) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails details = (MyUserDetails) authentication.getPrincipal();
        return projektService.findAllProjectsOfManager(details.getId(), isActive);
    }

    /**
     * Vrati vsechny specialni objekty projektu, at uz aktivni nebo neaktivni
     * */
    @GetMapping("/projects/active/{isActive}")
    public Iterable<ProjectOfUser> getProjectsOfActivity(@PathVariable boolean isActive) {
        return projektService.findAllProjectsOfActivity(isActive);
    }

    /**
     * Vrati vsechny projekty ulozene v databazi
     * */
    @GetMapping("/projects")
    public Iterable<Projekt> getAll() {
        return projektService.findAll();
    }

    /**
     * Vrati vsechny karty projektu, jsou do umele vytvorene objekty obsahujici informace o projektu
     * */
    @GetMapping("/projects/cards")
    public Iterable<ProjectCard> getAllProjectsCard() {
        return projektService.findAllProjectCards();
    }


    /**
     * Vrati vsechny karty projektu, nakterych pracuje dany uzivatel - je na nich aktivni, projektu muze by aktivni i nekativni
     * */
    @GetMapping("/projects/cards/user/{id}")
    public Iterable<ProjectCard> getAllProjectsCardOfUser(@PathVariable Long id) {
        return projektService.findAllProjectCardsOfUser(id);
    }


    /**
     * Vrati jeden projekt podle jeho id
     * @param id id daneho projektu
     * */
    @GetMapping("/project/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {

        Optional<Projekt> projekt = projektService.findById(id);

        if (!projekt.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<Projekt>>(projekt, HttpStatus.OK);
    }

    /**
     * Vrati vsechny uzivatele projektu - resitele i managera (aktivni i neaktivni)
     * @param id id daneho projektu
     * */
    @GetMapping("/project/{id}/users")
    public Iterable<UzivProjekt> getProjectUsers(@PathVariable Long id) {
        return projektService.findAllProjectUsers(id);
    }


    /**
     * Vrati vsechny data dotazniku - jedna se o informace jak kdo odpovidal na dotaznik, ktery byl prirazeny k projektu
     * @param id id daneho projektu
     * */
    @GetMapping("/project/{id}/survey")
    public Iterable<DotazOtazOdpo> getProjectSurveyInfo(@PathVariable Long id) {
        return projektService.findAllSurveyData(id);
    }

    /**
     * Vrati vsechna rizika daneho projektu
     * @param id id daneho projektu
     * */
    @GetMapping("/project/{id}/risks")
    public Iterable<UzivProjektRiziko> getProjectRisks(@PathVariable Long id) {
        return projektService.findAllProjectRisks(id);
    }

    /**
     * Funkce na smazani projektu dle pozadovane id
     * @param id id projektu
     * */
    @DeleteMapping("/project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {

        projektService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }

    /**
     * Funkce na smazani swot tabulky daneho projektu
     * @param id id kategorie
     * */
    @DeleteMapping("/project/{id}/swot")
    public ResponseEntity<?> deleteProjectSwot(@PathVariable Long id) {
            projektService.deleteSwot(id);
        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);
    }


    /**
     * Funkce pro pozadavek na smazani daneho rizika na danem projektu
     * */
    @DeleteMapping("/project/{id}/risk/{idRisk}")
    public ResponseEntity<?> deleteProjektRisk(@PathVariable Long id, @PathVariable Long idRisk) {
        projektService.deleteRisk(id, idRisk);
        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);
    }

    /**
     * Funkce na odstraneni dotazniku a vsech spolecnych informaci
     * @param id id kategorie
     * */
    @DeleteMapping("/project/{id}/survey")
    public ResponseEntity<?> removeProjectSurvey(@PathVariable Long id) {
        projektService.removeSurvey(id);
        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);
    }

}
