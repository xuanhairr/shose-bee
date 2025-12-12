package com.poly.BeeShoes.controller.customer;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ContactController {
    @GetMapping({"/contact","/contact/"})
    public String indexLightBee(){
        return "customer/pages/contact/contact";
    }
}
