import React, {useState, useEffect, useRef} from "react";
import {Grid, TextField, Tooltip, IconButton, InputAdornment} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ProjectInfoCard from "./ProjectInfoCard";
import axios from "axios";
import ConformDialog from "../ConformDialog";
import {Link, withRouter } from 'react-router-dom';
import {visibleOnlyAdmin} from "../../security/secureComponents";
import {setErrorCode} from "../../actions";
import {useDispatch} from "react-redux";
import DashboardTextMsg from "../dashboard/DashboardTextMsg";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

//inspirace na search input field je z material table, co nejvice jsem se snazila udelat stejny styl
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
 * komponenta tlasitka pro pridani projektu
 * */
const AddButton = () => (
    <Tooltip title="Přidat">
        <IconButton component={Link} to={`/app/project/addForm`}>
            <AddBoxIcon />
        </IconButton>
    </Tooltip>
);


/**
 * Komponenta zobrazujici karty projektu + dalsi male komponenty
 *
 * props:
 *      queary - dotaz,, posila se na server, urcuje jake porjekty chceme
 *
 * Autor: Sara Skutova
 *
 * */
function ProjectCards(props) {
    const classes = useStyles();
    const [projectsData, setProjectData] = useState([]);
    const [searchedProjData, setSearchedProjData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [noSearchText, setNoSearchText] = useState(true);
    const [noSearchData, setNoSearchData] = useState(false);
    const [noData, setNoData] = useState(true);

    const [open, setOpen] = useState(false);
    const [projDele, setProjDele] = useState({});

    const [loadingP, dataP] = useGetData(props.queary, false);

    const source = useRef(axios.CancelToken.source());

    const dispatch = useDispatch();

    const AddPRojectAdmin = visibleOnlyAdmin(() => <AddButton />);


    /**
     * Pozadavek na server na smazani projektu
     * */
    async function deleteProject(id) {

        try {
           await axios.delete(`/api/nprr/project/${id}`, {cancelToken: source.current.token});
        } catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }

/*    function filterSearch(item) {

        let text = "";
        if(item.aktivni)
            text = "Aktivní";
        else
            text = "Neaktivní";

        return item.nazev.includes(searchText) || item.popis.includes(searchText) || item.vedouci.includes(searchText) || text.includes(searchText);

    }*/


    /**
     * Handle funkce pro vyhledavaci pole
     * Dynamicky vyhledava zadanou hodnotu v datech vsech karet, pokud najde v karte projektu shodu, tak se zobrazi
     * */
    const handleSearchField = event => {
        setSearchText(event.target.value);
        if (event.target.value === "") {
            setNoSearchText(true);
            setSearchedProjData(projectsData);
        }
        else
            setNoSearchText(false);

        //const arr = projectsData.filter(filterSearch);
        //setSearchedProjData(arr);
        const search = event.target.value;
        const arr = projectsData.filter(item => {
            let text = "";
            if(item.aktivni)
                text = "Aktivní";
            else
                text = "Neaktivní";

            return item.nazev.includes(search) || item.popis.includes(search) || item.vedouci.includes(search) || text.includes(search);
        });

        if(arr.length > 0)
            setNoSearchData(false);
        else
            setNoSearchData(true);


        setSearchedProjData(arr);
    };

    /**
     * Reaguje na talcitko vycisteni vyhledavaciho pole, vymaze z neho hodnotu tim se znovu zobrazi vsechny karty projektu
     * */
    const handleCleanButton = () => {
        setNoSearchText(true);
        setSearchedProjData(projectsData);
        setSearchText("");
    };

    /**
     * Reakci na prikaz smazani rpojektu, zobrazi se dialog
     * */
    const handleDelete = (projID) => {
        const proj = projectsData.find(proj => proj.id === projID);
        setProjDele(proj);
        setOpen(true);
    };

    /**
     * Zruseni dilaogu smazani
     * */
    const handleCancel = () => {
        setOpen(false);
    };

    /**
     * Potvrzeni smazani + kace okolo toho
     * */
    const handleApproval = () => {
        const newArray = [
            ...projectsData
        ];

        const index = newArray.findIndex(item => item.id === projDele.id);
        newArray.splice(index, 1);
        setProjectData(newArray);
        setSearchedProjData(newArray);
        deleteProject(projDele.id);
        setProjDele({});
        setOpen(false);
    };


    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingP && dataP != null) {
            if(dataP.length > 0)
                setNoData(false);
            setProjectData(dataP);
            setSearchedProjData(dataP);
        }
    }, [loadingP, dataP]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel(); //tohle nic neudela, pokud neni axios pozadavek zrovna spusten
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    //to pole vyhledavani je inspirovano z tabulek material table, jedna se tem prvni div
    return (
        <React.Fragment>
            <div className={classes.searchDiv}>
                <TextField className={classes.searchInput}
                           id="searchField"
                           label=""
                           placeholder="Hledat"
                           name="searchText"
                           value={searchText}
                           onChange={handleSearchField}
                           InputProps={{
                               startAdornment: (
                                   <InputAdornment position="start">
                                       <Tooltip title="Hledat">
                                           <SearchIcon fontSize="small"/>
                                       </Tooltip>
                                   </InputAdornment>
                               ),
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <IconButton onClick={handleCleanButton} disabled={noSearchText}>
                                           <ClearIcon fontSize="small"/>
                                       </IconButton>
                                   </InputAdornment>
                               )
                           }}
                />
                <AddPRojectAdmin/>
            </div>

            <Grid container spacing={3}>
                {
                    noData ?
                        <DashboardTextMsg text="Žádné přístupné projekty"/>
                        :
                        <React.Fragment>
                            {
                                noSearchData ?
                                    <DashboardTextMsg text="Zadanou frází neobsahuje žádný projekt"/>
                                    :
                                    searchedProjData.map((projectCard, index) => (
                                        <Grid key={index} item xs={12} sm={6} md={3} lg={3}>
                                            <ProjectInfoCard key={projectCard.id} cardInfo={projectCard} handleDelete={handleDelete} />
                                        </Grid>
                                    ))
                            }
                        </React.Fragment>
                }

            </Grid>
            <ConformDialog title={"Odstranit projekt " + projDele.nazev + "?"}
                           text="Tímto se odstraní požadovaný projekt a všechny jeho odvozené informace (přiřazené rizika, swot analýza, přiřazení řešitelé a statistika vyplněných dotazníků) z databáze."
                           handleCancel={handleCancel}
                           handleApproval={handleApproval}
                           open={open}
            />

        </React.Fragment>
    );
}
export default withRouter(ProjectCards);