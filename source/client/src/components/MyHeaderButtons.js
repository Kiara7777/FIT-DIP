import React from "react";
import {IconButton, Tooltip} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import {makeStyles} from "@material-ui/core/styles";
import TextTitle from "./TextTitle";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    nadpisAEdit: {
        display: "flex",
    },

    edit: {
        marginLeft: "auto",
    },

}));

/**
 * Komponenta pro zobrazeni titulku a tlacitek pro editaci, potvrzeni editace a zruseni editace
 * Casto ji pouzivaji jine komponenty
 *
 * props:
 *      edit - zda je editace zapnuta
 *      onSave - vlozena funkce na potvrzeni editace
 *      onNo - vlozena funkce na zruseni editace
 *      onEdit - zapnuti editace
 *
 * Autor: Sara Skutova
 * */
function MyHeaderButtons(props) {

    const classes = useStyles();

    /**
     * Definice tlacitek
     * */
    const Buttons = () => {
        return(
            props.edit ?
                <div className={`${classes.nadpisAEdit} ${classes.edit}`}>
                    <Tooltip title="Potvrdit">
                        <IconButton aria-label="potvrdit" color="primary" onClick={props.onSave}>
                            <CheckIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Zrušit">
                        <IconButton aria-label="zrusit" color="primary" onClick={props.onNo}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                :
                <Tooltip title="Editovat">
                    <IconButton aria-label="edit" color="primary" className={classes.edit} onClick={props.onEdit}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
        );
    };


    return(
        <div className={classes.nadpisAEdit}>
            <TextTitle title={props.title}/>
            <Buttons/>
        </div>
    );

}

export default MyHeaderButtons;