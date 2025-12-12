package com.poly.BeeShoes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LichSuHoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don")
    @JsonIgnore
    HoaDon hoaDon;

    String hanhDong;
    Timestamp thoiGian;

    @OneToOne
    @JoinColumn(name = "nguoi_thuc_hien")
    @JsonIgnore
    User nguoiThucHien;

    String trangThaiSauUpdate;
}
