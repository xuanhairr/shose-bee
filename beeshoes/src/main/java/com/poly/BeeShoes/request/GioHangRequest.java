package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GioHangRequest {
    Long id;
    chiTietSanPhamApiRquest chitietSanPham;
    Integer soLuong;
}
