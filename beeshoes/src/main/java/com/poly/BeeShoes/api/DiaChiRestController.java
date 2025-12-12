package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.DiaChi;
import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.service.DiaChiService;
import com.poly.BeeShoes.service.KhachHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/dia-chi")
@RequiredArgsConstructor
public class DiaChiRestController {
    private final DiaChiService diaChiService;
    private final KhachHangService khachHangService;
    @DeleteMapping("/delete")
    public ResponseEntity xoaDiaChi(@RequestParam("id")Long id) {
        DiaChi diaChi = diaChiService.getById(id);
        if (diaChi==null){
            return ResponseEntity.notFound().header("status","AddressNull").build();
        }
        KhachHang kh = khachHangService.getByDiaChiMacDinh(diaChi);
        if (kh!=null){
            return ResponseEntity.notFound().header("status","isAddressDefault").build();
        }
        diaChiService.delete(diaChi.getId());
        return ResponseEntity.ok().build();
    }

}
