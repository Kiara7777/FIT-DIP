import {connectedRouterRedirect} from "redux-auth-wrapper/history4/redirect";
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

/**
 * Funkce vytvorene pomoci knihovny redux-auth-wrapper.
 * Pomovi toho ze ovliv+novat pristup k jednotlivym adresam a komponentam podle toho jakou ma uzivatel roli.
 * Tady zamereni na smerovani a adresy.
 *
 * Autor: Sara Skutova
 * */

const locationHelper = locationHelperBuilder({});

/**
 * Pristupne pouze prihlasenym uzivatelum
 * */
export const userIsAuthenticated = connectedRouterRedirect({
    redirectPath: '/',
    authenticatedSelector: state => state.user !== null,
    wrapperDisplayName: 'UserIsAuthenticated'
});

/**
 * Pristupne pouze neprihlasenym uzivatelum
 * */
export const userIsNotAuthenticated = connectedRouterRedirect({
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/app/dashboard',
    allowRedirectBack: false,
    authenticatedSelector: state => state.user === null,
    wrapperDisplayName: 'UserIsNotAuthenticated'
});

/**
 * Pristupne pouze administratorovi
 * */
export const userIsAuthAndAdmin = connectedRouterRedirect({
    redirectPath: '/403',
    authenticatedSelector: state => state.user !== null && state.user.secRole === 'ADMIN',
    wrapperDisplayName: 'UserIsAuthAndAdmin'
});


/*
export const userIsAuthenticated = connectedRouterRedirect({
    redirectPath: '/',
    authenticatedSelector: state => state.user !== null && state.logger,
    wrapperDisplayName: 'UserIsAuthenticated'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/app/dashboard',
    allowRedirectBack: false,
    authenticatedSelector: state => state.user === null && !state.logger,
    wrapperDisplayName: 'UserIsNotAuthenticated'
});

export const userIsAuthAndAdmin = connectedRouterRedirect({
    redirectPath: '/',
    authenticatedSelector: state => state.user !== null && state.logger && state.user.secRole === 'ADMIN',
    wrapperDisplayName: 'UserIsAuthAndAdmin'
});*/
