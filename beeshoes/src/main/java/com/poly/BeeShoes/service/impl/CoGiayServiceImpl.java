package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.CoGiay;
import com.poly.BeeShoes.repository.CoGiayRepository;
import com.poly.BeeShoes.service.CoGiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class CoGiayServiceImpl implements CoGiayService {
    private final CoGiayRepository coGiayRepository;
    @Override
    public CoGiay save(CoGiay coGiay) {
        return coGiayRepository.save(coGiay);
    }

    @Override
    public CoGiay getById(Long id) {
        return coGiayRepository.findById(id).get();
    }

    @Override
    public CoGiay getByTen(String ten) {
        return coGiayRepository.getFirstByTen(ten);
    }

    @Override
    public List<CoGiay> getAll() {
        return coGiayRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public List<CoGiay> getAllClient() {
        return coGiayRepository.findAllByTrangThaiIsTrue();
    }

    @Override
    public boolean delete(Long id) {
        CoGiay cg = coGiayRepository.findById(id).get();
        if (cg.getId()!=null){
            coGiayRepository.deleteById(cg.getId());
            return true;
        }
        return false;
    }

    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = chuanHoaTen(ten);
        List<CoGiay> danhSachCoGiay = coGiayRepository.findAll();
        List<CoGiay> coGiayTrungTen = danhSachCoGiay.stream()
                .filter(cg -> {
                    if (chuanHoaTen(cg.getTen()).equals(tenChuanHoa) && !cg.getId().equals(id)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        return !coGiayTrungTen.isEmpty();
    }

}
