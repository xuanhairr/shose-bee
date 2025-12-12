package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.MuiGiay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MuiGiayRepository extends JpaRepository<MuiGiay,Long> {
    boolean existsByTen(String ten);
    MuiGiay getByTen(String ten);

    List<MuiGiay> findAllByTrangThaiIsTrue();
}
