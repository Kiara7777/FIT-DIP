import React from 'react';
import {Paper, Grid, Container} from "@material-ui/core";
import UsersTable from "./UsersTable";
import RoleTable from "./RoleTable";
import UserBarChart from "./UserBarChart";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({

    paperChart: {
        height: "100%",
        maxHeight: "100%",
        minHeight: 419
    }

}));

/**
 * Komponenta zobrazujici ostatni casti spravy uzivatelu
 *
 * Autor: Sara Skutova
 * */
function UserTabs() {

    const classes = useStyles();

    return(
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <RoleTable />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paperChart} elevation={2}>
                        <UserBarChart/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <UsersTable />
                </Grid>
            </Grid>
        </Container>
    );
}


/*<Container maxWidth="lg">
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <RoleTable />
        </Grid>
        <Grid item xs={12} md={6}>
            <Paper className={classes.paperChart} elevation={2}>
                <UserBarChart/>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <UsersTable />
        </Grid>
        <Grid item xs={12}>
            <Test />
        </Grid>
    </Grid>
</Container>*/




export default UserTabs;