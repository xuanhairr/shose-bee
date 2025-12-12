package com.poly.BeeShoes.api;

import com.poly.BeeShoes.library.LibService;
import com.poly.BeeShoes.model.KichCo;
import com.poly.BeeShoes.service.ChiTietSanPhamService;
import com.poly.BeeShoes.service.KichCoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class KichCoRestController {
    private final KichCoService kichCoService;
    private final ChiTietSanPhamService chiTietSanPhamService;
    @PostMapping("/them-kich-co")
    public ResponseEntity<KichCo> them(@RequestParam("trangThai") Boolean trangThai, @RequestParam("ten") String ten, @RequestParam(value = "id", required = false) Long id) {
        KichCo th = new KichCo();

        if (ten.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "nameNull").body(null);
        }
        if (trangThai==null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "statusNull").body(null);
        }
        if (!LibService.isNumeric(ten)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "NotIsNum").body(null);
        }
        if (Integer.parseInt(ten) < 20 || Integer.parseInt(ten) > 50) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "faildkhoang").body(null);
        }
        if (id != null) {
            if (kichCoService.existsByTen(ten,id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        } else {
            if (kichCoService.existsByTen(ten,null)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        }

        if (id != null) {
            th = kichCoService.getById(id);
            th.setNgaySua(Timestamp.from(Instant.now()));
        } else {
            th.setNgaySua(Timestamp.from(Instant.now()));
            th.setNgayTao(Timestamp.from(Instant.now()));
        }
        th.setTrangThai(trangThai);
        th.setTen(ten);
        KichCo sp = kichCoService.save(th);
        if (sp.getNguoiTao() != null) {
            sp.setCreate(sp.getNguoiTao().getNhanVien().getMaNhanVien());
        } else {
            sp.setCreate("N/A");
        }
        if (sp.getNguoiSua() != null) {
            sp.setUpdate(sp.getNguoiSua().getNhanVien().getMaNhanVien());
        } else {
            sp.setUpdate("N/A");
        }
        sp.setNguoiTao(null);
        sp.setNguoiSua(null);

        if (sp.getId() != null) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "oke").body(sp);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(sp);
    }
    @DeleteMapping("/xoa-kich-co")
    public ResponseEntity xoa(@RequestParam(value = "id") Long id) {
        boolean st = false;
        KichCo cl = kichCoService.getById(id);
        if (chiTietSanPhamService.existsByKichCo(cl)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "constraint").body(null);
        }
        if (id != null) {
            st = kichCoService.delete(id);
        }
        if (st) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "success").body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(null);
    }
}
