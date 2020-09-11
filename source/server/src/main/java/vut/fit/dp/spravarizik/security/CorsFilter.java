package vut.fit.dp.spravarizik.security;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//https://stackoverflow.com/questions/40286549/spring-boot-security-cors
//NASEHEJ NA TO, po nekolika tutorialech, navodu, vseho, tohle je jedine co funguje, pamatuj na to kdyz se na to budes v budoucnu pokouset sahat
/**
 * CORS filter Cross-origin resource sharing, pro sdileni zdroju, v tomto pripade dat v DB
 * vychozi delalo problemy, protoze mezji jinymi tam v hlavice bylo *, ktera nepovoluje aby se slo prihlasovat
 *  + tam byli i dalsi problemy, ten odkaz nahore bylo jedine ze vsech jinych navodu a odpovedi co fungovalo
 *
 * @author Sara Skutova
 * */
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        final String origin = request.getHeader("Origin");

        //response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); //natvrdo to bude na tehle adrese a jinde ne
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept,Authorization,x-xsrf-token");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        //test cors a OPTIONS - tohle musi byt jinak to blbne
        if(request.getMethod().equals(HttpMethod.OPTIONS.toString()))
            response.setStatus(HttpServletResponse.SC_OK);
        else
            filterChain.doFilter(request, response);
    }

    //response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept,Authorization");
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void destroy() {

    }
}
