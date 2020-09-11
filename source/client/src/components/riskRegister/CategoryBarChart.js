import React, {useEffect, useState} from "react";
import { ResponsiveBar } from '@nivo/bar'
import randomcolor from "randomcolor";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import {darkTheme, lightTheme, TestTooltip} from "../../spolecneFunkce";
import {useGetData} from "../useGetData";
import {risk} from "../constants";

/* STYL KOMPONENTY
 ten titulek, aby se to zkratilo pri nedostatku mistaa - titleText: https://www.w3schools.com/cssref/css3_pr_text-overflow.asp
* */
const useStyles = makeStyles(theme => ({
    root: {
        height: 400,
        width: "100%",
    },

    chart: {
        height: 352,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    titleText: {
        paddingTop: 16,
        paddingLeft: 24,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"

    }
}));

///NIVO/////
const margin={ top: 20, right: 25, bottom: 50, left: 60};
const BarNivo = (chartProps) => {
    return (
        <ResponsiveBar
            data={chartProps.data}
            indexBy="nazev"
            keys={["rizika"]}
            margin={margin}
            colors={chartProps.colors}
            colorBy="index"
            enableGridX={true}
            axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Kategorie',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Rizika',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            theme={chartProps.theme}
            tooltip={({indexValue, value}) => (
                <TestTooltip id={indexValue} text="počet rizik" value={value}/>
            )}
        />
    );
};

/**
 * Kompoenta pro zobrazovani grafu, tykajiciho se kategorii rizik - pocet rizik va dane kategorii
 *  Autor: Sara Skutova
 * */
function CategoryBarChar() {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(true);
    const [colors, setColors] = useState([]);

    const changed = useSelector(state => state.change);
    const theme = useSelector(state => state.appTheme);

    //ziskani potrebnych dat zse serveru - vsechny kategorie rizik
    const [loadingC, dataC] = useGetData(risk.getRiskCategories, changed);


    //tranformusji data do podoby {id, nazev, pocetRizik}, puvodne je tam pole s id rizik
    function tranformData(kategorieData) {

        //reduce, v result se uchovavaji mezi vysledky, druhy parametr je aktualni item v poli, pouzila se
        //destrukturalizace pro rozdeleni na policka, cilem je dostat pryc ty zaznamy kategorii, ktere nejamji zadne riziko - nebudou se tak zobrazovat v grafu, popis se vynecha
        const newData = kategorieData.reduce(function (result, {id, nazev, popis, rizika}) {
            if (rizika.length !== 0) {
                result.push({id: id, nazev: nazev, rizika: rizika.length})
            }
            return result;

        }, []);

        //pro situace, kde nejsou zadni rizika, zobrazi se pak odpovidajici text misto  grafu
        if (newData.length === 0)
            setNoData(true);
        else
            setNoData(false);

        return newData;
    }


    useEffect(() => {
        if(!loadingC && dataC != null) {
            const newData = tranformData(dataC);
            setData(newData);
            const col = randomcolor({
                count: newData.length,
                hue: 'blue'
            });
            setColors(col);
        }
    },[loadingC, dataC]);

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.titleText}>
                Kategorie rizik
            </Typography>
            <div className={classes.chart}>
            {
                noData ? <Typography variant="body2">Žádná data</Typography> :
                    theme === 'light' ?
                        <BarNivo data={data} colors={colors} theme={lightTheme}/>
                        :
                        <BarNivo data={data} colors={colors} theme={darkTheme}/>
            }
            </div>
        </div>
    );

}

export default CategoryBarChar;