import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import LoadingLogin from "./components/LoadingLogin";
import UserPage from "./components/user/UserPage";
import MainProjectPage from "./components/project/MainProjectPage";
import ProjectPageID from "./components/project/ProjectPageID";
import AddProjectForm from "./components/project/addProject/AddProjectForm";
import MainRiskRegisterPage from "./components/riskRegister/MainRiskRegisterPage";


import {userIsAuthAndAdmin, userIsAuthenticated, userIsNotAuthenticated} from "./security/secureRouters";
import DashboardPage from "./components/dashboard/DashboardPage";
import PageNotFound from "./components/error/PageNotFound";
import {useSelector} from "react-redux";
import MainQA from "./components/questionAnswer/MainQA";
import MainSurveyPage from "./components/survey/MainSurveyPage";
import SurveyInfoPage from "./components/survey/surveyInfo/SurveyInfoPage";
import AddSurveyPage from "./components/survey/addSurvey/AddSurveyPage";
import MyErrorHandler from "./components/error/MyErrorHandler";
import Forbidden from "./components/error/Forbidden";

/*
* O routrech
* https://www.youtube.com/watch?v=Law7wfdg_ls&t=1199s&ab_channel=DevEd
* o chranenych pro autentizaci https://www.youtube.com/watch?v=Y0-qdp-XBJg&ab_channel=freeCodeCamp.org
* */

/**
 * Hlavni komponenta pro React.
 *
 * Autor: Sara Skutova
 * */
function App() {

    const theme = useSelector(state => state.appTheme);

    /**
     * Reaguje na zmenu theme promenne - tvori nove theme v aplikaci
     * */
    const myTheme = createMuiTheme({
        palette: {
            primary: theme === 'light' ? {main: '#1976d2'} : {main: '#90caf9'},
            type: theme,
        },
    });

    return (
        <ThemeProvider theme={myTheme}>
            <Router>
                <MyErrorHandler>
                <Switch>
                    <Route exact path="/" component={userIsNotAuthenticated(LoadingLogin)}/>
                    <Route exact path="/app/dashboard" component={userIsAuthenticated(DashboardPage)}/>
                    <Route exact path="/app/users" component={userIsAuthAndAdmin(UserPage)}/>
                    <Route exact path="/app/project" component={userIsAuthenticated(MainProjectPage)}/>
                    <Route exact path="/app/project/addForm" component={userIsAuthAndAdmin(AddProjectForm)}/>
                    <Route exact path="/app/project/:id" component={userIsAuthenticated(ProjectPageID)}/>
                    <Route exact path="/app/register" component={userIsAuthenticated(MainRiskRegisterPage)}/>
                    <Route exact path="/app/survey" component={userIsAuthAndAdmin(MainSurveyPage)}/>
                    <Route exact path="/app/survey/addSurvey" component={userIsAuthAndAdmin(AddSurveyPage)}/>
                    <Route exact path="/app/survey/:id" component={userIsAuthAndAdmin(SurveyInfoPage)}/>
                    <Route exact path="/app/question" component={userIsAuthAndAdmin(MainQA)}/>
                    <Route exact path="/403" component={userIsAuthenticated(Forbidden)}/>
                    <Route component={PageNotFound} />
                </Switch>
            </MyErrorHandler>
            </Router>
    </ThemeProvider>
  );
}

export default App;
