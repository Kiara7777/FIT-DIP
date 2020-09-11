import React, {useEffect, useState} from "react";
import {ResponsiveHeatMap} from "@nivo/heatmap";
import {pravdepLookup, dopadLookup} from "../../constants";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {Typography} from "@material-ui/core";
import {green, yellow, amber, orange} from "@material-ui/core/colors";
import {darkTheme, lightTheme} from "../../../spolecneFunkce";

// barvy z Material-UI
const GREEN = green[500];
const YELLOW = yellow[500];
const AMBER = amber[500];
const ORANGE = orange[700];

/* STYL KOMPONENTY
* titleText inspirovan v w3school*/
const useStyles = makeStyles(theme => ({
    root: {
        height: 450,
        width: "100%",
    },

    chart: {
        height: 402,
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

    },

}));

const style = { cursor: 'pointer' };

/**
 * Podle indexu vypocita jako bude mit policko barvu
 * */
const calculateColor = (indexPravd, indexDopad) => {

    const index = indexPravd * indexDopad;

    if (index < 5)
        return GREEN;
    else if (index >= 5 && index < 10)
        return YELLOW;
    else if (index >= 10 && index < 15)
        return AMBER;
    else
        return ORANGE;
};

/**
 * Ziskat z objektu klic, ktery ma danou hodnotu
 * https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
 * */
const getIndex = (stringValue, data) => {
    return Object.keys(data).find(item => data[item] === stringValue);
};

/**
 * Cast funkce pro vypocteni barvy, nejprve vypocte index a z naslednych hodnot barvu
 * */
const getColor = (xAxis,  yAxis) => {
    const pravd = getIndex(yAxis, pravdepLookup);
    const dopad = getIndex(xAxis, dopadLookup);

    return calculateColor(pravd, dopad);
};

/**
 * Definice tvaru bunky pro heatMap, skoro cele je to prevzato primo ze souboru Niva, jedine co je jine, tak je zmena pro
 * vyplneni policka barvou, jinak me nenapadlo jak tam tu barvu dostat, jinaci zpusoby nefungovaly jak jsem chtela
 * zdroj: https://github.com/plouc/nivo/blob/master/packages/heatmap/src/HeatMapCellRect.js
 * */
const MyShape = ({
                     data,
                     value,
                     x,
                     y,
                     width,
                     height,
                     color,
                     opacity,
                     borderWidth,
                     borderColor,
                     enableLabel,
                     textColor,
                     onHover,
                     onLeave,
                     onClick,
                     theme,
                 }) => {

    const myColor = getColor(data.xKey, data.yKey);

    return (
            <g
                transform={`translate(${x}, ${y})`}
                onMouseEnter={onHover}
                onMouseMove={onHover}
                onMouseLeave={onLeave}
                onClick={e => {
                    onClick(data, e)
                }}
                style={style}
            >
                <rect
                    x={width * -0.5}
                    y={height * -0.5}
                    width={width}
                    height={height}
                    fill={myColor}
                    fillOpacity={opacity}
                    strokeWidth={borderWidth}
                    stroke={borderColor}
                    strokeOpacity={opacity}
                />
                {enableLabel && (
                    <text
                        dominantBaseline="central"
                        textAnchor="middle"
                        style={{
                            ...theme.labels.text,
                            fill: textColor,
                        }}
                        fillOpacity={opacity}
                    >
                        {value}
                    </text>
                )}
            </g>
    );

};

/**
 * Definice tooltipu co se zobrazi pri najeti mysi na policko matice. takova mini komponenta
 * */
const MyTooltip = (props) => {
    const pravd = parseInt(getIndex(props.yKey, pravdepLookup));
    const dopad = parseInt(getIndex(props.xKey, dopadLookup));


    const names = props.riskData.reduce((total, risk) => {
        if (risk.pravdepodobnost === pravd && risk.dopad === dopad)
            return [...total, risk.nazev];
        else
            return total;
    }, []);

    let finalNames = [];
    if (names.length === 0) //zadne riziko tam neni
        finalNames = ["Žádná rizika"];
    else
        finalNames = [...names];


    return (
        <div>
            {
                finalNames.map(risk => (
                    <div key={risk}>{risk}</div>
                ))
            }
        </div>

    );

};

