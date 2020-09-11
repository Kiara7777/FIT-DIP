import React, {useEffect, useRef, useState} from "react";
import {Typography, Button, Container, Grid, IconButton, Tooltip, Collapse} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";
import ConformDialog from "../../ConformDialog";
import {
    visibleOnlyProjMgnAndAdmin,
    vOProjMPRojUAndAdmin,
    vOProjMUDoneSurveyAdmin,
    vOProjMUNoDoneSurveyAdmin, vProjActiveAlone
} from "../../../security/secureComponents";
import TextFieldEdit from "../../../TextFieldEdit";
import ProjectStatsInfo from "../projectInfo/ProjectStatsInfo";
import {
    addProjectSurvey,
    changeProject,
    removeSurvey,
    setErrorCode,
    setProjectSurvey,
    setUserDoneSurvey
} from "../../../actions";
import SurveyDialog from "./SurveyDialog";
import SurveyStats from "./SurveyStats";
import SurveyAnswerDialog from "./SurveyAnswerDialog";
import {trackPromise} from "react-promise-tracker";
import {project, survey} from "../../constants";
import DashboardTextMsg from "../../dashboard/DashboardTextMsg";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY
* titleText inspirovan v w3school*/
const useStyles = makeStyles(theme => ({

    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },

    input: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.primary.light,
        padding: theme.spacing(1)
    },

    newLines: {
        whiteSpace: "pre-line"

    },

    nodata: {
        textAlign: "center"
    },

    button: {
        margin: theme.spacing(1)
    },

    titleText: {
        paddingBottom: theme.spacing(2),
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },

    main: {
        marginTop: theme.spacing(1)
    },

    actionButtons: {
        display: "flex",
    },

    deleteButton: {
        marginLeft: "auto"
    },

    test: {
        width: "100%"
    }


}));

/**
 * Inicialni hodnoty pro formik
 * */
const initialData = {
    nazev: "",
    popis: "",
    otazky: []
};

/**
 * Hlavni komponenta pro zobrazeni karty dotazniku projektu s pozadovanymi informacemi
 *
 * Autor: Sara Skutova
 * */
