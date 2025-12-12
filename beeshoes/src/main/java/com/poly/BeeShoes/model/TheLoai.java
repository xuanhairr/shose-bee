package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TheLoai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String ten;
    Timestamp ngayTao;
    Timestamp ngaySua;
    @Transient
    Long CountProduct;
    @OneToOne
    @JoinColumn(name = "nguoi_tao")
    User nguoiTao;

    @OneToOne
    @JoinColumn(name = "nguoi_sua")
    User nguoiSua;

    boolean trangThai;

    @Transient
    String update;
    @Transient
    String create;

    @Override
    public String toString() {
        return "TheLoai{" +
                "id=" + id +
                ", ten='" + ten + '\'' +
                ", ngayTao=" + ngayTao +
                ", ngaySua=" + ngaySua +
                ", nguoiTao=" + nguoiTao +
                ", nguoiSua=" + nguoiSua +
                ", trangThai=" + trangThai +
                ", update='" + update + '\'' +
                ", create='" + create + '\'' +
                '}';
    }
}
