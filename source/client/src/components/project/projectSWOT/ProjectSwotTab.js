import React, {useEffect, useRef, useState} from "react";
import {Typography, Button, Container, Grid, IconButton} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';
import MyHeaderButtons from "../../MyHeaderButtons";
import {changeProject, setErrorCode} from "../../../actions";
import axios from "axios";
import ConformDialog from "../../ConformDialog";
import {vOProjMPRojUAndAdmin, vProjActiveAlone} from "../../../security/secureComponents";
import TextFieldEdit from "../../../TextFieldEdit";
import {trackPromise} from "react-promise-tracker";
import * as Yup from "yup";
import {project} from "../../constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY
titleText je z w3sch.
* */
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
        margin: theme.spacing(2)
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
        display: "flex"
    },

    deleteButton: {
        marginLeft: "auto"
    },

    test: {
        width: "100%"
    }


    }));


// tadt popisuje ten problem https://stackoverflow.com/questions/22573494/react-js-input-losing-focus-when-rerendering
/**
 * Komponenta swot tabulky, musi to byt venku jinak to delalo problemy, viz. odkaz nahore
 * */
const SwotTables = (swotInfo) => {
    return(
        <div className={swotInfo.class.main}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextFieldEdit title="S - Strengths - Silné stránky" value={swotInfo.silne} name="silne" edit={swotInfo.edit} onChange={swotInfo.onChange} error={swotInfo.error} errorText={swotInfo.errorText}/>
                </Grid>
                <Grid item xs={12} >
                    <TextFieldEdit title="W - Weaknesses - Slabé stránky" value={swotInfo.slabe} name="slabe" edit={swotInfo.edit} onChange={swotInfo.onChange} error={swotInfo.error} errorText={swotInfo.errorText}/>
                </Grid>
                <Grid item xs={12}>
                    <TextFieldEdit  title="O - Opportunities - Příležitosti" value={swotInfo.prilezitosti} name="prilezitosti" edit={swotInfo.edit} onChange={swotInfo.onChange} error={swotInfo.error} errorText={swotInfo.errorText}/>
                </Grid>
                <Grid item xs={12}>
                    <TextFieldEdit title="T - Threats - Hrozby" value={swotInfo.hrozby} name="hrozby" edit={swotInfo.edit} onChange={swotInfo.onChange} error={swotInfo.error} errorText={swotInfo.errorText}/>
                </Grid>
            </Grid>
        </div>

    );
};

/**
 * Hlavni komponenta SWOT analyzy, zobrayuje SWOT tabulku
 *
 * Autor: Sara Skutova
 * */
