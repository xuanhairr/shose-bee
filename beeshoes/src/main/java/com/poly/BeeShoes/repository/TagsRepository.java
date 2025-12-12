package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.Tags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagsRepository extends JpaRepository<Tags,Long> {
    List<Tags> findAllByTrangThaiIsTrue();


    Tags getFirstByTen(String ten);
}
