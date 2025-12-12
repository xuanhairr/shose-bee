package com.poly.BeeShoes.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HoaDonDto {
    Long id;
    String maHoaDon;
    String tenNguoiNhan;
    String sdtNhan;
    BigDecimal thucThu;
    boolean loaiHoaDon;
    String trangThai;
}
