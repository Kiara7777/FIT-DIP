import React, {useEffect, useState} from "react";
import axios from "axios";
import {Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ProjectOfUser from "./ProjectOfUser";
import Divider from "@material-ui/core/Divider";
import DashboardTextMsg from "./DashboardTextMsg";
import {useGetData} from "../useGetData";
import {project} from "../constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }
}));

/**
 * Komponenta pro zobrazeni Manazerske casti na dashboard sekci
 * Zobrazuje se jenom pro roli MANAGER
 *
 * Autor: Sara Skutova
 * */
function ManagerPart() {


    const classes = useStyles();

    const [projectActiveList, setProjectActiveList] = useState([]);
    const [projectDisaciveList, setProjectDisaciveList] = useState([]);
    const [noDataActive, setNoDataActive] = useState(false);
    const [noDataDisActive, setNoDataDisactive] = useState(false);

    //ziskani potrebnych dat ze serveru - karty aktivnich projektu, karty neaktivnich projektu, co spravuje dany manager
    const [loadingA, dataA] = useGetData(project.activeManagerProj, false);
    const [loadingD, dataD] = useGetData(project.disActiveManagerProj, false);

    useEffect(() => {

        if (!loadingA && !loadingD && dataA != null && dataD != null) {
            if (dataA.length > 0) {
                setProjectActiveList(dataA);
                setNoDataActive(false);
            } else
                setNoDataActive(true);

            if (dataD.length > 0) {
                setProjectDisaciveList(dataD);
                setNoDataDisactive(false);
            } else
                setNoDataDisactive(true);

        }

    }, [loadingA, loadingD, dataA, dataD]);


    return(
        <React.Fragment>
            <Grid container spacing={3}>
                {
                    noDataActive ?
                        <DashboardTextMsg text="Manažer není přihlášen k žádnému aktivnímu projektu"/>
                        :
                    projectActiveList.map(project => (
                        <Grid key={project.name} item>
                            <ProjectOfUser key={project.id} id={project.id} name={project.name} date={project.date} textContent="Datum začátku" active={project.active}/>
                        </Grid>
                    ))
                }
            </Grid>
            <Divider className={classes.divider}/>
            <Grid container spacing={3}>
                {
                    noDataDisActive ?
                        <DashboardTextMsg text="Manažer není přihlášen k žádnému neaktivnímu projektu"/>
                        :
                    projectDisaciveList.map(project => (
                        <Grid key={project.name} item>
                            <ProjectOfUser key={project.id} id={project.id} name={project.name} date={project.date} textContent="Datum ukončení" active={project.active}/>
                        </Grid>
                    ))
                }
            </Grid>
        </React.Fragment>
    );

}

export default ManagerPart;