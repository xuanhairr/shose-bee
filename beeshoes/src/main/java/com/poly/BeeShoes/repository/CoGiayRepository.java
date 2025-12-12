package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.CoGiay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoGiayRepository extends JpaRepository<CoGiay,Long> {
    boolean existsByTen(String Ten);
    CoGiay getFirstByTen(String ten);

    List<CoGiay> findAllByTrangThaiIsTrue();
//    boolean existsByTenIgnoreCaseAndTrangThai(String tenChuanHoa, boolean b);
}
