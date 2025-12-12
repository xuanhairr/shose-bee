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
public class Anh {
    public Anh(SanPham sanPham, String url, boolean main, Timestamp ngayTao) {
        this.sanPham = sanPham;
        this.url = url;
        this.main = main;
        this.ngayTao = ngayTao;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "id_san_pham")
    SanPham sanPham;

    String url;
    boolean main;
    Timestamp ngayTao;
    Timestamp ngaySua;

    @OneToOne
    @JoinColumn(name = "nguoi_tao")
    User nguoiTao;

    @OneToOne
    @JoinColumn(name = "nguoi_sua")
    User nguoiSua;
    boolean trangThai;

    @Override
    public String toString() {
        return "Anh{" +
                "id=" + id +
                ", sanPham=" + sanPham +
                ", url='" + url + '\'' +
                ", main=" + main +
                ", ngayTao=" + ngayTao +
                ", ngaySua=" + ngaySua +
                ", nguoiTao=" + nguoiTao +
                ", nguoiSua=" + nguoiSua +
                ", trangThai=" + trangThai +
                '}';
    }
}
