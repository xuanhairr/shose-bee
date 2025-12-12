package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.LichSuHoaDon;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDon, Long> {

    List<LichSuHoaDon> findByHoaDon_Id(Long id, Sort sort);

    List<LichSuHoaDon> findByHoaDon_Id(Long id);

}
