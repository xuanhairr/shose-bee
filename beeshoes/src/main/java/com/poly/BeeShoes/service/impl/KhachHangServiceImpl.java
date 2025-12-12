package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.DiaChi;
import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.model.KichCo;
import com.poly.BeeShoes.repository.KhachHangRepository;
import com.poly.BeeShoes.request.KhachHangRequest;
import com.poly.BeeShoes.service.KhachHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class KhachHangServiceImpl implements KhachHangService {

    private final KhachHangRepository khachHangRepository;

    @Override
    public List<KhachHang> getAll() {
        return khachHangRepository.findAll();
    }

    @Override
    public void delete(Long id) {
        khachHangRepository.deleteById(id);
    }

    @Override
    public KhachHang detail(Long id) {
        KhachHang khachHang = khachHangRepository.findById(id).orElse(null);
        return khachHang;
    }

    @Override
    public KhachHang add(KhachHang khachHang) {
        return khachHangRepository.save(khachHang);
    }

    @Override
    public KhachHang getByDiaChiMacDinh(DiaChi diaChi) {
        return khachHangRepository.findFirstByDiaChiMacDinh(diaChi).orElse(null);
    }

    @Override
    public KhachHang update(KhachHang khachHang) {
        return khachHangRepository.save(khachHang);
    }

    @Override
    public KhachHang getByMa(String ma) {
        return khachHangRepository.findByMaKhachHang(ma)
                .orElseThrow(() -> new UsernameNotFoundException("username does not exist"));
    }

    @Override
    public boolean existByMa(String ma) {
        return khachHangRepository.existsByMaKhachHang(ma);
    }

    @Override
    public boolean existsBySdt(String sdt) {
        return khachHangRepository.existsBySdt(sdt);
    }

    @Override
    public String generateCustomerCode() {
        long count = khachHangRepository.count();
        int numberOfDigits = (int) Math.log10(count + 1) + 1;
        int numberOfZeros = Math.max(0, 5 - numberOfDigits);
        String customerCode;
        do {
            customerCode = String.format("KH%0" + (numberOfDigits + numberOfZeros) + "d", count + 1);
            count++;
        } while (khachHangRepository.existsByMaKhachHang(customerCode));

        return customerCode;
    }
}
