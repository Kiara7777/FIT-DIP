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

const margin={ top: 20, right: 25, bottom: 50, left: 60};
const BarNivo = (chartProps) => {
    return (
        <ResponsiveBar
            theme={chartProps.theme}
            data={chartProps.data}
            indexBy="nazev"
            keys={["projekty"]}
            margin={margin}
            colors={chartProps.colors}
            colorBy="index"
            enableGridX={true}
            axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Rizika',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Projekty',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            tooltip={({indexValue, value}) => (
                <TestTooltip id={indexValue} text="počet projektů" value={value}/>
            )}
        />
    );
};

/**
 * Kompoenta pro zobrazovani grafu, - jak jsou rizika pouzivana v projektech
 *  Autor: Sara Skutova
 * */
function RiskInProjectChart() {

    const classes = useStyles();

    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(true);
    const [colors, setColors] = useState([]);

    const changed = useSelector(state => state.change);
    const theme = useSelector(state => state.appTheme);

    //ziskani potrebnych dat zse serveru - vsechna rizika
    const [loadingRisk, dataRisk] = useGetData(risk.getAllRisk, changed);

    //tranformusji data do podoby {id, nazev, projekty}, puvodne je tam toho vice, ale nezajima me to
    function tranformData(riskData) {

        //reduce, v result se uchovavaji mezi vysledky, druhy parametr je aktualni item v poli, pouzila se
        //destrukturalizace pro rozdeleni na policka, cilem je dostat pryc ty zaznamy rizik, ktere nejsou v zadnem projektu - nebudou se tak zobrazovat v grafu, popis se vynecha, projekt je cislo
        const newData = riskData.reduce(function (result, {id, nazev, popis, mozneReseni, projekty, kategorie}) {
            if (projekty!== 0) {
                result.push({id: id, nazev: nazev, projekty: projekty})
            }
            return result;

        }, []);

        //pro situace, kde nejsou zadna rizika, zobrazi se pak odpovidajici text misto  grafu
        if (newData.length === 0)
            setNoData(true);
        else
            setNoData(false);

        return newData;

    }

    useEffect(() => {
        if(!loadingRisk && dataRisk != null) {
            const newData = tranformData(dataRisk);
            setData(newData);
            const col = randomcolor({
                count: newData.length,
                hue: 'blue'
            });
            setColors(col);

        }
    },[loadingRisk, dataRisk]);

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.titleText}>
                Rizika v projektech
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

export default RiskInProjectChart;