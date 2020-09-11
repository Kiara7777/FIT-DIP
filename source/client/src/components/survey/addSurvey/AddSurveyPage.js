import React, {useEffect} from 'react';
import {CssBaseline} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import MenuAppBar from "../../MenuAppBar";
import SurveyInfo from "../surveyInfo/SurveyInfo";
import Loading from "../../Loading";
import {useDispatch} from "react-redux";
import {setTitle} from "../../../actions";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;


/* STYL KOMPONENTY
* placeholderToolbar je prevzat ze zdarma sablony dashboardu od Material-UI:
* https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Dashboard.js
* https://material-ui.com/getting-started/templates/dashboard/
 */
const useStyles = makeStyles(theme => ({

    root: {
        display: 'flex',
    },

    placeholderToolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },

    main: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },

    paperChart: {
        height: "100%"
    }

}));

/**
 * Hlavni komponenta stranky pro tvorbu dotazniku. Zobrazuje komponentu, ktera tvori formular na jeho tvorbu. Ta sama komponenta se pouziva i pri editaci.
 *
 * Autor: Sara Skutova
 * */
function AddSurveyPage() {
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setTitle(`Tvorba dotazníku`));
    }, [dispatch]);

    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar/>
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <SurveyInfo data={undefined} edit={true} create={true}/>
                <Loading/>
            </main>
        </div>
    );
}

export default AddSurveyPage;