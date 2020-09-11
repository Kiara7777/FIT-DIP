import {CHANGE_DEADLINE, CLEAN_PROJECT_DATA} from "../components/constants";

/**
 * Reducers funkce pro system REDUXU.
 * REDUX TUTORIAL: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1s&ab_channel=DevEd
 * Reducer pro deaedline na projektu
 *
 * Autor: Sara Skutova
 * */

const deadlineReducer = (state = "", action) => {
    switch (action.type) {
        case CHANGE_DEADLINE:
            return action.payload;
        case CLEAN_PROJECT_DATA:
            return "";
        default:
            return state;
    }
};

export default deadlineReducer;