package com.poly.BeeShoes.controller.cms;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin("*")
@RequestMapping("/cms")
public class ReportController {
    @GetMapping("/revenue")
    public String doanhthu() {
        return "cms/pages/report/revenue";
    }
}
