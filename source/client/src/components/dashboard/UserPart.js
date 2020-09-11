import React, {useEffect, useState} from "react";
import axios from "axios";
import {Grid} from "@material-ui/core";
import ProjectOfUser from "./ProjectOfUser";
import DashboardTextMsg from "./DashboardTextMsg";
import {useGetData} from "../useGetData";
import {project} from "../constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;


/**
 * Komponenta pro zobrazeni uzivatelsko casti na dashboard sekci
 * Zobrazuje se jenom pro roli USER
 *
 * Autor: Sara Skutova
 * */
function UserPart() {

    const [projectList, setProjectList] = useState([]);
    const [noData, setNoData] = useState(false);

    //ziskani potrebnych dat ze serveru - karty aktivnich projektu na kterych pracuje akualni user
    const [loading, data] = useGetData(project.activeUserProj, false);

    useEffect(() => {
        if (!loading && data != null) {
            if (data.length > 0) {
                setProjectList(data);
                setNoData(false);
            }
            else
                setNoData(true);

        }
    }, [loading, data]);

    return(
        <React.Fragment>
            <Grid container spacing={3}>
                {
                    noData ?
                        <DashboardTextMsg text="Uživatel není přihlášen k žádnému aktivnímu projektu"/>
                        :
                    projectList.map(project => (
                        <Grid key={project.name} item>
                            <ProjectOfUser key={project.id} id={project.id} name={project.name} date={project.date} textContent="Datum přiřazení" active={project.active}/>
                        </Grid>
                    ))
                }
            </Grid>
    </React.Fragment>
    );

}

export default UserPart;