import React, {useState, useEffect, useRef} from "react";
import MaterialTable from "material-table";
import {tableLocalization, user} from "../constants";
import {useDispatch} from "react-redux";
import {changeTrue, setErrorCode} from "../../actions";
import axios from 'axios';
import AddBoxIcon from "@material-ui/icons/AddBox";
import RoleDialog from "./RoleDialog";
import {useGetData} from "../useGetData";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/**
 * Komponenta tabulky, zobrazuje role, umoznuje je pridavat, editovat, mazat
 *
 * Autor: Sara Skutova
 * */
function RoleTable() {

    const [isLoading, setIsLoading] = useState(true);
    const [rolesData, setRolesData] = useState([]);
    const [secRolesLookup, setSecRolesLookup] = useState({});

    //ziskani potrebnych dat ze serveru - role a bezpecnostni role
    const [loadingR, dataR] = useGetData(user.getRoles, false);
    const [loadingS, dataS] = useGetData(user.getSecRoles, false);

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [row, setRow] = useState({});

    const source = useRef(axios.CancelToken.source());
    const dispatch = useDispatch();

    /**
     * Vytvoreni seznamu hodnot pro tabulku, at vi jake is je prirazemo cemu - tvori lookup bezpecnostnich roli
    * */
    function createLookup(data) {
        let newLookup = {};

        data.forEach(item => {
            newLookup[item.id] = item.nazev;
        });

        setSecRolesLookup(newLookup);
    }

    /**
     * Handle na reakci zavreni podpurneho dialogu, zavreni mohlo byz z duvodu zruseni nebo potvrzeni zmeny dat
     * */
    const handleZavreno = (newRole, tableId, approved) => {
        setOpen(false);

        if (approved) {
            if (edit) { //editovalo se to
                const newRolesData = [...rolesData];
                newRolesData[tableId] = newRole;
                setRolesData(newRolesData);
                dispatch(changeTrue());
            } else { //nedituje se, pridava se
                setRolesData(prevState => [...prevState, newRole]);
                dispatch(changeTrue());
            }
        }

        setEdit(false);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if (!loadingR && !loadingS && dataR != null && dataS != null) {
            setRolesData(dataR);
            createLookup(dataS);
            setIsLoading(false);
        } else if (loadingR || loadingS){
            setIsLoading(true);
        }

    }, [loadingR, loadingS, dataR, dataS]);

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
                    { title: 'Název Role', field: 'nazev' },
                    { title: 'Bezpečnostní role', field: 'securityRole', lookup: secRolesLookup }
                ]}
                data={rolesData}
                editable={{
                    onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                axios.delete(`/api/nprr/role/${oldData.id}`, {cancelToken: source.current.token})
                                    .then(result => {
                                        let newRolesData = [...rolesData];
                                        let num = newRolesData.indexOf(oldData);
                                        newRolesData.splice(num, 1);
                                        setRolesData(newRolesData);
                                        dispatch(changeTrue());
                                        resolve();
                                    })
                                    .catch(error => {
                                        if(!axios.isCancel(error)) {
                                            dispatch(setErrorCode(error.response.status));
                                        }
                                        //reject();
                                    });
                            })
                }}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: tableLocalization.body.editTooltip,
                        onClick: (event, rowData) => {
                            setRow(rowData);
                            setEdit(true);
                            setTitle("Editace role");
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
                            setTitle("Tvorba role");
                            setOpen(true);
                        }
                    },
                ]}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: []
                }}
                title="Role"
                localization={tableLocalization}
            />
            <RoleDialog open={open}
                        edit={edit}
                        role={row}
                        secRoles={secRolesLookup}
                        title={title}
                        handleZavreno={handleZavreno}
            />

        </div>
    );


}

export default RoleTable;