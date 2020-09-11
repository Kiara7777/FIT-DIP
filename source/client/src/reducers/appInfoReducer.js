import {
    CLEAR_ERROR,
    LOG_IN,
    LOG_OUT,
    SET_DRAWER,
    SET_ERROR,
    SET_THEME,
    SET_TITLE,
    SET_USER
} from "../components/constants";

/**
 * Reducers funkce pro system REDUXU.
 * REDUX TUTORIAL: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1s&ab_channel=DevEd
 * Tyto jsou zamerene na obecne informace v palikaci.
 *
 * Autor: Sara Skutova
 * */

/**
 * Reducer co indikuje prihlaseni a odhlaseni v aplikaci
 * */
export const  isLoggedReducer = (state = false, action) => {

    switch (action.type) {
        case LOG_IN:
            return true;
        case LOG_OUT:
            return false;
        default:
            return state;
    }
};

/**
 * Reduer, ktery indikuje stav menu, zda je otevreno nebo zaavreno
 * */
export const drawerReducer = (state = false, action) => {
    switch (action.type) {
        case SET_DRAWER:
            return action.payload;
        default:
            return state;

    }
};

/**
 * Reducer, ktery uchova titulek okna, ktere je prave zobrazeno - to co je v addBaru
 * */
export const titleReducer = (state = "", action) => {
    switch (action.type) {
        case SET_TITLE:
            return action.payload;
        default:
            return state;

    }
};

/**
 * Reducer, ktery uchova informace o aktualne prihlasenem uzivateli
 * */
export const  userInfo = (state = null, action) => {
    switch (action.type) {
        case SET_USER:
            return action.payload;
        default:
            return state;

    }
};

/**
 * Reducer pro uchovavani informace, ktery theme je nastaveny
 * */
export const themeInfo = (state = 'light', action) => {
    switch (action.type) {
        case SET_THEME:
            return action.payload;
        default:
            return state;

    }
};

/**
 * Reducer pro nastaveni chyboveho kodu
 * */
export const errorCode = (state = null, action) => {
    switch (action.type) {
        case SET_ERROR:
            return action.payload;
        case CLEAR_ERROR:
            return null;
        default:
            return state;
    }
};

