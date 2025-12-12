package com.poly.BeeShoes.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class LichSuHoaDonResphone {
    Long id;
    String hanhDong;
    LocalDateTime thoiGian;
    String nguoiThucHien;
}
