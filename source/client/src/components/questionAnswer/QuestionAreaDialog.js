import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid
} from "@material-ui/core";
import {Form, Formik} from "formik";
import {TextItem} from "../../spolecneFunkce";
import * as Yup from "yup";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import ProgressButton from "../ProgressButton";
import {setErrorCode} from "../../actions";
import {useDispatch} from "react-redux";
import {question} from "../constants";

const addInitialValues = {
    nazev: ""
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

    field: {
    }
}));

/**
 * Dialog pro pridani/editaci oblasti otazky, pouziva se pri tabulkce Oblasti otazek
 * pouziva se v nem formik
 *
 * props:
 *      edit - editace nebo tvorba
 *      questionArea - objekt odpovedi
 *      handleZavreno - spoejni s rodicem, reakce na uzavreni dialogu - zruseni ale i potvrzeni
 *      open - otevreni/zavreni dialogu
 *      title - titulek dialogu
 *
 * Autor: Sara Skutova
 * */
function QuestionAreaDialog(props) {

    const classes = useStyles();

    const [initialValues, setInitialValues] = useState(addInitialValues);

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        nazev: Yup.string().required("Název oblasti otázky je vyžadován"),
    });

    /**
     * Pro transformaci dat do podoby jake je potrebuju pro odeslani na server
     * */
    //pro editaci, role obsahuji i pole s id uzivateli s danou roli, API to nema rado, musi se to opravit
    function transformData(data) {
        if (props.edit) { //edituje se, data budou mit id
            return {
                id: props.questionArea.id,
                nazev: data.nazev,

            }
        } else { //nova role
            return {
                nazev: data.nazev,
            }
        }
    }

    /**
     * Odeslani dat na server
     * */
    async function sendQuestionArea(questionArea) {
        try {
            const response = await axios.post(question.postQuestionArea, questionArea, {cancelToken: source.current.token});
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
            props.handleZavreno(data, props.questionArea.tableData.id, true);
        else
            props.handleZavreno(data, undefined, true);
    };

    /**
     * Handler pro potvrzeni formulare, vyvola se vzdy pri tlacitku Dalsi. Jenom kdyz projde celou validaci uspesne.
     * */
    const handleOnSubmit = (values) => {
        const newData = transformData(values);
        sendQuestionArea(newData);
    };

    /**
     * Z prijatych dat sestavi data do podoby jakou je chceme ve formiku
     * */
    const setInitialData = (data) => {
        return {
            nazev: data.nazev
        }
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (props.open === true) {
            if (props.edit) {//data se edituji
                const data = setInitialData(props.questionArea);
                setInitialValues(data);
            } else { //nova role
                setInitialValues(addInitialValues);
            }
        }
    }, [props.open, props.edit, props.questionArea]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

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
                                    {/* -------------------------- NAZEV OBLASTI OTAZKY -------------------------- */}
                                    <TextItem {...formik} nameLabel="Název oblasti otázky *" name="nazev" disabled={false}/>
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

export default QuestionAreaDialog;