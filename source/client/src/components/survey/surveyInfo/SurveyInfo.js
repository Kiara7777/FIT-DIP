import React, {useEffect, useRef, useState} from "react";
import {Container, Grid, IconButton, Tooltip} from "@material-ui/core";
import TextFieldEdit from "../../../TextFieldEdit";
import QuestionInfo from "./QuestionInfo";
import MyHeaderButtons from "../../MyHeaderButtons";
import {makeStyles} from "@material-ui/core/styles";
import AddBoxIcon from "@material-ui/icons/AddBox";
import axios from "axios";
import AddQuestionDialog from "./AddQuestionDialog";
import {createLookup} from "../../../spolecneFunkce";
import {trackPromise} from "react-promise-tracker";
import {setErrorCode} from "../../../actions";
import {useDispatch} from "react-redux";
import * as Yup from "yup";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import CloseIcon from '@material-ui/icons/Close';
import {withRouter} from "react-router-dom";
import {question, survey} from "../../constants";


const initialData = {
    nazev: "",
    popis: "",
    otazky: []
};

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({

    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },

    nadpisAEdit: {
        display: "flex",
    },

    edit: {
        marginLeft: "auto",
    },

}));

/**
 * Komponenta ktera zobrazuje informace dotazniku - nazev, popis, otazky
 *
 * porps:
 *      create - informace zda se dotaznik tvori nebo edituje
 *      history - objekt react-redux-dom
 *      data - data dotazniku
 *      edit - je zapnuty edit mode
 *
 * Autor: Sara Skutova
 *
 * */
