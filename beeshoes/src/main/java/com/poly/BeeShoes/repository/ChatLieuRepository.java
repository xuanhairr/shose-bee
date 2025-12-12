package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatLieuRepository extends JpaRepository<ChatLieu,Long> {
    boolean existsByTen(String ten);
    ChatLieu getFirstByTen(String ten);

    List<ChatLieu> findAllByTrangThaiIsTrue();
}
