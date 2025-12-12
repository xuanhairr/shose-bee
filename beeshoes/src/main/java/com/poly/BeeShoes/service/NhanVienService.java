package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.ChucVu;
import com.poly.BeeShoes.model.NhanVien;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NhanVienService {
    Page<NhanVien> phanTrang(Integer pageNum, Integer pageNo);

    List<NhanVien> getAll();

    void delete(Long id);

    NhanVien detail(Long id);

    NhanVien add(NhanVien nhanVien);

    NhanVien update(NhanVien nhanVien, Long id);

    NhanVien getByMa(String ma);

    boolean existByMa(String ma);

    String generateEmployeeCode();

    boolean existsByChucVu(ChucVu cv);

    boolean existsBySdt(String sdt);

    boolean existsByCccd(String cccd);

}
