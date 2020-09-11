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
import {SelectItem, TextItem} from "../../spolecneFunkce";
import * as Yup from "yup";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import ProgressButton from "../ProgressButton";
import {setErrorCode} from "../../actions";
import {useDispatch} from "react-redux";
import {risk} from "../constants";

const addInitialValues = {
    nazev: "",
    popis: "",
    mozneReseni: "",
    kategorie: "",
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
 * Dialog pro pridani/editaci rizik do centralniho registru, pouziva se pri tabulkce Registr rizik
 * pouziva se v nem formik
 *
 * props:
 *      edit - editace nebo tvorba
 *      risk - objekt rizika
 *      handleZavreno - spoejni s rodicem, reakce na uzavreni dialogu - zruseni ale i potvrzeni
 *      open - otevreni/zavreni dialogu
 *      title - titulek dialogu
 *      category - seznam/pole moznzch kategorii rizika
 *
 * Autor: Sara Skutova
 * */
function RiskRegisterDialog(props) {

    const classes = useStyles();

    const [initialValues, setInitialValues] = useState(addInitialValues);
    const [category, setCategory] = useState({});

    const source = useRef(axios.CancelToken.source());

    const dispatch =useDispatch();

    const validationSchema = Yup.object({
        nazev: Yup.string().required("Název rizika je vyžadován"),
        popis: Yup.string().required("Popis rizika je vyžadován"),
        kategorie: Yup.number().typeError("Kategorie musí být vybrána")
        .required("Kategorie musí být vybrána")
    });

    //transformovat  data do podoby jake se odeslaji na server
    function transformData(risk) {
        if (props.edit) { //edituje se, data budou mit id
            return  {
                id: props.risk.id,
                nazev: risk.nazev,
                popis: risk.popis,
                mozneReseni: risk.mozneReseni,
                kategorie: {
                id: risk.kategorie
            }
        };
        } else { //nove riziko
            return {
                nazev: risk.nazev,
                popis: risk.popis,
                mozneReseni: risk.mozneReseni,
                kategorie: {
                    id: risk.kategorie
                }
            };
        }
    }

    /**
     * Odeslani dat na server
     * */
    async function sendRisk(riskData) {
        try {
            const response = await axios.post(risk.postRisk, riskData, {cancelToken: source.current.token});
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
            props.handleZavreno(data, props.risk.tableData.id, true);
        else
            props.handleZavreno(data, undefined, true);
    };

    /**
     * Handler pro potvrzeni formulare, vyvola se vzdy pri tlacitku Dalsi. Jenom kdyz projde celou validaci uspesne.
     * */
    const handleOnSubmit = (values) => {
        const newData = transformData(values);
        sendRisk(newData);
    };

    /**
     * Z prijatych dat sestavi data do podoby jakou je chceme ve formiku
     * */
    const setInitialData = (data) => {
        return {
            nazev: data.nazev,
            popis: data.popis,
            mozneReseni: data.mozneReseni,
            kategorie: data.kategorie
        }
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (props.open === true) {
            if (props.edit) {//data se edituji
                const data = setInitialData(props.risk);
                setInitialValues(data);
            } else { //nova role
                setInitialValues(addInitialValues);
            }

            setCategory(props.category);
        }
    }, [props.open, props.edit, props.risk, props.category]);


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
                                    {/* -------------------------- NAZEV -------------------------- */}
                                    <TextItem {...formik} nameLabel="Název *" name="nazev" disabled={false}/>
                                    {/* -------------------------- POPIS-------------------------- */}
                                    <TextItem {...formik} nameLabel="Popis *" name="popis" disabled={false}/>
                                    {/* -------------------------- MOZNE RESENI-------------------------- */}
                                    <TextItem {...formik} nameLabel="Možné řešení" name="mozneReseni" disabled={false}/>
                                    {/* --------------------------KATEGORIE -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr kategorie *" name="kategorie" nullName="Dostupné kategorie" selectValues={category} disabled={false}/>
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

export default RiskRegisterDialog;