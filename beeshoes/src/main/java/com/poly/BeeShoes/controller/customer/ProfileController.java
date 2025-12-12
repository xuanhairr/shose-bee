package com.poly.BeeShoes.controller.customer;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.request.ProfileRequest;
import com.poly.BeeShoes.service.*;
import com.poly.BeeShoes.utility.ConvertUtility;
import com.poly.BeeShoes.utility.MailUtility;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Controller
@RequiredArgsConstructor
public class ProfileController {
    private final UserService userService;
    private final HoaDonService hoaDonService;
    private final VoucherService voucherService;
    private final KhachHangService khachHangService;
    private final MailUtility mailUtility;
    private final LichSuHoaDonService lichSuHoaDonService;

    @GetMapping("/user-profile")
    public String profile(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            User user = userService.getByUsername(userDetails.getUsername());
            List<HoaDon> hd = hoaDonService.getByKhachHang(user.getKhachHang());
            List<Voucher> vouchers = voucherService.getAllByTrangThai(2);
            hd.forEach((hoaDon -> {
                vouchers.removeIf(v -> v.equals(hoaDon.getVoucher()));
            }));
            model.addAttribute("user", user);
            model.addAttribute("lsthoadon", hd);
            model.addAttribute("lstvouchers", vouchers);
            return "customer/pages/profile/user-profile";
        } else {
//            User user = userService.getByUsername("lutan2212@gmail.com");
//            List<HoaDon> hd = hoaDonService.getByKhachHang(user.getKhachHang());
//            List<Voucher> vouchers = voucherService.getAllByTrangThai(2);
//            hd.forEach((hoaDon -> {
//                vouchers.removeIf(v -> v.equals(hoaDon.getVoucher()));
//            }));
//            model.addAttribute("user", user);
//            model.addAttribute("lsthoadon", hd);
//            model.addAttribute("lstvouchers", vouchers);
//            return "customer/pages/profile/user-profile";
            return "redirect:/";
        }
    }

    @PostMapping("/api/update-profile")
    public ResponseEntity update(@ModelAttribute ProfileRequest request) {
        System.out.println(request.toString());
        if (request.getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("error", "Empty id.").build();
        }
        if (request.getHoTen().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("error", "Please enter your full name.").build();
        }
        if (request.getAvatar().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("error", "Please enter your avatar.").build();
        }
        if (request.getEmail().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("error", "Please enter your email.").build();
        }
        if (request.getSdt().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("error", "Please enter your phone.").build();
        }

        User user = userService.findByKhachHang_Id(request.getId());
        KhachHang khachHang = khachHangService.detail(request.getId());
        boolean emailExists = userService.existsByEmail(request.getEmail());
        boolean phoneNumberExists = khachHangService.existsBySdt(request.getSdt());

        if (user.getEmail().equalsIgnoreCase(request.getEmail())) {
            emailExists = false;
        }
        if (khachHang.getSdt().equalsIgnoreCase(request.getSdt())) {
            phoneNumberExists = false;
        }
        if (emailExists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("error", "Exists by email.").build();
        }
        if (phoneNumberExists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("error", "Exists by phone number.").build();
        }
        user.setEmail(request.getEmail());
        user.setAvatar(request.getAvatar());
        user.setNgaySua(Timestamp.from(Instant.now()));
        userService.update(user);
        khachHang.setNgaySinh(request.getNgaySinh());
        khachHang.setGioiTinh(request.isGioiTinh());
        khachHang.setHoTen(request.getHoTen());
        khachHang.setNgaySua(Timestamp.from(Instant.now()));
        khachHangService.update(khachHang);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-profile/search")
    public String filterByStatusAndInvoiceCode(
            @RequestParam("status") String status,
            @RequestParam("invoiceCode") String invoiceCode,
            Model model,
            HttpServletRequest request
    ) {
        if (request.getUserPrincipal() != null) {
            User user = userService.getByUsername(request.getUserPrincipal().getName());
            KhachHang khachHang = user.getKhachHang();
            List<HoaDon> invoiceList =
                    hoaDonService.getByCustomerIdAndInvoiceCodeAndStatus(khachHang.getId(), invoiceCode, status);
            List<Voucher> voucherList = voucherService.getAll();
            invoiceList.forEach(inv -> voucherList.removeIf(vou -> vou == inv.getVoucher()));
            model.addAttribute("user", user);
            model.addAttribute("lsthoadon", invoiceList);
            model.addAttribute("lstvouchers", voucherList);
        }
        return "customer/pages/profile/user-profile";
    }

    @PostMapping("/user-profile/update-receive-infor")
    public ResponseEntity updateReceiveInfor(
            @RequestBody String data,
            HttpServletRequest request
    ) {
        JsonObject response = JsonParser.parseString(data).getAsJsonObject();
        String invCode = response.get("invCode").getAsString();
        String cusName = response.get("customerName").getAsString();
        String cusPhone = response.get("customerPhone").getAsString();
        String invReceiveAddr = response.get("invReceiveAddress").getAsString();
        HoaDon needUpdateInv = hoaDonService.getHoaDonByMa(invCode);
        needUpdateInv.setTenNguoiNhan(cusName);
        needUpdateInv.setSdtNhan(cusPhone);
        needUpdateInv.setDiaChiNhan(invReceiveAddr);
        HoaDon updatedInv = hoaDonService.save(needUpdateInv);
        LichSuHoaDon invHistory = new LichSuHoaDon();
        if (request.getUserPrincipal() != null) {
            String body = "Bạn vừa cập nhật thông tin nhận hàng của đơn hàng có mã " + updatedInv.getMaHoaDon() +
                    " <br> <a href='http://localhost:8080/oder-tracking?oder=" + updatedInv.getMaHoaDon() +
                    "'>Xem chi tiết tại đây</a>";
            User userLogged = userService.getByUsername(request.getUserPrincipal().getName());
            invHistory.setNguoiThucHien(userLogged);
            mailUtility.sendMail(userLogged.getEmail(), "[LightBee Shop - Thông báo cập nhật thông tin đơn hàng]", body);
        }
        invHistory.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        invHistory.setHoaDon(updatedInv);
        invHistory.setTrangThaiSauUpdate(updatedInv.getTrangThai());
        invHistory.setHanhDong("Cập nhật thông tin đơn hàng");
        invHistory = lichSuHoaDonService.save(invHistory);
        Map<String, Object> res = new HashMap<>();
        res.put("tenNguoiNhan", updatedInv.getTenNguoiNhan());
        res.put("sdtNguoiNhan", updatedInv.getSdtNhan());
        res.put("diaChi", updatedInv.getDiaChiNhan());
        res.put("times", invHistory.getThoiGian());
        res.put("message", invHistory.getHanhDong());
        return ResponseEntity.ok().body(res);
    }
}
