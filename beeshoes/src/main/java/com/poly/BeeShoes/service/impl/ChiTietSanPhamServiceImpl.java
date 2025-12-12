package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.repository.ChiTietSanPhamRepository;
import com.poly.BeeShoes.service.ChiTietSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChiTietSanPhamServiceImpl implements ChiTietSanPhamService {
    private final ChiTietSanPhamRepository ctspRepository;
    @Override
    public ChiTietSanPham save(ChiTietSanPham chiTietSanPham) {
        return ctspRepository.save(chiTietSanPham);
    }

    @Override
    public ChiTietSanPham getById(Long id) {
        return ctspRepository.findById(id).orElse(null);
    }

    @Override
    public ChiTietSanPham getBySizeAndColorAndProduct(KichCo kichCo, MauSac mauSac,SanPham sanPham) {
        return ctspRepository.getFirstByMauSacAndKichCoAndSanPham(mauSac,kichCo,sanPham);
    }

//    @Override
//    public ChiTietSanPham getBySizeAndColor(KichCo kichCo, MauSac mauSac) {
//        return ctspRepository.getFirstByMauSacAndKichCo(mauSac ,kichCo);
//    }

    @Override
    public List<ChiTietSanPham> getAllBySanPham(SanPham samPham) {
        return ctspRepository.getAllBySanPham(samPham);
    }

    @Override
    public boolean delete(Long id) {
        ChiTietSanPham ctsp = ctspRepository.findById(id).get();
        if (ctsp.getId()!=null){
            ctspRepository.deleteById(ctsp.getId());
            return true;
        }
        return false;
    }

    @Override
    public boolean existsByChatLieu(ChatLieu chatLieu) {
        return ctspRepository.existsByChatLieu(chatLieu);
    }

    @Override
    public boolean existsByMaSanPham(String ma) {
        return false;
    }

    @Override
    public boolean existsByMauSac(MauSac ms) {
        return ctspRepository.existsByMauSac(ms);
    }

    @Override
    public boolean existsBySanPham(SanPham sanPham) {
        return ctspRepository.existsBySanPham(sanPham);
    }

    @Override
    public boolean existsByCoGiay(CoGiay cg) {
        return ctspRepository.existsByCoGiay(cg);
    }

    @Override
    public boolean existsByKichCo(KichCo kc) {
        return ctspRepository.existsByKichCo(kc);
    }


    @Override
    public boolean existsByDeGiay(DeGiay dg) {
        return ctspRepository.existsByDeGiay(dg);
    }

    @Override
    public boolean existsByMuiGiay(MuiGiay mg) {
        return ctspRepository.existsByMuiGiay(mg);
    }

    @Override
    public String generateDetailCode() {
        long count = ctspRepository.count();
        int numberOfDigits = (int) Math.log10(count + 1) + 1;
        int numberOfZeros = Math.max(0, 6 - numberOfDigits);
        String productCode;
        do {
            productCode = String.format("SP%0" + (numberOfDigits + numberOfZeros) + "d", count + 1);
            count++;
        } while (ctspRepository.existsByMaSanPham(productCode));

        return productCode;
    }

    @Override
    public boolean existsByAnh(Anh anh) {
        return ctspRepository.existsByAnh(anh);
    }
}
