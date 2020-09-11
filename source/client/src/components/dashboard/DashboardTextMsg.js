import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    nodata: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 100
    },

}));

/**
 * Komponenta pro zobrazeni specialniho textu na dashboard
 *
 * props:
 *      text - text co se ma vypsat
 *
 * Autor: Sara Skutova
 * */
function DashboardTextMsg(props) {

    const classes = useStyles();

    return (
        <div className={classes.nodata}>
                <Typography variant="h6">{props.text}</Typography>
        </div>
    );

}

export default DashboardTextMsg;