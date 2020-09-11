package vut.fit.dp.spravarizik.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

/**
 * Ttrida pro spolecne funkce vyuzivane kontrolery
 *
 * @author Sara Skutova
 * */
public class SpolecneFunkce {

    /**
     * Spolecna funkce, ktera vrati vysledek testovani, pouziva se ve vsech kontrolerech
     * @param result objekt s vysledky pokusu navazani prijateho JSON objektu na pozadavany objekt
     * */
    public static ResponseEntity<?> errorCheck(BindingResult result) {

        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();

            for(FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }

            return new ResponseEntity<Map<String, String>>(errors, HttpStatus.BAD_REQUEST);
        }
        return null;
    }
}
