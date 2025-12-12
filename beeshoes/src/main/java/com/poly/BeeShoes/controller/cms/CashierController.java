package com.poly.BeeShoes.controller.cms;

import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.service.KhachHangService;
import com.poly.BeeShoes.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/cms")
@RequiredArgsConstructor
public class CashierController {
    private final KhachHangService khachHangService;
    private final SanPhamService sanPhamService;
    @GetMapping("/cashier")
    public String index (Model model){
        List<KhachHang> khachHangs = khachHangService.getAll();
        khachHangs.forEach(kh -> System.out.println(kh.getUser().getEmail()));
        model.addAttribute("customer", khachHangs);
        model.addAttribute("listsanpham",sanPhamService.getAllApi());
        return "cashier/index";
    }
}
