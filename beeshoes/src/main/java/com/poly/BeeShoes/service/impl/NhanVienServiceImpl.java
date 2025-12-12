package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.ChucVu;
import com.poly.BeeShoes.model.NhanVien;
import com.poly.BeeShoes.model.Voucher;
import com.poly.BeeShoes.repository.NhanVienRepository;
import com.poly.BeeShoes.service.NhanVienService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NhanVienServiceImpl implements NhanVienService {
    private final NhanVienRepository nhanVienRepository;

    @Override
    public Page<NhanVien> phanTrang(Integer pageNum, Integer pageNo) {
        Pageable pageable = PageRequest.of(pageNum, pageNo);
        return nhanVienRepository.findAll(pageable);
    }

    @Override
    public List<NhanVien> getAll() {
        return nhanVienRepository.findAll();
    }

    @Override
    public void delete(Long id) {
        nhanVienRepository.deleteById(id);
    }

    @Override
    public NhanVien detail(Long id) {
        NhanVien nhanVien = nhanVienRepository.findById(id).get();
        return nhanVien;
    }

    @Override
    public NhanVien add(NhanVien nhanVien) {
        return nhanVienRepository.save(nhanVien);
    }

    @Override
    public NhanVien update(NhanVien nhanVien, Long id) {
        Optional<NhanVien> optional = nhanVienRepository.findById(id);
        return optional.map(o ->
        {
            nhanVienRepository.save(nhanVien);
            return o;
        }).orElse(null);
    }

    @Override
    public NhanVien getByMa(String ma) {
        return nhanVienRepository.findByMaNhanVien(ma)
                .orElseThrow(() -> new UsernameNotFoundException("username does not exist"));
    }

    @Override
    public boolean existByMa(String ma) {
        return nhanVienRepository.existsByMaNhanVien(ma);
    }

    @Override
    public String generateEmployeeCode() {
        long count = nhanVienRepository.count();
        int numberOfDigits = (int) Math.log10(count + 1) + 1;
        int numberOfZeros = Math.max(0, 5 - numberOfDigits);
        String employeeCode;
        do {
            employeeCode = String.format("NV%0" + (numberOfDigits + numberOfZeros) + "d", count + 1);
            count++;
        } while (nhanVienRepository.existsByMaNhanVien(employeeCode));

        return employeeCode;
    }

    @Override
    public boolean existsByChucVu(ChucVu cv) {
        return nhanVienRepository.existsByChucVu(cv);
    }

    @Override
    public boolean existsBySdt(String sdt) {
        return nhanVienRepository.existsBySdt(sdt);
    }

    @Override
    public boolean existsByCccd(String cccd) {
        return nhanVienRepository.existsByCccd(cccd);
    }
}
