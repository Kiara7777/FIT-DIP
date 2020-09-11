import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";

/* STYL KOMPONENTY */
const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },

    buttonProgress: {
        color: 'primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

/**
 * Funkce progress buttonu, pouziva se hlavne u dialogu, kdyz se neco posila na server,
 * z vetsi casti prevzato z https://material-ui.com/components/progress/
 *
 * props:
 *      disabled - zda je tlacitko disabled
 *      text - text tlacitka
 *
 * Autor: Sara Skutova
 * */
function ProgressButton(props) {

    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={props.disabled}
            >
                {props.text}
            </Button>
            {props.disabled && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
    );
}

export default ProgressButton;