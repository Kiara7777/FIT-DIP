package vut.fit.dp.spravarizik.security;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Vlastni implementace AuthenticationFailureHandler - server tohle vrati pokud uzivatel neni uspesny pri autentizaci - spatne prihlasvaci udaje
 * Jelikoz vychozi nefuguje pro moje potreby - ze klient je mimo server.
 *
 * @author Sara Skutova
 * */
@Component
public class MyAuthFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        httpServletResponse.getWriter().append("FAIL");
        httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
