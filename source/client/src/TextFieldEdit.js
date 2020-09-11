import React from "react";
import {InputBase, Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

/* STYL KOMPONENTY
titleText - z w3sch a material-table
* */
const useStyles = makeStyles(theme => ({

    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },

    input: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.primary.light,
        padding: theme.spacing(1)
    },

    error: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.error.main,
        padding: theme.spacing(1)
    },

    newLines: {
        whiteSpace: "pre-line"

    },

    titleText: {
        paddingBottom: theme.spacing(2),
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },




}));

/**
 * Textova komponenta - nahrada za TextField, pouziva se ruzne po aplikaci
 *
 * props:
 *      title - itulek
 *      edit - jedna se o editaci nebo normalni zobrazeni
 *      error - vznikla chyba (z validace)
 *      errorText - chybove zpravy
 *      value - hodnota na zobrazeni
 *      name - jmeno promenne
 *      onChange - napojena funkce, zajistuje reakci na stisknuti klaves
 *
 * Autor: Sara Skutova
 * */
function TextFieldEdit(props) {

    const classes = useStyles();

    return(
        <Paper className={classes.root}>
            <Typography  variant="h6" className={classes.titleText}>
                {props.title}
            </Typography>
            {
                props.edit ?
                    <FormControl error={props.error} fullWidth>
                        <InputBase className={clsx(classes.input, props.error && classes.error)}
                                   value={props.value}
                                   name={props.name}
                                   multiline
                                   fullWidth
                                   onChange={props.onChange}
                                   aria-describedby="component-error-text"
                        />
                        <FormHelperText id="component-error-text">{props.errorText}</FormHelperText>
                    </FormControl>
                    :
                    <Typography className={classes.newLines}>{props.value}</Typography>
            }
        </Paper>
    );
}

export default TextFieldEdit;