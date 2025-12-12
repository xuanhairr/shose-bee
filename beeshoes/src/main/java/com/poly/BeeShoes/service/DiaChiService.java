package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.DiaChi;

import java.util.List;

public interface DiaChiService {
    List<DiaChi> getAll();

    DiaChi getById(Long id);
    void delete(Long id);
    DiaChi detail(Long id);
    DiaChi add(DiaChi diaChi);
    DiaChi update(DiaChi diaChi, Long id);

    List<DiaChi> getByIdKhachHang(Long id);
}
