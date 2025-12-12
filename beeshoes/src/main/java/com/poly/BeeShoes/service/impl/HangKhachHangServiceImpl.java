package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.HangKhachHang;
import com.poly.BeeShoes.repository.HangKhachHangRepository;
import com.poly.BeeShoes.service.HangKhachHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HangKhachHangServiceImpl implements HangKhachHangService {

    private final HangKhachHangRepository hangKhachHangRepository;

    @Override
    public HangKhachHang getByMa(String bronze) {
        return null;
    }
}
