import React, {useEffect} from 'react';
import {Container, CssBaseline, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import {useDispatch} from "react-redux";
import {setTitle} from "../../actions";
import MenuAppBar from "../MenuAppBar";
import AnswersTable from "./AnswersTable";
import QuestionAreaTable from "./QuestionAreaTable";
import QuestionTable from "./QuestionTable";
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

//padding: theme.spacing(0, 1),
/*
    main: {
        flexGrow: 1,
        padding: theme.spacing(3),
    }
* */

/**
 * Hlavni komponenta Otazek, odpovedi a oblasti otazek. Zobrazuje tyto komponenty.
 *
 * Autor: Sara Skutova
 * */
function MainQA() {
    const classes = useStyles();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTitle("Otázky a odpovědi"))

    }, [dispatch]);

    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar/>
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <AnswersTable />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <QuestionAreaTable />
                        </Grid>
                        <Grid item xs={12}>
                            <QuestionTable />
                        </Grid>
                    </Grid>
                </Container>
                <Loading />
            </main>
        </div>
    );
}

export default MainQA;