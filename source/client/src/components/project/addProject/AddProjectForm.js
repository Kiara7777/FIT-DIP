import React, {useEffect, useRef, useState} from 'react';
import {
    CssBaseline,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Typography,
    Button,
    Container,
    Grid, Select, MenuItem, FormHelperText, Chip, InputLabel
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Form, Formik, Field} from "formik";
import * as Yup from "yup";
import axios from 'axios';
import MenuAppBar from "../../MenuAppBar";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import csLocale from "date-fns/locale/cs";
import { format} from 'date-fns';
import {useDispatch} from "react-redux";
import {setErrorCode, setTitle} from "../../../actions";
import BackFab from "../../BackFab";
import {trackPromise} from "react-promise-tracker";
import Loading from "../../Loading";
import ProgressButton from "../../ProgressButton";
import {project, user} from "../../constants";
import {
    DisabledFormControl,
    DisabledKeyboardDatePicker,
    DisabledTextField
} from "../../../spolecneFunkce";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY
* placeholderToolbar je prevzat ze zdarma sablony dashboardu od Material-UI:
* https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Dashboard.js
* https://material-ui.com/getting-started/templates/dashboard/
* */
const useStyles = makeStyles(theme => ({

    root: {
        display: 'flex',
    },

    placeholderToolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },

    main: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },

    content: {
        marginLeft: theme.spacing(10)
    },

    buttons: {
        margin: theme.spacing(2),
        display: "flex"
    },

    button: {
      marginRight: theme.spacing(1)
    },

    inputChips: {
        display: "flex",
        flexWrap: "wrap"
    },

    chip: {
        margin: 3
    },

}));

/**
 * Inspirace: dynamickeho formiku: https://github.com/jaredpalmer/formik/blob/master/examples/MultistepWizard.js
 * */

/**
 * Komponenta policek pro Nazev a Popis, ukazuje se pri 1 (step = 0)
 * */
const NazevPopisFields = (NPprops) => (
        <Grid container direction="column" justify="space-around" alignItems="stretch" >
            <Grid item xs={12}>
                <Field disabled={NPprops.disable}
                       as={DisabledTextField}
                       fullWidth
                       label="Název *"
                       name="nazev"
                       error={NPprops.touched.nazev !== undefined && NPprops.errors.nazev !== undefined}
                       helperText={NPprops.touched.nazev && NPprops.errors.nazev}
                />
            </Grid>
            <Grid item xs={12}>
                <Field disabled={NPprops.disable}
                       as={DisabledTextField}
                       multiline
                       fullWidth
                       label="Popis *"
                       name="popis"
                       margin="normal"
                       error={NPprops.touched.popis !== undefined && NPprops.errors.popis !== undefined}
                       helperText={NPprops.touched.popis && NPprops.errors.popis}
                />
            </Grid>
        </Grid>
);

/**
 * Komponenta kalendare, inspirovano/prevzato dokumentaci: https://material-ui-pickers.dev/guides/form-integration
 * */
const DateFormik = ({ field, form, ...other }) => {

    const currentError = form.errors[field.name];

    return (
        <DisabledKeyboardDatePicker
            name={field.name}
            value={field.value}
            format="dd. MM. yyyy"
            label={field.name === "start" ? "Začátek" : "Konec"}
            helperText={currentError}
            error={Boolean(currentError)}
            onChange={date => form.setFieldValue(field.name, date, true)}
            {...other}
        />
    );
};


/**
 * Komponenta pro zobrazovani START A KONEC datumu
 * */
const DateFields = (DProps) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={csLocale}>
            <Grid container  justify="space-around" alignItems="stretch" spacing={5}>
                <Grid item xs={12} md={6}>
                    <Field name="start"
                           fullWidth
                           component={DateFormik}
                           disabled={DProps.disable}
                    />
                </Grid>
                <Grid item xs={12} md={6} >
                    <Field name="konec"
                           fullWidth
                           component={DateFormik}
                           disabled={DProps.disable}
                    />
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    );


