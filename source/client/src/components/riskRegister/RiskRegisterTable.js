import React, {useState, useEffect, useRef} from "react";
import MaterialTable, {MTableEditField} from "material-table";
import {risk, tableLocalization} from "../constants";
import axios from 'axios';
import {changeTrue, setErrorCode} from "../../actions";
import {useDispatch, useSelector} from "react-redux";
import {createCategoryLookup} from "../../spolecneFunkce";
import RiskRegisterDialog from "./RiskRegisterDialog";
import AddBoxIcon from "@material-ui/icons/AddBox";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/**
 * Kompoenenta tabulky, zobrazuje rizika v centralnim registru, umoznuje je pridavat, editovat, mazat
 *
 * Autor: Sara Skutova
 * */
function RiskRegisterTable() {

    const [isLoading, setIsLoading] = useState(true);
    const [riskRegisterData, setRiskRegisterData] = useState([]);
    const [categoryLookup, setCategoryLookup] = useState({});

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [row, setRow] = useState({});

    let changed = useSelector(state => state.change);
    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    //ziskani potrebnych dat zse serveru - vsechna rizika, vsechny kategorie rizik
    const [loadingRisk, dataRisk] = useGetData(risk.getAllRisk, changed);
    const [loadingC, dataC] = useGetData(risk.getRiskCategories, changed);


    /**
     * Handle na reakci zavreni podpurneho dialogu, zavreni mohlo byz z duvodu zruseni nebo potvrzeni zmeny dat
     * */
    const handleZavreno = (newRisk, tableId, approved) => {
        setOpen(false);

        if (approved) {
            if (edit) { //editovalo se to
                const newRisksData = [...riskRegisterData];
                newRisksData[tableId] = newRisk;
                setRiskRegisterData(newRisksData);
                dispatch(changeTrue());
            } else { //nedituje se, pridava se
                setRiskRegisterData(prevState => [...prevState, newRisk]);
                dispatch(changeTrue());
            }
        }

        setEdit(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingC && !loadingRisk && dataC != null && dataRisk != null) {
            setRiskRegisterData(dataRisk);
            const categ = createCategoryLookup(dataC);
            setCategoryLookup(categ);
            setIsLoading(false);
        } else if (loadingRisk || loadingC){
            setIsLoading(true);
        }
    }, [loadingRisk, loadingC, dataC, dataRisk]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel(); //tohle nic neudela, pokud neni axios pozadavek zrovna spusten
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////


    return(
        <React.Fragment>
            <MaterialTable
                isLoading={isLoading}
                columns={[
                    { title: 'Název ', field: 'nazev', editComponent: (props) => <MTableEditField {...props} fullWidth/>},
                    { title: 'Popis', field: 'popis', editComponent: (props) => <MTableEditField {...props} multiline fullWidth/> },
                    { title: 'Možné řešení', field: 'mozneReseni', editComponent: (props) => <MTableEditField {...props} multiline fullWidth/>},
                    { title: 'Kategorie', field: 'kategorie', lookup: categoryLookup, width: "10%"}
                ]}
                data={riskRegisterData}
                editable={{
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            axios.delete(`/api/nprr/risk/${oldData.id}`, {cancelToken: source.current.token})
                                .then(result => {
                                    let newRiskData = [...riskRegisterData];
                                    let num = newRiskData.indexOf(oldData);
                                    newRiskData.splice(num, 1);
                                    setRiskRegisterData(newRiskData);
                                    dispatch(changeTrue());
                                    resolve();
                                })
                                .catch(error => {
                                    if(!axios.isCancel(error)) {
                                        dispatch(setErrorCode(error.response.status));
                                    }
                                    //reject(new Error("Delete risk error"));
                                });
                        }),
                }}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: tableLocalization.body.editTooltip,
                        onClick: (event, rowData) => {
                            setRow(rowData);
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
            <RiskRegisterDialog open={open}
                                edit={edit}
                                title={title}
                                risk={row}
                                category={categoryLookup}
                                handleZavreno={handleZavreno}

            />
        </React.Fragment>
    );

}

export default RiskRegisterTable;