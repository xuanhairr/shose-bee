package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.LichSuHoaDon;

import java.util.List;

public interface LichSuHoaDonService {
    List<LichSuHoaDon> getAllLichSuHoaDonByIdHoaDon(Long id);

    LichSuHoaDon save(LichSuHoaDon lichSuHoaDon);

    List<LichSuHoaDon> getAllLichSuHoaDonNotSort(Long id);

}
