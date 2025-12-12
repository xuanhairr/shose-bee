package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.ChiTietSanPham;
import com.poly.BeeShoes.model.GioHang;
import com.poly.BeeShoes.model.GioHangChiTiet;

import java.util.List;

public interface GioHangChiTietService {
    GioHangChiTiet save(GioHangChiTiet gioHangChiTiet);
    boolean delete(Long id);

    GioHangChiTiet getByCTSP(ChiTietSanPham ctsp, GioHang gioHang);
    GioHangChiTiet getById(Long id);

    void deleteByGioHangId(Long id);

    void deleteByGioHangIdAndChiTietSanPhamId(Long idGioHang, Long idChiTietSanPham);
}
