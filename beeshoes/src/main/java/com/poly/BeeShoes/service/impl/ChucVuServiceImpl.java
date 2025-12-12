package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.ChucVu;
import com.poly.BeeShoes.model.MuiGiay;
import com.poly.BeeShoes.repository.ChucVuReponsitory;
import com.poly.BeeShoes.service.ChucVuService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChucVuServiceImpl implements ChucVuService {
    private final ChucVuReponsitory chucVuReponsitory;

    @Override
    public List<ChucVu> getAll() {
        return chucVuReponsitory.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public boolean delete(Long id) {
        ChucVu cv = chucVuReponsitory.findById(id).get();
        if (cv.getId()!=null){
            chucVuReponsitory.deleteById(cv.getId());
            return true;
        }
        return false;
    }

    @Override
    public ChucVu getById(Long id) {
        ChucVu chucVu = chucVuReponsitory.findById(id).get();
        return chucVu;
    }

    @Override
    public ChucVu save(ChucVu chucVu) {
        return chucVuReponsitory.save(chucVu);
    }

    @Override
    public ChucVu getByTen(String ten) {
        return chucVuReponsitory.getFirstByTen(ten);
    }

    @Override
    public boolean existsByTen(String ten) {
        return chucVuReponsitory.existsByTen(ten);
    }
}
