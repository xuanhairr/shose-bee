package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.*;

import java.util.List;

public interface ChiTietSanPhamService {
    ChiTietSanPham save(ChiTietSanPham chiTietSanPham);
    ChiTietSanPham getById(Long id);
    ChiTietSanPham getBySizeAndColorAndProduct(KichCo kichCo, MauSac mauSac, SanPham sanPham);
//    ChiTietSanPham getBySizeAndColor(KichCo kichCo, MauSac mauSac);
    List<ChiTietSanPham> getAllBySanPham(SanPham samPham);
    boolean delete(Long id);
    boolean existsByChatLieu(ChatLieu chatLieu);
    boolean existsByMaSanPham(String ma);
    boolean existsByMauSac(MauSac ms);
    boolean existsBySanPham(SanPham sanPham);
    boolean existsByCoGiay(CoGiay cg);
    boolean existsByKichCo(KichCo kc);
    boolean existsByDeGiay(DeGiay dg);
    boolean existsByMuiGiay(MuiGiay mg);
    String generateDetailCode();

    boolean existsByAnh(Anh anh);
}
