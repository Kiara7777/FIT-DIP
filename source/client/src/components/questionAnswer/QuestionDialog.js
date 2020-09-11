import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Collapse,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider, FormControl, FormHelperText,
    Grid, InputLabel, MenuItem, Select,
    IconButton
} from "@material-ui/core";
import {Field, FieldArray, Form, Formik} from "formik";
import {Alert, AlertTitle} from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import {SelectItem, TextItem} from "../../spolecneFunkce";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import * as Yup from "yup";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import ProgressButton from "../ProgressButton";
import {setErrorCode} from "../../actions";
import {useDispatch} from "react-redux";
import {question} from "../constants";

const addInitialValues = {
    textOtazky: "",
    oblastOtazky: "",
    odpovedi: []


};


/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3),
        width: "100%"
    },

    questionDivider: {
        marginTop: 20,
        marginBottom: 20,
    },

    divider: {
        marginBottom: 20,
    },

    selectItem: {
        display: "flex"
    },

    buttonRemove: {
        marginLeft: "auto"
    }
}));

/**
 * Komponenta pomocci ktere se vybira odpoved pro otazku, umoznuje take odpoved smazat
 * */
const SelectItemButton = (props) => {
    const labelText = `vyber${props.name}`;
    return (
        <Grid item>
            <div className={props.classes.selectItem}>
                <FormControl fullWidth error={props.touched[props.name] !== undefined && props.errors[props.name] !== undefined} disabled={props.disabled}>
                    <InputLabel id={labelText}>{props.nameLabel}</InputLabel>
                    <Field name={props.name} as={Select} labelId={labelText}>
                        <MenuItem value={""} disabled>{props.nullName}</MenuItem>
                        {Object.entries(props.selectValues).map(val => (
                            <MenuItem key={parseInt(val[0])} value={parseInt(val[0])}>
                                {val[1]}
                            </MenuItem>
                        ))}
                    </Field>
                    <FormHelperText>{props.touched[props.name] && props.errors[props.name]}</FormHelperText>
                </FormControl>
                <Tooltip title="Odstranit odpověď">
                    <IconButton className={props.classes.buttonRemove} onClick={() => props.arrayHelpers.remove(props.index)}>
                        <DeleteOutlineIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        </Grid>

    );
};


/**
 * Dialog pro pridani/editaci otazky, pouziva se pri tabulkce Otazky
 * pouziva se v nem formik
 *
 * props:
 *      edit - editace nebo tvorba
 *      question - objekt otazky
 *      handleZavreno - spoejni s rodicem, reakce na uzavreni dialogu - zruseni ale i potvrzeni
 *      open - otevreni/zavreni dialogu
 *      title - titulek dialogu
 *      answers - seznam (pole) odpovedi
 *      oblasti - seznam/pole oblasti otazek
 *
 *
 * Autor: Sara Skutova
 * */
