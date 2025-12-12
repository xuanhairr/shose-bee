package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.DeGiay;
import com.poly.BeeShoes.repository.DeGiayRepository;
import com.poly.BeeShoes.service.DeGiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class DeGiayServiceImpl implements DeGiayService {
    private final DeGiayRepository deGiayRepository;
    @Override
    public DeGiay save(DeGiay deGiay) {
        return deGiayRepository.save(deGiay);
    }

    @Override
    public DeGiay getById(Long id) {
        return deGiayRepository.findById(id).get();
    }

    @Override
    public DeGiay getByTen(String ten) {
        return deGiayRepository.getFirstByTen(ten);
    }

    @Override
    public List<DeGiay> getAll() {
        return deGiayRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public List<DeGiay> getAllClient() {
        return deGiayRepository.findAllByTrangThaiIsTrue();
    }

    @Override
    public boolean delete(Long id) {
        DeGiay dg = deGiayRepository.findById(id).get();
        if (dg.getId()!=null){
            deGiayRepository.deleteById(dg.getId());
            return true;
        }
        return false;
    }
    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = chuanHoaTen(ten);
        List<DeGiay> danhSachCoGiay = deGiayRepository.findAll();
        List<DeGiay> coGiayTrungTen = danhSachCoGiay.stream()
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
