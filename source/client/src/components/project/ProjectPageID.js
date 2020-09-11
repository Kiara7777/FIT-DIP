import React, {useEffect, useState} from "react";
import MenuAppBar from "../MenuAppBar";
import {AppBar, Tabs, Tab} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    changeDeadline,
    changeManager,
    changePeopleCount,
    changeProject,
    changeResitele,
    cleanProjectData, setProjectRisks, setProjectSurvey, setRiskLoading, setTitle, setUserDoneSurvey
} from "../../actions";
import axios from "axios";
import ProjectInfoTab from "./projectInfo/ProjectInfoTab";
import ProjectRiskTab from "./projectRisks/ProjectRiskTab";
import ProjectSwotTab from "./projectSWOT/ProjectSwotTab";
import {getRiskInfo} from "../../spolecneFunkce";
import Zoom from "@material-ui/core/Zoom";
import BackFab from "../BackFab";
import ProjectSurveyTab from "./projectSurvey/ProjectSurveyTab";
import Loading from "../Loading";
import {useGetData} from "../useGetData";
import {project, risk, user} from "../constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;



/* STYL KOMPONENTY
* placeholderToolbar je prevzat ze zdarma sablony dashboardu od Material-UI:
* https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Dashboard.js
* https://material-ui.com/getting-started/templates/dashboard/
 */
const useStyles = makeStyles(theme => ({

    root: {
        display: 'flex',
    },

    placeholderToolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },

    main: {
        flexGrow: 1,
    },

    appbarTab: {
        marginBottom: theme.spacing(3),

    },

    maxView: {
        height: "100%"
    }

}));

/**
 * Komponenta, ktera na za cil nacist potrebna projektova data a rozeslat je jednotlivym projektovym datum.
 * Prakticky jde o rodice projektovych oken - tech tabu jak se to meni
 *
 * Autor: Sara Skutova
 * */
