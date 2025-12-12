package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.ChiTietSanPham;
import com.poly.BeeShoes.model.GioHang;
import com.poly.BeeShoes.model.GioHangChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTiet,Long> {
    GioHangChiTiet findByChiTietSanPhamAndGioHang(ChiTietSanPham chiTietSanPham, GioHang gioHang);
    void deleteByGioHang_Id(Long id);
    void deleteGioHangChiTietsByGioHang_IdAndAndChiTietSanPham_Id(Long idGioHang, Long idChiTietSanPham);
}
