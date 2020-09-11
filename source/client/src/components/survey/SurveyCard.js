import React from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    CardActions,
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {green, red} from "@material-ui/core/colors";
import {withRouter } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setTitle} from "../../actions";

/* STYL KOMPONENTY
Barvy jsou z MAterial-UI
ten webkit, po mnoha hledani jak by slo definovat maximalni pocet radku co se ma zobrazovat + aby se to pak zkratilo na ... tak jsem nasla ten webkit
 */
const useStyles = makeStyles(theme => ({

    root: {
        maxHeight: "100%",
    },

    red: {
        color: theme.palette.getContrastText(red[800]),
        backgroundColor: red[800],

    },

    green: {
        color: theme.palette.getContrastText(green[800]),
        backgroundColor: green[800],
    },

    smallAvatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },

    contentCard: {
        maxHeight: "100%",
        minHeight: "100%",
    },

    textPosis: {
        overflow: "hidden",
        display: "-webkit-box",
        '-webkitBoxOrient': "vertical",
        '-webkitLineClamp': 11,

    }

}));

/*
        whiteSpace: "nowrap",
        overflow: "hidden",

        {props.cardInfo.popis}
* */

/**
 * Komponenta karty dotazniku, zobrazuje nazev, pocet otazek, a zda byl prirazen k nejakem projektu.
 *
 * props:
 *      cardInfo - inforamce karty dotazniku
 *      history - objekt react-router-dom
 *      handleDelete - funkce rodice na smaazani daneho dotazniku
 *
 * Autor: Sara Skutova
 * */
function SurveyCard(props) {

    const classes = useStyles();

    const dispatch = useDispatch();


    /**
     * reakce na stisk tlacitko zobrazeni pordrobnosti dotazniku - presmeruje na stranku s dotazanikem
     * */
    const pushToSurvey = () => {
        dispatch(setTitle(`Dotazník: ${props.cardInfo.nazev}`));
        props.history.push(`/app/survey/${props.cardInfo.id}`);
    };

    /**
     * Komponenta tlacitka na smazani
     * */
    const DeleteButton = () => (
        <Button size="small" color="primary" onClick={() => props.handleDelete(props.cardInfo.id)}>
            Smazat
        </Button>
    );

    /**
     *                 <Button size="small" color="primary" component={Link} to={`/app/project/${props.cardInfo.id}`} >
     Podrobnosti
     </Button>
     * */



    return(
        <Card className={classes.root}>
            <CardHeader title={props.cardInfo.nazev}
                        titleTypographyProps={{variant:'h6' }}
            />
            <CardContent className={classes.contentCard}>
                <Typography variant="body2" >
                    {`Počer otázek: ${props.cardInfo.pocetOtazek}`}
                </Typography>
                <Typography variant="body2" >
                    {props.cardInfo.pouzit ? `Použito v projektu: Ano` : `Použito v projektu: Ne`}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={pushToSurvey} >
                    Podrobnosti
                </Button>
                <DeleteButton />
            </CardActions>
        </Card>
    );
}

export default withRouter(SurveyCard);