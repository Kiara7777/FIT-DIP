import React, {useEffect, useRef, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import TextTitle from "../../TextTitle";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import {setErrorCode} from "../../../actions";
import {useDispatch} from "react-redux";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    radioButtons: {
        paddingLeft: theme.spacing(2)
    },
}));

/*const Question = (props) => (
    <React.Fragment>
        <TextTitle title={`${props.index + 1}/${props.all} ${props.nazev}`}/>
        <div className={props.classes.radioButtons}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Odpovědi</FormLabel>
                <RadioGroup aria-label="odpovedi" name="odpovedi" value={props.questionsValues[props.index]} onChange={(event) => props.handleChangeAnswer(props.index, event)}>
                    {
                        props.odpovedi.map((odpoved, index) => (
                            <FormControlLabel key={odpoved.id} value={odpoved.id} control={<Radio />} label={odpoved.textOdpovedi} />
                        ))
                    }
                </RadioGroup>
            </FormControl>
        </div>
    </React.Fragment>
);*/

/**
 * Komponenta dialogu ve kterem se odpovida na otazky dotazniku
 *
 * props:
 *      project - id projektu, ke kteremu dotaznik patri
 *      survey - data dotazniku
 *      user - id aktulane prihlaseneho uzivatele
 *      approval - funkce, ktera spojuje dialog s rodicem, preposilaji se hodnoty, ktere se vratily ye serveru
 *      cancel - funkce, ktera spojuje dialog s rodicem, zruseni a ukonceni dialogu
 *      open - zda je dialog otevreny nebo zavreny
 *      title - titulek dialogu
 *
 * Autor: Sara Skutova
 *
 * */
function SurveyAnswerDialog(props) {

    const classes = useStyles();

    const [questionIndex, setQuestionIndex] = useState(0);
    const [questionsValues, setQuestionsValues] = useState([]);
    const [sendingData, setSendingData] = useState(false);

    const source = useRef(axios.CancelToken.source());

    const dispatch = useDispatch();

    /**
     * Vycisteni dialogu
     * */
    const cleanDialog = () => {
        setQuestionIndex(0);
        setQuestionsValues([]);
        setSendingData(false);

    };

    /**
     * Odeslani dat na server - jak uzivatele odpovidali
     * */
    async function sendData(newSurveyInfo) {
        try {
            const res = await axios.post(`api/nprr/project/${props.project}/survey/${props.survey.id}/user/${props.user}`, newSurveyInfo, {cancelToken: source.current.token});
            cleanDialog();
            props.approval(res.data);
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }

    }

    /**
     * Vytvoreni dat, ktere mohu odesla na server
     * */
    const createData = (survey, data) => {
        return survey.otazky.map((otazka, index )=> {
            return {
                otazkaDOO: {
                    "id": otazka.id
                },
                odpovedDOO: {
                    "id": data[index]
                }
            }

        })
    };

    const handleChangeIndex = (index) => {
        setQuestionIndex(index);
    };

    /**
     * Presouvani se v dotazniku na nastedujici otazku - pokud se jedna o posledni, tak se talcitko meni na odeslani hodnot
     * */
    const handleNext = () => {
        if (questionIndex !== props.survey.otazky.length - 1) {
            setQuestionIndex(prevState => prevState + 1);
        } else { //jedna se o posledni, odeslat data na server a vratit do okna, kde se to hodi do reduxu
            setSendingData(true);
            const newData = createData(props.survey, questionsValues);
            sendData(newData);
        }
    };

    /**
     * Presouvan se v dotazniku zpet na predchazejici otazku
     * */
    const handleBack = () => {
        setQuestionIndex(prevState => prevState - 1);
    };

    /**
     * Zruseni odpovidani - uzavreni dilaogu
     * */
    const handleCancel = () => {
        cleanDialog();
        props.cancel();
    };

    /**
     * Reakce na zmeny hodnot odpovedi
     * */
    const handleChangeAnswer = (index, event) => {
        const helpArray = [...questionsValues];
        const num = parseInt(event.target.value);
        helpArray.splice(index, 1, num);

        setQuestionsValues(helpArray);

    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

/*    <Typography key={odpoved.id} variant="body2">
        {odpoved.textOdpovedi}
    </Typography>*/

    /**
     * Komponenta otazky, je to vztahnute, at se to neplete vevnitr
     * */
    const Question = (props) => (
        <React.Fragment>
            <TextTitle title={`${props.index + 1}/${props.all} ${props.nazev}`}/>
            <div className={classes.radioButtons}>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="odpovedi" name="odpovedi" value={questionsValues[props.index]} onChange={(event) => handleChangeAnswer(props.index, event)}>
                        {
                            props.odpovedi.map((odpoved, index) => (
                                <FormControlLabel key={odpoved.id} value={odpoved.id} control={<Radio />} label={odpoved.textOdpovedi} />
                            ))
                        }
                    </RadioGroup>
                    </FormControl>
            </div>
        </React.Fragment>
    );


    return(
        <Dialog maxWidth="md"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
                open={props.open}
                scroll='paper'
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent dividers >
                <SwipeableViews index={questionIndex} onChangeIndex={handleChangeIndex}>
                    {
                        props.survey.otazky.map((otazka, index) => (
                            <Question key={otazka.id}
                                      index={index}
                                      nazev={otazka.textOtazky}
                                      all={props.survey.otazky.length}
                                      odpovedi={otazka.odpovedi}
                            />
                        ))
                    }
                </SwipeableViews>
            </DialogContent>
            <DialogActions>
                <Button color="primary"
                        onClick={handleCancel}
                >
                    Zrušit
                </Button>
                <Button color="primary"
                        onClick={handleBack}
                        disabled={questionIndex === 0}>
                    Zpět
                </Button>
                {/**https://stackoverflow.com/questions/2672380/how-do-i-check-in-javascript-if-a-value-exists-at-a-certain-array-index/2672411*/}
                <Button color="primary"
                        onClick={handleNext}
                        disabled={questionsValues[questionIndex] == null || sendingData}
                >
                    {questionIndex === props.survey.otazky.length - 1 ? 'Odeslat' : 'Další'}
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default SurveyAnswerDialog;