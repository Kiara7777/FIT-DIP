import { format, parseISO, isValid} from 'date-fns';
import csLocale from "date-fns/locale/cs";
import React, {useEffect, useRef, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {Paper} from "@material-ui/core";
import MyHeaderButtons from "../../MyHeaderButtons";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector, useDispatch} from "react-redux";
import {changeDeadline, changeProject, setErrorCode} from "../../../actions";
import axios from "axios";
import TextTitle from "../../TextTitle";
import {vOProjMPRojUAndAdminAndFailure, vProjActive} from "../../../security/secureComponents";
import {trackPromise} from "react-promise-tracker";
import * as Yup from "yup";
import {project} from "../../constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

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

    deadline: {
        marginLeft: theme.spacing(2)
    }

}));

/**
 * Komponenta pro zobrazeni zacatecniho a koncoveho datumu projektu. Umoznuje take jejich zmenu a nasledne odeslani zmeny
 *  na server. Pri zmene take aktualizuje informace ve stavech REDUXU.
 *  Jako date picker se vyuziva knihovna KeyboardDatePicker
 *
 *  Autor: Sara Skutova
 *
 * */
function ProjectDate() {

    const classes = useStyles();

    //save hodnoty se pouzivaji pokud uzivatel zrusi provadeni uprav
    const [edit, setEdit] = useState(false);
    const [isFirst, setIsFirst] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [startDateSave, setStartDateSave] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endDateSave, setEndDateSave] = useState(new Date());

    //urcuji errory datumu
    const [errorStart, setErrorStart] = useState(false);
    const [errorStartText, setErrorStartText] = useState("");
    const [errorEnd, setErrorEnd] = useState(false);
    const [errorEndText, setErrorEndText] = useState("");
    const [errorPred, setErrorPred] = useState(false);

    const placeholder = format(new Date(), "d. M. yyyy");
    const errorPredText = "Datum ukončení nemůže být dříven než datum začátku";

    const validDatumy = Yup.object( {
        start: Yup.date(),
        konec: Yup.date().min(Yup.ref('start')),
    });

    const projectData = useSelector(state => state.ProjectInfo);

    const source = useRef(axios.CancelToken.source());

    const dispatch = useDispatch();


    /**
     * Pokus o transformovani dat ze servoveho datumu - ten je v podobe stringu na datum ktere muze vyuzivaat kalendarova komponenta.
     * Pokud se nepodari, tak se vrati dnesni datum.
     * */
    function transformFrom(serverDate) {
        const date = parseISO(serverDate);

        if(isValid(date))
            return date;
        else
            return new Date();

/*        if (isValid(date)) {
            const klientDate = format(date, "d.M.yyyy");
            return klientDate;
        }
        else
            return null;*/
    }

    /**
     * Klientstou podobu datumu prevede na pozadovany string, ktery pozaduje server
     * */
    function transformTo(klientDate) {
        return format(klientDate, "yyyy-MM-dd")

    }

    /**
     * Nove datumy pripoji k parametrum projektu. To se map zasila jako celek.
     * */
    function saveDatatoProject(start, end) {
        const newProject = {
            ...projectData
        };

        newProject["start"] = start; //snad to funguje, DLE KONZOLE FUNGUJE
        newProject["konec"] = end; //snad to funguje, DLE KONZOLE FUNGUJE
        return newProject;

    }

    /**
     * Odeslani novych dat pojektu na server. Zaroven se take updatuji informace v REDUX store - informace o projektu,
     * koncove datum pro deadline.
     * */
    async function sendUpdate(newProject) {
        const data = {...newProject};
        delete data.dotaznikProjektu;
        try {
            await axios.post(project.postProject, data, {cancelToken: source.current.token});
        }catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }


    /**
     * Handle pro tlacitko editu. Kdyz uzivatel chce editovat danou komponentu.
     * */
    const handleEditClick = () => {
        const newS = transformFrom(projectData["start"]);
        const newE = transformFrom(projectData["konec"]);
        setStartDate(newS);
        setStartDateSave(newS);
        setEndDate(newE);
        setEndDateSave(newE);
        setIsFirst(false);
        setEdit(true);
    };

    /**
     * Handle kdyz se potvrdi zmena dane komponenty. Zmena se potrvdi i v Save hodnotach.
     * Data se transformuji do pozadovane podoby.
     * Datumy se pripoji k projektovym informacim.
     * Projektova data se odeslou na server.
     * Ukonci se edit.
     * */
    const handleEditSave = () => {

        validDatumy.isValid({
            start: startDate,
            konec: endDate
        }).then(function (valid) {
            if (valid) {
                setErrorEnd(false);
                setErrorPred(false);
                setStartDateSave(startDate);
                setEndDateSave(endDate);
                const start = transformTo(startDate);
                const end = transformTo(endDate);
                const newProject = saveDatatoProject(start, end);
                trackPromise(sendUpdate(newProject));
                dispatch(changeProject(newProject));
                dispatch(changeDeadline(newProject.konec));
                setIsFirst(true);
                setEdit(false);
            } else {
                setErrorEnd(true);
                setErrorPred(true);
            }
        })

    };

    /**
     * Datumy se obnovi ze Save hodnot.
     * */
    const handleEditNo = () => {
        setErrorEnd(false);
        setErrorPred(false);
        setStartDate(startDateSave);
        setEndDate(endDateSave);
        setIsFirst(true);
        setEdit(false);
    };


    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    // definovani pristupu ke komponenty, zobrazuje se jenom adminovi a managerovi daneho projektu a resitelum daneho p.
    // + alternativni kompoenta, pro ty co nesplnuji podminky
    const Title = () => (<TextTitle title="Datumy projektu" />);
    const HeaderButton = () => (<MyHeaderButtons title="Datumy projektu"
                                                 edit={edit}
                                                 onSave={handleEditSave}
                                                 onNo={handleEditNo}
                                                 onEdit={handleEditClick}/>);


    const VOPRojMProjUAdmin = vOProjMPRojUAndAdminAndFailure(HeaderButton, Title);
    const FinalComp = vProjActive(VOPRojMProjUAdmin, Title);
    ///////////////////////////////////////


    return(
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={csLocale}>
            <Paper className={classes.root}>
                <FinalComp />
                <Grid container direction="column" justify="space-around" alignItems="stretch" >
                    <Grid item>
                        <KeyboardDatePicker value={isFirst ? transformFrom(projectData["start"]) : startDate}
                                            format="dd. MM. yyyy"
                                            name="start"
                                            placeholder={placeholder}
                                            onChange={date => setStartDate(date)}
                                            margin="normal"
                                            label="Začátek"
                                            disabled={!edit}
                                            fullWidth
                                            helperText={errorStartText}
                                            error={errorStart}
                                            onError={error => {
                                                if(error !== "") {
                                                    setErrorStart(true);
                                                    setErrorStartText("Neplatné datum");
                                                }
                                                else {
                                                    setErrorStart(false);
                                                    setErrorStartText("");
                                                }
                                            }}
                                            />

                    </Grid>
                    <Grid item>
                        <KeyboardDatePicker value={isFirst ? transformFrom(projectData["konec"]) : endDate}
                                            format="dd. MM. yyyy"
                                            name="end"
                                            placeholder={placeholder}
                                            onChange={date => setEndDate(date)}
                                            margin="normal"
                                            label="Konec"
                                            disabled={!edit}
                                            fullWidth
                                            helperText={errorEndText || (errorPred && errorPredText)}
                                            error={errorEnd || errorPred}
                                            onError={error => {
                                                if(error !== "") {
                                                    setErrorEnd(true);
                                                    setErrorEndText("Neplatné datum");
                                                }
                                                else {
                                                    setErrorEnd(false);
                                                    setErrorEndText("");
                                                }
                                            }}
                                            />

                    </Grid>
                </Grid>

            </Paper>
        </MuiPickersUtilsProvider>
    );
}

export default ProjectDate;