package com.poly.BeeShoes.api;

import com.poly.BeeShoes.dto.DiaChiDto;
import com.poly.BeeShoes.library.LibService;
import com.poly.BeeShoes.model.DiaChi;
import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.model.Role;
import com.poly.BeeShoes.model.User;
import com.poly.BeeShoes.request.KhachHangRequest;
import com.poly.BeeShoes.request.UpdateCusAdressRequest;
import com.poly.BeeShoes.service.DiaChiService;
import com.poly.BeeShoes.service.KhachHangService;
import com.poly.BeeShoes.service.UserService;
import com.poly.BeeShoes.utility.MailUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/")
@RequiredArgsConstructor
public class KhachHangRestController {
    private final KhachHangService khachHangService;
    private final UserService userService;
    private final DiaChiService diaChiService;
    private final PasswordEncoder passwordEncoder;
    private final MailUtility mailUtility;

    @GetMapping("get-address-by-customer")
    public ResponseEntity getAddress(@RequestParam("id") Long id) {
        KhachHang khachHang = khachHangService.detail(id);
        if (khachHang == null) {
            return ResponseEntity.notFound().build();
        }
        List<DiaChi> dc = khachHang.getDiaChi();
        dc.forEach(addd -> addd.setKhachHang(null));
        return ResponseEntity.ok().body(dc);
    }
    @PostMapping("/set-default-address")
    public ResponseEntity setAddess(@RequestParam("idDiaChi") Long idDiaChi,
                                    @RequestParam("idKhachHang") Long idKhachHang){
        DiaChi diaChi = diaChiService.detail(idDiaChi);
        KhachHang khachHang = khachHangService.detail(idKhachHang);
        khachHang.setDiaChiMacDinh(diaChi);
        System.out.println(idKhachHang);
        System.out.println(idDiaChi);
        khachHangService.update(khachHang);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PostMapping("/update/add-diachi")
    public ResponseEntity addDiaChi(
            @ModelAttribute("diaChiDto") DiaChiDto diaChiDto
    ) {
        if(diaChiDto.getSoNhaDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","soNhaNull").body(null);
        }
        if(diaChiDto.getPhuongXaDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","tinhTPNull").body(null);
        }
        if(diaChiDto.getQuanHuyenDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","quanHuyenNull").body(null);
        }
        if(diaChiDto.getTinhThanhPhoDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","phuongXaNull").body(null);
        }
        KhachHang khachHang = khachHangService.detail(diaChiDto.getIdKH());

        if(khachHang.getDiaChi().size() > 4){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","maxAddress").body(null);
        }
        DiaChi diaChi = new DiaChi();
        diaChi.setSoNha(diaChiDto.getSoNhaDto());
        diaChi.setPhuongXa(diaChiDto.getPhuongXaDto());
        diaChi.setQuanHuyen(diaChiDto.getQuanHuyenDto());
        diaChi.setTinhThanhPho(diaChiDto.getTinhThanhPhoDto());
        diaChi.setKhachHang(khachHangService.detail(diaChiDto.getIdKH()));
        DiaChi diaChi1 = diaChiService.add(diaChi);
        diaChi1.setKhachHang(null);

        if (diaChi1.getId() != null) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "oke").body(diaChi1);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(diaChi1);
    }
    @PostMapping("/update/update-diachi")
    public ResponseEntity updateAdress(@ModelAttribute UpdateCusAdressRequest request) {
        if(request.getSoNhaDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","soNhaNull").body(null);
        }
        if(request.getPhuongXaDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","tinhTPNull").body(null);
        }
        if(request.getQuanHuyenDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","quanHuyenNull").body(null);
        }
        if(request.getTinhThanhPhoDto().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","phuongXaNull").body(null);
        }
        DiaChi dc = diaChiService.detail(request.getId());
        if(dc==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","AddressNull").body(null);
        }

        dc.setSoNha(request.getSoNhaDto());
        dc.setPhuongXa(request.getPhuongXaDto());
        dc.setQuanHuyen(request.getQuanHuyenDto());
        dc.setTinhThanhPho(request.getTinhThanhPhoDto());
        diaChiService.add(dc);
        return ResponseEntity.status(HttpStatus.OK).header("status", "oke").body(null);
    }
    @PostMapping("/check-duplicate")
    @ResponseBody
    public Map<String, Boolean> checkDuplicate(@RequestParam("email") String email,
                                               @RequestParam("phoneNumber") String phoneNumber,
                                               @RequestParam(name = "id",required = false) Long id) {
        User user = userService.findByKhachHang_Id(id);
        KhachHang khachHang = khachHangService.detail(id);
        boolean emailExists = userService.existsByEmail(email);
        boolean phoneNumberExists = khachHangService.existsBySdt(phoneNumber);

        if(user.getEmail().equalsIgnoreCase(email)){
            emailExists = false;
        }
        if(khachHang.getSdt().equalsIgnoreCase(phoneNumber)){
            phoneNumberExists = false;
        }

        Map<String, Boolean> result = new HashMap<>();
        result.put("email", emailExists);
        result.put("phoneNumber", phoneNumberExists);
        return result;
    }

