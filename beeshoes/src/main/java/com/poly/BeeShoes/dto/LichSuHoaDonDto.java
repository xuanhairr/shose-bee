package com.poly.BeeShoes.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LichSuHoaDonDto {
    Long id;
    Long idHoaDon;
    String hanhDong;
    Timestamp thoiGian;
    String nguoiThucHien;
    String trangThaiSauUpdate;
}
