import React, {useEffect, useState} from "react";
import axios from "axios";
import {Grid} from "@material-ui/core";
import ProjectOfUser from "./ProjectOfUser";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import ProjectStatsInfo from "../project/projectInfo/ProjectStatsInfo";
import DashboardTextMsg from "./DashboardTextMsg";
import {project, risk, user} from "../constants";
import {useGetData} from "../useGetData";

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
 * Komponenta pro zobrazeni Administratorske casti na dashboard sekci
 * Zobrazuje se jenom pro Administratora
 *
 * Autor: Sara Skutova
 * */
function AdminPart() {

    const classes = useStyles();

    const [projectActiveList, setProjectActiveList] = useState([]);
    const [projectDisaciveList, setProjectDisaciveList] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [riskCount, setRiskCount] = useState(0);
    const [noDataActive, setNoDataActive] = useState(false);
    const [noDataDisActive, setNoDataDisactive] = useState(false);

    //ziskani potrebnych dat ze serveru - karty aktivnich projektu, karty neaktivnich projektu, pocet uzivatelu v DB, pocet rizik v DB
    const [loadingActive, dataActive] = useGetData(project.activeProj, false);
    const [loadingDisactive, dataDisactive] = useGetData(project.disActiveProj, false);
    const [loadingU, dataU] = useGetData(user.usersCount, false);
    const [loadingRisk, dataRisk] = useGetData(risk.riskCount, false);

    useEffect(() => {
        if (!loadingActive && !loadingDisactive && !loadingU && !loadingRisk &&
        dataActive != null && dataDisactive != null && dataU != null && dataRisk != null) {
            if (dataActive.length > 0) {
                setProjectActiveList(dataActive);
                setNoDataActive(false);
            } else
                setNoDataActive(true);

            if (dataDisactive.length > 0) {
                setProjectDisaciveList(dataDisactive);
                setNoDataDisactive(false);
            } else
                setNoDataDisactive(true);

            setUserCount(dataU);
            setRiskCount(dataRisk);

        }
    }, [loadingActive, loadingDisactive, loadingU, loadingRisk,
        dataActive, dataDisactive, dataU, dataRisk]);


    return(
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <ProjectStatsInfo title="Počet uživatelů v DB" data={userCount}/>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ProjectStatsInfo title="Počet rizik v DB" data={riskCount}/>
                </Grid>
            </Grid>
            <Divider className={classes.divider}/>
            <Grid container spacing={3}>
                {
                    noDataActive ?
                        <DashboardTextMsg text="Žádné aktivní projekty v systému"/>
                        :
                    projectActiveList.map(project => (
                        <Grid key={project.name} item xs={12} sm={6} md={4}>
                            <ProjectOfUser key={project.id} id={project.id} name={project.name} date={project.date} textContent="Datum začátku" active={project.active}/>
                        </Grid>
                    ))
                }
            </Grid>
            <Divider className={classes.divider}/>
            <Grid container spacing={3}>
                {
                    noDataDisActive ?
                        <DashboardTextMsg text="Žádné neaktivní projekty v systému"/>
                        :
                    projectDisaciveList.map(project => (
                        <Grid key={project.name} item xs={12} sm={6} md={4}>
                            <ProjectOfUser key={project.id} id={project.id} name={project.name} date={project.date} textContent="Datum ukončení" active={project.active}/>
                        </Grid>
                    ))
                }
            </Grid>
        </React.Fragment>
    );

}

export default AdminPart;