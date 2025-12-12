package com.poly.BeeShoes.controller.cms;

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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/cms/khach-hang")
public class KhachHangController {
    private final KhachHangService khachHangService;
    private final DiaChiService diaChiService;

    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    private final MailUtility mailUtility;

    @GetMapping("")
    public String khachHang(Model model) {
        List<KhachHang> kh = khachHangService.getAll();
        List<DiaChi> dc = diaChiService.getAll();
        model.addAttribute("listKH", kh);
        model.addAttribute("listDC", dc);
        model.addAttribute("khachHang", new KhachHang());
        model.addAttribute("diaChi", new DiaChi());
        return "cms/pages/users/khachHang";
    }

    @GetMapping("/deleteKH/{id}")
    public String deleteKH(@PathVariable Long id) {
        KhachHang khachHang = khachHangService.detail(id);
        khachHang.setTrangThai(false);
        khachHangService.update(khachHang);
        return "redirect:/cms/khach-hang";
    }

    @GetMapping("/view-addKH")
    public String viewAdd(Model model) {
        model.addAttribute("khachHang", new KhachHangRequest());
        model.addAttribute("listKH", khachHangService.getAll());
        model.addAttribute("listDC", diaChiService.getAll());
        return "cms/pages/users/add-khachHang";
    }

