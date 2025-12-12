package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductInResponse {
    Long id;
    String maSanPham;
    String mauSac;
    String ten;
    String KichCo;
    String anh;
    Integer giaGoc;
    Integer giaBan;
    int soLuong;
}