    @PostMapping("/add-new-customer")
    public ResponseEntity addKH(@ModelAttribute("khachHang") KhachHangRequest khachHang) {
        if (khachHang.getHoTen().isBlank()) {
            return ResponseEntity.notFound().header("status", "emtyHoTen").build();
        }

        if (khachHang.getSdt().isBlank()) {
            return ResponseEntity.notFound().header("status", "emtySDT").build();
        }

        if (khachHangService.existsBySdt(khachHang.getSdt())) {
            return ResponseEntity.notFound().header("status", "exitsBySDT").build();
        }

        if (khachHang.getEmail().isBlank()) {
            return ResponseEntity.notFound().header("status", "emtyEmail").build();
        }

        if (userService.existsByEmail(khachHang.getEmail())) {
            return ResponseEntity.notFound().header("status", "exitsByEmail").build();
        }

        if (khachHang.getSoNha().isBlank()) {
            return ResponseEntity.notFound().header("status", "emtySoNha").build();
        }

        if (khachHang.getPhuongXa().isBlank()) {
            return ResponseEntity.notFound().header("status", "emtyPhuongXa").build();
        }

        if (khachHang.getQuanHuyen().isBlank()) {
            return ResponseEntity.notFound().header("status", "emtyQuanHuyen").build();
        }

        if (khachHang.getTinhThanhPho().isBlank()) {
            return ResponseEntity.notFound().header("status", "emtyTinhTP").build();
        }

        KhachHang kh1 = new KhachHang();
        kh1.setHoTen(khachHang.getHoTen());
        kh1.setGioiTinh(khachHang.isGioiTinh());
        kh1.setNgaySinh(khachHang.getNgaySinh());
        kh1.setSdt(khachHang.getSdt());
        kh1.setNgayTao(Timestamp.from(Instant.now()));
        kh1.setMaKhachHang(khachHangService.generateCustomerCode());
        kh1.setTrangThai(khachHang.isTrangThai());
        KhachHang kh = khachHangService.add(kh1);
        DiaChi dc = new DiaChi();
        dc.setSoNha(khachHang.getSoNha());
        dc.setPhuongXa(khachHang.getPhuongXa());
        dc.setQuanHuyen(khachHang.getQuanHuyen());
        dc.setTinhThanhPho(khachHang.getTinhThanhPho());
        dc.setNgayTao(Timestamp.from(Instant.now()));
        dc.setKhachHang(kh);
        DiaChi diaChi = diaChiService.add(dc);
        kh.setDiaChiMacDinh(diaChi);
        kh = khachHangService.add(kh);
        User user = new User();
        user.setEmail(khachHang.getEmail());
        user.setRole(Role.CUSTOMER);
        String password = LibService.generateRandomString(10);
        user.setPassword(passwordEncoder.encode(password));
        user.setKhachHang(kh);
        User u = userService.createNewUser(user);
        if (u != null) {
            String tb = "Chúc mừng bạn đã tạo tài khoản thành công!";
            String body = "<h1>Đăng Ký Thành Công !</h1><h2>email đăng nhập là : " + user.getEmail() + "</h2><h2>Mật Khẩu là : " + password + "</h2>";
            mailUtility.sendMail(user.getEmail(), tb, body);
        }
        Map<String, Object> res = new HashMap<>();
        res.put("mail", u.getEmail());
        res.put("ma", u.getKhachHang().getMaKhachHang());
        res.put("ten", u.getKhachHang().getHoTen());
        res.put("id", u.getKhachHang().getId());
        res.put("phone", u.getKhachHang().getSdt());
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/check-valid-email")
    public boolean checkEmail(@RequestParam("email") String email) {
        return userService.existsByEmail(email);
    }

    @PostMapping("/check-valid-phone")
    public boolean checkPhone(@RequestParam("phone") String phone) {
        return khachHangService.existsBySdt(phone);
    }

    @GetMapping("/get-avatar")
    public ResponseEntity avatar() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            User user = userService.getByUsername(userDetails.getUsername());
            return ResponseEntity.ok().body(user.getAvatar());
        }
        return ResponseEntity.notFound().build();
    }
}
