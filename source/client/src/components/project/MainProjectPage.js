import React, {useEffect} from 'react';
import {CssBaseline} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import MenuAppBar from "../MenuAppBar";
import ProjectCards from "./ProjectCards";
import {useDispatch, useSelector} from "react-redux";
import {setTitle} from "../../actions";
import {visibleOnlyAdminAndManager, visibleOnlyUser} from "../../security/secureComponents";
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
 * Hlavni komponenta zobrazovani projektu - tato presne slouzi zobrazi karty projektu
 *
 * Autor: Sara Skutova
 * */
function MainProjectPage() {
    const classes = useStyles();

    const user = useSelector(state => state.user);

    //rozdeleni videtelnosti karet
    const UserCards = visibleOnlyUser(() => <ProjectCards queary={`/api/nprr/projects/cards/user/${user.id}`}/>);
    const AdminManagerCards = visibleOnlyAdminAndManager(() => <ProjectCards queary={`/api/nprr/projects/cards`}/>);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTitle("Správa projektů"));
    }, [dispatch]);

    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar/>
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <UserCards />
                <AdminManagerCards />
                <Loading all={false}/>
            </main>
        </div>
    );
}

export default MainProjectPage;