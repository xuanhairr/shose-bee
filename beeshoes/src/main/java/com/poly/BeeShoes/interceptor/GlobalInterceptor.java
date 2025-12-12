package com.poly.BeeShoes.interceptor;

import com.poly.BeeShoes.service.NotificationService;
import com.poly.BeeShoes.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
@RequiredArgsConstructor
public class GlobalInterceptor implements HandlerInterceptor {

    private final NotificationService notificationService;
    private final UserService userService;

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        if(request.getUserPrincipal() != null) {
            String userEmail = request.getUserPrincipal().getName();
            request.setAttribute("userCMS", userService.getByUsername(userEmail));
        }
        request.setAttribute("notifications", notificationService.getTop10());
    }
}
