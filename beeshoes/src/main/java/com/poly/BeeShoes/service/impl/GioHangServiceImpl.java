package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.GioHang;
import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.repository.GioHangRepository;
import com.poly.BeeShoes.service.GioHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GioHangServiceImpl implements GioHangService {
    private final GioHangRepository gioHangRepository;
    @Override
    public GioHang save(GioHang gioHang) {
        return gioHangRepository.save(gioHang);
    }

    @Override
    public boolean delete(Long id) {
        if (gioHangRepository.existsById(id)){
            gioHangRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public GioHang getByKhachHang(KhachHang khachHang) {
        return gioHangRepository.getFirstByKhachHang(khachHang);
    }

    @Override
    public GioHang findByCustomerId(Long id) {
        return gioHangRepository.findGioHangsByKhachHang_Id(id);
    }

    @Override
    public GioHang getById(Long id) {
        return gioHangRepository.findById(id).get();
    }
}
