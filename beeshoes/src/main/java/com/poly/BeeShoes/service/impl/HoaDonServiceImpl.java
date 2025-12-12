package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.constant.TrangThaiHoaDon;
import com.poly.BeeShoes.model.User;
import com.poly.BeeShoes.repository.HoaDonRepository;
import com.poly.BeeShoes.service.HoaDonService;
import com.poly.BeeShoes.utility.ConvertUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HoaDonServiceImpl implements HoaDonService {

    private final HoaDonRepository hoaDonRepository;

    @Override
    public List<Object[]> getAllRevenueCreatedByDateRange(Date start, Date end) {
        return hoaDonRepository.getAllRevenueCreatedByDateRange(start, end);
    }

    @Override
    public List<Object[]> getAllRecordsCreatedByDateRange(Date start, Date end, boolean LoaiHD) {
        return hoaDonRepository.getAllRecordsCreatedByDateRange(start, end, LoaiHD);
    }

    @Override
    public BigDecimal getTotalRevenueByDateRangeAndType(Date start, Date end, boolean LoaiHD) {
        return hoaDonRepository.getTotalRevenueByDateRangeAndType(start, end, LoaiHD);
    }

    @Override
    public List<Object[]> getAllCountCreatedByCreatDate(String date) {
        return hoaDonRepository.getAllCountCreatedByCreatDate(date);
    }

    @Override
    public List<Object[]> getTotalDiscountByHourOfDay(String date) {
        return hoaDonRepository.getTotalDiscountByHourOfDay(date);
    }

    @Override
    public List<Object[]> getAllRevenueCreatedByCreatDate(String date) {
        return hoaDonRepository.getAllRevenueCreatedByCreatDate(date);
    }

    @Override
    public List<Object[]> getCountCreatedByCreatDateAndTypeHD(String date, boolean loaiHD) {
        return hoaDonRepository.getCountCreatedByCreatDateAndTypeHD(date, loaiHD);
    }

    @Override
    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAll(Sort.by(Sort.Direction.DESC, "ngayTao"));
    }

    @Override
    public List<HoaDon> getHoaDonBetwent(Date start, Date end) {
        return hoaDonRepository.findByNgayTaoBetween(start, end);
    }

    @Override
    public List<HoaDon> getAllByDate(Date date) {
        return hoaDonRepository.findAllByNgayTao(date);
    }

    @Override
    public List<HoaDon> getAllByDateRange(Timestamp from, Timestamp to) {
        return hoaDonRepository.findAllByNgayTaoBetween(from, to);
    }

    @Override
    public List<HoaDon> getByCustomerIdAndInvoiceCodeAndStatus(Long customerId, String invoiceCode, String status) {
        return hoaDonRepository.findByKhachHangIdAndMaHoaDonAndTrangThai(customerId, invoiceCode, status, Sort.by(Sort.Direction.DESC));
    }

    @Override
    public List<HoaDon> getByKhachHang(KhachHang khachHang) {
        Sort sort = Sort.by(Sort.Direction.DESC, "ngayTao");
        return hoaDonRepository.findAllByKhachHang(khachHang, sort);
    }


    @Override
    public List<HoaDon> getAllHoaDonByTrangThai(String trangThaiHoaDon) {
        return hoaDonRepository.findByTrangThai(trangThaiHoaDon, Sort.by(Sort.Direction.DESC, "ngayTao"));
    }


    @Override
    public HoaDon getHoaDonById(Long id) {
        return hoaDonRepository.findById(id).orElse(null);
    }

    @Override
    public Long count() {
        return hoaDonRepository.count();
    }

    @Override

    public Long countHoaDonCuaKhachHang(Long id) {
        return hoaDonRepository.countByKhachHangId(id);
    }

    @Override
    public HoaDon taoMoiHoaDonKhiBanTaiQuay(User user) {
        HoaDon createdHoaDon = new HoaDon();
        createdHoaDon.setNgayTao(ConvertUtility.DateToTimestamp(new Date()));
        createdHoaDon.setNguoiTao(user);
        return hoaDonRepository.save(createdHoaDon);
    }

    @Override
    public boolean capNhatTrangThaiHoaDon(User user, HoaDon hoaDon, String trangThaiHoaDon) {
        try {
            hoaDon.setTrangThai(trangThaiHoaDon);
            hoaDon.setNgaySua(ConvertUtility.DateToTimestamp(new Date()));
            hoaDon.setNguoiSua(user);
            hoaDonRepository.save(hoaDon);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean capNhatTrangThaiTatCaHoaDon(User user, List<HoaDon> danhSachHoaDon, String trangThaiHoaDon) {
        try {
            danhSachHoaDon.forEach(hoaDon -> {
                hoaDon.setTrangThai(trangThaiHoaDon);
                hoaDon.setNgaySua(ConvertUtility.DateToTimestamp(new Date()));
                hoaDon.setNguoiSua(user);
            });
            hoaDonRepository.saveAll(danhSachHoaDon);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public HoaDon getHoaDonByMa(String ma) {
        return hoaDonRepository.findByMaHoaDon(ma);
    }

    @Override
    public HoaDon save(HoaDon hoaDon) {
        return hoaDonRepository.save(hoaDon);
    }

    @Override
    public String generateInvoiceCode() {
        long count = hoaDonRepository.count();
        int numberOfDigits = (int) Math.log10(count + 1) + 1;
        int numberOfZeros = Math.max(0, 5 - numberOfDigits);
        String invoiceCode;
        do {
            invoiceCode = String.format("HD%0" + (numberOfDigits + numberOfZeros) + "d", count + 1);
            count++;
        } while (hoaDonRepository.existsByMaHoaDon(invoiceCode));

        return invoiceCode;
    }
}
