import React, {useEffect, useState} from "react";
import {Card, CardContent, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

/* STYL KOMPONENTY
titleText: https://www.w3schools.com/cssref/css3_pr_text-overflow.asp
* */
const useStyles = makeStyles(theme => ({
    root: {
        height: "100%",
        minHeight: 160
    },

    edit: {
        marginLeft: "auto",
    },

    titleText: {
        paddingBottom: theme.spacing(2),
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"

    },

    card: {
        textAlign: 'center',
    }

}));


/**
 * Spolecna koponenta pro zobrazovani informaci. Redukuje pocet komponent co se muselo vytvorit.
 * Kdyz pozadovana data nejsou pristupna tak se zobrazi text, ze nejsou data.
 * props:
 * title - co dat nahoru
 * data - hodnotu co vykreslit
 *
 * Autor: Sara Skutova
 *
 * */
function ProjectStatsInfo(props) {

    const classes = useStyles();
    const [noData, setNoData] = useState(true);

    const noDataText = "Žádná data";

    useEffect(() => {
        if (props.data === 0 || typeof props.data === 'undefined') {
            setNoData(true);
        }
        else
            setNoData(false);

    }, [props]);

    return(
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h6" className={classes.titleText}>
                    {props.title}
                </Typography>
                {noData ?
                    <Typography variant="h4" className={classes.card}>
                        {noDataText}
                    </Typography>
                    :
                    <Typography variant="h2" className={classes.card}>
                        {props.data}
                    </Typography>
                }
            </CardContent>
        </Card>
    )

}

export default ProjectStatsInfo;