function SurveyInfo(props) {

    const source = useRef(axios.CancelToken.source());

    const classes = useStyles();


    const [noQuestion, setNoQuestion] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [questionAreasLookup, setQestionAreaLookup] = useState({});
    const [open, setOpen] = useState(false);

    const [surveyData, setSurveyData] = useState(initialData);
    const [surveyDataSave, setSurveyDataSave] = useState(initialData);
    const [edit, setEdit] = useState(false);

    const [errorText, setErrorText] = useState(false);
    const [errorTextMsg, setErrorTextMsg] = useState("");
    const [errorQuestion, setErrorQuestion] = useState(false);

    const errorMsgHelp = "Vechny textové informace musí být zadané";

    const dispatch = useDispatch();

    const validSurvey = Yup.object({
        nazev: Yup.string().required(),
        popis: Yup.string().required(),
        otazky: Yup.array().min(1)
    });


    /**
     * ziskani vsech potrebnych dat - vsech otazek, vsechny oblasti otazek
     * */
    async function getQuestion() {
        try {
            const res = await axios.get(question.getAllQuestions, {cancelToken: source.current.token});
            const resOblasti = await axios.get(question.getAllAreas, {cancelToken: source.current.token});
            setQuestions(res.data);
            setQestionAreaLookup(createLookup(resOblasti.data, "nazev"));
            setNoQuestion(false);
            setOpen(true);
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * Odeslani dat dotazniku - editace nebo tvorba
     * */
    async function sendSurvey(surveyData) {
        try {
           const res = await axios.post(survey.postSurvey, surveyData, {cancelToken: source.current.token});
           if (props.create) {
               props.history.push(`/app/survey/${res.data.id}`);
           }
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }

    }

    /**
     * Transormuej data do pozadovane podoby
     * {
    "id": 1,
    "nazev": "Test dotazniku 1 test 3",
    "popis": "test",
    "otazky": [
        {
        	"otazkaDotazniku": {
        		"id": 3
        	},
        	"poradi": 1
        },
     * */
    const transformData = (data) => {
        if(edit) {
            return {
                id: data.id,
                nazev: data.nazev,
                popis: data.popis,
                otazky: data.otazky.map((otazka, index) => {
                    return {
                        otazkaDotazniku: {
                            id: otazka.id
                        },
                        poradi: index + 1
                    }
                })
            }
        } else {
            return {
                nazev: data.nazev,
                popis: data.popis,
                otazky: data.otazky.map((otazka, index) => {
                    return {
                        otazkaDotazniku: {
                            id: otazka.id
                        },
                        poradi: index + 1
                    }
                })
            }

        }
    };

    /**
     * Reakce na uzavreni dialogu, ktery se pouzil pro vyber otazek
     * */
    const handleCloseDialog = (otazky) => {
        setOpen(false);
        let addQuestion = [];
        otazky.forEach(id => {
            const item = questions.find(question => question.id === id);
            addQuestion = [...addQuestion, item];
        });
        const suvData = {...surveyData};
        const oldOtazky = [...surveyData.otazky];
        suvData['otazky'] = [...oldOtazky, ...addQuestion];
        setSurveyData(suvData);
        if (otazky.length > 0) {
            setErrorQuestion(false);
        }
    };


    /**
     * reakce na pozadavek zapnuti editovani
     * */
    const handleEditClick = () => {
        setEdit(true);
    };

    /**
     * povryeni editvanych dat, po editaci ulozi data na serve - jenom pokud projde validaci
     * */
    const handleEditSave = () => {

/*        validSurvey.validate(surveyData)
            .then(function (valid) {
                if (valid) {
                    setErrorText(false);
                    setErrorTextMsg("");
                    setSurveyDataSave(surveyData);
                    const newData = transformData(surveyData);
                    trackPromise(sendSurvey(newData));
                    setEdit(false);
                } else {
                    setErrorText(true);
                    setErrorTextMsg(errorMsgHelp);
                }
            });*/

        validSurvey.validate(surveyData)
            .then(function (value) {
                setErrorText(false);
                setErrorTextMsg("");
                setErrorQuestion(false);
                setSurveyDataSave(surveyData);
                const newData = transformData(surveyData);
                trackPromise(sendSurvey(newData));
                setEdit(false);
            }).catch(function (error) {
                if (error.path === "otazky") {
                    setErrorText(false);
                    setErrorTextMsg("");
                    setErrorQuestion(true);
                } else {
                    setErrorText(true);
                    setErrorTextMsg(errorMsgHelp);
                    setErrorQuestion(false);
                }

        })

    };

    /**
     * reakce na zeuseni editace - budou tam puvodni hodnoty
     * */
    const handleEditNo = () => {

        if (props.create) {
            props.history.push("/app/survey");
        } else {
            setErrorText(false);
            setErrorTextMsg("");
            setErrorQuestion(false);
            setSurveyData(surveyDataSave);
            setEdit(false);
        }
    };

    /**
     * reakce na zemenu dat - puzivaji to textova policka
     * */
    const handleChangeValue = (event) => {
        const newInfo = {
            ...surveyData
        };
        newInfo[event.target.name] = event.target.value;

        setSurveyData(newInfo);
    };

    /**
     * reakce na smazani dotazniku
     * */
    const handleDelete = (index) => {
        const oldSurvey = {...surveyData};
        const oldArray = [...surveyData.otazky];
        oldArray.splice(index, 1);
        oldSurvey['otazky'] = oldArray;
        setSurveyData(oldSurvey);
    };

    /**
     * Reakce na pridani otazek - vsechny otazky se nactou pouze jednou + se otevre tamten dialog
     * */
    const handleAddQ = () => {
        if(noQuestion) {
            trackPromise(getQuestion());
        } else {
            setOpen(true);
        }
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (typeof  props.data !== 'undefined') {
            setSurveyData(props.data);
            setSurveyDataSave(props.data);
        }

        setEdit(props.edit);
    }, [props]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel(); //tohle nic neudela, pokud neni axios pozadavek zrovna spusten
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    return(
        <Container maxWidth="lg">
            <MyHeaderButtons title="" edit={edit} onSave={handleEditSave} onNo={handleEditNo} onEdit={handleEditClick}/>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextFieldEdit title="Název" value={surveyData.nazev} name="nazev" edit={edit} onChange={handleChangeValue} error={errorText} errorText={errorTextMsg}/>
                </Grid>
                <Grid item xs={12}>
                    <TextFieldEdit title="Popis" value={surveyData.popis} name="popis" edit={edit} onChange={handleChangeValue} error={errorText} errorText={errorTextMsg}/>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={errorQuestion}>
                        <Alert severity="error"
                               action={
                                   <IconButton
                                       aria-label="close"
                                       color="inherit"
                                       size="small"
                                       onClick={() => {
                                           setErrorQuestion(false);
                                       }}
                                   >
                                       <CloseIcon fontSize="inherit" />
                                   </IconButton>
                               }
                        >
                            <AlertTitle>Chyba</AlertTitle>
                            Dotazník musí obsahovat alespoň 1 otázku!
                        </Alert>
                    </Collapse>
                </Grid>
                {
                    surveyData.otazky.map((otazka, index) => (
                        <Grid item xs={12} key={index}>
                            <QuestionInfo nazev={otazka.textOtazky} handleDelete={handleDelete} odpovedi={otazka.odpovedi} index={index} edit={edit}/>
                        </Grid>
                    ))
                }
            </Grid>
            <div className={classes.nadpisAEdit}>
                {
                    edit ?
                        <Tooltip title="Přidat otázky">
                            <IconButton color="primary" onClick={handleAddQ} className={classes.edit}>
                                <AddBoxIcon />
                            </IconButton>
                        </Tooltip>
                        :
                        null
                }
            </div>
            <AddQuestionDialog open={open}
                               title="Výběr nových otázek"
                               questionsSurvey={surveyData.otazky}
                               quesions={questions}
                               areas={questionAreasLookup}
                               handleClose={handleCloseDialog}

            />
        </Container>
    );
}

export default withRouter(SurveyInfo);