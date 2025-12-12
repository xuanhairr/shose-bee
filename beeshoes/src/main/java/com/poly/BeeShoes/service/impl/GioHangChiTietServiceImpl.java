package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.ChiTietSanPham;
import com.poly.BeeShoes.model.GioHang;
import com.poly.BeeShoes.model.GioHangChiTiet;
import com.poly.BeeShoes.repository.GioHangChiTietRepository;
import com.poly.BeeShoes.service.GioHangChiTietService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GioHangChiTietServiceImpl implements GioHangChiTietService {
    private final GioHangChiTietRepository gioHangChiTietRepository;
    @Override
    public GioHangChiTiet save(GioHangChiTiet gioHangChiTiet) {
        return gioHangChiTietRepository.save(gioHangChiTiet);
    }

    @Override
    public boolean delete(Long id) {
        if (gioHangChiTietRepository.existsById(id)){
            gioHangChiTietRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public GioHangChiTiet getByCTSP(ChiTietSanPham chiTietSanPham, GioHang gioHang) {
        return gioHangChiTietRepository.findByChiTietSanPhamAndGioHang(chiTietSanPham,gioHang);
    }

    @Override
    public GioHangChiTiet getById(Long id) {
        return gioHangChiTietRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteByGioHangId(Long id) {
        gioHangChiTietRepository.deleteByGioHang_Id(id);
    }

    @Override
    public void deleteByGioHangIdAndChiTietSanPhamId(Long idGioHang, Long idChiTietSanPham) {
        gioHangChiTietRepository.deleteGioHangChiTietsByGioHang_IdAndAndChiTietSanPham_Id(idGioHang, idChiTietSanPham);
    }


}
