import React, {useEffect} from "react";
import ErrorPage from "./ErrorPage";

/**
 * Komponenta chyby 403
 *
 * Autor: Sara Skutova
 * */
function Forbidden(props) {

    //chci zobrazovat v adresovem radku aktualni stranku pri teto chybe
    //musi se ale upravit co prijde, protoze to redux-auth-wrapper trosku posucha
    useEffect(() => {
        if (props.location != null) {
            const add = props.location.search.replace("?redirect=", "");
            const next = add.replace(/%2F/g, "/");
            window.history.pushState('teset', 'test', next);
        }
    }, [props.location]);

    return (
        <ErrorPage status="403"
                   text="Nemáš právo zobrazit tuto stránku!"
                   buttonAdress="/app/dashboard"
                   buttonName="Dashboard"
        />
    );
}
export default Forbidden;