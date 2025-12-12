package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.KichCo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KichCoRepository extends JpaRepository<KichCo,Long> {
    KichCo getKichCoByTen(String ten);
    boolean existsByTen(String ten);
    List<KichCo> findAllByTrangThaiIsTrue();
}
