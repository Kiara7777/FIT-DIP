import React, {useEffect, useRef, useState} from "react";
import {IconButton, Paper, Tooltip, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import TextTitle from "../../TextTitle";
import EditIcon from "@material-ui/icons/Edit";
import ConformDialog from "../../ConformDialog";
import {trackPromise} from "react-promise-tracker";
import {changeProject, setErrorCode} from "../../../actions";
import {project} from "../../constants";
import {visibleOnlyProjMgnAndAdmin} from "../../../security/secureComponents";

/* STYL KOMPONENTY
titleText: https://www.w3schools.com/cssref/css3_pr_text-overflow.asp
* */
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(2),
        height: "100%",
        minHeight: 160
    },

    edit: {
        marginLeft: "auto",
    },

    titleText: {
        paddingBottom: theme.spacing(2),
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"

    },

    card: {
        textAlign: 'center',
    },

    nadpisAEdit: {
        display: "flex",
    },

}));

/**
 * Komponenta aktivace/deaktivace projektu
 * Zaroven take zobrazuje zda je projekt aktivni ci neaktivni
 *
 * props:
 *      title - titulek karty
 *
 * Autor: Sara Skutova
 * */
function ProjectActive(props) {

    const aktivni = "Aktivní";
    const neaktivni = "Neaktivní";

    const dialogA = "Aktivace projektu";
    const dialogAText = "Tímto se aktuální projekt aktivuje";
    const dialogN = "Deaktivace projektu";
    const dialogNText = "Tímto se aktuální projekt deaktivuje";

    const [openDialog, setOpenDialog] = useState(false);
    const [aktivita, setAktivita] = useState(aktivni);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogText, setDialogText] = useState("");
    const classes = useStyles();

    const projectData = useSelector(state => state.ProjectInfo);
    const dispatch = useDispatch();
    const source = useRef(axios.CancelToken.source());

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
     * Funkce ktera vytvori novy objekt projektu a zmeni v nem pozadovanou vlastnost
     * */
    function saveDatatoProject(newValue) {
        const newProject = {
            ...projectData
        };

        newProject["aktivni"] = newValue; //snad to funguje, DLE KONZOLE FUNGUJE
        return newProject;

    }

    /**
     * Funkce reagujici na edit tlacitkom, otevira dialog na potvrzeni zmeny
     * */
    const onEdit = () => {
        setOpenDialog(true);
        if (projectData.aktivni) {
            setDialogTitle(dialogN);
            setDialogText(dialogNText);
        } else {
            setDialogTitle(dialogA);
            setDialogText(dialogAText);
        }
    };

    /**
     * Zruseni akce dialogu
     * */
    const handleCancel = () => {
        setOpenDialog(false);
    };

    /**
     * Povrzeni akce dialogu, meni hodnotu aktivity projektu
     * */
    const handleApproval = () => {
        const newData = saveDatatoProject(!projectData.aktivni);
        trackPromise(sendUpdate(newData));
        dispatch(changeProject(newData));
        setOpenDialog(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (projectData.aktivni) {
            setAktivita(aktivni);
        } else {
            setAktivita(neaktivni);
        }
    }, [projectData.aktivni]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    // definovani zobrazeni komponenty jenom managerovi a adminovi
    const ButtonEdit = () => (
        <Tooltip title="Editovat">
            <IconButton aria-label="edit" color="primary" className={classes.edit} onClick={onEdit}>
                <EditIcon/>
            </IconButton>
        </Tooltip>
    );

    const ButtonForMAndA = visibleOnlyProjMgnAndAdmin(() => <ButtonEdit />);

    //////////////////////////////////////////////////////////////////

    return(
        <Paper className={classes.root}>
            <div className={classes.nadpisAEdit}>
                <TextTitle title={props.title} />
                <ButtonForMAndA />
            </div>
            <Typography variant="h4" className={classes.card}>
                {aktivita}
            </Typography>
            <ConformDialog title={dialogTitle}
                           text={dialogText}
                           handleCancel={handleCancel}
                           handleApproval={handleApproval}
                           open={openDialog}
            />
        </Paper>
    );
}

export default ProjectActive;