import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import RiskBarPieChart from "./RiskBarPieChart";
import {Paper} from "@material-ui/core";
import {dopadLookup, pravdepLookup, prioritaLookup, stavLookup} from "../../constants";
import {darkTheme, lightTheme} from "../../../spolecneFunkce";

/**
 * Komponentna ktera se stara o vykresleni grafovych komponent u rizik na projektu
 * props:
 *      category - kategorie rizik
 *
 * Autor: Sara Skutova
 * */
function RiskCharts(props) {

    const [category, setCategory] = useState([]);
    const [stav, setStav] = useState([]);
    const [pravdepodobnost, setPravdepodobnost] = useState([]);
    const [dopad, setDopad] = useState([]);
    const [priorita, setPriorita] = useState([]);

    const riskData =  useSelector(state => state.projectRisks);
    const theme = useSelector(state => state.appTheme);



    /**
     * funkce na spocitani kolik ma dana kategorie rizik - data pro bar chart
     * */
    const createCategoryData  = (riskData, categoryServer) => {
        let categoryData = [];

        riskData.forEach(risk => {
            const category = categoryServer.find(item => item.id === risk.kategorie); //najde kategorii kterou riziko ma
            if (categoryData.length === 0) { //bude se jednat o prvni objekt
                categoryData.push({nazev: category.nazev, rizika: 1});
            } else { //nejaka data uz tam jsou
                //najit pokud se v total uz dana kategorie nachazi
                const isIn = categoryData.find(item => item.nazev === category.nazev);
                if (typeof isIn === "undefined") { //kategorie tam jeste neni
                    categoryData.push({nazev: category.nazev, rizika: 1});
                } else {
                    const indexOfCat = categoryData.indexOf(isIn);
                    categoryData[indexOfCat] = {nazev: isIn.nazev, rizika: isIn.rizika + 1};
                }
            }
        });

        return categoryData;
    };

    /**
     * Vytvoreni dat pro pie chart, podle lookup dat - pravdepodobnost, priorita, dopat, stav
     * */
    const createPieChartData = (riskData, lookup, druh) => {
        let data = [];
        riskData.forEach(risk => {
            const name = lookup[risk[druh]];
            if (data.length === 0) {//nic tam neni
                data.push({id: name, label: name, value: 1});
            } else { //uz tam neco je
                const isIn = data.find(item => item.id === name);
                if (typeof isIn === "undefined") { //dany nazev tam jeste nenii
                    data.push({id: name, label: name, value: 1})
                } else {
                    const indexOfCat = data.indexOf(isIn);
                    data[indexOfCat] = {id: isIn.id, label: isIn.label, value: isIn.value + 1};
                }
            }
        });

        return data;
    };

    useEffect(() => {
        if (riskData.length !== 0 && props.category.length !== 0) {
            const categoryData = createCategoryData(riskData, props.category);
            setCategory(categoryData);

            const stavData = createPieChartData(riskData, stavLookup, "stav");
            setStav(stavData);

            const pravdepodobnostData = createPieChartData(riskData, pravdepLookup, "pravdepodobnost");
            setPravdepodobnost(pravdepodobnostData);

            const dopadData = createPieChartData(riskData, dopadLookup, "dopad");
            setDopad(dopadData);

            const prioritaData = createPieChartData(riskData, prioritaLookup, "priorita");
            setPriorita(prioritaData);
        }
    }, [riskData, props]);

    /**
     * Oddeleno aby se mohlo manipulovat theme grafu - tmavy, svetly
     * */
    const Charts = (myTheme) => (
        <React.Fragment>
            <Grid item xs={12}>
                <Paper>
                    <RiskBarPieChart data={category} title={"Kategorie rizik v projektu"} bar={true} theme={myTheme.theme}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper>
                    <RiskBarPieChart data={stav} title={"Stav rizik v projektu"} bar={false} theme={myTheme.theme}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper>
                    <RiskBarPieChart data={pravdepodobnost} title={"Pravděpodobnost vzniku rizik v projektu"} bar={false} theme={myTheme.theme}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper>
                    <RiskBarPieChart data={dopad} title={"Dopady rizik v projektu"} bar={false} theme={myTheme.theme}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper>
                    <RiskBarPieChart data={priorita} title={"Priorita rizik v projektu"} bar={false} theme={myTheme.theme}/>
                </Paper>
            </Grid>
        </React.Fragment>
    );


    return (
        <Grid item container spacing={3}>
            {
                theme === 'light' ? <Charts theme={lightTheme}/> : <Charts theme={darkTheme}/>
            }
        </Grid>
    );
}

export default RiskCharts;