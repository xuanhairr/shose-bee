package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.CoGiay;

import java.util.List;

public interface CoGiayService {
    CoGiay save(CoGiay coGiay);
    CoGiay getById(Long id);
    CoGiay getByTen(String ten);
    List<CoGiay> getAll();
    List<CoGiay> getAllClient();
    boolean delete(Long id);
    boolean existsByTen(String ten ,Long id);
}
