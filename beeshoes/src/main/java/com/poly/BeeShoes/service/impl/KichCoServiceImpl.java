package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.KichCo;
import com.poly.BeeShoes.repository.KichCoRepository;
import com.poly.BeeShoes.service.KichCoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class KichCoServiceImpl implements KichCoService {
    private final KichCoRepository kichCoRepository;
    @Override
    public KichCo save(KichCo kichCo) {
        return kichCoRepository.save(kichCo);
    }

    @Override
    public KichCo getById(Long id) {
        return kichCoRepository.findById(id).get();
    }

    @Override
    public KichCo getByTen(String co) {
        return kichCoRepository.getKichCoByTen(co);
    }

    @Override
    public List<KichCo> getAll() {
        return kichCoRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public List<KichCo> getAllClient() {
        return kichCoRepository.findAllByTrangThaiIsTrue();
    }

    @Override
    public boolean delete(Long id) {
        KichCo co = kichCoRepository.findById(id).get();
        if (co.getId()!=null){
            kichCoRepository.deleteById(co.getId());
        }
        return false;
    }

    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = chuanHoaTen(ten);
        List<KichCo> danhSachCoGiay = kichCoRepository.findAll();
        List<KichCo> coGiayTrungTen = danhSachCoGiay.stream()
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
