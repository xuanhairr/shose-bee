package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.Anh;
import com.poly.BeeShoes.model.SanPham;
import com.poly.BeeShoes.repository.AnhRepository;
import com.poly.BeeShoes.service.AnhService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnhServiceImpl implements AnhService {
    private final AnhRepository anhRepository;

    @Override
    public Anh save(Anh anh) {
        return anhRepository.save(anh);
    }

    @Override
    public Anh getAnhByURL(String url) {
        return anhRepository.getFirstByUrl(url);
    }

    @Override
    public List<Anh> getAllBySanPham(SanPham sanPham) {
        return anhRepository.getAllBySanPham(sanPham);
    }

    @Override
    public boolean delete(Long id) {
        Anh a = anhRepository.findById(id).get();
        if (a.getId() != null) {
            anhRepository.deleteById(a.getId());
            return true;
        }
        return false;
    }
}
