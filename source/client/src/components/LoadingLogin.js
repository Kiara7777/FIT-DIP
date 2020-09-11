import React, {useEffect } from 'react';
import {useDispatch} from "react-redux";
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import LoginForm from "./LoginForm";
import {logIN, setUser} from '../actions';
import {info} from "./constants";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/**
 * Komponenta zobrazujici komponentu prihlasovanciho formulare
 *
 * Autor: Sara Skutova
 * */
function LoadingLogin() {

    const dispatch = useDispatch();

    //spusti se jak se nacte komponenta, otestuje stav prihalseni na serveru
    useEffect(() => {
        trackPromise(
        axios.get(info.userInfo)
            .then(response => {
                dispatch(setUser(response.data));
                dispatch(logIN());
            })
            .catch(error => {
                console.log("nejses prihlasenej");
            })
        );
    }, [dispatch]);


    return(
        <LoginForm/>
    );

}
export default LoadingLogin;