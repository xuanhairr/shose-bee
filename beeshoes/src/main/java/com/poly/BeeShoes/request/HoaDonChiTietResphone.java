package com.poly.BeeShoes.request;

import com.poly.BeeShoes.model.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Setter
@Getter
public class HoaDonChiTietResphone {
    Long id;
    Integer giaGoc;
    Integer giaBan;
    int soLuong;
    String maSanPham;
    String tenSanPham;
    String maMauSac;
    String tenMauSac;
    String kichCo;
    String anh;
    int soLuongTon;
}
