import {combineReducers} from "redux";
import {isLoggedReducer, drawerReducer, titleReducer, userInfo, themeInfo, errorCode} from "./appInfoReducer";
import changeReducer from "./changeReducer";
import {
    projectInfoReducer,
    projectPeopleCountReducer,
    projectRiskReducer,
    projectSurveyDataReducer,
    riskLoading, userDoneSurvey
} from "./projectInfoReducer";
import deadlineReducer from "./deadlineReducer";
import {managerReducer, resiteleReducer} from "./clenoveReducer";
import {CLEAN_REDUX} from "../components/constants";

/**
 * Store prijme jenom jeden reducer - musi se skombinvoat do jednoho
 * REDUX TUTORIAL: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1s&ab_channel=DevEd
 *
 * Autor: Sara Skutova
 * */

//ten logger muzu napsat i jako isLoggedReducer, a ono se to uz samo udela
const myCombineReducer = combineReducers({
    logger: isLoggedReducer,
    user: userInfo,
    appTheme: themeInfo,
    drawer: drawerReducer,
    title: titleReducer,
    error: errorCode,
    change: changeReducer,
    ProjectInfo: projectInfoReducer,
    deadline: deadlineReducer,
    manager: managerReducer,
    resitele: resiteleReducer,
    projectPlCount: projectPeopleCountReducer,
    projectRisks: projectRiskReducer,
    riskLoading: riskLoading,
    projectSurveyData: projectSurveyDataReducer,
    userDoneSurvey: userDoneSurvey

});

//ten undefined, dle redux dokumentace to vyvolava inicializaci puvodmoho stavu
//vice take tady: https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
const rootReducer = (state, action) => {
    if (action.type === CLEAN_REDUX)
        state = undefined;
    return myCombineReducer(state, action)
};

export default rootReducer;