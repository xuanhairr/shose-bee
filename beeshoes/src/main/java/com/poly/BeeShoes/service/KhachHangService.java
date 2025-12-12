package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.DiaChi;
import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.request.KhachHangRequest;

import java.util.List;

public interface KhachHangService {
    List<KhachHang> getAll();

    void delete(Long id);

    KhachHang detail(Long id);

    KhachHang add(KhachHang khachHang);
    KhachHang getByDiaChiMacDinh(DiaChi diaChi);

    KhachHang update(KhachHang khachHang);
    KhachHang getByMa(String ma);

    boolean existByMa(String ma);

    boolean existsBySdt(String sdt);

    String generateCustomerCode();
}
