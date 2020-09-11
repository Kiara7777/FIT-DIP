import React, {useState, useEffect, useRef} from "react";
import MaterialTable from "material-table";
import {question, tableLocalization} from "../constants";
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import AddBoxIcon from "@material-ui/icons/AddBox";
import {makeStyles} from "@material-ui/core/styles";
import QuestionDetail from "./QuestionDetail";
import QuestionDialog from "./QuestionDialog";
import {setErrorCode} from "../../actions";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({
    riskDetail: {
        width: "100%"
    }
}));

/**
 * Kompoennta tabulky, zobrazuje otazky umoznuje je pridavat, editovat, mazat
 *
 * Autor: Sara Skutova
 * */
function QuestionTable() {

    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [oblastLookup, setOblastLookup] = useState({});
    const [answerLookup, setAnswerLookup] = useState({});

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [row, setRow] = useState({});

    const change = useSelector(state => state.change);
    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    //ziskani vsech potrebnych dat ze serveru - vsechny otazky, vsechny oblasti, vsechny odpovedi
    const [loadingQ, dataQ] = useGetData(question.getAllQuestions, change);
    const [loadingAreas, dataAreas] = useGetData(question.getAllAreas, change);
    const [loadingAnswers, dataAnswers] = useGetData(question.getAllAnswers, change);


    /**
     * Funkce na vytvoreni lookupu - seznamu, v tomto pridape seznam oblasti
     * */
    function createLookup(data, field) {
        let newLookup = {};

        data.forEach(item => {
            newLookup[item.id] = item[field];
        });

        if (field === "nazev")
            setOblastLookup(newLookup);
        else
            setAnswerLookup(newLookup);
    }

    /**
     * Handle na reakci zavreni podpurneho dialogu, zavreni mohlo byz z duvodu zruseni nebo potvrzeni zmeny dat
     * */
    const handleZavreno = (newQuestion, tableId, approved) => {
        setOpen(false);

        if (approved) {
            if (edit) { //editovalo se to
                const newData = [...data];
                newData[tableId] = newQuestion;
                setData(newData);
            } else { //nedituje se, pridava se
                setData(prevState => [...prevState, newQuestion]);
            }
        }

        setEdit(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingQ && !loadingAreas && !loadingAnswers && dataQ != null && dataAreas != null && dataAnswers != null) {
            setData(dataQ);
            createLookup(dataAreas, 'nazev');
            createLookup(dataAnswers, 'textOdpovedi');
            setIsLoading(false);
        } else if (loadingQ || loadingAreas || loadingAnswers){
            setIsLoading(true);
        }

    }, [loadingQ, loadingAreas, loadingAnswers,
        dataQ, dataAreas, dataAnswers]);


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
                    { title: 'Text otázky', field: 'textOtazky' },
                    { title: 'Oblast otázky', field: 'oblastOtazky.id', lookup: oblastLookup },

                ]}
                data={data}
                detailPanel={[
                    {
                        tooltip: 'Opovědi',
                        render: rowData => {
                            return (
                                <div className={classes.riskDetail}>
                                    <QuestionDetail {...rowData}/>
                                </div>
                            )
                        },
                    }
                ]}
                editable={{
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            axios.delete(`/api/nprr/question/${oldData.id}`, {cancelToken: source.current.token})
                                .then(result => {
                                    let newData = [...data];
                                    let num = newData.indexOf(oldData);
                                    newData.splice(num, 1);
                                    setData(newData);
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
                            setTitle("Editace otázky");
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
                            setTitle("Tvorba otázky");
                            setOpen(true);
                        }
                    },
                ]}
                options={{
                    actionsColumnIndex: -1
                }}
                title="Otázky"
                localization={tableLocalization}
            />
            <QuestionDialog open={open}
                            edit={edit}
                            question={row}
                            oblasti={oblastLookup}
                            answers={answerLookup}
                            title={title}
                            handleZavreno={handleZavreno}
            />
        </div>
    );


}

export default QuestionTable;