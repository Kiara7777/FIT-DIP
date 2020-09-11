import React from "react";
import ErrorPage from "./ErrorPage";

/**
 * Komponenta chyby 401
 *
 * Autor: Sara Skutova
 * */
function Unauthorized() {

    return (
        <ErrorPage status="401"
                   text="Server hlásí, že uživatel není plně přihlášený."
                   buttonAdress="/"
                   buttonName="Přihlášení"
        />
    );
}
export default Unauthorized;