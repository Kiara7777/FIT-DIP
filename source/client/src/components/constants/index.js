/**
 * Soubor obsahuje konstanty pouzivane vsude na projektu
 *
 * Autor: Sara Skutova
 * */

/**
 * Konstanty s lokalizaci pro material-table. Je vyuzivana ve vsech tabulkach.
 * */
export const tableLocalization = {
    body: {
        emptyDataSourceMessage: 'Žádná data',
        addTooltip: 'Přidat',
        deleteTooltip: 'Odstranit',
        editTooltip: 'Editovat',
        editRow: {
            deleteText: 'Skutečně chcete daný záznam smazat z databáze?',
            cancelTooltip: 'Zrušit',
            saveTooltip: 'Potvrdit'
        }
    },
    header: {
        actions: 'Akce'
    },
    toolbar: {
        searchTooltip: 'Hledat',
        searchPlaceholder: 'Hledat'
    },
    pagination: {
        labelDisplayedRows: '{from}-{to} z {count}',
        labelRowsSelect: 'záznamů',
        labelRowsPerPage: 'Záznamů na stránku:',
        firstAriaLabel: 'První stránka',
        firstTooltip: 'První stránka',
        previousAriaLabel: 'Předcházející stránka',
        previousTooltip: 'Předcházející stránka',
        nextAriaLabel: 'Následující stránka',
        nextTooltip: 'Následující stránka',
        lastAriaLabel: 'Poslední stránka',
        lastTooltip: 'Poslední stránka'
    }
};

/////////////// Konstanty ktere se vyuzivaji v systemu REDUX ///////////////////
export  const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";

export const CHANGE_PROJECT_NAME = "CHANGE_PROJECT_NAME";
export const CHANGE_PROJECT_POPIS = "CHANGE_PROJECT_POPIS";
export const CHANGE_PROJECT_START = "CHANGE_PROJECT_START";
export const CHANGE_PROJECT_KONEC = "CHANGE_PROJECT_KONEC";
export const CHANGE_PROJECT_AKTIVNI = "CHANGE_PROJECT_AKTIVNI";
export const CHANGE_PROJECT = "CHANGE_PROJECT";

export const CHANGE_DEADLINE = "CHANGE_DEADLINE";

export const CHANGE_MANAGER = "CHANGE_MANAGER";
export const CHANGE_RESITELE = "CHANGE_RESITELE";

export const CHANGE_PL_NUMBER = "CHANGE_PL_NUMBER";

export const CHANGE_TRUE = "CHANGE_TRUE";
export const CHANGE_FALSE = "CHANGE_FALSE";

export const CLEAN_PROJECT_DATA = "CLEAN_PROJECT_DATA";

export const CHANGE_PROJECT_RISK = "CHANGE_PROJECT_RISK";
export const SET_PROJECT_RISKS = "SET_PROJECT_RISKS";
export const REMOVE_RISK_FROM_PROJECT = "REMOVE_RISK_FROM_PROJECT";
export const ADD_RISK_TO_PROJECT = "ADD_RISK_TO_PROJECT";

export const RISK_LOADING_TRUE = "RISK_LOADING_TRUE";
export const RISK_LOADING_FALSE = "RISK_LOADING_FALSE";
export const SET_RISK_LOADING = "SET_RISK_LOADING";

export const SET_DRAWER = "SET_DRAWER";

export const SET_TITLE = "SET_TITLE";

export const SET_USER = "SET_USER";

export const CLEAN_REDUX = "CLEAN_REDUX";

export const SET_THEME = "SET_THEME ";

export const SET_PROJECT_SURVEY_DATA = "SET_PROJECT_SURVEY_DATA";
export const ADD_PROJECT_SURVEY_DATA = "ADD_PROJECT_SURVEY_DATA";
export const SET_USER_DONE_SURVEY = "SET_USER_DONE_SURVEY";
export const REMOVE_SURVEY = "REMOVE_SURVEY";

export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";

//////////////////////////////////////////////////////////////////////////////
////// Konstanty pro pridavani/editace rizik, pouzivaji se pri lookupech, ktere se nemeni//////////
//lookup pro stav
export const stavLookup = {1: 'Nové', 2: 'Rozpracováno', 3: 'Hotovo'};

//lookup pro pravdepodobnost
export const pravdepLookup = {1: 'Velmi nízká', 2: 'Nízká', 3: 'Střední', 4: 'Vysoká', 5: 'Velmi vysoká'};

//lookup pro dopad
export const dopadLookup = {1: 'Velmi malý', 2: 'Malý', 3: 'Střední', 4: 'Vysoký', 5: 'Velmi vysoký'};

//lookup pro prioritu
export const prioritaLookup = {1: 'Malá', 2: 'Střední', 3: 'Vysoká'};

//////////////////////ERRORS////////////////////////////
export const UNAUTHORIZED = 401;
export const NOT_FOUND = 404;
export const FORBIDDEN = 403;

///////////////////// API constants//////////////////////////////////
//jsou tady jenom ty co nemaji v sibe promenne casti
export const info = {
    userInfo: `api/nprr/info`,
};

export const loginInto = {
    login: `/login`,
};

export const user = {
    usersCount: `api/nprr/users/count`,
    getUsers: `/api/nprr/users`,
    getRoles: '/api/nprr/roles',
    getSecRoles: `api/nprr/secRoles`,
    getCurrentUser: `api/nprr/user`,
    getCurrentUserRole: `api/nprr/role`,
    postRole: `/api/nprr/role`,
    postUser: `/api/nprr/user`
};

/**
 * getProject: `/api/nprr/project` se pouzije jako `/api/nprr/project/{id}`
 * */
export const project = {
    activeProj: `api/nprr/projects/active/true`,
    disActiveProj: `api/nprr/projects/active/false`,
    postProject: `api/nprr/project`,
    activeManagerProj: `api/nprr/projects/active/true/manager`,
    disActiveManagerProj: `api/nprr/projects/active/false/manager`,
    activeUserProj: `api/nprr/projects/active/user`,
    postProjectWithSWOT: `/api/nprr/project/swot`,
    getProject: `/api/nprr/project`,
    projectSurveyAnswers: `/api/nprr/project/survey`,
};

export const risk = {
    riskCount: `api/nprr/risks/count`,
    getRiskCategories: `/api/nprr/kategories`,
    getAllRisk: `/api/nprr/risks`,
    postCategory: `/api/nprr/kategorie`,
    postRisk: `/api/nprr/risk`,
};
/**
 * Ano je to stejne, ale chci to tak mit, kazde se pouziva v jinem kontextu
 * getSurveyID: `/api/nprr/survey` se pouzije jako /api/nprr/survey/{id}
 * deleteSurveyID: `/api/nprr/survey` se pouzije jako deleteSurveyID: `/api/nprr/survey/{id}`
 * */
export const survey = {
    getSurveyID: `/api/nprr/survey`,
    deleteSurveyID: `/api/nprr/survey`,
    getAllSurveyCards: `/api/nprr/surveys/cards`,
    getAllSurvey: `/api/nprr/surveys`,
    postSurvey: `/api/nprr/survey`,
};

export const question = {
    getAllAreas: `/api/nprr/questionAreas`,
    getAllAnswers: `/api/nprr/answers`,
    getAllQuestions: `/api/nprr/questions`,
    postAnswer: `/api/nprr/answer`,
    postQuestionArea: `/api/nprr/questionArea`,
    postQuestion: `/api/nprr/question`,
};
//////////////////////////////////////////////////////////////////////