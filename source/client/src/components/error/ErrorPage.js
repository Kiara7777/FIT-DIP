import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Container, CssBaseline, Grid, Paper, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link, withRouter} from "react-router-dom";


/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({

    page: {
        height: "100vh",
        paddingTop: theme.spacing(25),
        backgroundColor: theme.palette.primary.main,
    },

    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    paperError: {
        color: theme.palette.primary.main
    },

    buttons: {
        color: theme.palette.primary.main
    },

    body: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    }
}));

/**
 * Komponenta pro zobrazeni chybove strnaky. Je zakladem pro zobrazeni chyb 404, 401, 403
 * props:
 *      status - kod chyby
 *      text - text chyby
 *      buttonAdress - adresa na kterou se ma po stisknuti tacitka presmerovat
 *      buttonName - text na danem tlacitku
 *
 * Autor: Sara Skutova
 * */
function ErrorPage(props) {
    const classes = useStyles();


    return (
        <React.Fragment>
            <CssBaseline />
            <div className={classes.body}>
                <Container maxWidth="sm" className={classes.page}>
                    <Paper className={classes.paperError}>
                        <Grid container direction="column" justify="center" alignItems="center" spacing={5}>
                            <Grid item>
                                <Typography variant="h1">
                                    {props.status}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">
                                    {props.text}
                                </Typography>
                            </Grid>
                            <Grid item container direction="row" justify="space-around" alignItems="center">
                                <Grid item>
                                    <Button className={classes.buttons} component={Link} to={props.buttonAdress}>
                                        {props.buttonName}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </div>
        </React.Fragment>
    );

}

export default withRouter(ErrorPage);