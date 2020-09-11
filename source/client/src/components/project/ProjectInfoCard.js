import React from "react";
import {
    Card,
    CardHeader,
    Avatar,
    Tooltip,
    CardContent,
    Typography,
    CardActions,
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {green, red} from "@material-ui/core/colors";
import {withRouter } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setTitle} from "../../actions";
import {visibleOnlyAdmin} from "../../security/secureComponents";

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
root: {
    maxHeight: "100%",
        minHeight: "100%",
},
*/

/*
        whiteSpace: "nowrap",
        overflow: "hidden",

        {props.cardInfo.popis}
* */

/**
 * Komponenta karty projektu, zobrazuje nazev, managera, zda je aktivni/naktivni, popis
 *
 * props:
 *      cardInfo - inforamce karty projektu
 *      history - objekt react-router-dom
 *      handleDelete - funkce rodice na smaazani daneho projektu
 *
 * Autor: Sara Skutova
 * */
function ProjectInfoCard(props) {

    const classes = useStyles();
    let active = "";
    let tooltip = "";
    const dispatch = useDispatch();


    if(props.cardInfo.aktivni) {
        active = "A";
        tooltip = "Aktivní projekt";
    }
    else {
        active = "N";
        tooltip = "Ukončený projekt";
    }

    /**
     * reakce na stisk tlacitko zobrazeni pordrobnosti projektu - presmeruje na stranku s projektuem
     * */
    const pushToProject = () => {
        dispatch(setTitle(`Projekt: ${props.cardInfo.nazev}`));
        props.history.push(`/app/project/${props.cardInfo.id}`);
    };

    /**
     * Komponenta tlacitka na smazani
     * */
    const DeleteButton = () => (
        <Button size="small" color="primary" onClick={() => props.handleDelete(props.cardInfo.id)}>
            Smazat
        </Button>
    );

    const DeleteButtonAdmin = visibleOnlyAdmin(() => <DeleteButton/>);

    /**
     *                 <Button size="small" color="primary" component={Link} to={`/app/project/${props.cardInfo.id}`} >
     Podrobnosti
     </Button>
     * */


    return(
        <Card className={classes.root}>
            <CardHeader title={props.cardInfo.nazev}
                        avatar={
                            <Tooltip title={tooltip}>
                                <Avatar className={clsx(classes.smallAvatar, classes.red, props.cardInfo.aktivni && classes.green)}>
                                    {active}
                                </Avatar>
                            </Tooltip>
                            }
                        subheader={props.cardInfo.vedouci}
            />
            <CardContent className={classes.contentCard}>
                <Typography variant="body2" color="textSecondary" className={classes.textPosis}>
                    {props.cardInfo.popis}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={pushToProject} >
                    Podrobnosti
                </Button>
                <DeleteButtonAdmin/>
            </CardActions>
        </Card>
    );
}

export default withRouter(ProjectInfoCard);