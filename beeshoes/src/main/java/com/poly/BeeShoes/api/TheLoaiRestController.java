package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.TheLoai;
import com.poly.BeeShoes.service.SanPhamService;
import com.poly.BeeShoes.service.TheLoaiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TheLoaiRestController {
    private final TheLoaiService theLoaiService;
    private final SanPhamService sanPhamService;
    @DeleteMapping("/xoa-the-loai")
    public ResponseEntity xoaChatLieu(@RequestParam(value = "id") Long id) {
        boolean st = false;
        TheLoai cl = theLoaiService.getById(id);
        if (sanPhamService.exitsByTheLoai(cl)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "constraint").body(null);
        }
        if (id != null) {
            st = theLoaiService.delete(id);
        }
        if (st) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "success").body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(null);
    }

    @PostMapping("/them-the-loai")
    public ResponseEntity<TheLoai> themThuongHieu(@RequestParam("trangThai") Boolean trangThai, @RequestParam("ten") String ten, @RequestParam(value = "id", required = false) Long id) {
        TheLoai th = new TheLoai();
        if (ten.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "nameNull").body(null);
        }
        if (trangThai==null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "statusNull").body(null);
        }

        if (id != null) {
            if (theLoaiService.existsByTen(ten,id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        } else {
            if (theLoaiService.existsByTen(ten,null)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        }

        if (id !=null) {
            th = theLoaiService.getById(id);
            th.setNgaySua(Timestamp.from(Instant.now()));
        } else {
            th.setNgaySua(Timestamp.from(Instant.now()));
            th.setNgayTao(Timestamp.from(Instant.now()));
        }
        th.setTrangThai(trangThai);
        th.setTen(ten);
        TheLoai sp = theLoaiService.save(th);
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
}
