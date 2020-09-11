import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'

/**
 * Funkce vytvorene pomoci knihovny redux-auth-wrapper.
 * Pomovi toho ze ovliv+novat pristup k jednotlivym adresam a komponentam podle toho jakou ma uzivatel roli.
 * Tady zamereni na komponenty.
 *
 * Autor: Sara Skutova
 * */

/**
 * Test pro komponentu, ktera se ma zobrazit pouze Aminovi
 * */
export const visibleOnlyAdmin = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && state.user.secRole === 'ADMIN',
    wrapperDisplayName: 'VisibleOnlyAdmin',
});

/**
 * Test pro komponentu, ktera se ma zobrazit pouze uzivateli s bezpecnostni roli USER
 * */
export const visibleOnlyUser = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && state.user.secRole === 'USER',
    wrapperDisplayName: 'VisibleOnlyUser',
});

/**
 * Test pro komponentu, ktera se ma zobrazit pouze managerovi
 * */
export const visibleOnlyManager = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && state.user.secRole === 'MANAGER',
    wrapperDisplayName: 'VisibleOnlyManager',
});

/**
 * Test pro komponentu, ktera se ma zobrazit adminovi a managerovi
 * */
export const visibleOnlyAdminAndManager = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && (state.user.secRole === 'MANAGER' || state.user.secRole === 'ADMIN'),
    wrapperDisplayName: 'VisibleOnlyAdminAndManager',
});

/**
 * Test pro komponentu, ktera se ma zobrazit pouze adminovi, zaroven take obsahuje prikaz na zobrazeni alternativni komponenty,
 * pokud uzivatel neni admin
 * */
export const visibleOnlyAdminAndFailure  = (Component, FailureComponent) => connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && state.user.secRole === 'ADMIN',
    wrapperDisplayName: 'VisibleOnlyAdminAndFailure',
    FailureComponent
})(Component);

/**
 * Test pro komponentu, ktera se ma zobrazit adminovi a managerovi daneho projektu
 * */
export const visibleOnlyProjMgnAndAdmin = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && (state.user.secRole === 'ADMIN' || (state.user.secRole === 'MANAGER' && state.user.id === state.manager.id)),
    wrapperDisplayName: 'VisibleOnlyProjMgnAndAdmin',
});

/**
* Test pro komponentu, ktera se ma zobrazit pouze  adminovi a managerovi daneho projektu, zaroven take obsahuje prikaz na zobrazeni alternativni komponenty,
* pokud uzivatel neni admin
* */
export const visOnlProjMngAdminAndFailure = (Component, FailureComponent) => connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && (state.user.secRole === 'ADMIN' || (state.user.secRole === 'MANAGER' && state.user.id === state.manager.id)),
    wrapperDisplayName: 'VisibleOnlyProjMgnAndAdmin',
    FailureComponent
})(Component);

/**
 * Test pro komponentu, ktera se ma zobrazit adminovi, managerovi daneho projektu a resiteli daneho projektu
 * */
export const vOProjMPRojUAndAdmin = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && (state.user.secRole === 'ADMIN' ||
        (state.user.secRole === 'MANAGER' && state.user.id === state.manager.id) ||
        (state.user.secRole === 'USER' && typeof state.resitele.find(resitel => resitel.id === state.user.id) !== 'undefined')
    ),
    wrapperDisplayName: 'VOProjMPRojUAndAdmin',
});

/**
 * Test pro komponentu, ktera se ma zobrazit adminovi, managerovi daneho projektu a resiteli daneho projektu, zaroven take obsahuje prikaz na zobrazeni alternativni komponenty,
 * pokud uzivatel nesplnuje pozadavky
 * */
export const vOProjMPRojUAndAdminAndFailure = (Component, FailureComponent) => connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && (state.user.secRole === 'ADMIN' ||
        (state.user.secRole === 'MANAGER' && state.user.id === state.manager.id) ||
        (state.user.secRole === 'USER' && typeof state.resitele.find(resitel => resitel.id === state.user.id) !== 'undefined')
    ),
    wrapperDisplayName: 'VOProjMPRojUAndAdminAndFailure',
    FailureComponent
})(Component);

/**
 * Test pro komponentu, zobrazi se pouze pokud projekt bude aktivni samotne
 * */
export const vProjActiveAlone = connectedAuthWrapper({
    authenticatedSelector: state => state.ProjectInfo.aktivni === true,
    wrapperDisplayName: 'VProjActiveAlone',
});

/**
 * Test pro komponentu, zobrazi se pouze pokud projekt bude aktivni + alternativa
 * */
export const vProjActive = (Component, FailureComponent) => connectedAuthWrapper({
    authenticatedSelector: state => state.ProjectInfo.aktivni === true,
    wrapperDisplayName: 'VProjActive',
    FailureComponent
})(Component);


/**
 * Komponenta pro zobrazeni tlacitka zodpovezeni na dotaznik, zobrazi se adminovi a tem co pracuji na projektu a jeste na dotaznik neodpovedeli
 * */
export const vOProjMUNoDoneSurveyAdmin = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && (state.user.secRole === 'ADMIN' ||
        (state.user.secRole === 'MANAGER' && state.user.id === state.manager.id && !state.userDoneSurvey) ||
        (state.user.secRole === 'USER' && typeof state.resitele.find(resitel => resitel.id === state.user.id) !== 'undefined' && !state.userDoneSurvey)
    ),
    wrapperDisplayName: 'VOProjMUNoDoneSurveyAdmin',
});

/**
 * Komponenta pro zobrazeni tlacitka na zobrazeni statistiky dotazniku - manager normal, admin normal, user jenom kdzy odpovedel
 * */
export const vOProjMUDoneSurveyAdmin = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && (state.user.secRole === 'ADMIN' ||
        (state.user.secRole === 'MANAGER' && state.user.id === state.manager.id) ||
        (state.user.secRole === 'USER' && typeof state.resitele.find(resitel => resitel.id === state.user.id) !== 'undefined' && state.userDoneSurvey)
    ),
    wrapperDisplayName: 'vOProjMUDoneSurveyAdmin',
});
