package vut.fit.dp.spravarizik;

import org.apache.catalina.filters.CorsFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * Hlavni metoda, spousi cely server
 *
 * @author Sara Skutova
 * */
@SpringBootApplication
public class SpravarizikApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpravarizikApplication.class, args);
    }
}
