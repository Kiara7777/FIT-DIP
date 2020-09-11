import React, {useState, useEffect, useRef} from "react";
import MaterialTable from "material-table";
import {question, tableLocalization} from "../constants";
import {useDispatch} from "react-redux";
import {changeTrue, setErrorCode} from "../../actions";
import axios from 'axios';
import AddBoxIcon from "@material-ui/icons/AddBox";
import QuestionAreaDialog from "./QuestionAreaDialog";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/**
 * Kompoennta tabulky, zobrazuje oblasti otazek, umoznuje je pridavat, editovat, mazat
 *
 * Autor: Sara Skutova
 * */
function QuestionAreaTable() {

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [row, setRow] = useState({});

    //ziskat vsechny oblasti otazek ze serveru
    const [loadingA, dataA] = useGetData(question.getAllAreas, false);

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();


    /**
     * Handle na reakci zavreni podpurneho dialogu, zavreni mohlo byz z duvodu zruseni nebo potvrzeni zmeny dat
     * */
    const handleZavreno = (newQuestionArea, tableId, approved) => {
        setOpen(false);

        if (approved) {
            if (edit) { //editovalo se to
                const newData = [...data];
                newData[tableId] = newQuestionArea;
                setData(newData);
                dispatch(changeTrue());
            } else { //nedituje se, pridava se
                setData(prevState => [...prevState, newQuestionArea]);
                dispatch(changeTrue());
            }
        }

        setEdit(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingA && dataA != null) {
            setData(dataA);
            setIsLoading(false);
        } else if (loadingA){
            setIsLoading(true);
        }
    }, [loadingA, dataA]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel(); //tohle nic neudela, pokud neni axios pozadavek zrovna spusten
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    return(
        <div>
            <MaterialTable
                isLoading={isLoading}
                columns={[
                    { title: 'Název oblasti', field: 'nazev' },
                ]}
                data={data}
                editable={{
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            axios.delete(`/api/nprr/questionArea/${oldData.id}`, {cancelToken: source.current.token})
                                .then(result => {
                                    let newData = [...data];
                                    let num = newData.indexOf(oldData);
                                    newData.splice(num, 1);
                                    setData(newData);
                                    dispatch(changeTrue());
                                    resolve();
                                })
                                .catch(error => {
                                    if(!axios.isCancel(error)) {
                                        dispatch(setErrorCode(error.response.status));
                                    }
                                    //reject();
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
                            setTitle("Editace oblasti otázky");
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
                            setTitle("Tvorba oblasti otázky");
                            setOpen(true);
                        }
                    },
                ]}
                options={{
                    actionsColumnIndex: -1
                }}
                title="Oblasti otázek"
                localization={tableLocalization}
            />
            <QuestionAreaDialog open={open}
                                edit={edit}
                                questionArea={row}
                                title={title}
                                handleZavreno={handleZavreno}
            />

        </div>
    );


}

export default QuestionAreaTable;