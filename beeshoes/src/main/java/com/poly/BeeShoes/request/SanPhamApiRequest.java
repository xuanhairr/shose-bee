package com.poly.BeeShoes.request;

import com.poly.BeeShoes.model.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamApiRequest {
    Long id;
    String ten;
    List<String> tags;
    Long thuongHieu;
    Long theLoai;
    List<kichCoApiRequest> kichCo;
    List<String> maMauSac;
    List<AnhApiRequest> anh;
    List<chiTietSanPhamApiRquest> chiTietSanPham;
    boolean sale;
}
