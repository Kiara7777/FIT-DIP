package vut.fit.dp.spravarizik.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Vlastni implementace AccessDeniedHandler - server tohle vrati pokud uzivatel se pokousi o akci ke ktere nema pravo
 * Jelikoz vychozi nefuguje pro moje potreby - ze klient je mimo server.
 *
 * @author Sara Skutova
 * */
@Component
public class MyAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AccessDeniedException e) throws IOException, ServletException {
        httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "FORBIDDEN");
    }
}
