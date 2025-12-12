package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Tags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String ten;
    Timestamp ngayTao;
    Timestamp ngaySua;

    @OneToOne
    @JoinColumn(name = "nguoi_tao")
    User nguoiTao;

    @OneToOne
    @JoinColumn(name = "nguoi_sua")
    User nguoiSua;

    @Transient
    String update;
    @Transient
    String create;

    boolean trangThai;

    @ManyToMany(mappedBy = "tags")
    List<SanPham> sanPhams;
}
