package com.poly.BeeShoes.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

@ControllerAdvice
public class GlobalExceptionHandler {
//    @ExceptionHandler(value = {IllegalArgumentException.class})
//    public String handleIllegalArgumentException(HttpServletRequest request) {
//        return "redirect:/error/404";
//    }
//    @ExceptionHandler(value = {BadRequestException.class})
//    public String handleBadRequestException(HttpServletRequest request) {
//        return "redirect:/error/404";
//    }
//    @ExceptionHandler(value = {Exception.class})
//    public String defaultErrorHandler(HttpServletRequest req, Exception e) {
//        return "redirect:/error/404";
//    }
}
