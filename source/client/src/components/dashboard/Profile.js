import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Paper, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import {green, red} from "@material-ui/core/colors";
import axios from "axios";
import clsx from "clsx";
import Tooltip from "@material-ui/core/Tooltip";
import {useGetData} from "../useGetData";
import {user} from "../constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY
 Definice berev jsou z Material-UI: https://material-ui.com/customization/color/
 ten titulek, aby se to zkratilo pri nedostatku mistaa - titleText: https://www.w3schools.com/cssref/css3_pr_text-overflow.asp
* */
const useStyles = makeStyles(theme => ({

    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
        minWidth: 300
    },

    titleText: {
        paddingBottom: theme.spacing(2),
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    large: {
        width: theme.spacing(14),
        height: theme.spacing(14),
        marginLeft: 'auto',
    },
    red: {
        color: theme.palette.getContrastText(red[800]),
        backgroundColor: red[800],

    },

    green: {
        color: theme.palette.getContrastText(green[800]),
        backgroundColor: green[800],
    },

    blue: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
}));

/**
 * Komponenta pro zobrazeni inforamci/profilu aktulane prihlaseneho uzivatele
 *
 * Autor: Sara Skutova
 * */
function Profile() {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [secRole, setSecRole] = useState("");
    const [tooltip, setTooltip] = useState("");

    //ziskani vsech potrebnych dat ze serveru - aktualniho uzivatele a jeho roli a bezp. roli
    const [loadingU, dataU] = useGetData(user.getCurrentUser, false);
    const [loadingR, dataR] = useGetData(user.getCurrentUserRole, false);

    const colors = {
        A: classes.red,
        U: classes.green,
        M: classes.blue,
    };

    /**
     * Ze ziskanych dat nastavi potrebne stavy komponenty
     * */
    const setData = (user, role) => {
        setName(user.nazev);
        setEmail(user.email);
        setRole(role.nazev);
        setSecRole(user.bezpRole.charAt(0));
        setTooltip(user.bezpRole);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingU && !loadingR && dataU != null && dataR != null) {
            setData(dataU, dataR);
        }

    }, [loadingU, loadingR, dataU, dataR]);
    ///////////////////////////////////////////////////////////////////////////////////////////


// <Avatar className={clsx(classes.large, {[classes.red]: secRole ===  'ADMIN', [classes.green]: secRole ===  'USER', [classes.blue]: secRole ===  'MANAGER'})}>
    return (
        <Paper className={classes.root}>
            <Typography  variant="h6" className={classes.titleText}>
                {"Profil uživatele"}
            </Typography>
            <Grid container spacing={3} direction="row"  justify="center" alignItems="center">
                <Grid item xs={6} container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="subtitle1">{name}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">{email}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="overline">{role}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Tooltip title={tooltip}>
                        <Avatar className={clsx(classes.large, colors[secRole])}>
                            {secRole}
                        </Avatar>
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>

    );
}

export default Profile;