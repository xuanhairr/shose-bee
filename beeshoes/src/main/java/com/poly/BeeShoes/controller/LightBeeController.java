package com.poly.BeeShoes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LightBeeController {

    @GetMapping({"/checkout","/checkout/"})
    public String checkout(){
        return "redirect:/shopping-cart";
    }
}
