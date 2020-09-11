import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";

//cast stylu prevzato z https://material-ui.com/components/expansion-panels/
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },

    questionDivider: {
        marginTop: 20,
        marginBottom: 20,
    },
}));

/**
 * Dialog pro vyber dotazniku, ktery se ma priradit k projektu
 * props:
 *      confirm - funkce rodice, ktere se posle index dotazniku, ktery se vybral
 *      open - zda je dialog otevreny/zavreny
 *      data - data vsech dotazniku - pole
 *      title - titulek dialogu
 *      cancel - funkce rusici dialog - zavre ho
 *
 * Autor: Sara Skutova
 * */
function SurveyDialog(props) {

    const classes = useStyles();
    const [surveys, setSurveys] = useState([]);


    /**
     * Reakce na stisk pridani dotazniku
     * */
    const handleAdd = (indexSurv) => {
        props.confirm(indexSurv);
    };

    useEffect(() => {
        if (props.open) {
            setSurveys(props.data);
        }
    }, [props]);


    return(
        <Dialog maxWidth="md"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
                open={props.open}
                scroll='paper'
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent dividers >
                {
                    surveys.map((survey, indexSurv)=> (
                        <ExpansionPanel key={survey.id}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography className={classes.heading}>{survey.nazev}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography>{survey.popis}</Typography>
                                        </Grid>
                                        {
                                            survey.otazky.map((otazka, index )=> (
                                                <Grid item xs={12} key={otazka.id}>
                                                    <Typography variant="body2">
                                                        {`${index + 1}) ${otazka.textOtazky}`}
                                                    </Typography>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                            </ExpansionPanelDetails>
                            <Divider className={classes.questionDivider}/>
                            <ExpansionPanelActions>
                                <Button color="primary" onClick={() => handleAdd(indexSurv)}>
                                    Přiřadit
                                </Button>
                            </ExpansionPanelActions>
                        </ExpansionPanel>
                    ))
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={props.cancel}>
                    Zrušit
                </Button>
            </DialogActions>
        </Dialog>

    );
}

export default SurveyDialog;