/**
 * Komponenta pro vyber managera
 * */
const ManagerField = (Mprops) => (
        <DisabledFormControl fullWidth error={Mprops.touched.manager !== undefined && Mprops.errors.manager !== undefined} disabled={Mprops.disable}>
            <InputLabel id="vyberManagera">Výběr manažera</InputLabel>
            <Field name="manager" as={Select} labelId="vyberManagera">
            <MenuItem value="" disabled>Dostupní manažeři</MenuItem>
            {Mprops.managers.map(manager => (
                <MenuItem key={manager.id} value={manager.id}>
                    {manager.nazev}
                </MenuItem>
            ))}
            </Field>
            <FormHelperText>{Mprops.touched.manager && Mprops.errors.manager}</FormHelperText>
        </DisabledFormControl>
    );


/**
 * CHIP pro vyber resitelu
 * */
const Chips = (chipsProps) => {
    const value = chipsProps.users.find(user => user.id === chipsProps.id);
    return(
        <Chip label={value.nazev} className={chipsProps.classes.chip}/>
    );
};


/**
 * Komponenta pro vyber resitelu - neni povinne, takze vsechno ok, kdyz se nic nevybere
 * Propojeni s komponentou Chip, je dle prikladu ze stranek s dokumentaci v Material-UI
 * */
const ResiteleField = (Rprops) => (
        <DisabledFormControl fullWidth disabled={Rprops.disable}>
            <InputLabel id="vyberResitelu">Výběr řešitelů</InputLabel>
            <Field name="resitele"
                   as={Select}
                   multiple
                   labelId="vyberResitelu"
                   renderValue={selected => (
                       <div className={Rprops.classes.inputChips}>
                           {selected.map(value => (
                               <Chips key={value} id={value} users={Rprops.users} classes={Rprops.classes}/>
                           ))}
                       </div>
                   )}
            >
                <MenuItem value="" disabled>Dostupní řešitelé</MenuItem>
                {
                    Rprops.users.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.nazev}
                        </MenuItem>
                    ))
                }
            </Field>
        </DisabledFormControl>
    );

/**
 * Komponenta pro zobrazeni shrnuti, kombinuje vsechny predchazejici prvky, vsechny jsou ale desibled
 * */
const AllFields = (Allprops) => {
    return (
        <Grid container direction="column" justify="space-around" alignItems="stretch" spacing={2}>
            <Grid item>
                <NazevPopisFields {...Allprops.formik}  disable={Allprops.disable}/>
            </Grid>
            <Grid item>
                <DateFields {...Allprops.formik} disable={Allprops.disable}/>
            </Grid>
            <Grid item>
                <ManagerField {...Allprops.formik} managers={Allprops.managers} disable={Allprops.disable}/>
            </Grid>
            <Grid item>
                <ResiteleField {...Allprops.formik} users={Allprops.users} classes={Allprops.classes} disable={Allprops.disable}/>
            </Grid>
        </Grid>
    );
};

/**
 * Funkce ktera vraci pole s nazvy jednotlivych kroku
 * */
const getSteps = () => {
    return ["Název a popis projektu", "Začátek a konec projektu", "Výběr manažera", "Výběr řešitelů", "Shrnutí"]
};

/**
 * Funkce, ktera podle aktualniho kroku vraci komponentu ktera se ma zobrazit
 * */
const getStepContent = (activeStep, formik, managers, users, classes) => {
    switch (activeStep) {
        case 0:
            return <NazevPopisFields {...formik}  disable={false}/>;
        case 1:
            return <DateFields {...formik}  disable={false}/>;
        case 2:
            return <ManagerField {...formik} managers={managers}  disable={false}/>;
        case 3:
            return <ResiteleField {...formik} users={users} classes={classes} disable={false}/>;
        case 4:
            return <AllFields formik={formik} managers={managers} users={users} classes={classes} disable={true}/>;
        default:
            return <div>CHYBA</div>;
    }
};



