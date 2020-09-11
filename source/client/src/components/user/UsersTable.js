import React, {useState, useEffect, useRef} from "react";
import MaterialTable from "material-table";
import {tableLocalization, user} from "../constants";
import axios from 'axios';
import {useSelector, useDispatch} from "react-redux";
import {changeTrue, setErrorCode} from "../../actions";
import AddBoxIcon from "@material-ui/icons/AddBox";
import UserDialog from "./UserDialog";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/**
 * Kompoenenta tabulky, zobrazuje uzivatele, umoznuje je pridavat, editovat, mazat
 *
 * Autor: Sara Skutova
 * */
function UsersTable() {

    const [isLoading, setIsLoading] = useState(true);
    const [usersData, setUsersData] = useState([]);
    const [roleLookup, setRoleLookup] = useState({});

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [row, setRow] = useState({});

    const source = useRef(axios.CancelToken.source());

    let changed = useSelector(state => state.change);
    const dispatch = useDispatch();

    //ziskani potrebnych dat ze serveru - uzivatele a role
    const [loadingU, dataU] = useGetData(user.getUsers, changed);
    const [loadingR, dataR] = useGetData(user.getRoles, changed);

    /**
     * Vytvoreni seznamu hodnot pro tabulku, at vi jake is je prirazemo cemu - tvori lookup roli
     * */
    function createLookup(data) {
        let newLookup = {};

        data.forEach(item => {
            newLookup[item.id] = item.nazev;
        });

        setRoleLookup(newLookup);
    }

    /**
     * Handle na reakci zavreni podpurneho dialogu, zavreni mohlo byz z duvodu zruseni nebo potvrzeni zmeny dat
     * */
    const handleZavreno = (newUser, tableId, approved) => {
        setOpen(false);

        if (approved) {
            if (edit) { //editovalo se to
                const newUserData = [...usersData];
                newUserData[tableId] = newUser;
                setUsersData(newUserData);
                dispatch(changeTrue());
            } else { //nedituje se, pridava se
                setUsersData(prevState => [...prevState, newUser]);
                dispatch(changeTrue());
            }
        }

        setEdit(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingU && !loadingR && dataU != null && dataR != null) {
            setUsersData(dataU);
            createLookup(dataR);
            setIsLoading(false);
        } else if (loadingR || loadingU){
            setIsLoading(true);
        }

    }, [loadingU, loadingR, dataU, dataR]);


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
                { title: 'Login', field: 'login' },
                { title: 'Heslo', field: 'passwd' },
                { title: 'Email', field: 'email' },
                { title: 'Jméno a příjmení', field: 'nazev'},
                { title: 'Role', field: 'role', lookup: roleLookup }
            ]}
            data={usersData}
            editable={{
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        axios.delete(`/api/nprr/user/${oldData.id}`, {cancelToken: source.token})
                            .then(result => {
                                let newUserData = [...usersData];
                                let num = newUserData.indexOf(oldData);
                                newUserData.splice(num, 1);
                                setUsersData(newUserData);
                                dispatch(changeTrue());
                                resolve();
                            })
                            .catch(error => {
                                if(!axios.isCancel(error)) {
                                    dispatch(setErrorCode(error.response.status));
                                }
                                //reject(new Error("Delete user error"));
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
                        setTitle("Editace uživatele");
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
                        setTitle("Tvorba uživatele");
                        setOpen(true);
                    }
                },
            ]}
            options={{
                actionsColumnIndex: -1
            }}
            title="Uživatelé"
            localization={tableLocalization}
        />
            {/*console.count()*/}
            <UserDialog open={open}
                        edit={edit}
                        user={row}
                        roles={roleLookup}
                        title={title}
                        handleZavreno={handleZavreno}
            />
        </div>
    );
}

export default UsersTable;