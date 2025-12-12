package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.QuanTri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuanTriReponsitory extends JpaRepository<QuanTri, Long> {
}