function ProjectPageID({match}) {

    const [projectData, setProjectData] = useState({});
    const [projectRisksProps, setProjectRisksProps] = useState([]);
    const [projectUsers, setProjectUsers] = useState([]);
    const [riskCategorie, setRiskCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [tab, setTab] = useState(0);
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();

    const userRedux = useSelector(state => state.user);

    //nacist potrebna data ze serveru
    //projekt
    const [loadingP, dataP] = useGetData(`${project.getProject}/${match.params.id}`, false);

    //projektovy dotaznik
    const [loadingS, dataS] = useGetData(`/api/nprr/project/${match.params.id}/survey`, false);

    //projektova rizika
    const [loadingR, dataR] = useGetData(`/api/nprr/project/${match.params.id}/risks`, false);

    //projektovi resitele
    const [loadingU, dataU] = useGetData(`/api/nprr/project/${match.params.id}/users`, false);

    //vsichni uzivatele
    const [loadingAllU, dataAllU] = useGetData(user.getUsers, false);

    //vsechny kategorie rizik
    const [loadingC, dataC] = useGetData(risk.getRiskCategories, false);

    /**
     * Reakce na pozadavek zmeny tabu, prepne hodnotu a tim se prepne tab
     * */
    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    /**
     * Zjisti zda uzivatel jiz odpovedel na dotaznik
     * */
    const isUserDone = (userID, surveyData) => {
        const len = surveyData.filter(item => item.uzivatel === userID).length;
        return len > 0;
    };

    /**
     * Vypocita pocet aktivnich resitelu projektu + je tam i manager
     * */
    function getActiveCount(data) {
        const num = data.reduce((result, item) => {
            if(item.aktivni)
                return result + 1;
            else
                return result;
        }, 0);

        return num;
    }

    /**
     * Z uzivatelu pridelenych na projektu vrati uzivatele ktery je aktivni a je vedoduci - manager
     * */
    function getActiveManager(data) {
        const vedouci = data.find(user => user.vedouci === true && user.aktivni === true);
        if (vedouci === undefined)
            return {id: "", nazev: ""};
        else
            return {id: vedouci.id.uzivatelID, nazev:vedouci.uzivatel.nazev};
    }

    /**
     * Se seznamu prirazenych uzivatelu vybere ty aktivni (a ty co nejsou vedouci)
     * */
    function getActiveUsers(users) {
        const newResitele = users.filter(user => user.aktivni === true && user.vedouci !== true);
        return newResitele.map(resitel => {
            return {
                id: resitel.id.uzivatelID,
                nazev: resitel.uzivatel.nazev
            }
        });
    }


    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    ///////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        dispatch(cleanProjectData());
    }, [dispatch]);

    //pro projekt
    useEffect(() => {
        if(!loadingP && dataP != null) {
            let swot;
            if (dataP.swot !== null) {
                swot = {
                    id: dataP.swot.id,
                    silne: dataP.swot.silne,
                    slabe: dataP.swot.slabe,
                    prilezitosti: dataP.swot.prilezitosti,
                    hrozby: dataP.swot.hrozby,
                    projekt: {
                        id: dataP.id
                    }
                }
            } else
                swot = null;

            const test = {
                ...dataP,
                swot
            };

            setProjectData(test);
            dispatch(changeProject(test));
            dispatch(changeDeadline(dataP.konec));
            dispatch(setTitle(`Projekt: ${dataP.nazev}`));
        }
    }, [loadingP, dataP, dispatch]);

    //pro project survey
    useEffect(() => {
        if (!loadingS && dataS != null && userRedux != null){
            dispatch(setProjectSurvey(dataS));
            const isDone = isUserDone(userRedux.id, dataS);
            dispatch(setUserDoneSurvey(isDone));
        }
    }, [loadingS, dataS, dispatch, userRedux]);

    //pro projekt risk
    useEffect(() => {
        if(!loadingR && dataR != null) {
            setProjectRisksProps(dataR);
            const riskData = getRiskInfo(dataR, true);
            dispatch(setProjectRisks(riskData));
            dispatch(setRiskLoading(false));
        }
    },[loadingR, dataR, dispatch]);

    //pro projekt uzivatele
    useEffect(() => {
        if (!loadingU && dataU != null) {
            //ziskani aktualniho managera
            const manager = getActiveManager(dataU);
            dispatch(changeManager(manager));

            //ziskani aktualnich resitelu
            const resitele = getActiveUsers(dataU);
            dispatch(changeResitele(resitele));

            //pocet aktivnich resitelu + manager
            const num = getActiveCount(dataU);
            dispatch(changePeopleCount(num));

            setProjectUsers(dataU);
        }
    }, [loadingU, dataU, dispatch]);

    //pro vsechny uzivatele
    useEffect(() => {
        if(!loadingAllU && dataAllU != null) {
            setUsers(dataAllU);
        }
    }, [loadingAllU, dataAllU]);

    //pro vsechny kategorie
    useEffect(() => {
        if (!loadingC && dataC != null) {
            setRiskCategories(dataC);
        }
    }, [loadingC, dataC]);

    ///////////////////////////////////////////////////////////////////////////////////////////


    const fabs = [1,2,3,4];

    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar />
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <AppBar position="static" color="default" className={classes.appbarTab}>
                    <Tabs value={tab}
                          onChange={handleChangeTab}
                          indicatorColor="primary"
                          textColor="primary"
                          centered>
                        <Tab label="Informace o projektu" />
                        <Tab label="Rizika projektu" />
                        <Tab label="SWOT analýza" />
                        <Tab label="Dotazník" />
                    </Tabs>
                </AppBar>
                {tab === 0 && <ProjectInfoTab projectData={projectData} projectRisks={projectRisksProps} projectUsers={projectUsers} users={users}/>}
                {tab === 1 && <ProjectRiskTab projectRisks={projectRisksProps} category={riskCategorie}/>}
                {tab === 2 && <ProjectSwotTab />}
                {tab === 3 && <ProjectSurveyTab />}
                {fabs.map((fab, index) => (
                    <Zoom
                        key={fab}
                        in={tab === index}
                        timeout={transitionDuration}
                        style={{
                            transitionDelay: `${tab === index ? transitionDuration.exit : 0}ms`,
                        }}
                        unmountOnExit
                    >
                        <BackFab key={fab}/>
                    </Zoom>
                    ))}
                    <Loading all={true}/>
            </main>
        </div>
    );
}

/*
*                 <SwipeableViews
                    index={tab}
                    onChangeIndex={handleChangeIndex}
                >
                *
                *
                * <ProjectRiskTab/>
*
* */


export default ProjectPageID;