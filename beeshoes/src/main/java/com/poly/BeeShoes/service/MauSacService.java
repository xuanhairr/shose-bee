package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.MauSac;
import com.poly.BeeShoes.model.ThuongHieu;

import java.util.List;

public interface MauSacService {
    MauSac save(MauSac mauSac);
    MauSac getById(Long id);
    MauSac getMauSacByMa(String ma);
    MauSac getByTen(String ten);
    List<MauSac> getAll();
    boolean delete(Long id);
    boolean existsByMaMauSac(String ma);
    List<MauSac> getAllClient();
    boolean existsByTen(String ten,Long id);
}
