package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class HDCTResponse {
    Long idHD;
    Long idCTSP;
    Long idHDCT;
    String img;
    String maMauSac;
    String tenMau;
    String kichCo;
    Integer giaBan;
    Integer giaGoc;
    String ten;
    int soLuong;
    boolean isNew;
    Integer tongTien;
    Integer giamGia;
    Integer thucThu;
    Integer phiShip;
    Timestamp times;
    String message;
    String user;
}
