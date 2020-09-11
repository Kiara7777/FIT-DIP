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
import {user} from "../constants";

const addInitialValues = {
    login: "",
    passwd: "",
    email: "",
    nazev: "",
    role: ""
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
 * Dialog pro pridani/editaci uzivatele, pouziva tabulka Uzivatele
 * pouziva se v nem formik
 *
 * props:
 *      edit - editace nebo tvorba
 *      user - objekt uzivatele
 *      roles - seznam/pole roli
 *      handleZavreno - spoejni s rodicem, reakce na uzavreni dialogu - zruseni ale i potvrzeni
 *      open - otevreni/zavreni dialogu
 *      title - titulek dialogu
 *
 * Autor: Sara Skutova
 * */
function UserDialog(props) {

    const classes = useStyles();

    const [initialValues, setInitialValues] = useState(addInitialValues);
    const [roles, setRoles] = useState({});

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        login: Yup.string().required("Přihlašovací login uživatele je vyžadován"),
        passwd: Yup.string().required("Heslo uživatele je vyžadováno"),
        email: Yup.string().email("Nesprávný formát emailu")
            .required("Email uzivatele je vyžadován"),
        nazev: Yup.string().required("Název role je vyžadován"),
        role: Yup.number().typeError("Role musí být vybrána")
            .required("Role musí být vybrána")
    });

    /**
     * Pro transformaci dat do podoby jake je potrebuju pro odeslani na server
     * */
    //transformovat  data do podoby jake se odeslaji na server
    function transformData(user) {
        if (props.edit) { //edituje se, data budou mit id
            return {
                id: props.user.id,
                login: user.login,
                passwd: user.passwd,
                email: user.email,
                nazev: user.nazev,
                role: {
                    id: user.role
                }
            }
        } else { //novy uzivatel
            return {
                login: user.login,
                passwd: user.passwd,
                email: user.email,
                nazev: user.nazev,
                role: {
                    id: user.role
                }
            };
        }
    }

    /**
     * Odeslani dat na server
     * */
    async function sendUser(userData) {
        try {
            const response = await axios.post(user.postUser, userData, {cancelToken: source.token});
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
            props.handleZavreno(data, props.user.tableData.id, true);
        else
            props.handleZavreno(data, undefined, true);
    };

    /**
     * Handler pro potvrzeni formulare, vyvola se vzdy pri tlacitku Dalsi. Jenom kdyz projde celou validaci uspesne.
     * */
    const handleOnSubmit = (values) => {
        const newData = transformData(values);
        sendUser(newData);
    };

    /**
     * Z prijatych dat sestavi data do podoby jakou je chceme ve formiku
     * */
    const setInitialData = (data) => {
        return {
            login: data.login,
            passwd: data.passwd,
            email: data.email,
            nazev: data.nazev,
            role: data.role
        }
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (props.open === true) {
            if (props.edit) {//data se edituji
                const data = setInitialData(props.user);
                setInitialValues(data);
            } else { //nova role
                setInitialValues(addInitialValues);
            }

            setRoles(props.roles);
        }
    }, [props.open, props.edit, props.user, props.roles]);


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
                                    {/* -------------------------- LOGIN -------------------------- */}
                                    <TextItem {...formik} nameLabel="Login *" name="login" disabled={false}/>
                                    {/* -------------------------- HESLO -------------------------- */}
                                    <TextItem {...formik} nameLabel="Heslo *" name="passwd" disabled={false}/>
                                    {/* -------------------------- EMAIL -------------------------- */}
                                    <TextItem {...formik} nameLabel="Email *" name="email" disabled={false}/>
                                    {/* -------------------------- EMAIL -------------------------- */}
                                    <TextItem {...formik} nameLabel="Jméno a příjmení *" name="nazev" disabled={false}/>
                                    {/* --------------------------ROLE -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr role *" name="role" nullName="Dostupné role" selectValues={roles} disabled={false}/>
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

export default UserDialog;