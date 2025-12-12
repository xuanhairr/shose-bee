package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonChiTiet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don")
    HoaDon hoaDon;

    @OneToOne
    @JoinColumn(name = "id_chi_tiet_san_pham")
    ChiTietSanPham chiTietSanPham;
    BigDecimal giaGoc;
    BigDecimal giaBan;
    int soLuong;

}
