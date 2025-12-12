package com.poly.BeeShoes.request;

import com.poly.BeeShoes.model.*;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class chiTietSanPhamApiRquest {
    Long id;
    String maSanPham;
    String mauSac;
    String ten;
    String tenMau;
    String KichCo;
    String anh;
    Integer giaGoc;
    Integer giaBan;
    int soLuongTon;
    boolean isSale;
}
