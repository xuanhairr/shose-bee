package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.KichCo;

import java.util.List;

public interface KichCoService {
    KichCo save(KichCo kichCo);
    KichCo getById(Long id);
    KichCo getByTen(String co);
    List<KichCo> getAll();
    List<KichCo> getAllClient();
    boolean delete(Long id);
    boolean existsByTen(String ten,Long id);
}
