import React, {useEffect, useState} from "react";
import {Box, Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TextTitle from "../../TextTitle";
import Grid from "@material-ui/core/Grid";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({

    nodata: {
        textAlign: "center"
    },

    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },

    nadpisAEdit: {
        display: "flex",
    },
}));

/**
 * Kompoenenta zobrazujici statistiku jak uzivatele odpovidali na dotaznik
 *
 * props:
 *      stats - data statistikz
 *      projectData- projektova data
 *      bold - informace zda dana odpoved ma byt vzyraznena ci ne - je to pole
 *
 * Autor: Sara Skutova
 * */
function SurveyStats(props) {

    const classes = useStyles();

    const [noData, setNoData] = useState(true);

    const noDataText = "Výsledky dotazníku nejsou k dispozici";

    useEffect(() => {
        if (typeof props.stats !== 'undefined') {
            setNoData(false);
        }

    },[props]);

    /**
     * Vytahnuta komponenta otazek, at to neni vsechno narvane
     * */
    const Question = (props) => (
        <Paper className={classes.root}>
            <TextTitle title={`${props.index + 1}. ${props.nazev}`}/>
            <Grid container spacing={2}>
                {
                    props.odpovedi.map((odpoved, index) => (
                        <Grid item key={odpoved.id} xs={12}>
                            <Typography component="div">
                                {
                                    props.bold === odpoved.id ?
                                        <Box fontWeight="fontWeightBold" fontSize="body2.fontSize">
                                            {`${odpoved.textOdpovedi} - ${props.stats[odpoved.id]}%`}
                                        </Box>
                                        :
                                        <Box fontSize="body2.fontSize">
                                            {`${odpoved.textOdpovedi} - ${props.stats[odpoved.id]}%`}
                                        </Box>
                                }
                            </Typography>
                        </Grid>
                    ))
                }
            </Grid>
        </Paper>
    );

    return (
        <React.Fragment>
        {
            noData ?
                <div className={classes.nodata}>
                    <Typography variant="h6">{noDataText}</Typography>
                </div>
                :
                <Grid container spacing={3}>
                    {
                        props.projectData.dotaznikProjektu.otazky.map((otazka, index )=> (
                            <Grid item xs={12} key={otazka.id}>
                                <Question nazev={otazka.textOtazky} odpovedi={otazka.odpovedi} index={index} stats={props.stats[otazka.id]} bold={parseInt(props.bold[otazka.id])}/>
                            </Grid>
                        ))

                    }
                </Grid>
        }
        </React.Fragment>
    )
}

export default SurveyStats;