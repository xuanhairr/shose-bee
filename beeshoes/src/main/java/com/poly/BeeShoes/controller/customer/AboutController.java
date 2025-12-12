package com.poly.BeeShoes.controller.customer;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AboutController {
    @GetMapping({"/about","/about/"})
    public String about (){
        return "customer/pages/about/about";
    }
}
