import React, {useState, useEffect, useRef} from "react";
import MaterialTable from "material-table";
import {question, tableLocalization} from "../constants";
import {useDispatch} from "react-redux";
import {changeTrue, setErrorCode} from "../../actions";
import axios from 'axios';
import AddBoxIcon from "@material-ui/icons/AddBox";
import AnswerDialog from "./AnswerDialog";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/**
 * Kompoennta tabulky, zobrazuje odpovedi, umoznuje je pridavat, editovat, mazat
 *
 * Autor: Sara Skutova
 * */
function AnswerTable() {

    const [isLoading, setIsLoading] = useState(true);
    const [answerData, setAnswerData] = useState([]);

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [row, setRow] = useState({});

    //ziskat vsechny odpovedi ze serveru
    const [loadingA, dataA] = useGetData(question.getAllAnswers, false);

    const source = useRef(axios.CancelToken.source());

    const dispatch = useDispatch();


    /**
     * Handle na reakci zavreni podpurneho dialogu, zavreni mohlo byz z duvodu zruseni nebo potvrzeni zmeny dat
    * */
    const handleZavreno = (newAnswer, tableId, approved) => {
        setOpen(false);

        if (approved) {
            if (edit) { //editovalo se to
                const newAnswerData = [...answerData];
                newAnswerData[tableId] = newAnswer;
                setAnswerData(newAnswerData);
                dispatch(changeTrue());
            } else { //nedituje se, pridava se
                setAnswerData(prevState => [...prevState, newAnswer]);
                dispatch(changeTrue());
            }
        }

        setEdit(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingA && dataA != null) {
            setAnswerData(dataA);
            setIsLoading(false);
        } else if (loadingA){
            setIsLoading(true);
        }
    }, [loadingA, dataA]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////

    return(
        <div>
            <MaterialTable
                isLoading={isLoading}
                columns={[
                    { title: 'Text odpovědi', field: 'textOdpovedi' },
                ]}
                data={answerData}
                editable={{
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            axios.delete(`/api/nprr/answer/${oldData.id}`, {cancelToken: source.current.token})
                                .then(result => {
                                    let newAmswersData = [...answerData];
                                    let num = newAmswersData.indexOf(oldData);
                                    newAmswersData.splice(num, 1);
                                    setAnswerData(newAmswersData);
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
                            setTitle("Editace odpovědi");
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
                            setTitle("Tvorba odpovědi");
                            setOpen(true);
                        }
                    },
                ]}
                options={{
                    actionsColumnIndex: -1
                }}
                title="Odpovědi"
                localization={tableLocalization}
            />
            <AnswerDialog open={open}
                        edit={edit}
                        answer={row}
                        title={title}
                        handleZavreno={handleZavreno}
            />

        </div>
    );


}

export default AnswerTable;