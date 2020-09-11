import React from "react";
import {Container, Grid, Paper} from "@material-ui/core";
import ProjectRiskTable from "./ProjectRiskTable";
import RiskMatrix from "./RiskMatrix";
import {makeStyles} from "@material-ui/core/styles";
import RiskNumber from "../projectInfo/RiskNumber";
import RiskCharts from "./RiskCharts";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({

    paperChart: {
        height: "100%"
    }

}));
/**
 * Hlavni komponenta pro zobrazovani karty rizik na projektu. Zobrazuje dalsi komponenty na teto strance.
 *
 * Autor: Sara Skutova
 * */
function ProjectRiskTab(props) {

    const classes = useStyles();

    return(
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <RiskNumber />
                </Grid>
                <Grid item xs={12}>
                    <RiskCharts category={props.category}/>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paperChart} elevation={2}>
                        <RiskMatrix/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <ProjectRiskTable projectRisks={props.projectRisks} category={props.category}/>
                </Grid>
            </Grid>

        </Container>
    );

}

export default ProjectRiskTab;