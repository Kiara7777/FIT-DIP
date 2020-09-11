import React, {useState, useEffect, useRef} from "react";
import MaterialTable, {MTableEditField} from "material-table";
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";
import {removeRiskFromProject, setErrorCode} from "../../../actions";
import {createCategoryLookup} from "../../../spolecneFunkce";
import {tableLocalization, stavLookup, pravdepLookup, prioritaLookup, dopadLookup} from "../../constants";
import {makeStyles} from "@material-ui/core/styles";
import RiskDetail from "./RiskDetail";
import AddBoxIcon from '@material-ui/icons/AddBox';
import RiskDialog from "./RiskDialog";
import {vOProjMPRojUAndAdminAndFailure, vProjActive} from "../../../security/secureComponents";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;


/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    riskDetail: {
        width: "100%"
    }
}));


/**
 * Komponenta pro zobrazovani rizik ktere jsou prirazene k danemu projektu, tabulka z material-table
 * props:
 * category: seznam vsech kategorii
 *
 * Autor: Sara Skutova
 * */
function ProjectRiskTable(props) {

    const classes = useStyles();

    const [riskAdmins, setRiskAdmins] = useState({});
    const [categoryLookup, setCategoryLookup] = useState({});

    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);
    const [row, setRow] = useState({});
    const [edit, setEdit] = useState(true);

    const source = useRef(axios.CancelToken.source());

    const dispatch = useDispatch();
    const projectData = useSelector(state => state.ProjectInfo);
    const managerData = useSelector(state => state.manager);
    const resiteleData = useSelector(state => state.resitele);
    const riskData = useSelector(state => state.projectRisks);
    const riskLoader = useSelector(state => state.riskLoading);

    /**
     * Funkce na vytvoreni lookupu pro vyber spravce rizika
     * manager je manager projektu, resitele je pole restielu projektu, spravceID a spravceNAzev je id a nazev aktulaniho spravce
     * je mozne, ze aktulani spravce uz nebude clenem tymu - V zaznamu k riziku, ale zustane
     * */
    function createMngLookup(manager, resitele, rizika) {
        //objekt lze notovat jako pole, obj['s'] = 1; - kdyz tam ta vlastnost chybi tak ji tam da, kdyz tam je, tak ji modifikuje
        const lookup = {};
        lookup[manager.id] = manager.nazev;
        resitele.forEach(resitel => lookup[resitel.id] = resitel.nazev);

        if (Array.isArray(rizika))
            rizika.forEach(rizko => lookup[rizko.uzivID] = rizko.uzivNazev);
        else
            lookup[rizika.uzivID] = rizika.uzivNazev;

        return lookup;
    }

    const handleZavreno = () => {
        setOpen(false);
    };

    useEffect(() => {
        const categ = createCategoryLookup(props.category);
        setCategoryLookup(categ);
    }, [props.category]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);

    /**
     * Tabulka s akcemi - pro ty co na projeku pacuji a admina
     * */
    const TableWithAction = () => (
        <MaterialTable
            isLoading={riskLoader}
            columns={[
                { title: 'Název ', field: 'nazev', editComponent: (props) => <MTableEditField {...props} fullWidth/> },
                { title: 'Stav', field: 'stav', lookup: stavLookup},
                { title: 'Prevděpodobnost', field: 'pravdepodobnost', lookup: pravdepLookup},
                { title: 'Dopad', field: 'dopad', lookup: dopadLookup},
                { title: 'Priorita', field: 'priorita', lookup: prioritaLookup},
                { title: 'Správce', field: 'uzivID', lookup: createMngLookup(managerData, resiteleData, riskData)},
                { title: 'Kategorie', field: 'kategorie', lookup: categoryLookup}
            ]}
            detailPanel={[
                {
                    tooltip: 'Podrobnosti',
                    render: rowData => {
                        return (
                            <div className={classes.riskDetail}>
                                <RiskDetail {...rowData}/>
                            </div>
                        )
                    },
                }
            ]}
            data={riskData}
            editable={{
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        axios.delete(`/api/nprr/project/${projectData.id}/risk/${oldData.id}`, {cancelToken: source.current.token})
                            .then(result => {
                                dispatch(removeRiskFromProject(oldData));
                                resolve();
                            })
                            .catch(error => {
                                if(!axios.isCancel(error)) {
                                    dispatch(setErrorCode(error.response.status));
                                }
                                //reject(new Error("Delete risk error"));
                            });
                    })
            }}
            actions={[
                {
                    icon: 'edit',
                    tooltip: tableLocalization.body.editTooltip,
                    onClick: (event, rowData) => {
                        setRow(rowData);
                        setRiskAdmins(createMngLookup(managerData, resiteleData, rowData));
                        setEdit(true);
                        setTitle("Editace rizika");
                        setOpen(true);
                    }
                },
                {
                    icon: () => <AddBoxIcon />,
                    tooltip: tableLocalization.body.addTooltip,
                    isFreeAction: true,
                    onClick: (event, rowData) => {
                        setRow(rowData);
                        setRiskAdmins(createMngLookup(managerData, resiteleData, []));
                        setEdit(false);
                        setTitle("Tvorba rizika");
                        setOpen(true);
                    }
                },
            ]}
            options={{
                actionsColumnIndex: -1
            }}
            title="Registr rizik"
            localization={tableLocalization}
        />

    );

    /**
     * Tabulka bez akci, pro ty co na projektu nepracuji, ale maji pristup - defkato jiny manager
     * */
    const TableWithoutAction = () => (
        <MaterialTable
            isLoading={riskLoader}
            columns={[
                { title: 'Název ', field: 'nazev', editComponent: (props) => <MTableEditField {...props} fullWidth/> },
                { title: 'Stav', field: 'stav', lookup: stavLookup},
                { title: 'Prevděpodobnost', field: 'pravdepodobnost', lookup: pravdepLookup},
                { title: 'Dopad', field: 'dopad', lookup: dopadLookup},
                { title: 'Priorita', field: 'priorita', lookup: prioritaLookup},
                { title: 'Správce', field: 'uzivID', lookup: createMngLookup(managerData, resiteleData, riskData)},
                { title: 'Kategorie', field: 'kategorie', lookup: categoryLookup}
            ]}
            detailPanel={[
                {
                    tooltip: 'Podrobnosti',
                    render: rowData => {
                        return (
                            <div className={classes.riskDetail}>
                                <RiskDetail {...rowData}/>
                            </div>
                        )
                    },
                }
            ]}
            data={riskData}
            options={{
                actionsColumnIndex: -1
            }}
            title="Registr rizik"
            localization={tableLocalization}
        />
    );

/*    const MyDialog = () => (
        <RiskDialog open={open}
                    title={title}
                    risk={row}
                    handleZavreno={handleZavreno}
                    admins={riskAdmins}
                    category={categoryLookup}
                    edit={edit}
        />
    );*/

    const VOProjMProjUAdminAndFailureTable = vOProjMPRojUAndAdminAndFailure(TableWithAction, TableWithoutAction);
    //const VOProjMProjUAdminDialog = vOProjMPRojUAndAdmin(() => <MyDialog />);
    const FinalTable = vProjActive(VOProjMProjUAdminAndFailureTable, TableWithoutAction);

    return(
        <div>
            <FinalTable />
            <RiskDialog open={open}
                        title={title}
                        risk={row}
                        handleZavreno={handleZavreno}
                        admins={riskAdmins}
                        category={categoryLookup}
                        edit={edit}
            />
        </div>
    );
}

export default ProjectRiskTable;