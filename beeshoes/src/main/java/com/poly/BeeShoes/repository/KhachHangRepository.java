package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.DiaChi;
import com.poly.BeeShoes.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Long> {
    Optional<KhachHang> findByMaKhachHang(String maKhachHang);

    Optional<KhachHang> findById(Long id);
    Optional<KhachHang> findFirstByDiaChiMacDinh(DiaChi diaChi);

    boolean existsByMaKhachHang(String maKhachHang);

    boolean existsBySdt(String sdt);
}
