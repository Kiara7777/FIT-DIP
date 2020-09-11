/**
 * Tento soubor obsahuje funkce, ktere se vyuzivaji ke identifikaci akci pro system REDUX, ktery umoznuje sdilet stav mezi
 * komponentami.
 *
 * REDUX tutorial a inspirace: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1058s&ab_channel=DevEd
 *
 * Autor: Sara Skutova
 * */

//konstanty, ktere se vyuzivaji
import {
    CHANGE_PROJECT_NAME,
    CHANGE_PROJECT_POPIS,
    CHANGE_PROJECT_START,
    CHANGE_PROJECT_AKTIVNI,
    CHANGE_PROJECT_KONEC,
    CHANGE_PROJECT,
    CHANGE_DEADLINE,
    CHANGE_MANAGER,
    CHANGE_PL_NUMBER,
    LOG_IN,
    LOG_OUT,
    CHANGE_RESITELE,
    CLEAN_PROJECT_DATA,
    SET_PROJECT_RISKS,
    CHANGE_PROJECT_RISK,
    REMOVE_RISK_FROM_PROJECT,
    ADD_RISK_TO_PROJECT,
    SET_RISK_LOADING,
    SET_DRAWER,
    SET_TITLE,
    SET_USER,
    CLEAN_REDUX,
    SET_THEME,
    SET_PROJECT_SURVEY_DATA,
    ADD_PROJECT_SURVEY_DATA,
    SET_USER_DONE_SURVEY,
    REMOVE_SURVEY,
    SET_ERROR,
    CLEAR_ERROR,
    CHANGE_TRUE, CHANGE_FALSE
} from "../components/constants";

/**
 * Akce zmenu stavu prihlaseni/ohlaseni, indikace prihlaseni
 * */
export const logIN = () => {
    return {
        type: LOG_IN
    }
};

/**
 * Akce zmenu stavu prihlaseni/ohlaseni, indikace odhlaseni
 * */
export const logOUT = () => {
    return {
        type: LOG_OUT
    }
};

/**
 * Akce indikovani zmeny informace v DB, rika dalsim komponentam na aktualni strance, ze znovu musi nacist data z DB
 * */
export const changeTrue = () => {
    return {
        type: CHANGE_TRUE
    }
};

export const changeFalse = () => {
    return{
        type: CHANGE_FALSE
    }
};

export const changeProjectName = (payload) => {
    return {
        type: CHANGE_PROJECT_NAME,
        payload: payload
    }
};

export const changeProjectPopis = (payload) => {
    return {
        type: CHANGE_PROJECT_POPIS,
        payload: payload
    }
};

export const changeProjectStart = (payload) => {
    return {
        type: CHANGE_PROJECT_START,
        payload: payload
    }
};

export const changeProjectKonec = (payload) => {
    return {
        type: CHANGE_PROJECT_KONEC,
        payload: payload
    }
};

export const changeProjectAktivni= (payload) => {
    return {
        type: CHANGE_PROJECT_AKTIVNI,
        payload: payload
    }
};

/**
 * Akce na zmenu informaci projektu. Payload obsahuje nove data projektu, ktere se musi nahrat do REDUX storu
 * */
export const changeProject = (payload) => {
    return {
        type: CHANGE_PROJECT,
        payload: payload
    }
};

/**
 * Akce na zmenu koncoveho datumu projektu, vyuziva se pri vypoctu deadlinu projektu.
 * Payload obsahuje nove koncove datum.
 * */
export const changeDeadline = (payload) => {
    return {
        type: CHANGE_DEADLINE,
        payload: payload
    }
};

/**
 * Akce na zmenu managera projektu, vyuziva se pri sprave rizik na projektu
 * Slouzi jako propojeni mezi strankou s informacemi a strankoou o rizicich, at se nemusi porad stahovat z API
 * Payload obsahuje noveho managera ve tvaru {id: ..., nazev: ....}
 * */
export const changeManager = (payload) => {
    return {
        type: CHANGE_MANAGER,
        payload: payload
    }
};

