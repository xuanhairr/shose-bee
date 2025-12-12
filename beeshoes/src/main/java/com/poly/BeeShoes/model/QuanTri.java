package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "quan_tri")
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class QuanTri {
    @Id
    Long id;
    String banner1;
    String title1;
    String mo_ta1;
    String banner2;
    String title2;
    String mo_ta2;
    @OneToOne
    @JoinColumn(name = "san_pham1")
    SanPham san_pham1;
    String title_sp1;

    @OneToOne
    @JoinColumn(name = "san_pham2")
    SanPham san_pham2;
    String title_sp2;

    @OneToOne
    @JoinColumn(name = "san_pham3")
    SanPham san_pham3;
    String title_sp3;

    @OneToOne
    @JoinColumn(name = "san_pham_sale")
    SanPham san_pham_sale;
    String title_sp_sale;

    LocalDateTime thoi_gian_sale;

    @Transient
    Timestamp thoi_gian;
}
