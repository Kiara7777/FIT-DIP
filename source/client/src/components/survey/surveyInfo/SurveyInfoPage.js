import React, {useEffect, useState} from 'react';
import { CssBaseline} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import MenuAppBar from "../../MenuAppBar";
import SurveyInfo from "./SurveyInfo";
import Loading from "../../Loading";
import {useDispatch} from "react-redux";
import {setTitle} from "../../../actions";
import {useGetData} from "../../useGetData";
import {survey} from "../../constants";
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
 * Hlavni stranka dotazniku, zobrazuje kompoonentu, ktera spravuje dotaznikova data
 * match - z react-redux-dom
 *
 * Autor: Sara Skutova
 * */
function SurveyInfoPage({match}) {
    const classes = useStyles();
    const [surveyData, setSurveyData] = useState(undefined);

    const [loading, data] = useGetData(`${survey.getSurveyID}/${match.params.id}`, false);

    const  dispatch = useDispatch();


    useEffect(() => {
        if (!loading && data != null) {
            setSurveyData(data);
            dispatch(setTitle(`Dotazník: ${data.nazev}`));
        }
    }, [loading, data, dispatch]);

    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar/>
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <SurveyInfo data={surveyData} edit={false} create={false}/>
                <Loading/>
            </main>
        </div>
    );
}

export default SurveyInfoPage;