package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.MauSac;
import com.poly.BeeShoes.model.SanPham;
import com.poly.BeeShoes.repository.MauSacRepository;
import com.poly.BeeShoes.service.MauSacService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class MauSacServiceImpl implements MauSacService {
    private final MauSacRepository mauSacRepository;
    @Override
    public MauSac save(MauSac mauSac) {
        return mauSacRepository.save(mauSac);
    }

    @Override
    public MauSac getById(Long id) {
        return mauSacRepository.getById(id);
    }

    @Override
    public MauSac getMauSacByMa(String ma) {
        return mauSacRepository.getMauSacByMaMauSac(ma);
    }

    @Override
    public MauSac getByTen(String ten) {
        return mauSacRepository.getFirstByTen(ten);
    }

    @Override
    public List<MauSac> getAll() {
        return mauSacRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public boolean delete(Long id) {
        MauSac ms = mauSacRepository.findById(id).get();
        if (ms.getId()!=null){
            mauSacRepository.deleteById(ms.getId());
            return true;
        }
        return false;
    }

    @Override
    public boolean existsByMaMauSac(String ma) {
        String mamau = chuanHoaTen(ma);
        List<MauSac> danhSachCoGiay = mauSacRepository.findAll();
        List<MauSac> coGiayTrungTen = danhSachCoGiay.stream()
                .filter(cg -> chuanHoaTen(cg.getMaMauSac()).equals(mamau))
                .collect(Collectors.toList());
        return !coGiayTrungTen.isEmpty();
    }

    @Override
    public List<MauSac> getAllClient() {
        return mauSacRepository.findAllByTrangThaiIsTrue();
    }

    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = chuanHoaTen(ten);
        List<MauSac> danhSachCoGiay = mauSacRepository.findAll();
        List<MauSac> coGiayTrungTen = danhSachCoGiay.stream()
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
