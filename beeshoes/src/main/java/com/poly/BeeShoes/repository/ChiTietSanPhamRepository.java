package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham,Long> {
    boolean existsBySanPham(SanPham sanPham);
    boolean existsByMauSac(MauSac mauSac);
    List<ChiTietSanPham> getAllBySanPham(SanPham sanPham);
    boolean existsByMaSanPham(String ma);
    boolean existsByChatLieu(ChatLieu chatLieu);
    boolean existsByMuiGiay(MuiGiay mg);
    boolean existsByCoGiay(CoGiay cg);
    boolean existsByDeGiay(DeGiay dg);
    ChiTietSanPham getFirstByMauSacAndKichCoAndSanPham(MauSac mauSac, KichCo kichCo,SanPham sanPham);
    boolean existsByKichCo(KichCo kc);
    boolean existsByAnh(Anh anh);
    ChiTietSanPham getFirstByMauSacAndKichCo(MauSac mauSac, KichCo kichCo);
}
