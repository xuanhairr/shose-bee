package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.HinhThucThanhToan;
import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.repository.HinhThucThanhToanRepository;
import com.poly.BeeShoes.service.HinhThucThanhToanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HinhThucThanhToanServiceImpl implements HinhThucThanhToanService {

    private final HinhThucThanhToanRepository hinhThucThanhToanRepository;

    @Override
    public List<HinhThucThanhToan> getByHinhThucThanhToan(String hinhThuc) {
        return null;
    }

    @Override
    public List<HinhThucThanhToan> getAll() {
        return hinhThucThanhToanRepository.findAll(Sort.by(Sort.Direction.DESC, "ngayTao"));
    }

    @Override
    public HinhThucThanhToan save(HinhThucThanhToan hinhThucThanhToan) {
        return hinhThucThanhToanRepository.save(hinhThucThanhToan);
    }

    @Override
    public HinhThucThanhToan getById(Long id) {
        return hinhThucThanhToanRepository.findById(id).orElse(null);
    }

    @Override
    public HinhThucThanhToan getByTen(String hinhThuc) {
        return hinhThucThanhToanRepository.findFirstByHinhThuc(hinhThuc).orElse(null);
    }

    @Override
    public boolean delete(Long id) {
        return false;
    }

    @Override
    public HinhThucThanhToan getByHinhThuc(String hinhThuc) {
        return hinhThucThanhToanRepository.findFirstByHinhThuc(hinhThuc).orElse(null);
    }
}
