package com.poly.BeeShoes.controller.cms;

import com.poly.BeeShoes.model.Voucher;
import com.poly.BeeShoes.request.VoucherRequest;
import com.poly.BeeShoes.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Controller
@Component
@RequiredArgsConstructor
@RequestMapping("/cms/voucher")
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping({"", "/"})
    public String index(Model model) {
        model.addAttribute("lstvoucher", voucherService.getAll());
        return "cms/pages/vouchers/voucher";
    }

    @GetMapping({"/add-voucher", "/add-voucher/"})
    public String getData(@RequestParam(name = "id", required = false) Long id, Model model) {
        if (id != null) {
            Voucher voucher = voucherService.getById(id);
            voucher.setEndDate1(voucher.getNgayKetThuc().toLocalDateTime());
            voucher.setStartDate1(voucher.getNgayBatDau().toLocalDateTime());
            model.addAttribute("voucher", voucher);
        }
        return "cms/pages/vouchers/form-voucher";
    }


    @PostMapping("/cancel-voucher")
    public ResponseEntity<Voucher> cancel(@RequestParam("id") Long id) {
        if (id != null) {
            Voucher voucher = voucherService.getById(id);
            if (voucher == null) {
                return ResponseEntity.notFound().header("status", "voucherNull").build();
            }
            voucher.setTrangThai(3);
            voucher.setNgaySua(Timestamp.from(Instant.now()));
            voucherService.save(voucher);
            voucher.setEndDate1(voucher.getNgayKetThuc().toLocalDateTime());
            voucher.setStartDate1(voucher.getNgayBatDau().toLocalDateTime());
            voucher.setNguoiTao(null);
            voucher.setNguoiSua(null);
            return ResponseEntity.ok().body(voucher);
        }
        return ResponseEntity.notFound().header("status", "idNull").build();
    }

    @PostMapping({"/add-voucher", "/add-voucher/"})
    public ResponseEntity save(@ModelAttribute VoucherRequest voucher) {
        if (voucher.getName().isBlank()) {
            return ResponseEntity.notFound().header("status", "NameNull").build();
        }
        boolean bol = voucherService.existsByTen(voucher.getName(), voucher.getId());
        if (bol) {
            return ResponseEntity.notFound().header("status", "existsByName").build();
        }
        if (voucher.getType().isBlank()) {
            return ResponseEntity.notFound().header("status", "typeNull").build();
        }
        if (voucher.getCondition() == null) {
            return ResponseEntity.notFound().header("status", "conditionNull").build();
        }
        if (voucher.getType().equals("%")) {
            if (voucher.getPercent() == null || voucher.getPercent() > 100) {
                return ResponseEntity.notFound().header("status", "presentNull").build();
            }
        } else {
            if (voucher.getMoney() == null) {
                return ResponseEntity.notFound().header("status", "moneyNull").build();
            }
        }
        if (voucher.getStart_time() == null) {
            return ResponseEntity.notFound().header("status", "startNull").build();
        }
        if (voucher.getEnd_time() == null) {
            return ResponseEntity.notFound().header("status", "endNull").build();
        }
        if (voucher.getQuantity() == null) {
            return ResponseEntity.notFound().header("status", "quantityNull").build();
        }
        if (voucher.getMax_discount() == null) {
            return ResponseEntity.notFound().header("status", "maxNull").build();
        }
        if (voucher.getId() != null) {
            if (voucher.getStatus() == null || voucher.getStatus() < 1 || voucher.getStatus() > 4) {
                return ResponseEntity.notFound().header("status", "statusNull").build();
            }
        }
        Voucher vc = null;
        if (voucher.getId() != null) {
            vc = voucherService.getById(voucher.getId());
        }
        if (vc == null) {
            vc = new Voucher();
            vc.setNguoiTao(null);
            vc.setMa(voucherService.genVoucherCode());
            vc.setNgayTao(Timestamp.from(Instant.now()));
            vc.setNgaySua(Timestamp.from(Instant.now()));
            vc.setTrangThai(1);
        } else {
            vc.setNguoiSua(null);
            vc.setNgaySua(Timestamp.from(Instant.now()));
            vc.setTrangThai(voucher.getStatus());
        }
        vc.setNgayBatDau(Timestamp.valueOf(voucher.getStart_time()));
        vc.setNgayKetThuc(Timestamp.valueOf(voucher.getEnd_time()));
        vc.setLoaiVoucher(voucher.getType());
        if (voucher.getType().equals("%")) {
            vc.setGiaTriPhanTram(voucher.getPercent());
            vc.setGiaTriTienMat(null);
        } else {
            vc.setGiaTriPhanTram(null);
            vc.setGiaTriTienMat(voucher.getMoney());
        }
        vc.setSoLuong(voucher.getQuantity());
        vc.setMoTa(voucher.getDescription());
        vc.setGiaTriToiDa(voucher.getMax_discount());
        vc.setGiaTriToiThieu(voucher.getCondition());
        vc.setTen(voucher.getName());
        vc = voucherService.save(vc);
        vc.setNguoiSua(null);
        vc.setNguoiTao(null);
        return ResponseEntity.ok().body(vc);
    }
}
