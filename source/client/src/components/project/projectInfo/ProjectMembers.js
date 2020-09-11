import React, {useEffect, useRef, useState} from "react";
import {Paper, FormControl, Select, MenuItem, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, InputLabel, Chip} from "@material-ui/core";
import MyHeaderButtons from "../../MyHeaderButtons";
import DeleteIcon from '@material-ui/icons/Delete';
import {makeStyles} from "@material-ui/core/styles";
import {useSelector, useDispatch} from "react-redux";
import { format} from 'date-fns';
import axios from "axios";
import clsx from 'clsx';
import {changePeopleCount, changeResitele, setErrorCode} from "../../../actions";
import TextTitle from "../../TextTitle";
import {visOnlProjMngAdminAndFailure, vProjActive} from "../../../security/secureComponents";
import {trackPromise} from "react-promise-tracker";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* STYL KOMPONENTY
dsign Chipu inspirovan/revzat y MAterial-UI
* */
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },

    input: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.primary.light,
        padding: theme.spacing(1)
    },

    memberBox: {
        display: "flex"
    },

    deleteButton: {
        marginLeft: "auto",
        padding: 0
    },

    hideButton: {
        visibility: "hidden"
    },

    inputChips: {
        display: "flex",
        flexWrap: "wrap"
    },

    chip: {
        margin: 3
    }

}));

/**
 * Kompoenenta Chipu od MAterial-UI, takove to pekne kualte zobrazeni.
 * */
const Chips = (props) => {
    const value = props.newUsers.find(user => user.id === props.id);
    return(
        <Chip label={value.nazev} className={props.classes.chip}/>
    );
};


/**
 * Komponenta pro vyber uzivatelu, je moznost vybrat nekolik uzivatelu najednou s jednom otevrenim toho selectu
 * */
const SelectMembers = (props) => (
    <FormControl fullWidth>
        <InputLabel id="pridatResitele">Přidat řešitele</InputLabel>
        <Select labelId="pridatResitele"
                multiple
                value={props.newUsersID}
                onChange={props.handleChangeSelect}
                renderValue={selected => (
                    <div className={props.classes.inputChips}>
                        {selected.map(value => (
                            <Chips key={value} id={value} newUsers={props.newUsers} classes={props.classes}/>
                        ))}
                    </div>
                )}
        >
            <MenuItem value="" disabled>Dostupní řešitelé</MenuItem>
            {
                props.users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.nazev}
                    </MenuItem>
                ))
            }

        </Select>
    </FormControl>
);


/**
 * Komponenta pro prirazovani/odhlasovani resitelu projektu (zde se neresi manager)
 * props:
 * title = pro to co se ma zobrazit nahore v nadpisu
 * users = dostupni uzivatele
 *
 * Autor: Sara Skutova
 * */
