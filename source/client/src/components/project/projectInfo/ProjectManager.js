import React, {useEffect, useRef, useState} from "react";
import {Paper, Typography, FormControl, Select, MenuItem} from "@material-ui/core";
import MyHeaderButtons from "../../MyHeaderButtons";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {format} from 'date-fns';
import axios from "axios";
import {changeManager, setErrorCode} from "../../../actions";
import {visibleOnlyAdmin, visibleOnlyAdminAndFailure, vProjActive} from "../../../security/secureComponents";
import TextTitle from "../../TextTitle";
import {trackPromise} from "react-promise-tracker";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY*/
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },

    input: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.primary.light,
        padding: theme.spacing(1)
    }

}));

/**
 * Komponenta pro vyber managera projektu. Manazera pujde vybrat ze seznamu manazenu, kteri jsou v DB
 * props:
 * title = pro to co se ma zobrazit nahore v nadpisu
 * users = dostupni uzivatele
 *
 * Autor: Sara Skutova
 * */
function ProjectManager(props) {

    const classes = useStyles();

    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState({id: 0, nazev: "Žádná data"});
    const [valueSave, setValueSave] = useState({id: 0, nazev: "Žádná data"});
    const [managers, setManagers] = useState([]);

    const projectData = useSelector(state => state.ProjectInfo);
    const managerData = useSelector(state => state.manager);

    const dispatch = useDispatch();

    const source = useRef(axios.CancelToken.source());


    /**
     * Z dostupnych resitelu vybere ty co maji roli managera, vrati jejich seznam v objektecch ktere jsou prizpusobeny pro
     * select komponentu
     * */
    function createManagersList(data) {
        const filterList = data.filter(user => user.bezpRole === "MANAGER");
        return filterList.map(user => {
            return {id: user.id, nazev: user.nazev};
        });
    }

    /**
     * Vztvori objekt tabulky UzivProjekt, ktery reprezentuje manazera. Musi byt v tomo formatu aby to server mohl zpracovat.
     * */
    function createMangerData() {
        const today = format(new Date(), "yyyy-MM-dd");
        return {
            id: {
                projectID: projectData.id,
                uzivatelID: value.id
            },
            vedouci: true,
            dateStart: today,
            dateEnd: null,
            aktivni: true,
            projekt: {
                id: projectData.id
            },
            uzivatel: {
                id: value.id
            }
        };
    }

    /**
     * Odesle objekt managera na server
     * */
    async function sendManager(newManager) {
        try {
            await axios.post(`/api/nprr/project/${projectData.id}/manager`, newManager, {cancelToken: source.current.token});
        }catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }
    
    

    /**
     * Handle pro zmenu hodnoty, kerou se vybralo ze selectu
     * */
    const handleChangeSelect = (event) => {
        const newValue = managers.find(manager => manager.id === event.target.value);
        setValue(newValue);
    };

    /**
     * Handle pro tlacitko editu. Kdyz uzivatel chce editovat danou komponentu.
     * */
    const handleEditClick = () => {
        setValue(managerData);
        setValueSave(managerData);
        setEdit(true);
    };

    /**
     * Handle pro potvrzeni editace. Vybrany objekt se tranformuje na objekt managera, ktery se nasledne odeslse na server.
     * Potvrdi se i ulozeni do save hodnoty
     * */
    const handleEditSave = () => {
        setValueSave(value);
        const mana = createMangerData();
        trackPromise(sendManager(mana));
        dispatch(changeManager(value));
        setEdit(false);

    };

    /**
     * Obnoveni puvodni hodnoty.
     * */
    const handleEditNo = () => {
        setValue(valueSave);
        setEdit(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if(props.users !== undefined && props.users.length !== 0) {
            const newManagers = createManagersList(props.users);
            setManagers(newManagers);
        }
    }, [props.users]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Samotny select pro vyber managera, zobrazi se pri zapnutem editu
     * */
    const SelectManager = () => {
        return (
        <FormControl fullWidth>
            <Select value={value.id} onChange={handleChangeSelect}>
                <MenuItem value="" disabled>Dostupní manažeři</MenuItem>
                {managers.map(manager => (
                    <MenuItem key={manager.id} value={manager.id}>
                        {manager.nazev}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        )
    };

    const Title = () => (<TextTitle title={props.title} />);
    const HeaderButton = () => (<MyHeaderButtons title={props.title}
                                          edit={edit}
                                          onSave={handleEditSave}
                                          onNo={handleEditNo}
                                          onEdit={handleEditClick}/>);

    const VAdminOrFail= visibleOnlyAdminAndFailure(HeaderButton, Title);
    const SelectOnlyAdmin = visibleOnlyAdmin(() => <SelectManager/>);
    const FinalActive = vProjActive(VAdminOrFail, Title);


    return(
        <Paper className={classes.root}>
            <FinalActive />
            {
                edit ?
                    <SelectOnlyAdmin />
                    :
                    <Typography>{managerData.nazev}</Typography>
            }
        </Paper>

    );


}

export default ProjectManager;