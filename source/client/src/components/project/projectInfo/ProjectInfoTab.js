import React from "react";
import {Grid, Container} from "@material-ui/core";
import TextInfoComp from "../../TextInfoComp";
import ProjectDate from "./ProjectDate";
import ProjectDealine from "./ProjectDeadline";
import ProjectManager from "./ProjectManager";
import ProjectMembers from "./ProjectMembers";
import PeopleNumber from "./PeopleNumber";
import RiskNumber from "./RiskNumber";
import ProjectActive from "./ProjectActive";

/**
 * Komponenta, ktera ma za ukol rozmistit jednotlive komponenty po projekt a poslat jim podpovidajici data
 * Kompoennty jsou rozdelene pomoci Grid komponenty Material-UI, ktera to vnitrne definuje pomoci flexboxu.
 * props:
 * projectData - data aktualniho projektu
 * projectRisks - seznam rizik projektu
 * projectUsers - seznam prirazenych uzivatelu
 * users - seznam dostupnych uzivatelu
 *
 * Autor: Sara Skutova
 * */
function ProjectInfoTab(props) {

    return(
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextInfoComp title="Název projektu" type="nazev" errorText="Název projektu musí být zadán"/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <ProjectActive title="Aktivita projektu"/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <RiskNumber />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PeopleNumber />
                </Grid>
                <Grid item xs={12} md={3}>
                    <ProjectDealine konec={props.projectData.konec}/>
                </Grid>
                <Grid item xs={12}>
                    <TextInfoComp title="Popis projektu" type="popis" errorText="Popis projektu musí být zadán"/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <ProjectDate />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ProjectManager title="Manažer projektu" usersProject={props.projectUsers} users={props.users}/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <ProjectMembers title="Řešitelé projektu" usersProject={props.projectUsers} users={props.users}/>
                </Grid>
            </Grid>

        </Container>
    );


}
export default ProjectInfoTab;