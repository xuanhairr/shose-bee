package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "gio_hang_chi_tiet")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GioHangChiTiet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @JoinColumn(name = "id_gio_hang")
    @ManyToOne
    GioHang gioHang;

    @JoinColumn(name = "id_chi_tiet_san_pham")
    @ManyToOne
    ChiTietSanPham chiTietSanPham;

    Integer soLuong;
    boolean trangThai;
}
