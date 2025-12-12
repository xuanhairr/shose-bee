package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.QuanTri;
import com.poly.BeeShoes.repository.QuanTriReponsitory;
import com.poly.BeeShoes.service.QuanTriService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuanTriServiceImpl implements QuanTriService {
    private final QuanTriReponsitory quanTriReponsitory;

    @Override
    public QuanTri save(QuanTri quanTri) {
        return quanTriReponsitory.save(quanTri);
    }

    @Override
    public QuanTri update(QuanTri quanTri, Long id) {
        Optional<QuanTri> optional = quanTriReponsitory.findById(id);
        return optional.map(o ->
        {
            quanTriReponsitory.save(quanTri);
            return o;
        }).orElse(null);
    }

    @Override
    public QuanTri getById(Long id) {
        return quanTriReponsitory.findById(id).orElse(null);
    }

    @Override
    public List<QuanTri> getAll() {
        return quanTriReponsitory.findAll();
    }

    @Override
    public boolean delete(Long id) {
        return false;
    }
}
