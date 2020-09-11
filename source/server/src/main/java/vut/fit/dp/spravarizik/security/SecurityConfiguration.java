package vut.fit.dp.spravarizik.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.context.annotation.Bean;

import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;


/**
 * Konfigurace zabezpeceni pomoci Spring Security
 * hlavni inspirace pomoci: https://www.youtube.com/watch?v=iyXne7dIn7U&list=PLqq-6Pq4lTTYTEooakHchTGglSvkZAjnE&index=4&ab_channel=JavaBrains
 * Propjeni spring security a jpa, inspirovano z: https://www.youtube.com/watch?v=TNt3GHuayXs&list=PLqq-6Pq4lTTYTEooakHchTGglSvkZAjnE&index=8&ab_channel=JavaBrains
 * Propojeni spring security, spring boot a react klienta:
 * https://www.codesandnotes.be/2014/10/31/restful-authentication-using-spring-security-on-spring-boot-and-jquery-as-a-web-client/
 * https://stackoverflow.com/questions/49241384/401-instead-of-403-with-spring-boot-2
 * https://stackoverflow.com/questions/32498868/custom-login-form-configure-spring-security-to-get-a-json-response
 *
 * @author Sara Skutova
 * */
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Qualifier("myUserDetailsService")
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private MyAuthSuccessHandler myAuthSuccessHandler;

    @Autowired
    private MyAuthFailureHandler myAuthFailureHandler;

    @Autowired
    private MyAuthEntryPoint myAuthEntryPoint;

    @Autowired
    private MyLogoutSuccHandler myLogoutSuccHandler;

    @Autowired
    private MyAccessDeniedHandler myAccessDeniedHandler;

    @Bean
    CorsFilter corsFilter() {
        CorsFilter filter = new CorsFilter();
        return filter;
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }
    //.and().exceptionHandling().authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
    //.and().cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues()); //TODO provizorne, jeste se na to budu muset kouknout

    //tohle resi problem, kdyz pro nektere "slozitejsi" dotazy, HTTP automaticky posila OPTIONS pozadavek, ten ale zaroven neposila hodnotu JSEESION cookie,
    // takze by se zasekl na entry pointu jako neprihlasen a v klientu by to vyhodilo chybu
    //.antMatchers(HttpMethod.OPTIONS, "/api/nprr/**").permitAll()

    //.access("@userSecurity.hasUserId(authentication,#userId)")

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(HttpMethod.GET,"/api/nprr/project/{id}/**").access("@userTest.userCanAccessProject(#id, authentication)")
                .anyRequest().authenticated()
                .and().formLogin().successHandler(myAuthSuccessHandler).failureHandler(myAuthFailureHandler)
                .and().logout().deleteCookies("JSESSIONID").invalidateHttpSession(true).logoutSuccessHandler(myLogoutSuccHandler)
                .and().rememberMe().key("secretTestRememeber").rememberMeParameter("remember")
                .and().exceptionHandling().accessDeniedHandler(myAccessDeniedHandler)
                .and().exceptionHandling().authenticationEntryPoint(myAuthEntryPoint)
                .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        http.csrf().disable();
        http.headers().frameOptions().disable();





/*        http.authorizeRequests()
                .antMatchers("/admin").hasAuthority("ADMIN")
                .antMatchers("/user").hasAnyAuthority("USER", "ADMIN")
                .antMatchers("/").permitAll()
                .and().formLogin();*/
    }


/*
.anyRequest().authenticated() //jakykoliv pozadavek na server musi byt autentizovan


                .and().authorizeRequests().antMatchers("/").permitAll().and()
                .authorizeRequests().antMatchers("/h2-console/**").permitAll()

http.headers().frameOptions().disable();

antMatchers(HttpMethod.OPTIONS, "*").permitAll()

@Bean
    CorsConfigurationSource configurationSource() {
        System.out.println("FILTER");
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("POST", "OPTIONS", "GET", "DELETE", "PUT"));
        configuration.setAllowedHeaders(Arrays.asList("X-Requested-With", "Origin", "Content-Type", "Accept", "Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }*/

    //TODO musi se dat realne sifrovani hesel, zatim jenom provizorne jako clear text
    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

}
