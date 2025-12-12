package com.poly.BeeShoes.controller.customer;

import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.model.LichSuHoaDon;
import com.poly.BeeShoes.model.User;
import com.poly.BeeShoes.service.HoaDonService;
import com.poly.BeeShoes.service.KhachHangService;
import com.poly.BeeShoes.service.UserService;
import com.poly.BeeShoes.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class OderTrackingController {
    private final UserService userService;
    private final HoaDonService hoaDonService;
    private final VoucherService voucherService;
    private final KhachHangService khachHangService;

    @GetMapping("/oder-tracking")
    public String tracking(@RequestParam(name = "oder", required = false) String code, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HoaDon hoaDon = null;
        User user = null;
        List<LichSuHoaDon> lsHD = new ArrayList<>();
        lsHD = null;
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            user = userService.getByUsername(userDetails.getUsername());
            if (code != null) {
                hoaDon = hoaDonService.getHoaDonByMa(code);
                if (hoaDon != null && hoaDon.getKhachHang() != null && user.getKhachHang() != null
                        && hoaDon.getKhachHang().getId().equals(user.getKhachHang().getId())) {
                } else {
                    hoaDon = null;
                }
            }
        } else {
            if (code != null) {
                hoaDon = hoaDonService.getHoaDonByMa(code);
                if (hoaDon != null && hoaDon.getKhachHang() != null) {
                    hoaDon = null;
                }
                if (hoaDon != null && hoaDon.getDiaChiNhan().equals("Tại Quầy")) {
                    hoaDon = null;
                }
            }
        }

        List<LichSuHoaDon> list = null;
        if (hoaDon != null) {
            lsHD = hoaDon.getLichSuHoaDons();
            Collections.sort(lsHD, (ls1, ls2) -> ls2.getThoiGian().compareTo(ls1.getThoiGian()));
            list = new ArrayList<>(lsHD); // Tạo một bản sao của lsHD
            Collections.reverse(list);// Đảo ngược thứ tự của các phần tử trong list
            int i = 0;
            while (i < list.size() - 1) {
                if (list.get(i).getTrangThaiSauUpdate().equals(list.get(i + 1).getTrangThaiSauUpdate())) {
                    list.remove(i + 1);
                } else {
                    i++;
                }
            }
        }
        model.addAttribute("strack", list);
        model.addAttribute("lstLSHD", lsHD);
        model.addAttribute("show", code);
        model.addAttribute("hoadon", hoaDon);
        model.addAttribute("user", user);
        return "customer/pages/oder-tracking/oder-tracking";
    }
}
