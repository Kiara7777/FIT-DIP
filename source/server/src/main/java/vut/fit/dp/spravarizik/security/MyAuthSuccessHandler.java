package vut.fit.dp.spravarizik.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import vut.fit.dp.spravarizik.uniteClass.LoginResponseObj;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;

/**
 * Vlastni implementace AuthenticationSuccessHandler - server tohle vrati pokud uzivatel je uspesny pri autentizaci
 * Jelikoz vychozi nefuguje pro moje potreby - ze klient je mimo server.
 *
 * Zaroven take nastavuje zivotnost spojeni  - na 60 minut
 *
 * @author Sara Skutova
 * */
@Component
public class MyAuthSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {


        HttpSession session = httpServletRequest.getSession();
        MyUserDetails details = (MyUserDetails) authentication.getPrincipal();
        LoginResponseObj myData = new LoginResponseObj(details.getId(), details.getSecRole());
        httpServletResponse.getWriter().write(new ObjectMapper().writeValueAsString(myData));
        httpServletRequest.getSession(false).setMaxInactiveInterval(60*60);

        httpServletResponse.setStatus(HttpServletResponse.SC_OK); //ke klentovi se vrati 200 status - OK
    }
}