function ProjectMembers(props) {

    const classes = useStyles();

    //resitele a users jsou vsichni ve tvaru {id: id, nazev: nazev}
    const [edit, setEdit] = useState(false);
    const [resitele, setResitele] = useState([]); //ti co na projektu pracuji a nejsuo vedouci
    const [resiteleSave, setResiteleSave] = useState([]); //zaloha
    const [newUsersID, setNewUsersID] = useState([]); //seznam tech co se maji pridat k seznamu pracujicich - hodnota selectu - jenom ID
    const [newUsers, setNewUsers] = useState([]); //seznam tech co se maji pridat k seznamu pracujicich - hodnota selectu - ID A NAZEV
    const [users, setUsers] = useState([]); //seznam dostupnych resitelu
    const [usersSave, setUsersSave] = useState([]);

    const [projectUsers, setProjectUsers] = useState([]);

    const projectData = useSelector(state => state.ProjectInfo);
    const resiteleData = useSelector(state => state.resitele);
    const managerProjectu = useSelector(state => state.manager);
    const dispatch = useDispatch();

    const source = useRef(axios.CancelToken.source());

    /**
     * Pretvoreni dat do podobny jakou to chce server.
     * */
    function createDataForServer(users) {
        const today = format(new Date(), "yyyy-MM-dd");
        const newArrayUsers = [];

        for(let i = 0; i < users.length; i++) {
            const jeTam = projectUsers.find(user => user.id.uzivatelID === users[i].id); //find ma vracet undefined jestli tam tu hodnotu nenajde
            if (jeTam !== undefined) { //naslo to prvek co tam je
                const newItem = {
                    id: {
                        projectID: projectData.id,
                        uzivatelID: jeTam.id.uzivatelID
                    },
                    vedouci: jeTam.vedouci,
                    dateStart: jeTam.dateStart,
                    dateEnd: null,
                    aktivni: true,
                    projekt: {
                        id: projectData.id
                    },
                    uzivatel: {
                        id: jeTam.id.uzivatelID
                    }
                };
                newArrayUsers.push(newItem);

            }
            else { //je tam ted neco jineho, neco noveho
                const newItem = {
                    id: {
                        projectID: projectData.id,
                        uzivatelID: users[i].id
                    },
                    vedouci: false,
                    dateStart: today,
                    dateEnd: null,
                    aktivni: true,
                    projekt: {
                        id: projectData.id
                    },
                    uzivatel: {
                        id: users[i].id
                    }
                };
                newArrayUsers.push(newItem);
            }
        }

        return newArrayUsers;
    }


    /**
     * Ze seznamu uzivatelu vybere ty, kteri muzou byt prirazeni jako resitele
     * */
    function createUsersList(users) {
        return users.filter(user => user.bezpRole === "USER"); //nezarazeni a clenove tymu

    }

    /**
     * Zse seznamu dostupnych resitelu se odeberou ti co uz resiteli jsou.
     * V seznamu budou teda jenom novi
     * */
    function removeUser(usersList, newResitele) {
        let filterList = usersList;

        for (let i = 0; i < newResitele.length; i++) {
            filterList = filterList.filter(user => user.id !== newResitele[i].id)
        }

        return filterList;

    }


    /**
     * Transformace objektu mozneho resitele (Uzivatel) ze serveru na objekt pozadovany selectem
     * */
    function transformUsersFrom(users) {
        return users.map(user => {
            return {
                id: user.id,
                nazev: user.nazev,
            }
        });
    }

    /**
     * Odeslani novych resitelu na server
     * */
    async function sendUsers(newUsers) {
        try {
            await axios.post(`/api/nprr/project/${projectData.id}/users`, newUsers, {cancelToken: source.current.token});
        }catch (error) {
            if(!axios.isCancel(error)) {
                dispatch(setErrorCode(error.response.status));
            }
        }
    }


    /**
     * Handle selectu pro pridani resitele. Musi resit oddelene samotne id kvuli zobrazeni Chipu
     * */
    const handleChangeSelect = (event) => {
        //event.target.value je pole
        const newValues = event.target.value.map(id => {
            return users.find(item => item.id === id)
        });

        setNewUsersID(event.target.value);
        setNewUsers(newValues);
    };

    /**
     * Handle pro tlacitko editu. Kdyz uzivatel chce editovat danou komponentu.
     * */
    const handleEditClick = () => {
        setResitele(resiteleData);
        setResiteleSave(resiteleData);
        const pUsers = createUsersList(props.users);
        const tranformedUser = transformUsersFrom(pUsers);
        const userList = removeUser(tranformedUser, resiteleData);
        setUsers(userList);
        setUsersSave(userList);
        setEdit(true);
    };

    /**
     * Handle pro potvrzeni editace. Prepise se save hodnota.
     * Nastavi se aktulani hodnoty. Vymazou se hodnoty pro Chipy.
     * Vytvori se odpovidajici objekty UzivProjekt a nova data se odeslou na server.
     * Uvedomi se REDUX, ze se mozna zmenil pocet uzivatelu.
     * */
    const handleEditSave = () => {
        const newResitele = [...resitele, ...newUsers];

        //resitele
        setResitele(newResitele);
        setResiteleSave(newResitele);

        dispatch(changeResitele(newResitele));

         const newUserArray = removeUser(users, newResitele);

        //dostupni uzivatele
        setUsers(newUserArray);
        setUsersSave(newUserArray);

        //pomocne pole pro aktualni hodnoty selectu
        setNewUsersID([]);
        setNewUsers([]);

        const newData = createDataForServer(newResitele);
        if (managerProjectu.id === "" && managerProjectu.nazev === "") {//neni manager, smazan z projektu?
            dispatch(changePeopleCount(newResitele.length));
        } else {
            dispatch(changePeopleCount(newResitele.length + 1)); //ten +1 je manager
        }
        trackPromise(sendUsers(newData));

        setEdit(false);

    };

    /**
     * Obnovenu puvodnich hodnot. ukonceni editace a Vymazani hodnot Chipu
     * */
    const handleEditNo = () => {
        setResitele(resiteleSave);
        setUsers(usersSave);
        setNewUsersID([]);
        setNewUsers([]);
        setEdit(false);
    };

    /**
     * Handle pro vymazani resitele ze seznamu. Nasledne se resitel prida do seznamu dostupnych resitelu.
     * */
    const handleleDelete = (event, index) => {
        const newPole = resitele.filter((resite, indexArray) => indexArray !== index);
        const data = resitele[index];
        const newData = [
            ...users,
            data
        ];
        setUsers(newData);
        setResitele(newPole);
    };

    ////////////////// USEEFFECT slouzi pro reakci na zmenu stavu komponenty////////////////////
    useEffect(() => {
        if(props.usersProject !== undefined && props.usersProject.length !== 0) {
            setProjectUsers(props.usersProject);
        }
    }, [props.usersProject]);

    useEffect(() => {
        const testS = source;
        return() => {
            testS.current.cancel();
        }
    }, [source]);
    ///////////////////////////////////////////////////////////////////////////////////////////


    const UserList = (props) => {
        return (
            props.listData.map((resitel, index) => (
                <div key={resitel.id}>
                    <ListItem>
                        <ListItemText primary={resitel.nazev}/>
                        <ListItemSecondaryAction className={clsx(!edit && classes.hideButton)}>
                            <IconButton edge="end" aria-label="delete" onClick={event => handleleDelete(event, index)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </div>
            ))
        );
    };


    const Title = () => (<TextTitle title={props.title} />);
    const HeaderButton = () => (<MyHeaderButtons title={props.title}
                                                 edit={edit}
                                                 onSave={handleEditSave}
                                                 onNo={handleEditNo}
                                                 onEdit={handleEditClick}/>);

    const VOnlyProjMAndAAndFailure = visOnlProjMngAdminAndFailure(HeaderButton, Title);
    const FinalActive = vProjActive(VOnlyProjMAndAAndFailure, Title);



    return(
        <Paper className={classes.root}>
            <FinalActive />
            <List>
                {
                    edit ?
                        <UserList listData={resitele} />
                        :
                        <UserList listData={resiteleData} />
                }
            </List>
            {
                edit && <SelectMembers newUsersID={newUsersID} handleChangeSelect={handleChangeSelect} classes={classes} users={users} newUsers={newUsers}/>

            }
        </Paper>

    );
}


export default ProjectMembers;