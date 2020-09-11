import React, {useEffect, useState} from "react";
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from "@nivo/pie";
import randomcolor from "randomcolor";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {TestTooltip} from "../../../spolecneFunkce";

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

///RECHART////
/*const margin = { top: 20, right: 35, bottom: 50, left: 20};
const BarRechart = (chartProps) => {
    return(
        <ResponsiveContainer>
            <BarChart data={chartProps.data}
                      margin={margin}
                      barCategoryGap="15%"
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="nazev"/>
                <YAxis allowDecimals={false} interval="preserveStartEnd"/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="pocetRizik" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};*/
///////////////////////////////////////////
///NIVO/////
const margin={ top: 20, right: 25, bottom: 50, left: 60};
const BarNivo = (chartProps) => {
    return (
        <ResponsiveBar
            theme={chartProps.theme}
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
                legend: 'Počet rizik',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            tooltip={({indexValue, value}) => (
                <TestTooltip id={indexValue} text="počet rizik" value={value}/>
            )}
        />
    );
};

/**
 * Pie chart z Nivo
 * */
const PieNivo = (chartProps) => (
    <ResponsivePie
        theme={chartProps.theme}
        data={chartProps.data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        colors={chartProps.colors}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={0}
        radialLabelsTextXOffset={3}
        radialLabelsTextColor={chartProps.theme.axis.ticks.text.fill}
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={25}
        radialLabelsLinkHorizontalLength={15}
        radialLabelsLinkStrokeWidth={2}
        radialLabelsLinkColor={{ from: 'color', modifiers: [] }}
        slicesLabelsSkipAngle={0}
        slicesLabelsTextColor={{ theme: 'background' }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: chartProps.theme.axis.ticks.text.fill,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: chartProps.theme.axis.ticks.text.fill
                        }
                    }
                ]
            }
        ]}
        tooltip={({id, value}) => (
            <TestTooltip id={id} text="počet rizik" value={value}/>
        )}
    />
);

/**
 * Kompoenta pro zobrazovani grafu, tykaji se rizik na projektu
 * props:
 *  data - co se maji zobrazit
 *  title - titulek komponenty/grafu
 *  bar - zda se ma zobrazit bar chart nebo pie chart
 *  theme - zda je aktivni tmavy nebo svetly vzhled
 *
 *  Autor: Sara Skutova
 *
 * */
function RiskBarPieChart(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(true);
    const [colors, setColors] = useState([]);


    useEffect(() => {
        if (props.data.length !== 0) {
            setData(props.data);
            setNoData(false);
            const col = randomcolor({
                count: props.data.length,
                hue: 'blue'
            });
            setColors(col);
        }
    },[props]);



    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.titleText}>
                {props.title}
            </Typography>
            <div className={classes.chart}>
                {
                    noData ?
                        <Typography variant="body2">Žádná data</Typography> :
                        props.bar ? <BarNivo data={data} colors={colors} theme={props.theme}/> : <PieNivo data={data} colors={colors} theme={props.theme}/>
                }
            </div>
        </div>
    );

}

export default RiskBarPieChart;