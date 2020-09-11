
import {
    CHANGE_PROJECT_NAME,
    CHANGE_PROJECT_POPIS,
    CHANGE_PROJECT_START,
    CHANGE_PROJECT_AKTIVNI,
    CHANGE_PROJECT_KONEC,
    CHANGE_PROJECT,
    CHANGE_PL_NUMBER,
    CLEAN_PROJECT_DATA,
    CHANGE_PROJECT_RISK,
    SET_PROJECT_RISKS,
    REMOVE_RISK_FROM_PROJECT,
    ADD_RISK_TO_PROJECT,
    SET_RISK_LOADING,
    SET_PROJECT_SURVEY_DATA,
    ADD_PROJECT_SURVEY_DATA,
    SET_USER_DONE_SURVEY, REMOVE_SURVEY
} from "../components/constants";


/**
 * Reducers funkce pro system REDUXU.
 * REDUX TUTORIAL: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1s&ab_channel=DevEd
 * Zamereni na informace a data projektu projektu
 *
 * Autor: Sara Skutova
 * */

const initialSate = {
    id: "",
    nazev: "",
    popis: "",
    start: "",
    konec: "",
    aktivni: true,
    swot: null,
    dotaznikProjektu: null
};

/**
 * Reducer, stav pro informace na projektu
 * */
export const projectInfoReducer = (state = initialSate, action) => {
    switch (action.type) {
        case CHANGE_PROJECT_NAME:
            return {
                ...state,
                nazev: action.payload
            };
        case CHANGE_PROJECT_POPIS:
            return {
                ...state,
                popis: action.payload
            };
        case CHANGE_PROJECT_START:
            return {
                ...state,
                start: action.payload
            };
        case CHANGE_PROJECT_AKTIVNI:
            return {
                ...state,
                aktivni: action.payload
            };
        case CHANGE_PROJECT_KONEC:
            return {
                ...state,
                konec: action.payload
            };
        case CHANGE_PROJECT:
            return action.payload;
        case CLEAN_PROJECT_DATA:
            return initialSate;
        default:
            return state;


    }
};

/**
 * Reducer pro pocet resitelu na projektu + i manager TODO asi se bude predelavat
 * */
export const projectPeopleCountReducer = (state = 0, action) => {
    switch (action.type) {
        case CHANGE_PL_NUMBER:
            return action.payload;
        case CLEAN_PROJECT_DATA:
            return 0;
        default:
            return state;

    }
};

/**
 * Reducer pro rizika na projektu. Ummoznuje z pole rizik pridavat, odebirat, upravovat
 * */
export const projectRiskReducer = (state = [], action) => {
    switch (action.type) {
        case SET_PROJECT_RISKS:
            return action.payload;
        case CHANGE_PROJECT_RISK:
            return state.map(risk => {
                if (risk.id === action.payload.id)
                    return action.payload;
                return risk;
            });
        case REMOVE_RISK_FROM_PROJECT:
            return state.filter(risk => {
                if (risk.id === action.payload.id)
                    return false;
                return true;
            });
        case ADD_RISK_TO_PROJECT:
            return [...state, action.payload];
        case CLEAN_PROJECT_DATA:
            return [];
        default:
            return state;
    }
};

/**
 * Indikator zda v reduxu uz jsou informace o rizicich na projektu, potrebuje se to pro tabulku v ProjektRiskTable
 * */
export const riskLoading = (state = true, action) => {
    switch (action.type) {
        case SET_RISK_LOADING:
            return action.payload;
        case CLEAN_PROJECT_DATA:
            return true;
        default:
            return state;
    }
};

/**
 * Reducer pro vyplnena datadotazniku na projektu
 * */
export const projectSurveyDataReducer = (state = [], action) => {
    switch (action.type) {
        case SET_PROJECT_SURVEY_DATA:
            return action.payload;
        case ADD_PROJECT_SURVEY_DATA:
            return [...state, action.payload];
        case REMOVE_SURVEY:
            return [];
        case CLEAN_PROJECT_DATA:
            return [];
        default:
            return state;

    }
};


/**
 * Informace zda aktualne prihlaseny uzivatel uz odpovedel na dotaznik
 * */

export const userDoneSurvey = (state = false, action) => {
    switch (action.type) {
        case SET_USER_DONE_SURVEY:
            return action.payload;
        case REMOVE_SURVEY:
            return  false;
        case CLEAN_PROJECT_DATA:
            return false;
        default:
            return state;
    }
};