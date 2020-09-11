import React, {useState, useEffect, useRef} from "react";
import {Grid, Tooltip, IconButton} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddBoxIcon from '@material-ui/icons/AddBox';
import axios from "axios";
import ConformDialog from "../ConformDialog";
import {Link, withRouter } from 'react-router-dom';
import SurveyCard from "./SurveyCard";
import {setErrorCode} from "../../actions";
import {useDispatch} from "react-redux";
import {useGetData} from "../useGetData";
import {survey} from "../constants";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

//inspirace na search input field je z material table, co nejvice jsem se snazila udelat stejny styl
/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    searchDiv: {
        display: "flex",
        marginBottom: theme.spacing(2)
    },

    searchInput: {
        marginLeft: "auto"
    },

    addButton: {
        paddingBottom: 0
    }


}));


/**
 * Komponenta zobrazujici karty dotazniku + dalsi komponenty (tlacitko pro tvorbu), dialog pro potvrzeni smazani.
 *
 * Autor: Sara Skutova
 * */
function SurveyCards() {
    const classes = useStyles();
    const [data, setData] = useState([]);

    const [open, setOpen] = useState(false);
    const [surveyDelete, setSurveyDelete] = useState({});

    const [loadingS, dataS] = useGetData(survey.getAllSurveyCards, false);

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    /**
     * Zadost o smazani daneho dotazniku
     * */
    async function deleteSurvey(id) {
        try {
            await axios.delete(`${survey.deleteSurveyID}/${id}`, {cancelToken: source.current.token});
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

    /**
     * Reakce na stisk smazani klavesy pro smazani dotazniku - otevre potvrzujici dialog
     * */
    const handleDelete = (id) => {
        const survID = data.find(survey => survey.id === id);
        setSurveyDelete(survID);
        setOpen(true);
    };

    /**
     * Zruseni potvrzujiciho dialogu
     * */
    const handleCancel = () => {
        setOpen(false);
    };

    /**
     * Souhlas s potvrzujicim dialogem
     * */
    const handleApproval = () => {
        const newArray = [
            ...data
        ];

        const index = newArray.findIndex(item => item.id === surveyDelete.id);
        newArray.splice(index, 1);
        setData(newArray);
        deleteSurvey(surveyDelete.id);
        setSurveyDelete({});
        setOpen(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingS && dataS != null) {
            setData(dataS);
        }
    }, [loadingS, dataS]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel(); //tohle nic neudela, pokud neni axios pozadavek zrovna spusten
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    return (
        <React.Fragment>
            <div className={classes.searchDiv}>
                <Tooltip title="Přidat">
                    <IconButton className={classes.searchInput} component={Link} to={`/app/survey/addSurvey`}>
                        <AddBoxIcon/>
                    </IconButton>
                </Tooltip>
            </div>

            <Grid container spacing={3}>
                {
                    data.map((card, index) => (
                        <Grid key={index} item xs={12} sm={6} md={3} lg={3}>
                            <SurveyCard key={card.id} cardInfo={card} handleDelete={handleDelete}/>
                        </Grid>
                    ))
                }

            </Grid>
            <ConformDialog title={"Odstranit dotazník " + surveyDelete.nazev + "?"}
                           text="Tímto se odstraní požadovaný dotazník a všechny jeho odvozené informace (přiřazení dotazníku k projektu, přiřazení otázek k dotazníku a odpovědi uživatelů k dotazníku) z databáze."
                           handleCancel={handleCancel}
                           handleApproval={handleApproval}
                           open={open}
            />

        </React.Fragment>
    );
}
export default withRouter(SurveyCards);