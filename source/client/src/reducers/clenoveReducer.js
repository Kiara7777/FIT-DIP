import {CHANGE_MANAGER, CHANGE_RESITELE, CLEAN_PROJECT_DATA} from "../components/constants";

/**
 * Reducers funkce pro system REDUXU.
 * REDUX TUTORIAL: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1s&ab_channel=DevEd
 * Zamereni na cleny resitelskehp tymu
 *
 * Autor: Sara Skutova
 * */


const managerInitialState = {
    id: "",
    nazev: ""
};

/**
 * REducer pro managera projektu
 * */
export const managerReducer = (state = managerInitialState, action) => {
    switch (action.type) {
        case CHANGE_MANAGER:
            return action.payload;
        case CLEAN_PROJECT_DATA:
            return managerInitialState;
        default:
            return state;
    }
};

/**
 * REducer pro resitele projektu
 * */
export const resiteleReducer = (state = [], action) => {
    switch (action.type) {
        case CHANGE_RESITELE:
            return action.payload;
        case CLEAN_PROJECT_DATA:
            return [];
        default:
            return state;
    }
};