package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.TheLoai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheLoaiRepository extends JpaRepository<TheLoai, Long> {

    boolean existsByTen(String ten);

    List<TheLoai> findAllByTrangThaiIsTrue();

    TheLoai getFirstByTen(String ten);

    TheLoai getById(Long id);
    // Phương thức để lấy số lượng sản phẩm có trạng thái true được gắn với mỗi thể loại
    @Query("SELECT COUNT(sp) FROM SanPham sp WHERE sp.theLoai.id = :theLoaiId AND sp.trangThai = true")
    Long countSanPhamByTheLoaiIdAndTrangThai(@Param("theLoaiId") Long theLoaiId);
}
