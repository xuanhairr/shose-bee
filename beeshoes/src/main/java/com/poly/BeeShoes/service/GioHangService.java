package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.GioHang;
import com.poly.BeeShoes.model.KhachHang;

import java.util.List;

public interface GioHangService {
    GioHang save(GioHang gioHang);
    boolean delete(Long id);
    GioHang getByKhachHang(KhachHang khachHang);

    GioHang findByCustomerId(Long id);
    GioHang getById(Long id);
}
