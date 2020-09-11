package vut.fit.dp.spravarizik.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Vlastni implementace LogoutSuccessHandler - server tohle vrati pokud uzivatel je uspesny pri odhlaseni
 * Jelikoz vychozi nefuguje pro moje potreby - ze klient je mimo server.
 *
 * @author Sara Skutova
 * */
@Component
public class MyLogoutSuccHandler implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        httpServletResponse.setStatus(HttpServletResponse.SC_OK);

    }
}
