package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.DeGiay;
import com.poly.BeeShoes.service.ChiTietSanPhamService;
import com.poly.BeeShoes.service.DeGiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class DeGiayRestController {
    private final DeGiayService deGiayService;
    private final ChiTietSanPhamService chiTietSanPhamService;
    @PostMapping("/them-de-giay")
    public ResponseEntity<DeGiay> them(@RequestParam("trangThai") Boolean trangThai, @RequestParam("ten") String ten, @RequestParam(value = "id", required = false) Long id) {
        DeGiay th = new DeGiay();
        if (ten.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "nameNull").body(null);
        }
        if (trangThai==null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "statusNull").body(null);
        }
        if (id != null) {
            if (deGiayService.existsByTen(ten,id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        } else {
            if (deGiayService.existsByTen(ten,null)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        }

        if (id != null) {
            th = deGiayService.getById(id);
            th.setNgaySua(Timestamp.from(Instant.now()));
        } else {
            th.setNgaySua(Timestamp.from(Instant.now()));
            th.setNgayTao(Timestamp.from(Instant.now()));
        }
        th.setTrangThai(trangThai);
        th.setTen(ten);
        DeGiay sp = deGiayService.save(th);
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
    @DeleteMapping("/xoa-de-giay")
    public ResponseEntity xoa(@RequestParam(value = "id") Long id) {
        boolean st = false;
        DeGiay cl = deGiayService.getById(id);
        if (chiTietSanPhamService.existsByDeGiay(cl)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "constraint").body(null);
        }
        if (id != null) {
            st = deGiayService.delete(id);
        }
        if (st) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "success").body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(null);
    }
}
