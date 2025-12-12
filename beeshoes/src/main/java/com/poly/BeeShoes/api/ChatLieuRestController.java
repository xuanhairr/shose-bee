package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.ChatLieu;
import com.poly.BeeShoes.service.ChatLieuService;
import com.poly.BeeShoes.service.ChiTietSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatLieuRestController {
    private final ChatLieuService chatLieuService;
    private final ChiTietSanPhamService chiTietSanPhamService;
    @DeleteMapping("/xoa-chat-lieu")
    public ResponseEntity xoaChatLieu(@RequestParam(value = "id") Long id) {
        boolean st = false;
        ChatLieu cl = chatLieuService.getById(id);
        if (chiTietSanPhamService.existsByChatLieu(cl)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "constraint").body(null);
        }
        if (id != null) {
            st = chatLieuService.delete(id);
        }
        if (st) {
            return ResponseEntity.status(HttpStatus.OK).header("status", "success").body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).header("status", "error").body(null);
    }

    @PostMapping("/them-chat-lieu")
    public ResponseEntity<ChatLieu> themThuongHieu(@RequestParam("trangThai") Boolean trangThai, @RequestParam("ten") String ten, @RequestParam(value = "id", required = false) Long id) {
        ChatLieu th = new ChatLieu();
        if (ten.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "nameNull").body(null);
        }
        if (trangThai==null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "statusNull").body(null);
        }
        if (id != null) {
            if (chatLieuService.existsByTen(ten,id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        } else {
            if (chatLieuService.existsByTen(ten,null)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "existsByTen").body(null);
            }
        }

        if (id != null) {
            th = chatLieuService.getById(id);
            th.setNgaySua(Timestamp.from(Instant.now()));
        } else {
            th.setNgaySua(Timestamp.from(Instant.now()));
            th.setNgayTao(Timestamp.from(Instant.now()));
        }
        th.setTrangThai(trangThai);
        th.setTen(ten);
        ChatLieu sp = chatLieuService.save(th);
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
