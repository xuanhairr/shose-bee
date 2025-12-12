package com.poly.BeeShoes.interceptor;

import com.poly.BeeShoes.service.NotificationService;
import com.poly.BeeShoes.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer {
    private final NotificationService notificationService;
    private final UserService userService;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new GlobalInterceptor(notificationService, userService));
    }
}
