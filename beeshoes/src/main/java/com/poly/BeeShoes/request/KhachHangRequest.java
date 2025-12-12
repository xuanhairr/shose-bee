package com.poly.BeeShoes.request;

import com.poly.BeeShoes.model.KhachHang;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;
@Getter
@Setter
@ToString
public class KhachHangRequest {
    private Long id;
    private String maKhachHang;
    private String hoTen;
    private String email;
    private boolean gioiTinh;
    private Date ngaySinh;
    private String sdt;
    private boolean trangThai=true;
    Long idDiaChi;
    String soNha;
    String phuongXa;
    String quanHuyen;
    String tinhThanhPho;
}
