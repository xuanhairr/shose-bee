package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "nhan_vien")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String maNhanVien;
    String hoTen;
    boolean gioiTinh;
    Date ngaySinh;
    String soNha;
    String phuongXa;
    String quanHuyen;
    String tinhThanhPho;
    String sdt;
    String cccd;

    @ManyToOne
    @JoinColumn(name = "id_chuc_vu")
    ChucVu chucVu;

    Timestamp ngayTao;
    Timestamp ngaySua;

    @OneToOne
    @JoinColumn(name = "nguoi_tao")
    User nguoiTao;

    @OneToOne
    @JoinColumn(name = "nguoi_sua")
    User nguoiSua;

    boolean trangThai;
}
