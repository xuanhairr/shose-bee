package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.DiaChi;
import com.poly.BeeShoes.repository.DiaChiReponsitory;
import com.poly.BeeShoes.service.DiaChiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaChiServiceImpl implements DiaChiService {
    private final DiaChiReponsitory diaChiReponsitory;

    @Override
    public List<DiaChi> getAll() {
        return diaChiReponsitory.findAll();
    }

    @Override
    public DiaChi getById(Long id) {
        return diaChiReponsitory.findById(id).orElse(null);
    }

    @Override
    public void delete(Long id) {
        diaChiReponsitory.deleteById(id);
    }

    @Override
    public DiaChi detail(Long id) {
        DiaChi diaChi = diaChiReponsitory.findById(id).get();
        return diaChi;
    }

    @Override
    public DiaChi add(DiaChi diaChi) {
        return diaChiReponsitory.save(diaChi);
    }

    @Override
    public DiaChi update(DiaChi diaChi, Long id) {
        return diaChiReponsitory.save(diaChi);
    }

    @Override
    public List<DiaChi> getByIdKhachHang(Long id) {
        return diaChiReponsitory.findByKhachHang_Id(id);
    }
}
