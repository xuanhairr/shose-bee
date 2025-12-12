package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.HangKhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HangKhachHangRepository extends JpaRepository<HangKhachHang, Long> {

}
