import React, {useState} from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Grid,
    FormControlLabel,
    Checkbox,
    CssBaseline
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {Formik, Form, Field } from "formik";
import { useDispatch } from "react-redux";
import {logIN, setUser} from "../actions";
import {withRouter} from 'react-router-dom';
import axios from "axios";
import * as Yup from "yup";
import {trackPromise} from "react-promise-tracker";
import ProgressButton from "./ProgressButton";
import {loginInto} from "./constants";

axios.defaults.baseURL = 'http://localhost:8080';



/* Komponenta prihlasovaciho formulare, po prihlaseni pak
   bude uzivateli umozneno pristoupit ke zbytku nastoje.

   Pro lepsi praci s formularem se pouziva knihovna Formik.
   Formik sam do objektu (tady TextField) vklada automaticke funkce na onClick, onBlur, atd.
   Formik u checkboxu se taky stara o potrebne funkce
   Napojeni na knihovnu Material UI se provedla za pomoci
   nasledujiciho videa: https://www.youtube.com/watch?v=ziWJ4k_3BLk&ab_channel=JustinKim
   Pro lepsi validaci dat, se na doporuceni Formik pouziva knihovan yup.

   Kompoenenta byla castecne prevzata z zdarma sabloby MAterial-UI
   https://material-ui.com/getting-started/templates/sign-in/
   https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-in

   Autor: Sara Skutova
* */

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    containerLogin: {
        marginTop: theme.spacing(15),
    },

    paperLogin: {
        alignItems: 'center',
        padding: theme.spacing(5),

    },

    gridText: {
        padding: theme.spacing(7),
    },

    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },

    buttonProgress: {
        color: 'primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },

}));

/* POCATECNI HODNOTY pro Formik */
const initialValues = {
    login: "",
    password: "",
    remember: false
    };

/* KOMPONENTA Prihlasovaciho formulare */
function LoginForm() {


    const classes = useStyles();

    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState("");

    /* Funcke volana pri potvrzeni dotazniku */
    const handlerSubmit = (values, bag) => {
        sendAuth(values.login, values.password, values.remember, bag);
    };

    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        login: Yup.string().required("Login je vyžadován"),
        password: Yup.string().required("Heslo je vyžadováno"),
    });


    /**
     * Posila prihlasovaci udaje na server
     * */
    function sendAuth(username, password, remember, bag) {
        trackPromise(
        axios.post(loginInto.login, null, {params: {username, password, remember}})
            .then(response => {
                dispatch(setUser(response.data));
                dispatch(logIN());
/*                if (typeof props.location.state === 'undefined')
                    props.history.push("/app/dashboard");
                else
                    props.history.push(props.location.state.from.pathname);*/
            })
            .catch(error => {
                bag.setSubmitting(false);
                setError(true);
                setHelperText("Nesprávné přihlašovací údaje");
            })
        );
    }

    return(
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="sm" className={classes.containerLogin}>
                <Paper className={classes.paperLogin}>
                    <Typography variant="h4" align="center">
                        Přihlášení
                    </Typography>
                    <Formik initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handlerSubmit}
                    >
                        {formik => {
                            return (
                                <Form>
                                    <Grid container direction="column" justify="space-around" alignItems="stretch" className={classes.gridText}>
                                        <Grid item xs={12}>
                                            <Field as={TextField}
                                                   label="Login *"
                                                   fullWidth
                                                   margin="dense"
                                                   name="login"
                                                   error={error || (formik.touched.login !== undefined && formik.errors.login !== undefined)}
                                                   helperText={helperText || (formik.touched.login && formik.errors.login )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field as={TextField} type="password" label="Heslo *" fullWidth margin="dense" name="password"
                                                   error={error || (formik.touched.password !== undefined && formik.errors.password !== undefined)}
                                                   helperText={helperText || (formik.touched.password && formik.errors.password )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container direction="row" justify="space-around" alignItems="center">
                                        <Grid item>
                                            <FormControlLabel
                                                control={
                                                    <Field as={Checkbox} name="remember" color="primary"/>
                                                }
                                                label="Pamatovat přihlášení"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <ProgressButton disabled={formik.isSubmitting} text="Přihlásit se"/>
                                        </Grid>
                                    </Grid>
                            </Form>
                            )
                        }}
                </Formik>
                </Paper>
            </Container>
        </React.Fragment>
    );
}

export default  withRouter(LoginForm);
