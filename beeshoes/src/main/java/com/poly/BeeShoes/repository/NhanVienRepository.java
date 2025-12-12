package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.ChucVu;
import com.poly.BeeShoes.model.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface NhanVienRepository extends JpaRepository<NhanVien, Long> {
    Optional<NhanVien> findByMaNhanVien(String maNhanVien);

    boolean existsByMaNhanVien(String maNhanVien);

    boolean existsByChucVu(ChucVu cv);

    boolean existsBySdt(String sdt);

    boolean existsByCccd(String cccd);
}
