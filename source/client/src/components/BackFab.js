import React from "react";
import { withRouter } from 'react-router-dom';
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {makeStyles} from "@material-ui/core/styles";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    button: {
        position: "fixed",
        boxShadow: "none",
        bottom: "5%",
        right: "5%"
    },

    icon: {
        marginRight: theme.spacing(1),
    },
}));


/*
button: {
    background: "transparent",
        position: "fixed",
        boxShadow: "none",
        bottom: "5%",
        right: "5%"
}
*/

/**
 * Komponenta plovouciho tlacitka
 *
 * props:
 *      history - objekt react-redux-dom
 *
 * Autor: Sara Skutova
 * */
function BackFab(props) {

    const classes = useStyles();

    const handleFabZpet = () => {
        props.history.push(`/app/project`);
    };

    return (
        <Fab variant="extended" onClick={handleFabZpet} className={classes.button}>
            <ArrowBackIcon className={classes.icon}/>
            Přehled
        </Fab>
    );
}

export default withRouter(BackFab);