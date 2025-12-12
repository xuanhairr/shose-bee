package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.MuiGiay;
import com.poly.BeeShoes.model.SanPham;
import com.poly.BeeShoes.model.TheLoai;
import com.poly.BeeShoes.model.ThuongHieu;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham,Long> {
    @Query("SELECT sp FROM SanPham sp WHERE EXISTS (SELECT 1 FROM sp.chiTietSanPham ctsp) AND sp.trangThai=true")
    Page<SanPham> getAllByChiTietSanPhamExists(Pageable pageable);
    @Query("SELECT s FROM SanPham s LEFT JOIN FETCH s.chiTietSanPham ctsp LEFT JOIN FETCH ctsp.mauSac ms ORDER BY ms.maMauSac")
    SanPham findByIdWithSortedChiTietSanPham(Long id);
    @Query("SELECT sp FROM SanPham sp WHERE sp.chiTietSanPham IS EMPTY")
    List<SanPham> findAllWithoutChiTietSanPham();
    @Query("SELECT sp FROM SanPham sp JOIN FETCH sp.chiTietSanPham cts WHERE sp.trangThai = true AND cts.trangThai = :chiTietSanPhamTrangThai")
    List<SanPham> findAllWithChiTietSanPham(@Param("chiTietSanPhamTrangThai") Integer chiTietSanPhamTrangThai);
    @Query("SELECT sp FROM SanPham sp JOIN FETCH sp.chiTietSanPham cts WHERE sp.trangThai = true AND cts.trangThai = 1 AND sp.id=:id")
    Optional<SanPham> getByIdClient(@Param("id")Long id);
    SanPham getFirstByTen(String name);
    boolean existsByTheLoai(TheLoai theLoai);
    List<SanPham> findByChiTietSanPham_SoLuongTonLessThan(int soLuongTon);
    boolean existsByThuongHieu(ThuongHieu thuongHieu);

    default List<SanPham> findTop6ByOrderByTotalSoLuongTonAsc() {
        List<SanPham> allSanPham = findAll();
        Predicate<SanPham> trangThaiTrue = SanPham::isTrangThai;
        allSanPham.removeIf(trangThaiTrue.negate());
        allSanPham.sort(Comparator.comparingInt(SanPham::getTotalSoLuongTon));
        return allSanPham.subList(0, Math.min(allSanPham.size(), 6));
    }

    boolean existsByTen(String ten);

    List<SanPham> findTop4ByTheLoaiAndTrangThaiIsTrueOrderByNgayTaoDesc(TheLoai theLoai);
    @Query("SELECT DISTINCT sp FROM SanPham sp " +
            "JOIN FETCH sp.chiTietSanPham cts " +
            "WHERE cts.giaGoc > cts.giaBan AND sp.trangThai = true " +
            "ORDER BY (cts.giaGoc - cts.giaBan) DESC LIMIT 4")
    List<SanPham> findTop4ByGiaGocMinusGiaBanOrderByGiaGocMinusGiaBanDesc();
    @Query("SELECT DISTINCT sp FROM SanPham sp " +
            "JOIN FETCH sp.chiTietSanPham cts " +
            "WHERE cts.giaGoc > cts.giaBan AND sp.trangThai = true " +
            "ORDER BY (cts.giaGoc - cts.giaBan) DESC")
    List<SanPham> findByGiaGocMinusGiaBanOrderByGiaGocMinusGiaBanDesc();
    @Query("SELECT sp FROM SanPham sp " +
            "WHERE sp.trangThai = true " +
            "AND sp NOT IN :topProducts " +  // Sử dụng NOT IN để loại bỏ sản phẩm trùng
            "ORDER BY sp.ngayTao DESC " +
            "LIMIT 4")
    List<SanPham> findFirst4ByTrangThaiTrueOrderByNgayTaoDesc(@Param("topProducts") List<SanPham> topProducts);

    Integer countByTrangThaiIsTrue();

    List<SanPham> findByTrangThaiEquals(Boolean trangThai);
}
