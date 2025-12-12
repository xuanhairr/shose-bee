package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.Anh;
import com.poly.BeeShoes.service.AnhService;
import com.poly.BeeShoes.service.ChiTietSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AnhRestController {
    private final AnhService anhService;
    private final ChiTietSanPhamService chiTietSanPhamService;
    @DeleteMapping("/delete-anh")
    public ResponseEntity deleteAnh(@RequestParam("url") String url) {
        Anh anh = anhService.getAnhByURL(url);
        boolean st = chiTietSanPhamService.existsByAnh(anh);
        if (st){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "inProDetail").body(null);
        }
        if (anh == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "imgNull").body(null);
        }
        if (anh.isMain()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "isMain").body(null);
        }else{
            anhService.delete(anh.getId());
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }
    }

}
