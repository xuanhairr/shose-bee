package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.MauSac;
import com.poly.BeeShoes.service.ChiTietSanPhamService;
import com.poly.BeeShoes.service.MauSacService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MauSacRestController {
    private final MauSacService mauSacService;
    private final ChiTietSanPhamService chiTietSanPhamService;

    @PostMapping("/them-mau-sac")
    public ResponseEntity<MauSac> them(@RequestParam("trangThai") Boolean trangThai, @RequestParam("maMau") String maMau, @RequestParam("ten") String ten, @RequestParam(value = "id", required = false) Long id) {
        MauSac th = new MauSac();
        if (ten.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "nameNull").body(null);
        }
        if (maMau.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "colorCodeNull").body(null);
        }

        th = mauSacService.getMauSacByMa(maMau);

        if (id == null && th != null) {
            System.out.println("Vào null");
            System.out.println(id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByMaMau").body(null);
        }
        if (id != null && th != null && th.getId() != id) {
            System.out.println("Vào");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByMaMau").body(null);
        }
        if (trangThai == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "statusNull").body(null);
        }

        if (id != null) {
            if (mauSacService.existsByTen(ten,id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        } else {
            if (mauSacService.existsByTen(ten,null)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        }
        if (id != null) {
            th = mauSacService.getById(id);
            if (th != null) {
                th.setNgaySua(Timestamp.from(Instant.now()));
            }
        } else {
            th = new MauSac();
            th.setNgayTao(Timestamp.from(Instant.now()));
        }
        th.setTrangThai(trangThai);
        th.setTen(ten);
        th.setMaMauSac(maMau);
        MauSac sp = mauSacService.save(th);
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

    @DeleteMapping("/xoa-mau-sac")
    public ResponseEntity xoa(@RequestParam(value = "id") Long id) {
        boolean st = false;
        MauSac ms = mauSacService.getById(id);
        if (chiTietSanPhamService.existsByMauSac(ms)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "constraint").body(null);
        }
        if (id != null) {
            st = mauSacService.delete(id);
        }
        if (st) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "success").body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(null);
    }

}
