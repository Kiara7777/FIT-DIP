import React from "react";
import TextTitle from "../../TextTitle";
import DeleteIcon from '@material-ui/icons/Delete';
import {Paper, IconButton} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({

    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },

    nadpisAEdit: {
        display: "flex",
    },

    edit: {
        marginLeft: "auto",
    },

}));

/**
 * Komponenta zobrazuje podrobnosti o otazce  - nazev a jake ma odpovedi
 * Zobrazuje se jako karticka pod nazvem a popisem dotazniku, kazda otazka ma svoji karticku
 *
 * Pri editaci/tvorbe umožnuje otazku z dotazniku odstranit
 *
 * props:
 *      handleDelete - smazani otazky z dotazniku
 *      index - index, kterou ma otazka v poli otazek
 *      nazev - nazev otazky
 *      edit - zda se jedna o edit mod
 *      odpovedi - odpovedi co ma otazka
 *
 * Autor: Sara Skutova
 * */
function QuestionInfo(props) {

    const classes = useStyles();

    /**
     * Reakce na stisk talcitka na smazani
     * */
    const deleteQ = () => {
        props.handleDelete(props.index);
    };


    return (
        <Paper className={classes.root}>
            <div className={classes.nadpisAEdit}>
                <TextTitle title={`${props.index + 1}. ${props.nazev}`}/>
                {
                    props.edit ?
                    <IconButton color="primary" onClick={deleteQ} className={classes.edit}>
                        <DeleteIcon/>
                    </IconButton>
                    :
                    null
                }
            </div>
            <Grid container spacing={2}>
                {
                    props.odpovedi.map((odpoved, index) => (
                        <Grid item key={odpoved.id} xs={12}>
                            <Typography variant="body2">
                                {odpoved.textOdpovedi}
                            </Typography>
                        </Grid>
                    ))
                }
            </Grid>
        </Paper>
    );
}

export default QuestionInfo;