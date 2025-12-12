package com.poly.BeeShoes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.sql.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "khach_hang")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String maKhachHang;
    private String hoTen;
    private boolean gioiTinh;
    private Date ngaySinh;
    private String sdt;
    @JsonIgnore
    @OneToMany(mappedBy = "khachHang", fetch = FetchType.EAGER)
    List<DiaChi> diaChi;

    @OneToOne(mappedBy = "khachHang")
    private User user;

    @OneToOne
    @JoinColumn(name = "id_hang_khach_hang")
    HangKhachHang hangKhachHang;
    @OneToOne
    @JoinColumn(name = "dia_chi_mac_dinh")
    DiaChi diaChiMacDinh;

    private Integer diem=null;
    private Timestamp ngayTao;
    private Timestamp ngaySua;



    @OneToOne
    @JoinColumn(name = "nguoi_tao")
    User nguoiTao;

    @OneToOne
    @JoinColumn(name = "nguoi_sua")
    User nguoiSua;

    private boolean trangThai;
}
