import React from "react";
import ErrorPage from "./ErrorPage";

/**
 * Komponenta chyby 404
 *
 * Autor: Sara Skutova
 * */
function PageNotFound() {

    return (
        <ErrorPage status="404"
                   text="Ups. Stránka nenalezena :("
                   buttonAdress="/app/dashboard"
                   buttonName="Dashboard"
        />
    );
}
export default PageNotFound;