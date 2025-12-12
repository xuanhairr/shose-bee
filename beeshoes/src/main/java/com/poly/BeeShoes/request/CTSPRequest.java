package com.poly.BeeShoes.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CTSPRequest {

    Long sanPham;

    String tenSanPham;
    List<String> tags;

    Long theLoai;

    Long thuongHieu;

    Long chatLieu;

    Long deGiay;

    Long coGiay;

    Long muiGiay;

    String moTa;

    boolean sales;

    boolean trangThai;

    String product_details;

}
