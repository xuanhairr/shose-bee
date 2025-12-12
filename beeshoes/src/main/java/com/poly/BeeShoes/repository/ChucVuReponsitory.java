package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.ChucVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChucVuReponsitory  extends JpaRepository<ChucVu, Long> {
    boolean existsByTen(String ten);
    ChucVu getFirstByTen(String ten);
}
