package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "hang_khach_hang")
@FieldDefaults(level = AccessLevel.PRIVATE)
/*
    id bigint auto_increment,
    ten nvarchar(256),
    diem_toi_thieu int,

 */
public class HangKhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String ten;
    int diemToiThieu;
}
