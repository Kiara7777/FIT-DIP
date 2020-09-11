import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select,Divider, Collapse
} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import {makeStyles} from "@material-ui/core/styles";
import {stavLookup, pravdepLookup, dopadLookup, prioritaLookup, risk} from "../../constants";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {getRiskInfo, SelectItem, TextItem} from "../../../spolecneFunkce";
import {addRiskToProject, changeRiskInProject, setErrorCode} from "../../../actions";
import Typography from "@material-ui/core/Typography";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import {trackPromise} from "react-promise-tracker";
import Loading from "../../Loading";
import ProgressButton from "../../ProgressButton";

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

//inicialni hodnoty pro formik
const addInitialValues = {
        stav: "",
        pravdepodobnost: "",
        dopad: "",
        popisDopadu: "",
        planReseni: "",
        priorita: "",
        nazev: "",
        popis: "",
        kategorie: "",
        uzivID: ""
};

/**
 * Kompnenta pro zobrazovani dialogu pri editaci/pridavani rizika
 * riskProps:
 *  title - titulek dialogu
 *  open - nastaveni, at se dialog otevre
 *  risk - riziko ktere se ma uparavovat, pokud bude null tak se misto upravovani bude riziko tvorit
 *  edit - indikator zda jde o edit nebo o pridavani, TRUE - edit, FALSE - add
 *  handleZavreno - spojeni na rodice, ze se dialog uzavrel
 *  category - kategorie rizika
 *  admins - mozni spravci, kteryl lze priradit rizika - clenove resiteslkeho tymu
 *
 *  Autor: Sara Skutova
 * */
