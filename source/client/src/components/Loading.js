import React from 'react';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {usePromiseTracker} from "react-promise-tracker";
import makeStyles from "@material-ui/core/styles/makeStyles";

/*
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
*/
/* STYL KOMPONENTY */
const useStyles = makeStyles((theme) => ({
    backdropAll: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    backdropOne: {
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff',
    },
}));

/**
 * Komponenta, ktera se zobrazuje pokud se data aplikace nacitaji
 *
 * Autor: Sara Skutova
 * */
function Loading(props) {

    const classes = useStyles();

    const { promiseInProgress } = usePromiseTracker({area: props.area});

/*    useEffect(() => {
        console.log(promiseInProgress, "loading");

    },[promiseInProgress]);*/


    return(
        promiseInProgress &&
        <Backdrop open={true} className={classes['backdropAll']}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default Loading;