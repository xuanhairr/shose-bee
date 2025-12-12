package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.MuiGiay;
import com.poly.BeeShoes.service.ChiTietSanPhamService;
import com.poly.BeeShoes.service.MuiGiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MuiGiayRestController {
    private final MuiGiayService muiGiayService;
    private final ChiTietSanPhamService chiTietSanPhamService;
    @PostMapping("/them-mui-giay")
    public ResponseEntity<MuiGiay> them(@RequestParam("trangThai") Boolean trangThai, @RequestParam("ten") String ten, @RequestParam(value = "id", required = false) Long id) {
        MuiGiay th = new MuiGiay();
        if (ten.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "nameNull").body(null);
        }
        if (trangThai==null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "statusNull").body(null);
        }
        if (id != null) {
            if (muiGiayService.existsByTen(ten,id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        } else {
            if (muiGiayService.existsByTen(ten,null)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        }

        if (id != null) {
            th = muiGiayService.getById(id);
            th.setNgaySua(Timestamp.from(Instant.now()));
        } else {
            th.setNgaySua(Timestamp.from(Instant.now()));
            th.setNgayTao(Timestamp.from(Instant.now()));
        }
        th.setTrangThai(trangThai);
        th.setTen(ten);
        MuiGiay sp = muiGiayService.save(th);
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
    @DeleteMapping("/xoa-mui-giay")
    public ResponseEntity xoa(@RequestParam(value = "id") Long id) {
        boolean st = false;
        MuiGiay cl = muiGiayService.getById(id);
        if (chiTietSanPhamService.existsByMuiGiay(cl)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "constraint").body(null);
        }
        if (id != null) {
            st = muiGiayService.delete(id);
        }
        if (st) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "success").body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(null);
    }
}
