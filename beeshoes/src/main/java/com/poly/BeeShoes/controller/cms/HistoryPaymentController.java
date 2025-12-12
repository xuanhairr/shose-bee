package com.poly.BeeShoes.controller.cms;

import com.poly.BeeShoes.service.HinhThucThanhToanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin("*")
@RequestMapping("/cms")
@RequiredArgsConstructor
public class HistoryPaymentController {
    private final HinhThucThanhToanService hinhThucThanhToanService;

    @GetMapping("/history-payment")
    public String index(Model model) {
        model.addAttribute("listData", hinhThucThanhToanService.getAll());
        return "cms/pages/report/historyPayment";
    }
}
