import React, {useEffect} from 'react';
import {CssBaseline} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import MenuAppBar from "../MenuAppBar";
import UserTabs from "./UserTabs";
import {useDispatch} from "react-redux";
import {setTitle} from "../../actions";
import Loading from "../Loading";
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
    }

}));

/**
 * Hlavni stranka spravy uzivatelu, spojuje komponentu menu a stranky se spravou uzivatelu
 *
 * Autor: Sara Skutova
 * */
function UserPage() {
    const classes = useStyles();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTitle("Správa uživatelů"));
    }, [dispatch]);

    return(
        <div className={classes.root}>
            <CssBaseline/>
            <MenuAppBar/>
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <UserTabs />
                <Loading all={false}/>
            </main>
        </div>
    );
}

export default UserPage;