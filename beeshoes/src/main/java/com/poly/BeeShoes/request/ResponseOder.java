package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
public class ResponseOder {
    List<ProductInResponse> sanPham;
    String maHoaDon;
    String tenNguoiNhan;
    String hinhThucThanhToan;
    String type;
    String sDT;
    String diaChi;
    Integer daThanhToan;
    Integer chuaThanhToan;
    Integer tongtien;
    Integer thucthu;
    Integer giamGia;
    Integer phiShip;
    Timestamp ngayTao;
    Timestamp ngayThanhToan;


}
