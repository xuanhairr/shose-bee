package com.poly.BeeShoes.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> {
                    req
                            .requestMatchers("/cms/product", "/cms/shoe-material", "/cms/shoe-color", "/cms/shoe-size",
                                    "/cms/shoe-brand", "/cms/shoe-category", "/cms/shoe-sole", "/cms/shoe-toe",
                                    "/cms/shoe-collar", "/cms/nhan-vien", "/cms/voucher", "/cms/history-payment").hasAuthority("ADMIN")
                            .requestMatchers("/cms", "/cms/cashier", "/cms/hoa-don", "/cms/khach-hang").hasAnyAuthority("USER", "ADMIN")
                            .requestMatchers("/user-profile").hasAnyAuthority("CUSTOMER")
                            .requestMatchers("/change-password").authenticated()
                            .anyRequest().permitAll();
                })
                .exceptionHandling(ex -> {
                    ex.accessDeniedPage("/unauthorized");
                })
                .formLogin(form -> {
                    form
                            .loginPage("/login")
                            .defaultSuccessUrl("/", false)
                            .permitAll();
                })
                .logout(logout -> {
                    logout
                            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                            .logoutSuccessUrl("/login")
                            .invalidateHttpSession(true)
                            .deleteCookies("JSESSIONID")
                            .addLogoutHandler((request, response, authentication) -> {
                                SecurityContextHolder.clearContext();
                            });
                });
        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
