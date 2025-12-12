package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.LichSuHoaDon;
import com.poly.BeeShoes.repository.LichSuHoaDonRepository;
import com.poly.BeeShoes.service.LichSuHoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LichSuHoaDonServiceImpl implements LichSuHoaDonService {

    private final LichSuHoaDonRepository lichSuHoaDonRepository;

    @Override
    public List<LichSuHoaDon> getAllLichSuHoaDonByIdHoaDon(Long id) {
        return lichSuHoaDonRepository.findByHoaDon_Id(id, Sort.by(Sort.Direction.DESC, "thoiGian"));
    }

    @Override
    public LichSuHoaDon save(LichSuHoaDon lichSuHoaDon) {
        return lichSuHoaDonRepository.save(lichSuHoaDon);
    }

    @Override
    public List<LichSuHoaDon> getAllLichSuHoaDonNotSort(Long id) {
        return lichSuHoaDonRepository.findByHoaDon_Id(id);
    }
}
