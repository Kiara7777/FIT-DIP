import React from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import Draggable from 'react-draggable';

const PaperComponent = (dialogProps) => {
    return (
        <Draggable>
            <Paper {...dialogProps} />
        </Draggable>
    );
};

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    cursorStyle: {
        cursor: "move"
    }
}));


/**
 * Potvrzovaci dialog, casto se pouziva v jinych komponentech
 * open - zda se ma dialog oteveri, tlacitko na smazani to ovlivnuje
 * title - titulek okna dialogu
 * text - text dialogu
 * handleCancel - funkce na zruseni, implementuje ji rodic
 * handleAccept - funkce na potvrzeni, implementuje rodic
 *
 * Autor: Sara Skutova
 * */
function ConformDialog(props) {

    const classes = useStyles();

    return (
        <Dialog open={props.open}
                onClose={props.handleCancel}
                PaperComponent={PaperComponent}
                className={classes.cursorStyle}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleCancel} color="primary">
                    Zrušit
                </Button>
                <Button onClick={props.handleApproval} color="primary" autoFocus>
                    Potvrdit
                </Button>
            </DialogActions>
        </Dialog>
);
}

export default ConformDialog;