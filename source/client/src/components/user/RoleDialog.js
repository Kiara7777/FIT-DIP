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
import {useDispatch} from "react-redux";
import {setErrorCode} from "../../actions";
import {user} from "../constants";

const addInitialValues = {
    nazev: "",
    securityRole: ""
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
 * Dialog pro pridani/editaci roli, pouziva tabulka Role
 * pouziva se v nem formik
 *
 * props:
 *      edit - editace nebo tvorba
 *      role - objekt role
 *      secRoles - seznam/pole bezpecnostnich roli
 *      handleZavreno - spoejni s rodicem, reakce na uzavreni dialogu - zruseni ale i potvrzeni
 *      open - otevreni/zavreni dialogu
 *      title - titulek dialogu
 *
 * Autor: Sara Skutova
 * */
function RoleDialog(props) {

    const classes = useStyles();

    const [initialValues, setInitialValues] = useState(addInitialValues);
    const [secRoles, setSecRoles] = useState({});

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        nazev: Yup.string().required("Název role je vyžadován"),
        securityRole: Yup.number().typeError("Bezpečnostní role musí být vybrána")
            .required("Bezpečnostní role musí být vybrána")
    });

    /**
     * Pro transformaci dat do podoby jake je potrebuju pro odeslani na server
     * */
    //pro editaci, role obsahuji i pole s id uzivateli s danou roli, API to nema rado, musi se to opravit
    function transformData(data) {
        if (props.edit) { //edituje se, data budou mit id
            return {
                id: props.role.id,
                nazev: data.nazev,
                securityRole: {
                    id: data.securityRole
                }

            }
        } else { //nova role
            return {
                nazev: data.nazev,
                securityRole: {
                    id: data.securityRole
                }
            }
        }
    }

    /**
     * Odeslani dat na server
     * */
    async function sendRole(role) {
        try {
            const response = await axios.post(user.postRole, role, {cancelToken: source.current.token});
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
            props.handleZavreno(data, props.role.tableData.id, true);
        else
            props.handleZavreno(data, undefined, true);
    };

    /**
     * Handler pro potvrzeni formulare, vyvola se vzdy pri tlacitku Dalsi. Jenom kdyz projde celou validaci uspesne.
     * */
    const handleOnSubmit = (values) => {
        const newData = transformData(values);
        sendRole(newData);
    };

    /**
     * Z prijatych dat sestavi data do podoby jakou je chceme ve formiku
     * */
    const setInitialData = (data) => {
        return {
            nazev: data.nazev,
            securityRole: data.securityRole
        }
    };


    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (props.open === true) {
            if (props.edit) {//data se edituji
                const data = setInitialData(props.role);
                setInitialValues(data);
            } else { //nova role
                setInitialValues(addInitialValues);
            }

            setSecRoles(props.secRoles);
        }
    }, [props.open, props.edit, props.role, props.secRoles]);


    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);

    ///////////////////////////////////////////////////////////////////////////////////////////

    return(
        <React.Fragment>
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
                                    {/* -------------------------- BEZPECNOSTNI ROLE -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr bezpečnostní role *" name="securityRole" nullName="Dostupné bezpečnostní role" selectValues={secRoles} disabled={false}/>
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
        </React.Fragment>
    );
}

export default RoleDialog;