export const changeResitele = (payload) => {
    return {
        type: CHANGE_RESITELE,
        payload: payload
    }
};
/**
 * Akce pro zmenu poctu lidi pracujicih na projektu - manager + resitele
 * Payload obsahuje novy pocet.
 * */
export const changePeopleCount = (payload) => {
    return {
        type: CHANGE_PL_NUMBER,
        payload: payload
    }
};

/**
 * Akce na vycisteni dat projektu co je aktualne v pameti
 * */
export const cleanProjectData = () => {
  return {
      type: CLEAN_PROJECT_DATA
  }
};

/**
 * Akce nastavi (ulozi) seznam rizik projektu
 * */
export const setProjectRisks = (payload) => {
    return {
        type: SET_PROJECT_RISKS,
        payload: payload
    }
};

/**
 * Akce zmeni data daneho rizika v projektu
 * */
export const changeRiskInProject = (payload) => {
    return {
        type: CHANGE_PROJECT_RISK,
        payload: payload
    }
};

/**
 * Akce na vymazani rizika z projektu
 * */
export const removeRiskFromProject = (payload) => {
    return {
        type: REMOVE_RISK_FROM_PROJECT,
        payload: payload
    }
};

/**
 * Akce na pridani rizika do projektu
 * */
export const addRiskToProject = (payload) => {
    return {
        type: ADD_RISK_TO_PROJECT,
        payload: payload
    }
};

/**
 * Akce pro nastaveni nacitani rizik do reduxu - potrebuju nejakou idnikaci, ze to tam uz je
 * */
export const setRiskLoading = (payload) => {
  return {
      type: SET_RISK_LOADING,
      payload: payload
  }
};

/**
 * Akce pro nastaveni stavu menu, zda je otevreno nebo zavreno - ukladano z duvodu toho aby se to automaticky nezaviralo, kdyz se nacita jinaci stranka
 * */
export const setDrawer = (payload) => {
    return {
        type: SET_DRAWER,
        payload: payload
    }
};

/**
 * Akce pro nastaveni titulu stranky co se zobrazuje na addBaru
 * */
export const setTitle = (payload) => {
  return {
      type: SET_TITLE,
      payload: payload
  }
};

/**
 * Akce pro nastaveni prihlaseneho uzivatele
 */
export const setUser = (payload) => {
    return {
        type: SET_USER,
        payload: payload
    }
};

/**
 * Akce pro vycisteni storu reduxu
 * */
export const  cleanRedux = () => {
    return {
        type: CLEAN_REDUX
    }
};

/**
 * Akce na zmeneni theme aplikace
 * */
export const changeTheme = (payload) => {
    return {
        type: SET_THEME,
        payload: payload
    }
};

/**
 * Akce pro pridani dat projektoveho dotazniku do reduxu - jak a kdo odpovidal
 * */
export const setProjectSurvey = (payload) => {
    return {
        type: SET_PROJECT_SURVEY_DATA,
        payload: payload
    }
};

/**
 * Pridani jak uzivatel odpovedel na dotaznik do reduxu
 * */
export const addProjectSurvey = (payload) => {
    return {
        type: ADD_PROJECT_SURVEY_DATA,
        payload: payload
    }
};

/**
 * Nastavi informaci zda uzivatel na dotaznik na projektu uz odpovedel
 * */
export const setUserDoneSurvey = (payload) => {
    return {
        type: SET_USER_DONE_SURVEY,
        payload: payload
    }
};

/**
 * Odstarni data dotazniku z projektu a reduxu
 * */
export const removeSurvey = () => {
    return {
        type: REMOVE_SURVEY
    }
};

/**
 * Nastaveni chyboveho kodu, ktery se vratil ze serveru
 * */
export const setErrorCode = (payload) => {
    return {
        type: SET_ERROR,
        payload: payload
    }
};

/**
 * Vycisteni chzboveho kodu, ktery predtim se vratil ze serveru
 * */
export const clearError = () => {
    return {
        type: CLEAR_ERROR
    }
};

