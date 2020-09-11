import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";

/* STYL KOMPONENTY
titleText - z w3sch a material-table
* */
const useStyles = makeStyles(theme => ({
    titleText: {
        paddingBottom: theme.spacing(2),
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"

    },

}));

/**
 * Komponenta titlku co se zobrazuje titulek.
 * Vyuziva ji nekolik komponent
 *
 * Autor: Sara Skutova
 * */
function TextTitle(props) {
    const classes = useStyles();
    return (
        <Typography variant="h6" className={classes.titleText}>
            {props.title}
        </Typography>
    );

}

export default TextTitle;