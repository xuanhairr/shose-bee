package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

@Getter
@Setter
@ToString
public class ProfileRequest {
    String hoTen;
    String email;
    String sdt;
    boolean gioiTinh;
    Date ngaySinh;
    String avatar;
    Long id;
}
