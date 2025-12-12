package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.HinhThucThanhToan;
import com.poly.BeeShoes.model.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HinhThucThanhToanRepository extends JpaRepository<HinhThucThanhToan, Long> {
    Optional<HinhThucThanhToan> findFirstByHinhThuc(String hinhThuc);
    List<HinhThucThanhToan> findByHinhThuc(String hinhThuc);
}
