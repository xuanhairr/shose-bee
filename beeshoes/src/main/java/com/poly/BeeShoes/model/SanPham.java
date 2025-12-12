package com.poly.BeeShoes.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String ten;
    String moTa;
    Timestamp ngayTao;
    Timestamp ngaySua;



    @OneToOne
    @JoinColumn(name = "id")
    User nguoiTao;

    @OneToOne
    @JoinColumn(name = "id")
    User nguoiSua;

    boolean trangThai;

    @ManyToMany
    @JoinTable(
            name = "tags_san_pham",
            joinColumns = @JoinColumn(name = "id_san_pham"),
            inverseJoinColumns = @JoinColumn(name = "id_tag")
    )
    List<Tags> tags;

    @JoinColumn(name = "id_thuong_hieu")
    @ManyToOne
    ThuongHieu thuongHieu;

    @JoinColumn(name = "id_the_loai")
    @ManyToOne
    TheLoai theLoai;

    @OneToMany(mappedBy = "sanPham")
    List<Anh> anh;

    @OneToMany(mappedBy = "sanPham")
    List<ChiTietSanPham> chiTietSanPham;

    @Transient
    int soLuong;

    @Transient
    BigDecimal giaBan;
    @Transient
    boolean sale;

    @Transient
    List<MauSac> mauSac;
    public Anh getMainImage() {
        if (anh == null || anh.isEmpty()) {
            return null;
        }

        // Duyệt qua danh sách ảnh của sản phẩm
        for (Anh image : anh) {
            if (image.isMain()) {
                return image; // Trả về ảnh chính nếu tìm thấy
            }
        }

        return null; // Trả về null nếu không tìm thấy ảnh chính
    }
    public boolean hasSale() {
        if (chiTietSanPham == null || chiTietSanPham.isEmpty()) {
            return false; // Trả về false nếu không có chi tiết sản phẩm nào
        }
        // Sử dụng Java Stream để kiểm tra xem có chi tiết sản phẩm nào có trường isSale là true không
        return chiTietSanPham.stream().anyMatch(ChiTietSanPham::isSale);
    }

    public int getTotalSoLuongTon() {
        if (chiTietSanPham == null || chiTietSanPham.isEmpty()) {
            return 0; // Trả về 0 nếu không có chi tiết sản phẩm nào
        }

        int total = 0;
        for (ChiTietSanPham chiTiet : chiTietSanPham) {
            total += chiTiet.getSoLuongTon();
        }
        return total;
    }
    public boolean isSales() {
        if (chiTietSanPham == null || chiTietSanPham.isEmpty()) {
            return false;
        }
        // Sử dụng Java Stream để kiểm tra xem có đối tượng nào có isSale là true và trạng thái là 1 hay không
        return chiTietSanPham.stream()
                .anyMatch(ctsp -> ctsp.isSale() && ctsp.getTrangThai() == 1);
    }
    public List<KichCo> getDistinctKichCoList() {
        if (chiTietSanPham == null || chiTietSanPham.isEmpty()) {
            return List.of();
        }
        // Sử dụng Java Stream để lọc các kích cỡ không trùng lặp
        return chiTietSanPham.stream()
                .map(ChiTietSanPham::getKichCo)
                .distinct()
                .collect(Collectors.toList());
    }
    public boolean constrainTags(Tags tags){
        return this.getTags().contains(tags);
    }
    public List<ChiTietSanPham> getSortedChiTietSanPhamByMauSac() {
        if (chiTietSanPham == null || chiTietSanPham.isEmpty()) {
            return Collections.emptyList();
        }
        // Sắp xếp danh sách chi tiết sản phẩm theo mã màu sắc
        chiTietSanPham.sort(Comparator.comparing(ctsp -> ctsp.getMauSac().getMaMauSac()));

        return chiTietSanPham;
    }
    public List<MauSac> getDistinctMauSacList() {
        if (chiTietSanPham == null || chiTietSanPham.isEmpty()) {
            return List.of(); // Trả về danh sách rỗng nếu danh sách chi tiết sản phẩm là null hoặc rỗng
        }

        // Sử dụng Java Stream để lấy danh sách các màu sắc từ danh sách chi tiết sản phẩm
        List<MauSac> allColors = chiTietSanPham.stream()
                .map(ChiTietSanPham::getMauSac)
                .collect(Collectors.toList());

        // Lọc các màu sắc không trùng lặp
        return allColors.stream()
                .distinct()
                .collect(Collectors.toList());
    }

}
