package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.ChiTietSanPham;
import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.model.HoaDonChiTiet;

import java.util.List;

public interface HoaDonChiTietService {

    List<HoaDonChiTiet> getHoaDonChiTietCuaHoaDonById(Long id);

    List<HoaDonChiTiet> getChiTietSanPhamCuaHoaDonByIdHoaDon(Long id);

    HoaDonChiTiet save(HoaDonChiTiet hoaDonChiTiet);
    HoaDonChiTiet getByCTSP(ChiTietSanPham ctsp);
    HoaDonChiTiet getById(Long id);
    boolean delete (Long id);

}