const margin = { top: 20, right: 25, bottom: 60, left: 100};

/**
 * Komponenta samotne HeatMap z Nivo
 * */
const MatrixHeatMap = (data) => (
    <ResponsiveHeatMap
        theme={data.theme}
        cellShape={MyShape}
        data={data.chartData}
        indexBy="pravdepodobnost"
        keys={[
            'Velmi malý',
            'Malý',
            'Střední',
            'Vysoký',
            'Velmi vysoký'
        ]}
        tooltip={({xKey, yKey}) => (<MyTooltip xKey={xKey} yKey={yKey} riskData={data.riskData}/>)}
        margin={margin}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 6,
            tickPadding: 6,
            tickRotation: 0,
            legend: 'Dopad',
            legendPosition: 'middle',
            legendOffset: 36
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 6,
            tickPadding: 6,
            tickRotation: -34,
            legend: 'Pravděpodobnost',
            legendPosition: 'middle',
            legendOffset: -60
        }}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.25}
        animate={true}
        motionStiffness={80}
        motionDamping={9}
    />
);

/**
 * Komponenta pro zobrazovani matice pravdepodobnosti a dopadu
 *
 * Autor: Sara Skutova
 * */
function RiskMatrix() {

    const classes = useStyles();

    const [noData, setNoData] = useState(true);
    const [chartData, setChartData] = useState([]);
    const riskData =  useSelector(state => state.projectRisks);

    const theme = useSelector(state => state.appTheme);


    /**
     * Ze ziskanych rizik vybere ta co maji danou hodnotu pravdepodobnosti a dopadu. Hodnota se bere z indexu, proto se musi
     * zvetsit o 1 (v DB zacinaji hodnoty od 1)
     * */
    const calculateRisk = (indexPravd, indexDopad, data) => {
        const pravd = indexPravd + 1;
        const dopad = indexDopad + 1;

        const pocet = data.reduce((total, risk) => {
            if (risk.pravdepodobnost === pravd && risk.dopad === dopad)
                return total + 1;
            else
                return total;
        }, 0);

        return pocet;
    };

    useEffect(() => {

        /**
         * Ze ziskanych dat ziska potrebne informace pro matici. Vytvori pole objektu typu
         * {pravd: ....,
         * velmi nizke: pocet rizik
         * ...
         * velmi y soke: pocet rizik
         * }
         *
         * Je to uvnitr useEffect protoze si React stezoval warningem z duvodu zavislosti
         * */
        const transformData = (data) => {
            const pravdepodobnosti = Object.values(pravdepLookup);
            const dopady = Object.values(dopadLookup);

            const chData = pravdepodobnosti.map((pravd,indexPravd) => {
                const testP = {
                    pravdepodobnost: pravd
                };

                dopady.forEach((item, indexDopad) => {
                    testP[item] = calculateRisk(indexPravd, indexDopad, data);
                });

                return testP;
            });

            return chData;
        };

        if (riskData.length === 0) { //zadna rizika ke projektu nejsou prirazena
            setNoData(true);
        }
        else {
            const data = transformData(riskData);
            const reverse = data.reverse();
            setChartData(reverse);
            setNoData(false);
        }
    }, [riskData]);

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.titleText}>
                Matice pravděpodobností a dopadů
            </Typography>
            <div className={classes.chart}>
                {
                    noData ? <Typography variant="body2">Žádná data</Typography> :
                        theme === 'light' ?
                            <MatrixHeatMap chartData={chartData} riskData={riskData} theme={lightTheme}/>
                            :
                            <MatrixHeatMap chartData={chartData} riskData={riskData} theme={darkTheme}/>
                }
            </div>
        </div>
    );
}

export default RiskMatrix;