/**
 * Komponenta pro prida projektu. Je ve forme Material-UI stepperu, ktery funguje jako formular.
 * Vuziva Formik pro zparavoani poli formulare a yup pro validaci.
 *
 * Autor: Sara Skutova
 * */
function AddProjectForm(props) {
    const classes = useStyles();

    const [step, setStep] = useState(0);
    const [managers, setManagers] = useState([]);
    const [resiteleUser, setResiteleUser] = useState([]);
    const steps = getSteps();

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    ////////////////////FORMIK///////////////////////
    const initialValues = {
        nazev: "",
        popis: "",
        start: new Date(),
        konec: new Date(),
        manager: "",
        resitele: []
    };

    //validace se porozdelovana po castech aby mohlo fungovat krokovani, nasledne se spojuje do pole, ze ktereho se vybira
    //podle aktualnihi kroku
    const validNazevPopis = Yup.object({
        nazev: Yup.string().required('Vyžadováno'),
        popis: Yup.string().required('Vyžadováno'),
    });

    const validDatumy = Yup.object( {
        start: Yup.date().typeError("Nesprávný formát datumu: DD. MM. RRRR"),
        konec: Yup.date().typeError("Nesprávný formát datumu: DD. MM. RRRR")
            .min(Yup.ref('start'), "Datum ukončení nemůže být dříven než datum začátku"),
    });

    const validManager = Yup.object( {
        manager: Yup.number().typeError("Manažer musí být zadán")
            .required("Manažer musí být zadán"),
    });

    const validationSchemaAll = Yup.object({
        nazev: Yup.string().required('Vyžadováno'),
        popis: Yup.string().required('Vyžadováno'),
        start: Yup.date().typeError("Nesprávný formát datumu: DD. MM. RRRR"),
        konec: Yup.date().typeError("Nesprávný formát datumu: DD. MM. RRRR")
            .min(Yup.ref('start'), "Datum ukončení nemůže být dříven než datum začátku"),
        manager: Yup.number().typeError("Manažer musí být zadán")
            .required("Manažer musí být zadán"),
    });

    //validacni prole
    const validationSchema = [validNazevPopis, validDatumy, validManager, validationSchemaAll, validationSchemaAll];

    /**
     * Handler pro potvrzeni formulare, vyvola se vzdy pri tlacitku Dalsi. Jenom kdyz projde celou validaci uspesne.
     * */
    const handleOnSubmit = (values, bag) => {
        const last = isLast();
        if (!last) { // neni to posledni pokracuje se dale
            bag.setTouched({});
            bag.setSubmitting(false); //tohle ukonci celou fazi Submitovani https://jaredpalmer.com/formik/docs/guides/form-submission
            handleDalsi();
        }
        else { //je to posledni, data se maji poslat na server
            const projData = createProjectData(values);
            sendNewProjekt(projData);
        }
    };
    //////////////////////////////////////////////////////////////

    /**
     * Funkce pro zaslani projektu na server
     * */
    async function sendNewProjekt(projData) {
        try {
            const response = await axios.post(project.postProject, projData, {cancelToken: source.current.token});
            props.history.push(`/app/project/${response.data.id}`);

        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * Ze ziskanych dat vytvori objekt projektu, spoledne i s objektem managera a pole resitelu.
     * Data musi byt ve spravnem formatu aby je server prijal.
     * */
    function createProjectData(values) {
        const uzivManager = [{
            vedouci: true,
            dateStart: format(values.start, "yyyy-MM-dd"),
            dateEnd: null,
            aktivni: true,
            uzivatel: {
                id: values.manager
            }
        }];

        const uzivResitele = values.resitele.map(resitel => {
            return {
                vedouci: false,
                dateStart: format(values.start, "yyyy-MM-dd"),
                dateEnd: null,
                aktivni: true,
                uzivatel: {
                    id: resitel
                }
            }
        });


        return {
            nazev: values.nazev,
            popis: values.popis,
            start: format(values.start, "yyyy-MM-dd"),
            konec: format(values.konec, "yyyy-MM-dd"),
            aktivni: true,
            swot: null,
            itemUzProj: [...uzivManager, ...uzivResitele]
        };

    }

    /**
     * Ze seznamu uzivatelu vybere ty, ktere maji roli managera.
     * Vysledny seznam se pouzije na vybrani managera projektu
     * */
    function createManagersList(data) {
        const filterList = data.filter(user => user.role === 3); //Vybrat managery, ty 4 role se NESMI MENIT!!!!
        return filterList.map(user => {
            return {id: user.id, nazev: user.nazev};
        });
    }

    /**
     * Ze seznamu uzivatelu vybere ty, ktere maji roli: clen tymu nebo nezaranezo
     * Vysledny seznam se pouzije pri vyberu resitelu projektu
     * */
    function createResiteleList(data) {
        const filterList = data.filter(user => user.role === 1 || user.role === 2); //nezarazeni a clenove tymu
        return filterList.map(user => {
            return {id: user.id, nazev: user.nazev};
        });
    }

    /**
     * Test zda je aktulani prvek poslednim prvkem. Step zacina od 0 proto se musi zvysit o 1, aby melo stejnou veliksot jako pole steps.
     * */
    const isLast = () => {
        return (step + 1) === steps.length;
    };

    /**
     * Handler talcitka pro krok zpet. Snizi hodnotu aktulaniho kroku o 1
     * */
    const handleZpet = () => {
        setStep(prevState => prevState - 1);
    };

    /**
     * Handler tlacitka pro dlasi krok. Zvysi hodnotu aktualniho kroku o 1
     * */
    const handleDalsi = () => {
        setStep(prevState => prevState + 1);
    };

    /**
     * Funkce se spousti pri mountovani componenty, ten return se naopak spusti pokud se bude komponenta odmountova
     * */
    useEffect(() => {

        /**
         * Funkce na zistani uzivatelu z databaze
         * */
        async function getUsers() {
            try {
                const response = await axios.get(user.getUsers, {cancelToken: source.current.token});
                setManagers(createManagersList(response.data));
                setResiteleUser(createResiteleList(response.data));
            } catch (error) {
                if(!axios.isCancel(error)) {
                    dispatch(setErrorCode(error.response.status));
                }
            }
        }
        trackPromise(getUsers());
        dispatch(setTitle("Tvorba nového projektu"));
    }, [dispatch]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////


    return(
        <div className={classes.root}>
            <CssBaseline />
            <MenuAppBar />
            <main className={classes.main}>
                <div className={classes.placeholderToolbar} />
                <Container>
                    <Typography variant="h6">Tvorba nového projektu</Typography>
                    <Formik initialValues={initialValues}
                            validationSchema={validationSchema[step]}
                            onSubmit={handleOnSubmit}

                    >
                        {formik => (
                            <Form>
                                <Stepper activeStep={step} orientation="vertical">
                                    {
                                        steps.map((label, index) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                                <StepContent>
                                                    {getStepContent(index, formik, managers, resiteleUser, classes)}
                                                    <div className={classes.buttons}>
                                                        <Button
                                                            disabled={step === 0 || formik.isSubmitting}
                                                            onClick={handleZpet}
                                                            className={classes.button}
                                                        >
                                                            {"Zpět"}
                                                        </Button>
                                                        <ProgressButton disabled={formik.isSubmitting} text={step === steps.length - 1 ? 'Odeslat' : 'Další'}/>
                                                    </div>
                                                </StepContent>
                                            </Step>
                                        ))
                                    }
                                </Stepper>
                            </Form>
                        )}
                    </Formik>
                </Container>
                <BackFab />
                <Loading />
            </main>
        </div>

    );
}

export default AddProjectForm;
