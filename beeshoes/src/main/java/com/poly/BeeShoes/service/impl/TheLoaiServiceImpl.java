package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.TheLoai;
import com.poly.BeeShoes.repository.TheLoaiRepository;
import com.poly.BeeShoes.service.TheLoaiService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class TheLoaiServiceImpl implements TheLoaiService {
    private final TheLoaiRepository theLoaiRepository;

    @Override
    public TheLoai save(TheLoai theLoai) {
        return theLoaiRepository.save(theLoai);
    }

    @Override
    public TheLoai getById(Long id) {
        return theLoaiRepository.getById(id);
    }

    @Override
    public TheLoai getByTen(String ten) {
        return theLoaiRepository.getFirstByTen(ten);
    }

    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = chuanHoaTen(ten);
        List<TheLoai> danhSachCoGiay = theLoaiRepository.findAll();
        List<TheLoai> coGiayTrungTen = danhSachCoGiay.stream()
                .filter(cg -> {
                    if (chuanHoaTen(cg.getTen()).equals(tenChuanHoa) && !cg.getId().equals(id)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        return !coGiayTrungTen.isEmpty();
    }


    @Override
    public List<TheLoai> getAll() {
        return theLoaiRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public boolean delete(Long id) {
        TheLoai theLoai = theLoaiRepository.findById(id).get();
        if (theLoai.getId() != null) {
            theLoaiRepository.deleteById(theLoai.getId());
            return true;
        }
        return false;
    }

    @Override
    public List<TheLoai> getAllClient() {
        List<TheLoai> lst = theLoaiRepository.findAllByTrangThaiIsTrue();
        for (int i = 0; i < lst.size(); i++) {
            lst.get(i).setCountProduct(theLoaiRepository.countSanPhamByTheLoaiIdAndTrangThai(lst.get(i).getId()));
        }
        return lst;
    }
}