    @PostMapping("/add")
    public String addKH(@ModelAttribute("khachHang") KhachHangRequest khachHang, Model model,
                @RequestParam("sdt") String sdt,
                @RequestParam("email") String email) {
            boolean check = false;
            if(khachHang.getHoTen().isBlank()){
                model.addAttribute("errorHoTen", "Họ tên không được để trống");
                check=true;
            }if(khachHang.getSdt().isBlank()){
                model.addAttribute("errorSdt", "Sdt không được để trống");
                check=true;
            }
            if(khachHangService.existsBySdt(sdt)){
                model.addAttribute("trungSdt", "Số điện thoại đã tồn tại");
                check=true;
            }
            if(khachHang.getEmail().isBlank()){
                model.addAttribute("errorEmail", "Email không được để trống");
                check=true;
            }
            if(userService.existsByEmail(email)){
                model.addAttribute("trungEmail", "Email đã tồn tại");
                check=true;
            }if(khachHang.getSoNha().isBlank()){
                model.addAttribute("errorSoNha", "Số nhà không được để trống");
                check=true;
            }if(khachHang.getPhuongXa().isBlank()){
                model.addAttribute("errorPhuongXa", "Phường xã không được để trống");
                check=true;
            }if(khachHang.getQuanHuyen().isBlank()){
                model.addAttribute("errorQuanHuyen", "Quận huyện không được để trống");
                check=true;
            }if(khachHang.getTinhThanhPho().isBlank()){
                model.addAttribute("errorTinhTP", "Tỉnh tp không được để trống");
                check=true;
            }
            if(check){
                model.addAttribute("khachHang", khachHang);
                return "redirect:/cms/khach-hang/view-addKH";
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
            User u =  userService.createNewUser(user);
            if(u!=null){
                String tb = "Chúc mừng bạn đã tạo tài khoản thành công!";
                String body = "<h1>Đăng Ký Thành Công !</h1><h2>email đăng nhập là : "+user.getEmail() +"</h2><h2>Mật Khẩu là : "+password+"</h2>";
                mailUtility.sendMail(user.getEmail(), tb, body);
            }
            return "redirect:/cms/khach-hang";
    }

    @GetMapping("/detail/{id}")
    public String khachHangDetail(@PathVariable Long id, Model model) {
        KhachHang khachHang = khachHangService.detail(id);
        User user = userService.findByKhachHang_Id(khachHang.getId());
        KhachHangRequest kh = new KhachHangRequest();
        kh.setId(khachHang.getId());
        kh.setEmail(user.getEmail());
        kh.setMaKhachHang(khachHang.getMaKhachHang());
        kh.setSdt(khachHang.getSdt());
        kh.setHoTen(khachHang.getHoTen());
        kh.setNgaySinh(khachHang.getNgaySinh());
        kh.setGioiTinh(khachHang.isGioiTinh());
        kh.setTrangThai(khachHang.isTrangThai());
        if(khachHang.getDiaChiMacDinh() != null){
            kh.setIdDiaChi(khachHang.getDiaChiMacDinh().getId());
        }


        model.addAttribute("khachHang", kh);
        model.addAttribute("listDC", khachHang.getDiaChi());
        return "cms/pages/users/detail-khachHang";
    }
//
//    @PostMapping("/update/add-diachi")
//    public ResponseEntity addDiaChi(
//            @ModelAttribute("diaChiDto") DiaChiDto diaChiDto
//    ) {
//        if(diaChiDto.getSoNhaDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","soNhaNull").body(null);
//        }
//        if(diaChiDto.getPhuongXaDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","tinhTPNull").body(null);
//        }
//        if(diaChiDto.getQuanHuyenDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","quanHuyenNull").body(null);
//        }
//        if(diaChiDto.getTinhThanhPhoDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","phuongXaNull").body(null);
//        }
//        KhachHang khachHang = khachHangService.detail(diaChiDto.getIdKH());
//
//        if(khachHang.getDiaChi().size() > 4){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","maxAddress").body(null);
//        }
//        DiaChi diaChi = new DiaChi();
//        diaChi.setSoNha(diaChiDto.getSoNhaDto());
//        diaChi.setPhuongXa(diaChiDto.getPhuongXaDto());
//        diaChi.setQuanHuyen(diaChiDto.getQuanHuyenDto());
//        diaChi.setTinhThanhPho(diaChiDto.getTinhThanhPhoDto());
//        diaChi.setKhachHang(khachHangService.detail(diaChiDto.getIdKH()));
//        DiaChi diaChi1 = diaChiService.add(diaChi);
//        diaChi1.setKhachHang(null);
//
//        if (diaChi1.getId() != null) {
//            return ResponseEntity.status(HttpStatus.OK).header("status", "oke").body(diaChi1);
//        }
//        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(diaChi1);
//    }
//    @PostMapping("/update/update-diachi")
//    public ResponseEntity updateAdress(@ModelAttribute UpdateCusAdressRequest request) {
//        if(request.getSoNhaDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","soNhaNull").body(null);
//        }
//        if(request.getPhuongXaDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","tinhTPNull").body(null);
//        }
//        if(request.getQuanHuyenDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","quanHuyenNull").body(null);
//        }
//        if(request.getTinhThanhPhoDto().isBlank()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","phuongXaNull").body(null);
//        }
//        DiaChi dc = diaChiService.detail(request.getId());
//        if(dc==null){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status","AddressNull").body(null);
//        }
//
//        dc.setSoNha(request.getSoNhaDto());
//        dc.setPhuongXa(request.getPhuongXaDto());
//        dc.setQuanHuyen(request.getQuanHuyenDto());
//        dc.setTinhThanhPho(request.getTinhThanhPhoDto());
//        diaChiService.add(dc);
//        return ResponseEntity.status(HttpStatus.OK).header("status", "oke").body(null);
//    }
//    @PostMapping("/set-default-address")
//    public ResponseEntity setAddess(@RequestParam("idDiaChi") Long idDiaChi,
//                                    @RequestParam("idKhachHang") Long idKhachHang){
//        DiaChi diaChi = diaChiService.detail(idDiaChi);
//        KhachHang khachHang = khachHangService.detail(idKhachHang);
//        khachHang.setDiaChiMacDinh(diaChi);
//        System.out.println(idKhachHang);
//        System.out.println(idDiaChi);
//        khachHangService.update(khachHang);
//        return ResponseEntity.status(HttpStatus.OK).body(null);
//    }

    @PostMapping("/update/{id}")
    public String updateKH(
            @PathVariable Long id, Model model,
            @ModelAttribute("khachHang") KhachHangRequest khachHang
    ) {
        KhachHang updateKhachHang = khachHangService.detail(id);
        User user = userService.findByKhachHang_Id(khachHang.getId());
        updateKhachHang.setId(khachHang.getId());
        updateKhachHang.setHoTen(khachHang.getHoTen());
        updateKhachHang.setGioiTinh(khachHang.isGioiTinh());
        updateKhachHang.setNgaySinh(khachHang.getNgaySinh());
        updateKhachHang.setSdt(khachHang.getSdt());
        updateKhachHang.setTrangThai(khachHang.isTrangThai());
//        updateKhachHang.setDiaChiMacDinh(diaChiService.getById(khachHang.getIdDiaChi()));
        user.setEmail(khachHang.getEmail());
        user.setKhachHang(updateKhachHang);
        khachHangService.update(updateKhachHang);
        userService.update(user);
        return "redirect:/cms/khach-hang";
    }

//    @PostMapping("/check-duplicate")
//    @ResponseBody
//    public Map<String, Boolean> checkDuplicate(@RequestParam("email") String email,
//                                               @RequestParam("phoneNumber") String phoneNumber,
//                                               @RequestParam(name = "id",required = false) Long id) {
//        User user = userService.findByKhachHang_Id(id);
//        KhachHang khachHang = khachHangService.detail(id);
//        boolean emailExists = userService.existsByEmail(email);
//        boolean phoneNumberExists = khachHangService.existsBySdt(phoneNumber);
//
//        if(user.getEmail().equalsIgnoreCase(email)){
//            emailExists = false;
//        }
//        if(khachHang.getSdt().equalsIgnoreCase(phoneNumber)){
//            phoneNumberExists = false;
//        }
//
//        Map<String, Boolean> result = new HashMap<>();
//        result.put("email", emailExists);
//        result.put("phoneNumber", phoneNumberExists);
//        return result;
//    }

    @PostMapping("/check-duplicateAdd")
    @ResponseBody
    public Map<String, Boolean> checkDuplicateAdd(@RequestParam("email") String email,
                                               @RequestParam("phoneNumber") String phoneNumber) {
        boolean emailExists = userService.existsByEmail(email);
        boolean phoneNumberExists = khachHangService.existsBySdt(phoneNumber);

        Map<String, Boolean> result = new HashMap<>();
        result.put("email", emailExists);
        result.put("phoneNumber", phoneNumberExists);
        return result;
    }
}