function QuestionDialog(props) {

    const classes = useStyles();

    const [initialValues, setInitialValues] = useState(addInitialValues);
    const [alert, setAlert] = useState(false);
    const [varovani, setVarovani] = useState(false);
    const [oblasti, setOblasti] = useState({});
    const [answers, setAnswers] = useState({});

    const [alertDupl, setAlertDulp] = useState(false);
    const duplMsg = "Odpovědi se v otázce nesmí opakovat!";

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        textOtazky: Yup.string().required("Text otázky je vyžadován"),
        oblastOtazky: Yup.number().typeError("Oblast otázky musí být vybrána")
            .required("Oblast otázky musí být vybrána"),
        odpovedi: Yup.array().of(Yup.number().typeError("Odpoved musí být vybrána").required("Odpoved musí být vybrána"))
            .required("Otázka musí mít odpovědi")
            .min(2, "Otázka musí mít minimálně 2 odpovědi")
    });

    /**
     * Pro transformaci dat do podoby jake je potrebuju pro odeslani na server
     * */
    //u editace se musi pridat id otazky, nebudu brat v potaz zda tam neco pred tim bylo, odpovedi jde jenom vybirat ne editovat
    function transformData(data) {
        if (props.edit) {
            return {
                id: props.question.id,
                textOtazky: data.textOtazky,
                oblastOtazky: {
                    id: data.oblastOtazky
                },
                odpovedi: data.odpovedi.map((odpoved, index ) => {
                    return {
                        odpoved: {
                            id: odpoved
                        },
                        poradi: index + 1
                    }
                })
            }
        } else {
            return {
                textOtazky: data.textOtazky,
                oblastOtazky: {
                    id: data.oblastOtazky
                },
                odpovedi: data.odpovedi.map((odpoved, index ) => {
                    return {
                        odpoved: {
                            id: odpoved
                        },
                        poradi: index + 1
                    }
                })
            }
        }
    }

    /**
     * Odeslani dat na server
     * */
    async function sendQuestion(questionData) {
        try {
            const response = await axios.post(question.postQuestion, questionData, {cancelToken: source.current.token});
            handleApproval(response.data);
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }


    /**
     * Vycisti dialog a vsechny zavisle stavy
     * */
    const cleanDialog = () => {
        setInitialValues(addInitialValues);
        setAlert(false);
    };

    /**
     * Handle pro zruseni dialogu - zavre ho
     * */
    const handleCancel = () => {
        cleanDialog();
        props.handleZavreno(undefined, undefined, false);
    };

    /**
     * Handle pro potvrzeni a ulozeni dat z dialogu - bude se to posilat na server
     * */
    const handleApproval = (data) => {
        cleanDialog();
        if (props.edit)
            props.handleZavreno(data, props.question.tableData.id, true);
        else
            props.handleZavreno(data, undefined, true);
    };

    /**
     * Funkcke pro overeni jestli se tam nachazeji duplikaty odpovedi, kazda odpoved muze byt pouye jednou
     * https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
     * */
    const hasDuplicates = (odpovedi) => {
        return (new Set(odpovedi)).size !== odpovedi.length;
    };

    /**
     * Handler pro potvrzeni formulare, vyvola se vzdy pri tlacitku Dalsi. Jenom kdyz projde celou validaci uspesne.
     * */
    const handleOnSubmit = (values, big) => {

        if(hasDuplicates(values.odpovedi)) {
            big.setSubmitting(false);
            setVarovani(duplMsg);
            setAlertDulp(true);
        }
        else {
            setAlertDulp(false);
            const newData = transformData(values);
            sendQuestion(newData);
        }
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////

    useEffect(() => {
        /**
         * Z prijatych dat sestavi data do podoby jakou je chceme ve formiku
         * */
        const setInitialData = (data) => {
            return {
                textOtazky: data.textOtazky,
                oblastOtazky: data.oblastOtazky.id,
                odpovedi: props.question.odpovedi.map(odpoved => odpoved.id)
            }
        };

        if (props.open === true) {
            if (props.edit) {//data se edituji
                const data = setInitialData(props.question);
                setInitialValues(data);
            } else {
                setInitialValues(addInitialValues);
            }

            setAnswers(props.answers);
            setOblasti(props.oblasti);
        }
    }, [props.open, props.edit, props.question, props.answers, props.oblasti]);


    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

/*    formik.values.odpovedi.map((odpoved, item) => (
        <SelectItem {...formik} nameLabel="Výběr odpovědi" name={`odpovedi[${index}]`} nullName="Dostupné odpovědi" selectValues={answers} disabled={false}/>
    ))*/

    return(
        <Dialog maxWidth="sm"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
                open={props.open}
                scroll='paper'
        >
            <DialogTitle>{props.title}</DialogTitle>
            <Formik enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleOnSubmit}

            >
                {/*Ten styl u Form, je reseni problemu, kdy se dialog spatne scrolloval - hlavicka a paticka mely byt fixni, ale ten form zpusoboval, ze se cela
                komponenta scrollovala, fix prevzatej ze stranek gitu material-ui: https://github.com/mui-org/material-ui/issues/13253*/}
                {formik => (
                    <Form style={{
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <DialogContent dividers >
                            <Container className={classes.container} maxWidth="lg">
                                <Grid container direction="column" justify="space-around" alignItems="stretch" spacing={5}>
                                    {/* -------------------------- NAZEV -------------------------- */}
                                    <TextItem {...formik} nameLabel="Text otázky *" name="textOtazky" disabled={false}/>
                                    {/* -------------------------- BEZPECNOSTNI ROLE -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr oblasti otázky *" name="oblastOtazky" nullName="Dostupné oblasti otázky" selectValues={oblasti} disabled={false}/>
                                </Grid>
                                <Divider className={classes.questionDivider} />
                                <Collapse in={alert}>
                                    <Alert severity="error" action={
                                        <IconButton color="inherit" size="small" onClick={() => {setAlert(false); setAlertDulp(false)}}>
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    >
                                        <AlertTitle>Chyba</AlertTitle>
                                        {varovani}
                                    </Alert>
                                </Collapse>
                                <Grid container direction="column" justify="space-around" alignItems="stretch" spacing={5}>
                                    <FieldArray name="odpovedi"
                                                render={arrayHelpers => {
                                                    if (typeof formik.errors.odpovedi === 'string') {
                                                        setVarovani(formik.errors.odpovedi);
                                                        setAlert(true);
                                                    } else if (Array.isArray(formik.errors.odpovedi)) {
                                                        setVarovani("Vsechny odpovědi musí být vybrané!");
                                                        setAlert(true)
                                                    } else {
                                                        if(alertDupl) {
                                                            setVarovani(duplMsg);
                                                            setAlert(true);
                                                        }
                                                        else
                                                            setAlert(false);
                                                    }
                                                    return (
                                                    <React.Fragment>
                                                        {
                                                            formik.values.odpovedi.map((odpoved, index) => (
                                                                <SelectItemButton key={index}
                                                                                  {...formik}
                                                                                  nameLabel="Výběr odpovědi"
                                                                                  name={`odpovedi.${index}`}
                                                                                  nullName="Dostupné odpovědi"
                                                                                  selectValues={answers}
                                                                                  disabled={false}
                                                                                  classes={classes}
                                                                                  arrayHelpers={arrayHelpers}
                                                                                  index={index}
                                                                />
                                                            ))
                                                        }
                                                        <Grid item>
                                                            <div className={classes.selectItem}>
                                                                <Tooltip title="Přidat odpověď">
                                                                    <IconButton className={classes.buttonRemove}
                                                                                onClick={() => arrayHelpers.push('')}>
                                                                        <AddBoxIcon/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        </Grid>
                                                    </React.Fragment>
                                                    )
                                                }} />
                                </Grid>
                            </Container>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancel} color="primary">
                                Zrušit
                            </Button>
                            <ProgressButton disabled={formik.isSubmitting} text="Uložit"/>
                        </DialogActions>
                    </Form>

                )}

            </Formik>
        </Dialog>
    );
}

export default QuestionDialog;