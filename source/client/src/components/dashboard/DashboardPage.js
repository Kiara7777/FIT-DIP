import React, {useEffect} from 'react';
import {Container, CssBaseline, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import MenuAppBar from "../MenuAppBar";
import {useDispatch} from "react-redux";
import {setTitle} from "../../actions";
import Profile from "./Profile";
import UserPart from "./UserPart";
import {visibleOnlyAdmin, visibleOnlyManager, visibleOnlyUser} from "../../security/secureComponents";
import AdminPart from "./AdminPart";
import ManagerPart from "./ManagerPart";
import Loading from "../Loading";


/* STYL KOMPONENTY
* placeholderToolbar je prevzat ze zdarma sablony dashboardu od Material-UI:
* https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Dashboard.js
* https://material-ui.com/getting-started/templates/dashboard/
* */
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
 * Hlavni komponenta pro stranku Dashboard. zobrazuje dalsi komponenty teto sekce
 *
 * Autor: Sara Skutova
 * */
function DashboardPage() {
    const classes = useStyles();
    const dispatch = useDispatch();

    // Urcuji viditelnost komponent pro kazdou roli
    const VisibleAdmin = visibleOnlyAdmin(() => <AdminPart/>);
    const VisibleUser = visibleOnlyUser(() => <UserPart/>);
    const VisibleManager = visibleOnlyManager(() => <ManagerPart/>);

    useEffect(() => {
        dispatch(setTitle("Dashboard"))
    },[dispatch]);

    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar/>
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <Container maxWidth="lg">
                    <Grid container spacing={3} direction="row-reverse">
                        <Grid item xs={12} sm={12} md={4}>
                            <Profile/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <VisibleAdmin/>
                            <VisibleManager/>
                            <VisibleUser/>
                        </Grid>
                    </Grid>
                    <Loading/>
                </Container>
            </main>
        </div>
    );
}

export default DashboardPage;