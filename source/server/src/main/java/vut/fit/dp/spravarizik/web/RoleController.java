package vut.fit.dp.spravarizik.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.BezpRole;
import vut.fit.dp.spravarizik.domain.Uzivatel;
import vut.fit.dp.spravarizik.security.MyUserDetails;
import vut.fit.dp.spravarizik.service.RoleService;


import vut.fit.dp.spravarizik.service.SecRoleService;
import vut.fit.dp.spravarizik.service.UzivatelService;


import javax.validation.Valid;
import java.util.Optional;

/**
 * Trida pro kontroler Role. Tohle odpovida na volani klienta na API
 *
 * @author Sara Skutova
 * */
@RestController
@RequestMapping("api/nprr")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private SecRoleService secRoleService;

    @Autowired
    private UzivatelService uzivatelService;

    //Post Mapping urcuje medotu, ktera bude na dane strance reagovat na POST request, jakou stranku urcuje to co je v zavorce
    //Valid rika, ze posilame Validni objekt, SB spusti validaci objektu ,pokud nebude validnni, tak to nehodi 500, ale 400, vyhodi se exception
    //RequestBody json struktura se namaputje na dany pozadovany objekt
    /**
     * Funkce pro pridani nebo updatovani role
     * @param role Objekt role
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na objekt Role
     * */
    @PostMapping("/role")
    public ResponseEntity<?> addRole(@Valid @RequestBody Role role, BindingResult result) {

        //BindingResult pomaha ziskat informace z Validace
        //test na chyby
        ResponseEntity<?> errors = SpolecneFunkce.errorCheck(result);
        if (errors != null)
            return errors;

        Role newRole = roleService.saveOrUpdate(role);

        return new ResponseEntity<Role>(newRole, HttpStatus.CREATED);
    }

    /**
     * Vrati vsechny bezpecnostni role
     * */
    @GetMapping("/secRoles")
    public Iterable<BezpRole> getAllSec() {
        return secRoleService.findAll();
    }

    /**
     * Vrati jednu bezpecnostni roli podle jejiho id
     * @param id id dane bezpecnostni role
     * */
    @GetMapping("/secRole/{id}")
    public ResponseEntity<?> getSecRoleById(@PathVariable Long id) {

        Optional<BezpRole> securityRole = secRoleService.findById(id);

        if (!securityRole.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<BezpRole>>(securityRole, HttpStatus.OK);
    }

    /**
     * Vrati vsechny role v databazi
     * */
    @GetMapping("/roles")
    public Iterable<Role> getAll() {
        return roleService.findAll();
    }

    /**
     * Vrati roli aktualne prihlaseneho uzivatele
     * */
    @GetMapping("/role")
    public ResponseEntity<?> getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails details = (MyUserDetails) authentication.getPrincipal();

        Optional<Uzivatel> uzivatel = uzivatelService.findById(details.getId());
        Optional<Role> role = roleService.findById(uzivatel.get().getRole().getId());

        if (!role.isPresent())
            return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

        return new ResponseEntity<Optional<Role>>(role, HttpStatus.OK);
    }

    /**
     * Vrati jednu roli podle jejiho id
     * @param id id dane role
     * */
    @GetMapping("/role/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {

       Optional<Role> role = roleService.findById(id);

       if (!role.isPresent())
           return new ResponseEntity<String>("Záznam neexistuje", HttpStatus.NOT_FOUND);

       return new ResponseEntity<Optional<Role>>(role, HttpStatus.OK);
    }

    /**
     * Funkce na smazani role dle pozadovane id
     * @param id id role
     * */
    @DeleteMapping("/role/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {

        roleService.delete(id);

        return new ResponseEntity<String>("Smazáno", HttpStatus.OK);

    }
}
