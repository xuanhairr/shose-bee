package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.ChiTietSanPham;
import com.poly.BeeShoes.model.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Long> {
    List<HoaDonChiTiet> findByHoaDon_Id(Long id);

    HoaDonChiTiet findFirstByChiTietSanPham(ChiTietSanPham chiTietSanPham);
}
