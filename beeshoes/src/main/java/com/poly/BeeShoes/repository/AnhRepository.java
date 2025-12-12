package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.Anh;
import com.poly.BeeShoes.model.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnhRepository extends JpaRepository<Anh,Long> {
    List<Anh> getAllBySanPham(SanPham sanPham);
    void removeAnhsBySanPham(SanPham sanPham);
    Anh getFirstByUrl(String url);
}