function ProjectSwotTab() {

    const classes = useStyles();
    const [edit, setEdit] = useState(false);
    const [swotInfo, setSwotInfo] = useState({});
    const [swotInfoSave, setSwotInfoSave] = useState({});
    const [noData, setNoData] = useState(true);
    const [creating, setCreating] = useState(true);

    const [open, setOpen] = useState(false);

    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const errorTextHelp = "Všchny položky SWOT tabulky musí být zadané";

    const source = useRef(axios.CancelToken.source());

    const projectData = useSelector(state => state.ProjectInfo);
    const dispatch = useDispatch();

    const data = "K projektu není vytvořena žádná SWOT analýza";

    /**
     * VAlidacni schema pro hodnoty SWOT
     * */
    const validSWOT = Yup.object({
        silne: Yup.string().required(),
        slabe: Yup.string().required(),
        prilezitosti: Yup.string().required(),
        hrozby: Yup.string().required()
    });

    /**
     * funkce ,ktera vlozi akutalni SWOT data do dat rpojektu
     * */
    function saveDatatoProject(data) {
        const newProject = {
            ...projectData
        };

        newProject['swot'] = data; //snad to funguje, DLE KONZOLE FUNGUJE
        return newProject;

    }

/*    function testIfData(data) {
        if (data.swot !== null) { //data tam jsou
            setSwotInfo(data.swot);
            setSwotInfoSave(data.swot);
            return false;
        }
        else
            return true;
    }*/

    /**
     * Funcke zasle nova swot data (schovana v projektu) na server, dotaznikuvoa data se musi odstranit, jinak to bude delat problemy
     * */
    async function sendUpdate(newProject) {
        try {
            const helptest = {...newProject};
            delete helptest.dotaznikProjektu;
            await axios.post(project.postProjectWithSWOT, helptest, {cancelToken: source.current.token});
            dispatch(changeProject(newProject));
        }catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * funkce ,ktera na server zasle pozadavek na smazani projeku
     * */
    async function deleteSWOT(newProject) {
        try {
            await axios.delete(`/api/nprr/project/${projectData.id}/swot`, {cancelToken: source.current.token});
            dispatch(changeProject(newProject));
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }

    }

    /**
     * Handle funkce, ktera meni hodnoty swot jednotlivych policek - reaguje nas stisk klaves
     * */
    const handleChangeValue = (event) => {
        const newSwotInfo = {
            ...swotInfo
        };
        newSwotInfo[event.target.name] = event.target.value;

        setSwotInfo(newSwotInfo);
    };

    /**
     * Tvori swot strukturu
     * */
    const handleCreateSwot = () => {
        const newSwot = {
            id: projectData.id,
            silne: "",
            slabe: "",
            prilezitosti: "",
            hrozby: "",
            projekt: {
                id: projectData.id
            }
        };
        setSwotInfo(newSwot);
        setSwotInfoSave(newSwot);
        setNoData(false);
        setEdit(true);
    };

    /**
     * Reakce na zadost o zmeny - ta ikonka tusky
     * */
    const handleEditClick = () => {
        setEdit(true);
    };

    /**
     * Potvrzeni uprav - zaroven take zajisti odeslani na server
     * konecne ulozeni a odeslani se provede jenom pokud jsou data valudni - pouziva se zde yup bez formiku
     * */
    const handleEditSave = () => {
        validSWOT.isValid(swotInfo)
            .then(function(valid) {
                if (valid) {
                    setErrorText("");
                    setError(false);
                    setSwotInfoSave(swotInfo);
                    const newProjectData = saveDatatoProject(swotInfo);
                    trackPromise(sendUpdate(newProjectData));
                    setEdit(false);
                    setCreating(false);
                } else {
                    setErrorText(errorTextHelp);
                    setError(true);
                }
            });

    };

    /**
     * Odmitnuti zmen, ktere se provedly pri uprave
     * */
    const handleEditNo = () => {
        setErrorText("");
        setError(false);
        setSwotInfo(swotInfoSave);
        setEdit(false);

        if (creating)
            setNoData(true);
    };

    /**
     * Raekce na tlacitko smazani - otevre se dialog
     * */
    const handleDelete = () => {
        setOpen(true);
    };

    /**
     * REacke na zruseni smazani - dialog se uzavre
     * */
    const handleCancel = () => {
        setOpen(false);
    };

    /**
     * REakce na potvrzeni smazani, pokud se mazani vyskytlo pri tvorbe SWOT, tak se mazani na serveru neprovede, jenom se to celev vycisti
     * */
    const handleApproval = () => {

        if (creating) {
            setSwotInfo({});
            setSwotInfoSave({});
            setNoData(true);
            setOpen(false);
        } else {

            const newProject = {
                ...projectData
            };

            newProject['swot'] = null;
            deleteSWOT(newProject);
            setSwotInfo({});
            setSwotInfoSave({});
            setNoData(true);
            setOpen(false);
        }

    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (projectData.swot === null) {//projekt nema SWOT analyzu
            setNoData(true);
            setCreating(true);
        }
        else {
            setSwotInfo(projectData.swot);
            setSwotInfoSave(projectData.swot);
            setNoData(false);
            setCreating(false);
        }
    },[projectData.swot]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////



    //Funkce/komponenty, ktere se zobrazuji jenom urcitym rolim
    const VOPRojMProjUAdminAdd = vOProjMPRojUAndAdmin(() => <Button variant="contained" onClick={handleCreateSwot} className={classes.button}>Přidat SWOT analýzu</Button>);
    const VOPRojMProjUAdminHeader = vOProjMPRojUAndAdmin(() => <MyHeaderButtons title="" edit={edit} onSave={handleEditSave} onNo={handleEditNo} onEdit={handleEditClick}/>);
    const VOPRojMProjUAdminHeaderDelete = vOProjMPRojUAndAdmin(() => <IconButton onClick={handleDelete} color="primary"> <DeleteIcon /> </IconButton>);

    const FinalAdd = vProjActiveAlone(() => <VOPRojMProjUAdminAdd />);
    const FinalHeader = vProjActiveAlone(() => <VOPRojMProjUAdminHeader />);
    const FinalHeaderDelete = vProjActiveAlone(() => <VOPRojMProjUAdminHeaderDelete />);


    /**
     * Komponenta se zobrazi pokud projekt nema swot udelane
     * */
    const InfoAdd = () => {
        return(
            <div className={classes.nodata}>
                <Typography variant="h6">{data}</Typography>
                <FinalAdd />
            </div>
        );
    };



    // kdyz nebudou data, tak zobrazim text s tim, ze nejsou data a nabidnu tlacitko vytvorit swot, coz pusti do zobrazeni jako
    // by tam byly data, ale hodnoty budou prazdne a bude nastavena editace
    // kazde swot bude mit svoji paper, ale editace bude globalni pro vechny? hmmm
    return(
        <Container maxWidth="lg">
            {
                noData ?
                    <InfoAdd/>
                    :
                    <div>
                        <div className={classes.actionButtons}>
                            <div className={classes.test}></div>
                            <FinalHeader />
                            <FinalHeaderDelete />
                        </div>
                        <SwotTables {...swotInfo} class={classes} edit={edit} onChange={handleChangeValue} error={error} errorText={errorText}/>
                        <ConformDialog title="Odstranit SWOT analýzu z projektu?"
                                       text="Tímto se odstraní SWOT analýza aktualního projektu z databáze. SWOT analýza pomáha lépe identifikovat rizika na projektu."
                                       handleCancel={handleCancel}
                                       handleApproval={handleApproval}
                                       open={open}
                        />
                    </div>
            }
        </Container>
    );

}

export default ProjectSwotTab;