package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.HinhThucThanhToan;
import com.poly.BeeShoes.model.HoaDon;

import java.util.List;

public interface HinhThucThanhToanService {
    List<HinhThucThanhToan> getByHinhThucThanhToan(String hinhThuc);
    List<HinhThucThanhToan> getAll();
    HinhThucThanhToan save(HinhThucThanhToan hinhThucThanhToan);
    HinhThucThanhToan getById(Long id);
    HinhThucThanhToan getByTen(String hinhThuc);
    boolean delete(Long id);
    HinhThucThanhToan getByHinhThuc(String hinhThuc);

}
