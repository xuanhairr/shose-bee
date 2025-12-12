package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaChiReponsitory extends JpaRepository<DiaChi, Long> {
    List<DiaChi> findByKhachHang_Id(Long id);
}
