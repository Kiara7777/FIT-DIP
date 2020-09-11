package vut.fit.dp.spravarizik.security;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Vlastni implementace AuthenticationEntryPoint - server tohle vrati pokud uzivatel se pokousi necjakou akci, ale neni prihlaseny
 * Zaroven se toto provede i pokudd uzivatel neni plne autentizovan - to se deje pokud se uzivatel prihlasi pomoci REMEMBER ME cookie - a pokusi se provest akci na kterou nema pravo
 * Jelikoz vychozi nefuguje pro moje potreby - ze klient je mimo server.
 *
 * @author Sara Skutova
 * */
@Component
public class MyAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}



