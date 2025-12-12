package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.ChucVu;
import java.util.List;

public interface ChucVuService {
    List<ChucVu> getAll();
    boolean delete(Long id);
    ChucVu getById(Long id);
    ChucVu save(ChucVu chucVu);;
    ChucVu getByTen(String ten);
    boolean existsByTen(String ten);
}
