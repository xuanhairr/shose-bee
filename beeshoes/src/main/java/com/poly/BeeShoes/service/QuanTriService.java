package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.QuanTri;

import java.util.List;

public interface QuanTriService {
    QuanTri save(QuanTri quanTri);

    QuanTri update(QuanTri quanTri, Long id);
    QuanTri getById(Long id);
    List<QuanTri> getAll();
    boolean delete(Long id);
}
