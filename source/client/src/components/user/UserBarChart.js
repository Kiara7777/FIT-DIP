import React, {useEffect, useState} from "react";
import randomcolor from "randomcolor";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import {ResponsiveBar} from "@nivo/bar";
import {darkTheme, lightTheme, TestTooltip} from "../../spolecneFunkce";
import {useGetData} from "../useGetData";
import {user} from "../constants";

//titleText je prevzane z titulku u material-table, aby to vypadalo stejne
//tyka se to hlavne paddingu, najdes to pomoci inspektoru elementu
const useStyles = makeStyles(theme => ({
    root: {
        minHeight: 419,
        maxHeight: 551,
        width: "100%",
    },

    chart: {
        minHeight: 371,
        maxHeight: 503,
        height: 378,
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
            data={chartProps.data}
            indexBy="nazev"
            keys={["pocetUzivatelu"]}
            margin={margin}
            colors={chartProps.colors}
            colorBy="index"
            labelTextColor="black"
            enableGridX={true}
            axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Role',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Počet uživatelů',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            tooltip={({indexValue, value}) => (
                <TestTooltip id={indexValue} text="počet uživatelů" value={value}/>
            )}
            theme={chartProps.theme}
        />
    );
};

/**
 * Komponenta co zobrazuje graf - pocet uzivatelu v kazde roli
 *
 * Autor: Sara Skutova
 * */
function UserBarChart() {

    const classes = useStyles();
    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(true);
    const [colors, setColors] = useState([]);

    const changed = useSelector(state => state.change);
    const theme = useSelector(state => state.appTheme);

    //ziskani potrebnych dat ze serveru - role
    const [loadingR, dataR] = useGetData(user.getRoles, changed);

    //tranformusji data do podoby {id, nazev, pocetUzivatelu}, puvodne je vv poctu uzuvatelu pole
    function tranformData(dataRoleArray) {

        //reduce, v result se uchovavaji mezi vysledky, druhy parametr je aktualni item v poli, pouzila se
        //destrukturalizace pro rozdeleni na policka, cilem je dostat pryc ty zaznamy roli, ktere nejamji zadneho uzivatele - nebudou se tak zobrazovat v grafu
        const newData = dataRoleArray.reduce(function (result, {id, nazev, uzivatele}) {
            if (uzivatele.length !== 0) {
                result.push({id: id, nazev: nazev, pocetUzivatelu: uzivatele.length})
            }
            return result;

        }, []);

        //pro situace, kde nejsou zadni uzivatele, zobrazi se pak odpovidajici text misto  grafu
        if (newData.length === 0)
            setNoData(true);
        else
            setNoData(false);

        return newData;

    }
    useEffect(() => {
        if (!loadingR && dataR != null) {
            const newData = tranformData(dataR);
            setData(newData);
            setColors(randomcolor({
                count: newData.length,
                hue: 'blue'
            }));
        }
    },[loadingR, dataR]);

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.titleText}>
                Uživatelské role v systému
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
export default UserBarChart;