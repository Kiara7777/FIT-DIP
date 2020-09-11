import React, {useEffect, useState} from "react";
import {Container, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {DisabledTextField} from "../../spolecneFunkce";


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
 * Komponenta detailu otazky, zobrazi se pri rozkliknuti sipky pri jednotlivych zaznamech tabulky
 * V podrobnostech se vyúisuje jake ma otazka odpovedi
 *
 * props:
 *      odpovedi - odpovedi otazky
 *
 * Autor: Sara Skutova
 * */
function QuestionDetail(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);

    //o sortu https://www.w3schools.com/js/js_array_sort.asp
    //kdyz je vysledek negativni tak je a pred b
    useEffect(() => {
        if(props.odpovedi.length !== 0) {
            const sortArray = [...props.odpovedi];
            sortArray.sort((a, b) => a.poradi - b.poradi);

            setData(sortArray);
        }
    },[props.odpovedi]);

    return (
        <Container className={classes.detail}>
            <Grid container direction="column" justify="space-around" alignItems="stretch">
                {
                    data.map(item => (
                        <Grid item key={item.poradi}>
                            <DisabledTextField key={item.id} className={classes.info} disabled label={`Odpověd ${item.poradi}`} name={'textOdpovedi'} value={item.textOdpovedi} fullWidth multiline/>
                        </Grid>
                    ))}
            </Grid>
        </Container>

    );
}

export default QuestionDetail;