function ProjectSurveyTab() {

    const classes = useStyles();
    const [noData, setNoData] = useState(true);
    const [surveyData, setSurveyData] = useState(initialData);

    const [open, setOpen] = useState(false);

    const [openAdd, setOpenAdd] = useState(false);
    const [surveyLoaded, setSurveyLoaded] = useState(false);
    const [allSurvey, setAllSurvey] = useState([]);

    const [showStats, setShowStats] = useState(false);
    const [noStats, setNoStats] = useState(true);
    const [surveyStats, setSurveyStats] = useState(undefined);
    const [bold, setBold] = useState([]);
    const [noAnswers, setNoAnswers] = useState(true);

    const [openAnswer, setOpenAnswer] = useState(false);


    const source = useRef(axios.CancelToken.source());

    const projectData = useSelector(state => state.ProjectInfo);
    const user = useSelector(state => state.user);
    const projectSurveyData = useSelector(state => state.projectSurveyData);
    const userDone = useSelector(state => state.userDoneSurvey);
    const dispatch = useDispatch();

    const data = "K projektu není přiřazen žádný dotazník";

    const noSurveyDone = "Na dotazník ještě nikdo neodpověděl";

    /**
     * Funkce pro odstraneni dotazniku projektu - posila na server prikaz ke smazani
     * */
    async function deleteSurveyFromProject(newProjectData) {
        try {
            await axios.delete(`/api/nprr/project/${projectData.id}/survey`, {cancelToken: source.current.token});
            dispatch(changeProject(newProjectData));
            dispatch(removeSurvey());
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * Funkce pro ziskani dat vsech dotazniku - pouziva se pri vyberu dotazniku, ktery lze priradit k projektu
     * */
    async function getAllSurvey() {
        try {
            const res = await axios.get(survey.getAllSurvey, {cancelToken: source.current.token});
            setAllSurvey(res.data);
            setSurveyLoaded(true);
            setOpenAdd(true);
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }

        }
    }

    /**
     * Funkce pro odeslani dat dotazniku, jak uzivatel odpovidal na dotaznik
     * */
    async function saveProjectWitchSurvey(newProjectData, newDotaznik) {
        try {
            const res = await axios.post(project.projectSurveyAnswers, newProjectData, {cancelToken: source.current.token});
            const testData = {...newProjectData};
            testData['dotaznikProjektu'] = newDotaznik;
            dispatch(removeSurvey());
            dispatch(changeProject(testData));
            setSurveyData(res.data.dotaznikProjektu);
            setOpenAdd(false);
            setNoData(false);
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * Funkce vytvori template pro pridani informaci jak se odpovidalo na otazky
     * Bude to object objektu ve tvaru, kazde idOtazky je atribut
     * idOtazky: {
     *     idOdpovedi: 0,
     *     .
     *     .
     *     .
     * }
     * */
    const createSurveyStatsTempalte = (data) => {
        const testData = {};

        data.dotaznikProjektu.otazky.forEach(otazka => {
            const odpovediHelp = {};
            otazka.odpovedi.forEach(odpoved => odpovediHelp[odpoved.id] = 0);
            testData[otazka.id] = odpovediHelp;
        });

        return testData;
    };

    /**
     * Funkce naplni strukturu dotazniku daty -
     * */
    const popoulateStats = (stats, struct) => {

        const helpStruct = {...struct};
        const people = [];
        stats.forEach(stat => {
            if (!people.includes(stat.uzivatel))
                people.push(stat.uzivatel);
            const puvodni = helpStruct[stat.otazka][stat.odpoved];
            helpStruct[stat.otazka][stat.odpoved] = puvodni + 1;
        });

        const finalDAta = countPersentage(people.length, helpStruct);
        return finalDAta;
    };

    /**
     * Funkce ktera spocita procenta pro danou otazku - TODO POPREMYSLEJ CO ZE ZAOKROUHLANIM
     * 100% ...... celkovy pocet lidi co odpovedelo na dotaznik
     * x% ........ pocet co odpovedelo danou odpovedi
     * o zaokrouhlovani na 2 desetina mista: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
     * o porovnani desetinych cisel https://stackoverflow.com/questions/18741177/decimal-comparison-failing-in-javascript
     * Math.round( ( num + Number.EPSILON ) * 100 ) / 100
     * */
    const countPersentage = (maxValue, struct) => {
        const helpStruct = {...struct};
        const testBold = {};

        Object.entries(struct).forEach(otazka => {
            if (otazka.length !== 0) {
                let max = 0;
                let maxOdpoved = 1;
                Object.entries(otazka[1]).forEach(odpoved => {
                    if(odpoved.length !== 0) {
                        const num = (odpoved[1] * 100) / maxValue;
                        const rounded = Math.round( ( num + Number.EPSILON ) * 100 ) / 100;
                        if (Math.round(rounded * 100) > Math.round(max * 100)) {
                            max = rounded;
                            maxOdpoved = odpoved[0];
                        }
                        helpStruct[otazka[0]][odpoved[0]] = rounded;
                    }
                });
                testBold[otazka[0]] = maxOdpoved;
            }
        });

        setBold(testBold);
        return helpStruct;
    };

    /**
     * Reakce na stisk tlacitka pro zobrazeni statictiky dotazniku
     * */
    const handleShowStats = () => {

        if(projectSurveyData.length === 0) {
            setNoAnswers(true);
        } else {
            if(!showStats && noStats) {
                const data = createSurveyStatsTempalte(projectData);
                const newStats = popoulateStats(projectSurveyData, data);
                setSurveyStats(newStats);
                setNoStats(false);
                setNoAnswers(false);
            }
        }

        setShowStats(prevState => !prevState);
    };


    /**
     * Zruseni akce
     * */
    const handleCancel = () => {
        setOpen(false);
    };

    /**
     * Potvryeni odebrani dotazniku z projektu
     * */
    const handleApproval = () => {
        const newProjectData = {...projectData};
        newProjectData['dotaznikProjektu'] = null;
        deleteSurveyFromProject(newProjectData);
        setSurveyData(initialData);
        setNoData(true);
        setOpen(false);
    };

    /**
     * Handle pro zobrazeni dialogu na odpoved dotazniku
     * */
    const handleAnswerSurvey = () => {
        setOpenAnswer(true);
    };

    /**
     * Handle pro zruseni dialogu s dotaznikem
     * */
    const handleCancelSurvey = () => {
        setOpenAnswer(false);
    };

    /**
     * Handle co se vola jakmile se data z dotazniku odesle na server, ma za ukol data dostat na redux, a na dalsi potrebne mista
     * */
    const handleApprovalSurvey = (data) => {
        if (userDone) { //user uz odpovedel
            const old = projectSurveyData.filter(stat => stat.uzivatel !== user.id);
            const newDAta = [...old, ...data];
            dispatch(setProjectSurvey(newDAta));
            dispatch(setUserDoneSurvey(true));

        } else { //je to poprve
            data.forEach(item => dispatch(addProjectSurvey(item)));
            dispatch(setUserDoneSurvey(true));
        }

        setNoStats(true); //tohle donuti aby se statistika dotazniku znovu prepocitala pri stisku  tlacitka
        setOpenAnswer(false);
    };

    /**
     * Zruseni akce pridavani dotazniku
     * */
    const handleCancelAdd = () => {
        setOpenAdd(false);
    };


    /**
     * Akce pro pridani dotazniku k projektu - rakce na stisk tlacitka
     * */
    const handleAddToProject = (indexSurv) => {
        const newProjectData = {...projectData};
        const newDotaznik = allSurvey[indexSurv];
        newProjectData['dotaznikProjektu'] = {id: newDotaznik.id};
        saveProjectWitchSurvey(newProjectData, newDotaznik);
    };

    /**
     * Akce na zmacknuti tlacitka na pridani dotaznkiku - dialog pridani - zobrazuje se kdyz projektu nema zadny dotaznik
     * */
    const handleAddSurvey = () => {
        if (!surveyLoaded) {
            trackPromise(getAllSurvey());
        } else {
            setOpenAdd(true);
        }
    };

    /**
     * Zobrazuje dialog s potvrzenim na smazani dotazniku a jeho dat
     * */
    const handleRemove = () => {
        setOpen(true);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (projectData.dotaznikProjektu === null) {
            setNoData(true)
        } else {
            setSurveyData(projectData.dotaznikProjektu);
            setNoData(false);
        }
    },[projectData.dotaznikProjektu]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel(); //tohle nic neudela, pokud neni axios pozadavek zrovna spusten
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Definice komponent, ktere se zobrazi jenom urcitym rolim
     * */
    const VOPRojMProjUAdminAdd = vOProjMPRojUAndAdmin(() => <Button variant="contained" onClick={handleAddSurvey} className={classes.button}>Přidat dotazník</Button>);
    const VOPRojMProjUAdminHeaderDelete = visibleOnlyProjMgnAndAdmin(() => <Tooltip title="Odebrat"><IconButton onClick={handleRemove} color="primary"> <DeleteIcon /> </IconButton></Tooltip>);
    const VOPRojMProjUAdminAno = vOProjMPRojUAndAdmin(() => <ProjectStatsInfo title="Zodpovězený dotazník" data="Ano"/>);
    const VOPRojMProjUAdminNE = vOProjMPRojUAndAdmin(() => <ProjectStatsInfo title="Zodpovězený dotazník" data="Ne"/>);
    const VOMUNoDoneAdmin = vOProjMUNoDoneSurveyAdmin(() => <Button variant="contained" color="primary"  className={classes.button} onClick={handleAnswerSurvey}>Zodpovědět</Button>);
    const VOMUDoneAdmin = vOProjMUDoneSurveyAdmin(() => <Button variant="contained" color="primary" className={classes.button} onClick={handleShowStats}>Výsledky</Button>);

    const FinalAdd = vProjActiveAlone(() => <VOPRojMProjUAdminAdd />);
    const FinalHeaderDelete = vProjActiveAlone(() => <VOPRojMProjUAdminHeaderDelete />);
    const FinalNoDone = vProjActiveAlone(() => <VOMUNoDoneAdmin />);

    /**
     * Zobrazuje se pokud projektu nema prirazeny dotaznik
     * */
    const InfoAdd = () => {
        return(
            <div className={classes.nodata}>
                <Typography variant="h6">{data}</Typography>
                <FinalAdd />
            </div>
        );
    };



    // kdyz nebudou data, tak zobrazim text s tim, ze nejsou data a nabidnu tlacitko s prirazenim dotazniku
    return(
        <Container maxWidth="lg">
            {
                noData ?
                    <React.Fragment>
                        <InfoAdd/>
                        <SurveyDialog open={openAdd}
                                      title="Přiřazení dotazníku"
                                      data={allSurvey}
                                      cancel={handleCancelAdd}
                                      confirm={handleAddToProject}
                        />
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className={classes.actionButtons}>
                            <div className={classes.test}></div>
                            <FinalNoDone />
                            <VOMUDoneAdmin />
                            <FinalHeaderDelete />
                        </div>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextFieldEdit title="Název" value={surveyData.nazev} name="nazev" edit={false} onChange={null}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldEdit title="Popis" value={surveyData.popis} name="popis" edit={false} onChange={null}/>
                            </Grid>
                            <Grid item xs={3}>
                                <ProjectStatsInfo title="Počet otázek" data={surveyData.otazky.length}/>
                            </Grid>
                            <Grid item xs={3}>
                                {
                                    userDone ?
                                        <VOPRojMProjUAdminAno />
                                        :
                                        <VOPRojMProjUAdminNE/>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Collapse in={showStats}>
                                    {
                                        noAnswers ?
                                            <DashboardTextMsg text={noSurveyDone}/>
                                            :
                                            <SurveyStats projectData={projectData} stats={surveyStats} bold={bold}/>
                                    }
                                </Collapse>
                            </Grid>
                        </Grid>
                        <ConformDialog title="Odebrat dotazník z projektu?"
                                       text="Tímto se odebere dotazník z tohodle projektu. Zároveň se také odeberou statistiky zjištěné z daného dotazníku"
                                       handleCancel={handleCancel}
                                       handleApproval={handleApproval}
                                       open={open}
                        />
                        <SurveyAnswerDialog open={openAnswer}
                                            title={surveyData.nazev}
                                            survey={surveyData}
                                            cancel={handleCancelSurvey}
                                            approval={handleApprovalSurvey}
                                            project={projectData.id}
                                            user={user.id}

                        />
                    </React.Fragment>
            }
        </Container>
    );

}

export default ProjectSurveyTab;