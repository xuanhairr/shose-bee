package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.ThuongHieu;
import com.poly.BeeShoes.repository.ThuongHieuRepository;
import com.poly.BeeShoes.service.ThuongHieuService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class ThuongHieuServiceImpl implements ThuongHieuService {
    private final ThuongHieuRepository thuongHieuRepository;
    @Override
    public ThuongHieu save(ThuongHieu thuongHieu) {
        return thuongHieuRepository.save(thuongHieu);
    }

    @Override
    public ThuongHieu getById(Long id) {
        return thuongHieuRepository.findById(id).get();
    }

    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = chuanHoaTen(ten);
        List<ThuongHieu> danhSachCoGiay = thuongHieuRepository.findAll();
        List<ThuongHieu> coGiayTrungTen = danhSachCoGiay.stream()
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
    public ThuongHieu getByTen(String ten) {
        return thuongHieuRepository.getFirstByTen(ten);
    }

    @Override
    public List<ThuongHieu> getAll() {
        return thuongHieuRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public List<ThuongHieu> getAllClient() {
        return thuongHieuRepository.findAllByTrangThaiIsTrue();
    }

    @Override
    public boolean delete(Long id) {
        ThuongHieu th = thuongHieuRepository.findById(id).get();
        if (th.getId()!=null){
            thuongHieuRepository.deleteById(th.getId());
            return true;
        }
        return false;
    }
}
