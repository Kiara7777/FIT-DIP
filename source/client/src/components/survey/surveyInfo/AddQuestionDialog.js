import React, {useState} from "react";
import {
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Divider, FormControl,
    Grid, InputLabel, MenuItem, Select
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({

    questionDivider: {
        marginTop: 20,
        marginBottom: 20,
    },

    text: {
        display: "flex",
    },

    button: {
        marginLeft: "auto",
    },

}));

/**
 * Dodatecna komponenta panelu, ktery zobrazuje vybrane otazky
 * */
const QuestionPanel = (props) => (
    <React.Fragment>
        <DialogContentText>Zaznačené otázky</DialogContentText>
        {
            props.data.map((item, index) => (
                <Typography key={index}>{`${index + 1}) ${item}`}</Typography>
            ))
        }
        <Divider className={props.classes}/>
    </React.Fragment>
);

/**
 * Dialog pro pridani/editaci otazky ke dotazniku
 * pouziva se v nem formik
 *
 * props:
 *      edit - editace nebo tvorba
 *      quesions - objekt odpovedi
 *      questionsSurvey - otazky ktere se na dotazniku uz vyskytly
 *      handleClose - spoejni s rodicem, reakce na uzavreni dialogu - zruseni ale i potvrzeni
 *      open - otevreni/zavreni dialogu
 *      title - titulek dialogu
 *
 * Autor: Sara Skutova
 * */
function AddQuestionDialog(props) {

    const classes = useStyles();

    const [currendData, setCurrendData] = useState("");
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [activeQuestions, setActiveQuestions] = useState([]);
    const [activeQText, setActiveQText] = useState([]);
    const [questionIn, setQuestionIn] = useState(false);

    const helperText = "Po vybrání otázky je možné změnit oblast otázky a vybrat další otázku";

    //some vrati true pokud alespon jeden item v danem poli splni podminku
    const getCurrentQuestions = (oblastID) => {

        //vybrat otazky co jsou z dane oblasti
       const currentQ = props.quesions.filter(item => item.oblastOtazky.id === oblastID);

       //tohle ma odstranit otaznky co uz v dotaniku jsou
       const endResult = currentQ.filter(itemOne => {
           return !props.questionsSurvey.some(itemTwo => itemOne.id === itemTwo.id);
       });

       setCurrentQuestions(endResult);

    };

    const cleanDialog = () => {
        setCurrendData("");
        setCurrentQuestions([]);
        setActiveQuestions([]);
        setActiveQText([]);
        setQuestionIn(false)
    };

    const createActiveQText = (activeQId) => {
        const helpArray = [];

        activeQId.forEach(id => {
            const test = props.quesions.filter(item => item.id === id);
            if (test.length > 0)
                helpArray.push(test[0].textOtazky);
        });

        setActiveQText(helpArray);
    };

    /**
     * Handle pro nastaveni checkboxu u dane otazky, zaroven i nastavuje, kterou otazku pridat do dotazniku
     * jak nastavovat multiple checboxxs a jak to cist ty hodnoty
     * https://stackoverflow.com/questions/38751575/reactjs-materialui-checkboxes-setting-state-within-oncheck
     * */
    const handleAddCheck = (id) => {

        if (activeQuestions.includes(id)) { //uz tam je, takze to chci odstranit - odcheknout
            const newCheck = activeQuestions.filter(item => item !== id);
            createActiveQText(newCheck);
            if(newCheck.length === 0)
                setQuestionIn(false);
            else
                setQuestionIn(true);
            setActiveQuestions(newCheck);
        } else { //jeste tam neni
            const test = [...activeQuestions, id];
            if(test.length === 0)
                setQuestionIn(false);
            else
                setQuestionIn(true);
            createActiveQText(test);
            setActiveQuestions(prevState => [...prevState, id])
        }
    };

    /**
     * Handle pro prideleni otazek do dotazniku - zaznacene otazky se poslou zpet do survey info, kde se vlozi do dotazniku
     * */
    const handleConfirm = () => {
        const data = [...activeQuestions];
        cleanDialog();
        props.handleClose(data);

    };

    /**
     * Handle pro zruseni dialogu - zavre ho
     * */
    const handleCancel = () => {
        cleanDialog();
        props.handleClose([]);
    };

    /**
     * Handle pro zmenu oblasti
     * */
    const handleChangeOblast = (event) => {
        const num = Number(event.target.value); //TODO test na to jestli to neni NaN
        setCurrendData(num);
        getCurrentQuestions(num)
    };

    return(
        <Dialog maxWidth="md"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
                open={props.open}
                scroll='paper'
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent dividers >
                <DialogContentText >{helperText}</DialogContentText>
                <Grid container direction="row" spacing={2} justify="space-around" alignItems="center">
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="questionArea">Oblast otázky</InputLabel>
                            <Select
                                labelId="questionArea"
                                value={currendData}
                                onChange={handleChangeOblast}
                            >
                                <MenuItem value="" disabled>Dostupné oblasti</MenuItem>
                                {Object.entries(props.areas).map(val => (
                                    <MenuItem key={val[0]} value={val[0]}>
                                        {val[1]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Divider className={classes.questionDivider}/>
                {
                    questionIn && <QuestionPanel data={activeQText} classes={classes.questionDivider}/>
                }
                {
                    currentQuestions.map(question => (
                        <ExpansionPanel key={question.id}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <FormControlLabel
                                    aria-label="AddQuestion"
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    control={<Checkbox color="primary" checked={activeQuestions.includes(question.id)} onChange={() => handleAddCheck(question.id)}/>}
                                    label={question.textOtazky}
                                />
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container spacing={3}>
                                {
                                    question.odpovedi.map(odpoved => (
                                        <Grid item xs={12} key={odpoved.id}>
                                            <Typography variant="body2">
                                                {odpoved.textOdpovedi}
                                            </Typography>
                                        </Grid>
                                    ))
                                }
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Zrušit
                </Button>
                <Button variant="contained" color="primary" type="submit" autoFocus onClick={handleConfirm}>
                    Uložit
                </Button>
            </DialogActions>
        </Dialog>

    );
}

export default AddQuestionDialog;