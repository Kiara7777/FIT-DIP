import React, {useEffect} from 'react';
import {Container, CssBaseline, Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import MenuAppBar from "../MenuAppBar";
import RiskCategoryTable from "./RiskCategoryTable";
import CategoryBarChar from "./CategoryBarChart";
import RiskRegisterTable from "./RiskRegisterTable";
import RiskInProjectChart from "./RiskInProjectChart";
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
    },

    paperChart: {
        height: "100%"
    }

}));

/**
 * Hlavni komponenta Centralniho registru rizik. Zobrazuje tabulky kategorie a rizika a grafy ukazujici statisticka data.
 *
 * Autor: Sara Skutova
 * */
function MainRiskRegisterPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTitle("Správa centralního registru rizik"))
    },[dispatch]);

    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar/>
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <RiskCategoryTable />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper className={classes.paperChart} elevation={2}>
                                <CategoryBarChar />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper className={classes.paperChart} elevation={2}>
                                <RiskInProjectChart />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <RiskRegisterTable />
                        </Grid>
                    </Grid>
                </Container>
                <Loading />
            </main>
        </div>
    );
}

export default MainRiskRegisterPage;