package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCusAdressRequest {
    private String soNhaDto;
    private String phuongXaDto;
    private String quanHuyenDto;
    private String tinhThanhPhoDto;
    private Long id;
}
