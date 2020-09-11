import {CHANGE_FALSE, CHANGE_TRUE} from "../components/constants";

/**
 * Reducers funkce pro system REDUXU.
 * REDUX TUTORIAL: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1s&ab_channel=DevEd
 * Indikace, ze probehla zmena a komponent musi nacist zmeny v DB.
 *
 * Autor: Sara Skutova
 * */

const changeReducer = (state = false, action) => {
    switch (action.type) {
        case CHANGE_TRUE:
            return true;
        case CHANGE_FALSE:
            return false;
        default:
            return state;

    }
};

export default changeReducer;