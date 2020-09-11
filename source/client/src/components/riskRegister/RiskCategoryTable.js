import React, {useEffect, useState} from "react";
import axios from 'axios';
import MaterialTable from "material-table";
import {MTableEditField} from 'material-table'
import {changeTrue, setErrorCode} from "../../actions";
import {risk, tableLocalization} from "../constants";
import {useDispatch} from "react-redux";
import AddBoxIcon from "@material-ui/icons/AddBox";
import RiskCategoryDialog from "./RiskCategoryDialog";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;


/**
 * Kompoennta tabulky, zobrazuje kategorie rizik, umoznuje je pridavat, editovat, mazat
 *
 * Autor: Sara Skutova
 * */
function RiskCategoryTable() {

    const [isLoading, setIsLoading] = useState(true);
    const [kategoryData, setKategoryData] = useState([]);

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [row, setRow] = useState({});

    //ziskani potrebnych dat zse serveru - vsechny kategorie rizik
    const [loadingC, dataC] = useGetData(risk.getRiskCategories, false);

    const dispatch = useDispatch();

    /**
     * Handle na reakci zavreni podpurneho dialogu, zavreni mohlo byz z duvodu zruseni nebo potvrzeni zmeny dat
     * */
    const handleZavreno = (newCategory, tableId, approved) => {
        setOpen(false);

        if (approved) {
            if (edit) { //editovalo se to
                const newKategoryData = [...kategoryData];
                newKategoryData[tableId] = newCategory;
                setKategoryData(newKategoryData);
                dispatch(changeTrue());
            } else { //nedituje se, pridava se
                setKategoryData(prevState => [...prevState, newCategory]);
                dispatch(changeTrue());
            }
        }

        setEdit(false);
    };

    useEffect(() => {
        if (!loadingC && dataC != null) {
            setKategoryData(dataC);
            setIsLoading(false);
        }  else if (loadingC){
            setIsLoading(true);
        }
    }, [loadingC, dataC]);


    //multiline pro edit https://github.com/mbrn/material-table/pull/1232
    // , editComponent: (props) => <MTableEditField {...props} multiline/>
    return (
        <React.Fragment>
            <MaterialTable
                isLoading={isLoading}
                columns={[
                    { title: 'Název', field: 'nazev', width: "20%"},
                    { title: 'Popis', field: 'popis', editComponent: (props) => <MTableEditField {...props} multiline fullWidth/> },
                ]}
                data={kategoryData}
                editable={{
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            axios.delete(`/api/nprr/kategorie/${oldData.id}`)
                                .then(result => {
                                    let newKategorieData = [...kategoryData];
                                    let num = newKategorieData.indexOf(oldData);
                                    newKategorieData.splice(num, 1);
                                    setKategoryData(newKategorieData);
                                    dispatch(changeTrue());
                                    resolve();
                                })
                                .catch(error => {
                                    dispatch(setErrorCode(error.response.status));
                                    //reject(new Error("Delete kategorie error"));
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
                            setTitle("Editace kategorie");
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
                            setTitle("Tvorba kategorie");
                            setOpen(true);
                        }
                    },
                ]}
                options={{
                    actionsColumnIndex: -1,
                }}
                title="Kategorie rizik"
                localization={tableLocalization}
            />
            <RiskCategoryDialog open={open}
                                edit={edit}
                                category={row}
                                title={title}
                                handleZavreno={handleZavreno}
            />
        </React.Fragment>
    );

}

export default RiskCategoryTable;