function RiskDialog(riskProps) {
    const classes = useStyles();
    const [initialValues, setInitialValues] = useState(addInitialValues);
    const [saveValues, setSaveValues] = useState({}); //pro ulozeni pocatecnich hodnot, potrebuju zjistit jestli se samotne policka rizika zmenila
    const [category, setCategory] = useState({});
    const [admins, setAdmins] = useState({});
    const [edit, setEdit] = useState(false);

    const [centralRisk, setCentralRisk] = useState([]);
    const [cRiskSet, setCRiskSet] = useState(false);
    const [newDisabled, setNewDisabled] = useState(true);
    const [currentCategory, setCurrentCategory] = useState("");
    const [currentRisk, setCurrentRisk] = useState("");
    const [riskMenu, setRiskMenu] = useState([]);
    const [currentRiskObj, setCurrentRiskObj] = useState({});
    const [currentRiskID, setCurrentRiskID] = useState(undefined);
    const [alert, setAlert] = useState(false);

    const [collapse, setCollapse] = useState(false);
    const [searching, setSearching] = useState(false);

    const projectData = useSelector(state => state.ProjectInfo);
    const projectRiskData = useSelector(state => state.projectRisks);
    const dispatch = useDispatch();

    const source = useRef(axios.CancelToken.source());

    const varovani = "Vybrané riziko je již k projektu přiřazeno. Pokud ho uložíte, tak se jeho hodnota přepíše nově vytvořenými údaji!";


    const validationSchema = Yup.object({
        stav: Yup.number().typeError("Stav rizika musí být vybrán")
            .required("Stav rizika musí být vybrán"),
        pravdepodobnost: Yup.number().typeError("Pravděpodobnost výskytu musí být vybrána")
            .required("Pravděpodobnost výskytu musí být vybrána"),
        dopad: Yup.number().typeError("Míra dopadu musí být vybrána")
            .required("Míra dopadu musí být vybrána"),
        popisDopadu: Yup.string().required("Popis dopadu je vyžadován"),
        planReseni: Yup.string().required("Plán řešení je vyžadován"),
        priorita: Yup.number().typeError("Priorita řešení musí být vybrána")
            .required("Priorita řešení musí být vybrána"),
        nazev: Yup.string().required("Název rizika je vyžadován"),
        popis: Yup.string().required("Popis rizika je vyžadován"),
        kategorie: Yup.number().typeError("Kategorie rizika musí být vybrána")
            .required("Kategorie rizika musí být vybrána"),
        uzivID: Yup.number().typeError("Správce rizika musí být vybrán")
            .required("Správce rizika musí být vybrán"),

    });
    /**
     * Vytvori objekt UzivProjRizika, ktery pujde poslat na server, jedna se o riziko, ktere je bud upravuje nebo je
     * vybrane z registru rizik, takze id rizika je znamo
     * */
    const createUzivProjRizik = (data) => {
        const uzivProjRiz = {
            id: {
                idProjektu: projectData.id,
                idRizika: currentRiskID,
                idUzivatele: data.uzivID
            },
            idProjektR: {
                id: projectData.id
            },
            idUzivatelR: {
                id: data.uzivID
            },
            idRizikoR: {
                id: currentRiskID
            },
            stav: data.stav,
            pravdepodobnost: data.pravdepodobnost,
            dopad: data.dopad,
            popisDopadu: data.popisDopadu,
            planReseni: data.planReseni,
            priorita: data.priorita
        };

        return uzivProjRiz;
    };

    /**
     * Vytvori objekt rizika spolecne s UzivProjRiziko
     * */
    const createRiskUzivProjRiz = (data, newRisk) => {
        if (newRisk) {//jedna se o nove riziko, nebude tam id rizika
            return {
                nazev: data.nazev,
                popis: data.popis,
                mozneReseni: data.planReseni,
                kategorie: {
                    id: data.kategorie
                },
                itemUzProjRiz: [
                    {
                        idProjektR: {
                            id: projectData.id
                        },
                        idUzivatelR: {
                            id: data.uzivID
                        },
                        stav: data.stav,
                        pravdepodobnost: data.pravdepodobnost,
                        dopad: data.dopad,
                        popisDopadu: data.popisDopadu,
                        planReseni: data.planReseni,
                        priorita: data.priorita

                    }
                ]
            }
        } else { //jedna se o edit neceho co uz je, id rizika tam musi byt
            return {
                id: currentRiskID,
                nazev: data.nazev,
                popis: data.popis,
                mozneReseni: data.planReseni,
                kategorie: {
                    id: data.kategorie
                },
                itemUzProjRiz: [
                    {
                        idRizikoR: {
                            id: currentRiskID
                        },
                        idProjektR: {
                            id: projectData.id
                        },
                        idUzivatelR: {
                            id: data.uzivID
                        },
                        stav: data.stav,
                        pravdepodobnost: data.pravdepodobnost,
                        dopad: data.dopad,
                        popisDopadu: data.popisDopadu,
                        planReseni: data.planReseni,
                        priorita: data.priorita

                    }
                ]
            }
        }
    };

    /**
     * Vytvorit data rizika pro redux
     * */
    const createRiskRedux = (data, id, uzivName) => {
        return {
            id: id,
            stav: data.stav,
            pravdepodobnost: data.pravdepodobnost,
            dopad: data.dopad,
            popisDopadu: data.popisDopadu,
            planReseni: data.planReseni,
            priorita: data.priorita,
            nazev: data.nazev,
            popis: data.popis,
            kategorie: data.kategorie,
            uzivID: data.uzivID,
            uzivNazev: uzivName
        }
    };

    /**
     * Posle na server nova data -  editovane riziko na projektu nebo nove riziko pridelene k projektu - nemeni se samotna data rizika
     * */
    async function sendNewProjectRisk(newRisk) {
        try {
            const response = await axios.post(`/api/nprr/project/${projectData.id}/risk`, newRisk, {cancelToken: source.current.token});
            const data = getRiskInfo(response.data, false);
            if (riskProps.edit || edit) { //jedna se o editaci, vyvolat potrebny redux akci, nebo pridani rizika co uz ale v DB, takze se jenom bude updaovat
                dispatch(changeRiskInProject(data));
            } else { //jedna se o pridani noveho rizika do projektu vybraneho z registru rizik
                dispatch(addRiskToProject(data));
            }
            handleApproval();

        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }


    /**
     * Posle na server nova data - nove riziko + prirazeni rizika na projetku, nebo edit, kde se provedl edit dat samotneho rizika
     * */
    async function sendNewRisk(newRisk, values) {
        try {
            const response = await axios.post(risk.postRisk, newRisk, {cancelToken: source.current.token});
            const uziv = admins[values.uzivID];
            const data = createRiskRedux(values, response.data.id, uziv);
            if (riskProps.edit || edit) { // probehla editace rizika, nebo se pridalo neco co uz v seznamu je - takze se bude jednat o edit - EDIT REDUX
                dispatch(changeRiskInProject(data))
            } else { //je to nova vec
                dispatch(addRiskToProject(data));
            }
            handleApproval();

        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * Ze serveru stahne informace z centralniho registru
     * */
    async function getCentralRisk() {
        try {
            const response = await axios.get(risk.getAllRisk, {cancelToken: source.current.token});
            setCentralRisk(response.data);
            setCRiskSet(true);
            setSearching(false);

        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * V seznamu rizik vybere ty co maji danou kategorii
     * */
    const getRiskByCategory = (categoryID) => {
        const data = centralRisk.filter(risk => {
            return risk.kategorie === categoryID;
        });
        return data;
    };

    /**
     * V seznamu rizik nalezne to jehoz id je to co hledame
     * */
    const getRiskById = (id) => {
        return centralRisk.find(risk => risk.id === id);
    };

    /**
     * Vycisti dialog a vsechny zavisle stavy
     * */
    const cleanDialog = () => {
        setInitialValues(addInitialValues);
        setSaveValues({});
        setCurrentCategory("");
        setCurrentRisk("");
        setCurrentRiskObj({});
        setCurrentRiskID(undefined);
        setRiskMenu([]);
        setCollapse(false);
        setAlert(false);
        setEdit(false);
    };


    /**
     * Handler pro potvrzeni formulare, vyvola se vzdy pri tlacitku Dalsi. Jenom kdyz projde celou validaci uspesne.
     * */
    const handleOnSubmit = (values) => {


        //test zda se udaje rizika zmenily nebo se jedna o nove - bude se posilat objekt rizika spolecne se uzivprojerizik
        if (saveValues.nazev !== values.nazev || saveValues.popis !== values.popis || saveValues.planReseni !== values.planReseni || saveValues.kategorie !== values.kategorie) {


            if (currentRiskObj.hasOwnProperty("id") || riskProps.edit) { // edit rizika - data budou obsahovat id rizika
                const data = createRiskUzivProjRiz(values, false);
                sendNewRisk(data, values);

            }
            else { // jedna se o nove riziko, id tam nebude
                const data = createRiskUzivProjRiz(values, true);
                sendNewRisk(data, values);
            }
        } else { //data rizika se nezmenila, bude se posilat jenom uzivProjeRizik, bud se data editovala nebo se vybralo z centralniho registru
            const data = createUzivProjRizik(values);
            sendNewProjectRisk(data);
        }
    };

    /**
     * Handle pro zruseni dialogu - zavre ho
     * */
    const handleCancel = () => {
        cleanDialog();
        setNewDisabled(true);
        riskProps.handleZavreno();
    };

    /**
     * Handle pro potvrzeni a ulozeni dat z dialogu - bude se to posilat na server
     * */
    const handleApproval = () => {
        cleanDialog();
        setNewDisabled(true);
        riskProps.handleZavreno();
    };

    /**
     * Handle pro potrvvzeni vytnoreni noveho rizika (ne z registeu)
     * */
    const handleNoveRisk = () => {
        cleanDialog();
        setNewDisabled(false);
    };

    /**
     * Hnalde pro potvrzeni vyberu noveho rizika z centralniho registru
     * */
    const handleCentralRegi = () => {
        setNewDisabled(true);
        //musi se stahnout informace z centralniho registru
        if (!cRiskSet) {//uz  se nacetlo
            setSearching(true);
            trackPromise(getCentralRisk(), "risk_dialog_area",);
        }
        setCollapse(true);
    };

    /**
     * Handle na zmenu hodnoty v selectu u kategorie pri cteni z centralniho registru
     * */
    const handleChangeCategory = (event) => {
        setAlert(false);
        setEdit(false);
        setCurrentRisk("");
        setCurrentRiskObj({});
        setCurrentRiskID(undefined);
        const num = Number(event.target.value); //TODO test na to jestli to neni NaN
        setCurrentCategory(num);
        const data = getRiskByCategory(num);
        setRiskMenu(data);
        setNewDisabled(true);
    };

    /**
     * Handle na zmenu hodnoty v selectu u rizika pri cteni z centralniho registru
     * */
    const handleChangeRisk = (event) => {
        setCurrentRisk(event.target.value);
        const risk = getRiskById(event.target.value);
        setCurrentRiskObj(risk);
        setCurrentRiskID(risk.id);
        const newInitial = createInitialCentralData(risk);
        setInitialValues(newInitial);
        setSaveValues(newInitial);
        setNewDisabled(false);
        if (projectRiskData.filter(item => item.id === risk.id).length > 0) { //jestli tam uz je, tak zobrazit varovani
            setAlert(true);
            setEdit(true);
        }
        else {
            setEdit(false);
            setAlert(false);
        }
    };

    /**
     * Z vybraneho rizika vybere pocatecni hodnoty pro forkim - TOHLE JE PRI TVORBE RIZIKA KTERE SE VYBRALO S CENTRALNIHO REGISTRU
     * */
    const createInitialCentralData = (centralRiskData) => {
        return {
            ...addInitialValues,
            planReseni: centralRiskData.mozneReseni,
            nazev: centralRiskData.nazev,
            popis: centralRiskData.popis,
            kategorie: centralRiskData.kategorie
        }
    };

    /**
     * Z prijatych dat sestavi data do podoby jakou je chceme ve formiku
     * */
    const setInitialData = (data) => {
        const init = {
            stav: data.stav,
            pravdepodobnost: data.pravdepodobnost,
            dopad: data.dopad,
            popisDopadu: data.popisDopadu,
            planReseni: data.planReseni,
            priorita: data.priorita,
            nazev: data.nazev,
            popis: data.popis,
            kategorie: data.kategorie,
            uzivID: data.uzivID
        };

        return init;
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (riskProps.open === true) {
            // 0 bude pokud to bude prazdne coz znamena, ze se budou data pridavat a ne upravovat
           if (Object.entries(riskProps.risk).length === 0) {
               setInitialValues(addInitialValues);
               setSaveValues(riskProps.risk);
               setCurrentRiskID(undefined);
           } else {
               //tady by melo byt jenom kdyz chci upravovat, a data jsou pritomna
               const data = setInitialData(riskProps.risk);
               setInitialValues(data);
               setSaveValues(riskProps.risk);
               setCurrentRiskID(riskProps.risk.id);
           }
           setCategory(riskProps.category);
           setAdmins(riskProps.admins);
           if (riskProps.edit) {
               setNewDisabled(false);
               setEdit(true);
           }
        }
    }, [riskProps.open, riskProps.risk, riskProps.category, riskProps.admins, riskProps.edit]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Komponenta por vrchni cast dialogu - vybirani z noveho nebo z centralniho registru
     * */
    const QuectionSelectRisk = () => {
        return (
            <div>
                <Grid container direction="column" justify="center" spacing={3}>
                    <Grid item xs={12} style={{textAlign: "center"}}>
                        <Typography variant="h6">Vytvořit nové riziko nebo vybrat z centralního registru</Typography>
                    </Grid>
                    <Grid item container direction="row" spacing={2} justify="space-around" alignItems="center">
                        <Grid item xs={6} style={{textAlign: "center"}}>
                            <Button variant="contained" color="primary" onClick={handleNoveRisk} disabled={searching}>Nové riziko</Button>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: "center"}}>
                            <Button variant="contained" color="primary" onClick={handleCentralRegi} disabled={searching}>Centrální registr</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider className={classes.questionDivider}/>
                <Collapse in={collapse}>
                    <Grid container direction="row" spacing={2} justify="space-around" alignItems="center">
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="riskCategory">Kategorie</InputLabel>
                                <Select
                                    labelId="riskCategory"
                                    value={currentCategory}
                                    onChange={handleChangeCategory}
                                >
                                    <MenuItem value="" disabled>Dostupné kategorie</MenuItem>
                                    {Object.entries(category).map(val => (
                                        <MenuItem key={val[0]} value={val[0]}>
                                            {val[1]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="riskNazev">Název</InputLabel>
                                <Select
                                    labelId="riskNazev"
                                    value={currentRisk}
                                    onChange={handleChangeRisk}
                                >
                                    <MenuItem value="" disabled>Dostupná rizika</MenuItem>
                                    {
                                        riskMenu.map(val => (
                                            <MenuItem key={val.id} value={val.id}>
                                                {val.nazev}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Divider className={classes.questionDivider}/>
                </Collapse>
            </div>
        );
    };

    return(
        <Dialog maxWidth="sm"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
                open={riskProps.open}
                scroll='paper'
        >
            <DialogTitle>{riskProps.title}</DialogTitle>
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
                            {
                                !riskProps.edit && <QuectionSelectRisk />
                            }
                            <Collapse in={alert}>
                                <Alert severity="warning" action={
                                    <IconButton color="inherit" size="small" onClick={() => {setAlert(false);}}>
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                >
                                    <AlertTitle>Varování</AlertTitle>
                                    {varovani}
                                </Alert>
                            </Collapse>
                            <DialogContentText>Změna těchto údajů se projeví i v centrálním registru rizik</DialogContentText>
                            <Container className={classes.container} maxWidth="lg">
                                <Grid container direction="column" justify="space-around" alignItems="stretch" spacing={5}>
                                    {/* -------------------------- NAZEV -------------------------- */}
                                    <TextItem {...formik} nameLabel="Název *" name="nazev" disabled={newDisabled}/>
                                    {/*-------------------------- POPIS -------------------------- */}
                                    <TextItem {...formik} nameLabel="Popis *" name="popis" disabled={newDisabled}/>
                                    {/* -------------------------- PLAN RESENI -------------------------- */}
                                    <TextItem {...formik} nameLabel="Plán řešení *" name="planReseni" disabled={newDisabled}/>
                                    {/* -------------------------- KATEGORIE -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr kategorie *" name="kategorie" nullName="Dostupné kategorie" selectValues={category} disabled={newDisabled}/>
                                </Grid>
                            </Container>
                            <Divider className={classes.divider}/>
                            <DialogContentText>Vlastnosti rizika pro tento projekt</DialogContentText>
                            <Container className={classes.container} maxWidth="lg">
                                <Grid container direction="column" justify="space-around" alignItems="stretch" spacing={5}>
                                    {/* -------------------------- SPRAVCE -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr správce *" name="uzivID" nullName="Dostupní řešitelé" selectValues={admins} disabled={newDisabled}/>
                                    {/* -------------------------- STAV -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr stavu *" name="stav" nullName="Dostupné stavy" selectValues={stavLookup} disabled={newDisabled}/>
                                    {/* -------------------------- PRIORITA  -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr priority *" name="priorita" nullName="Dostupné priority" selectValues={prioritaLookup} disabled={newDisabled}/>
                                    {/* -------------------------- PRAVDEPODOBNOST -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr pravděpodobnosti výskytu *" name="pravdepodobnost" nullName="Dostupné pravděpodobnosti" selectValues={pravdepLookup} disabled={newDisabled}/>
                                    {/* -------------------------- DOPAD -------------------------- */}
                                    <SelectItem {...formik} nameLabel="Výběr míry dopadu *" name="dopad" nullName="Dostupné míry dopadu " selectValues={dopadLookup} disabled={newDisabled}/>
                                    {/* -------------------------- POPIS DOPADU -------------------------- */}
                                    <TextItem {...formik} nameLabel="Popis dopadu *" name="popisDopadu" disabled={newDisabled}/>
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
            <Loading area="risk_dialog_area"/>
        </Dialog>
    );

}

export default RiskDialog;