package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailVersion {

    Long id;
    String img;
    String maMauSac;
    String tenMau;
    String kichCo;
    String giaBan;
    String giaGoc;
    int soLuong;
    int trangThai;

    @Override
    public String toString() {
        return "ProductDetailVersion{" +
                "id=" + id +
                ", img='" + img + '\'' +
                ", maMauSac='" + maMauSac + '\'' +
                ", tenMau='" + tenMau + '\'' +
                ", kichCo='" + kichCo + '\'' +
                ", giaBan='" + giaBan + '\'' +
                ", giaGoc='" + giaGoc + '\'' +
                ", soLuong=" + soLuong +
                ", trangThai=" + trangThai +
                '}';
    }
}
