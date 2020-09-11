import React from "react";
import {Container, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {DisabledTextField} from "../../../spolecneFunkce";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    detail: {
        padding: 50
    },

    info: {
        marginTop: 20,
        marginBottom: 20
    }
}));

/**
 * Komponenta zobrazujici detail daneho rizika - to co se zobrazi po rozkliknute sipky pri riziku v tabulce rizik na projektu
 *
 * riskProps:
 *          popis - poppis rizika
 *          popisDopadu - popis dopadu rizka
 *          plan reseni - jaky je plan reseni pro dane riziko
 *
 * Autor: Sara Skutova
 * */
function RiskDetail(riskProps) {
    const classes = useStyles();



    return (
        <Container className={classes.detail}>
            <Grid container direction="column" justify="space-around" alignItems="stretch">
                <Grid item>
                    <DisabledTextField className={classes.info} disabled label={"Popis"} name={'popis'} value={riskProps.popis} fullWidth multiline/>
                </Grid>
                <Grid item>
                    <DisabledTextField className={classes.info} disabled label={"Popis dopadu"} name={'popisDopadu'} value={riskProps.popisDopadu} fullWidth multiline/>
                </Grid>
                <Grid item>
                    <DisabledTextField className={classes.info} disabled label={"Plán řešení"} name={'planReseni'} value={riskProps.planReseni} fullWidth multiline/>
                </Grid>
            </Grid>
        </Container>

    );
}

export default RiskDetail;