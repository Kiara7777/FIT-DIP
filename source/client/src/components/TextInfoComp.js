import React, {useEffect, useRef, useState} from "react";
import {InputBase, Paper, Typography} from "@material-ui/core";
import MyHeaderButtons from "./MyHeaderButtons";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector, useDispatch} from "react-redux";
import {changeProject, setErrorCode} from "../actions";
import axios from "axios";
import TextTitle from "./TextTitle";
import {vOProjMPRojUAndAdminAndFailure, vProjActive} from "../security/secureComponents";
import {trackPromise} from "react-promise-tracker";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import * as Yup from "yup";
import clsx from "clsx";
import {project} from "./constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
        height: "100%"
    },

    input: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.primary.light,
        padding: theme.spacing(1)
    },

    error: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.error.main,
        padding: theme.spacing(1)
    },

    newLines: {
        whiteSpace: "pre-line"

    }

}));


/**
 * Komponenta pro zobrazovani a editaci textove informace. Momentalne funguje pro: nazev a popis projektu.
 * Data se nacitaji/aktualizujji z REDUX stavu
 * props:
 * title = pro to co se ma zobrazit nahore v nadpisu
 * type = co je to za atribut projektu, at vim co potrebuju zmenit
 *
 * Autor: Sara Skutova
 * */
function TextInfoComp(props) {

    const classes = useStyles();

    const [edit, setEdit] = useState(false);
    const [isFirst, setIsFirst] = useState(true);
    const [value, setValue] = useState("");
    const [valueSave, setValueSave] = useState("");
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");


    const projectData = useSelector(state => state.ProjectInfo);
    const dispatch = useDispatch();

    const source = useRef(axios.CancelToken.source());

    const validationSchema = Yup.object({
        text: Yup.string().required()
    });

    /**
     * Funkce ktera vytvori novy objekt projektu a zmeni v nem pozadovanou vlastnost
     * */
    function saveDatatoProject(newValue) {
        const newProject = {
            ...projectData
        };

        newProject[props.type] = newValue; //snad to funguje, DLE KONZOLE FUNGUJE
        return newProject;

    }

    /**
     * Funkce ktera odesle na server aktualizovany objekt projektu
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
     * Handle ma na starosti reakci na zmenu textu jak se pise
     * */
    const handleChangeText = (event) => {
        setValue(event.target.value);
        setError(false);
        setErrorText("");
    };

    /**
     * Handle pro reakci na stisk tlacitka pro edit, defakto se provede inicializace pomocnych poli z hodnot z reduxu
     * */
    const handleEditClick = () => {
        setValue(projectData[props.type]);
        setValueSave(projectData[props.type]);

        setIsFirst(false);
        setEdit(true);
    };

    /**
     * Handle pro potvrzeni zmeny. Prepise se save hodnota. A nova hodnota projektu se odedsle na server. A ukonci se
     * editace.
     * */
    const handleEditSave = () => {

        validationSchema.isValid({
            text: value
        }).then(function(valid) {
            if (valid) {
                setError(false);
                setErrorText("");
                setValueSave(value);
                const newData = saveDatatoProject(value);
                trackPromise(sendUpdate(newData));
                dispatch(changeProject(newData));
                setIsFirst(true);
                setEdit(false);
            } else {
                setError(true);
                setErrorText(props.errorText);
            }
        });
    };

    /**
     * Zrusi se upravena hodnota vrati se puvodni
     * */
    const handleEditNo = () => {
        setError(false);
        setErrorText("");
        setValue(valueSave);
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

    const Title = () => (<TextTitle title={props.title} />);
    const HeaderButton = () => (<MyHeaderButtons title={props.title}
                                                 edit={edit}
                                                 onSave={handleEditSave}
                                                 onNo={handleEditNo}
                                                 onEdit={handleEditClick}/>);


    const VOPRojMProjUAdmin = vOProjMPRojUAndAdminAndFailure(HeaderButton, Title);
    const FinalComp = vProjActive(VOPRojMProjUAdmin, Title);

/*    <FormControl error={error} fullWidth>
        <InputBase className={classes.input}
                   value={ isFirst ? projectData[props.type] : value}
                   multiline
                   fullWidth
                   onChange={handleChangeText}
                   aria-describedby="component-error-text"
        />
        <FormHelperText id="component-error-text">{setErrorText}</FormHelperText>
    </FormControl>*/

    return(
        <Paper className={classes.root}>
            <FinalComp />
            {
                edit ?
                        <FormControl error={error} fullWidth>
                            <InputBase className={clsx(classes.input, error && classes.error)}
                                       value={ isFirst ? projectData[props.type] : value}
                                       multiline
                                       fullWidth
                                       onChange={handleChangeText}
                                       aria-describedby="component-error-text"
                            />
                            <FormHelperText id="component-error-text">{errorText}</FormHelperText>
                        </FormControl>
                    :
                    <Typography className={classes.newLines}>{projectData[props.type]}</Typography>
            }
        </Paper>
    );


}

export default TextInfoComp;
