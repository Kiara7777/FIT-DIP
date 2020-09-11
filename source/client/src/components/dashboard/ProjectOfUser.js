import React, {useEffect, useState} from "react";
import {isValid, parseISO, format} from "date-fns";
import csLocale from "date-fns/locale/cs";
import {Avatar, Card, CardActions, CardContent, CardHeader, Tooltip} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {setTitle} from "../../actions";
import {withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {green, red} from "@material-ui/core/colors";
import clsx from "clsx";

/* STYL KOMPONENTY
 Definice berev jsou z Material-UI: https://material-ui.com/customization/color/
* */
const useStyles = makeStyles(theme => ({

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
}));
/**
 * Komponenta pro zobrazeni zakldni karty projektu.
 * Vyuziva ji vsichni uzivatele.
 *
 *  props:
 *      name - nazev projektu
 *      id - id projektu
 *      date - datum projektu co se ma zobrazit
 *      active - zda je projekt aktivni/neactivni
 *      textContent - text co se ma zobrazit pri datumu
 *      history - parametry vlozene react-router-dom, je jich tam jeste vice (umoznuje smerovani, informace o adrese, atd.)
 *
 * Autor: Sara Skutova
 * */
function ProjectOfUser(props) {

    const classes = useStyles();

    const [myDate, setMyDate] = useState("");
    const [tooltip, setTooltip] = useState("");
    const [avatar, setAvatar] = useState("");
    const dispatch = useDispatch();

    const handleGoToProject = () => {
        dispatch(setTitle(`Projekt: ${props.name}`));
        props.history.push(`/app/project/${props.id}`);
    };

    useEffect(() => {


        const date = parseISO(props.date);
        if (isValid(date)) {
            const stringDate = format(date, 'd. MMMM yyyy', {locale: csLocale});
            setMyDate(stringDate);
        } else {
            const stringDate = format(new Date(), 'd. MMMM yyyy', {locale: csLocale});
            setMyDate(stringDate);
        }
        if (props.active) {
            setTooltip("Aktivní projekt");
            setAvatar("A");
        } else {
            setTooltip("Neaktivní projekt");
            setAvatar("N");
        }
    }, [props.active, props.date]);

    //classes.smallAvatar,
    return(
        <Card>
            <CardHeader title={props.name}
                        titleTypographyProps={{variant:'h6' }}
                        avatar={
                            <Tooltip title={tooltip}>
                                <Avatar className={clsx(props.active && classes.green, !props.active && classes.red)}>
                                    {avatar}
                                </Avatar>
                            </Tooltip>
                        }
            />
            <CardContent>
                <Typography variant="body2">{`${props.textContent}: ${myDate}`}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Button size="small" color="primary" onClick={handleGoToProject}>
                    Přejít k projektu
                </Button>
            </CardActions>
        </Card>
    );
}

export default withRouter(ProjectOfUser);