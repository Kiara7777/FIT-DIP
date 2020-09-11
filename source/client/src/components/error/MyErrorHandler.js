import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from 'react-router-dom';
import {clearError, setUser} from "../../actions";
import PageNotFound from "./PageNotFound";
import Unauthorized from "./Unauthorized";
import {FORBIDDEN, NOT_FOUND, UNAUTHORIZED} from "../constants";
import Forbidden from "./Forbidden";

/**
 * Kompoenenta, ktera "obaluje aplikaci". Zachytava chyby a zobrazuje odpovidajici stranku s chybou.
 *
 * children predstavuje "potomka" neboli aplikaci/cast aplikace, ktera se nacte, pokud se nevyskytne chyba.
 *
 * inspirovano tady: https://www.newline.co/@3nvi/centralizing-api-error-handling-in-react-apps--80296494
 *
 * Autor: Sara Skutova
 *
 * */
function MyErrorHandler({ children }){
    const history = useHistory();
    const error = useSelector(state => state.error);
    const dispatch = useDispatch();


    useEffect(() => {
        const unlisted = history.listen(() => {
            dispatch(clearError());
        });
        return() => {
            unlisted();
        }
    },[history, dispatch]);


    /**
     * Urcuje podle chyby, ktera stranka se ma zobrazit
     * */
    const renderContent = () => {
        if (error === NOT_FOUND) {
            return <PageNotFound />
        } else if (error === UNAUTHORIZED) {
            dispatch(setUser(null));
            return <Unauthorized />;
        } else if (error === FORBIDDEN)
            return <Forbidden />;

        return children;
    };

    return (
        <React.Fragment>
        {
            renderContent()
        }
        </React.Fragment>
    );


}

export default MyErrorHandler;