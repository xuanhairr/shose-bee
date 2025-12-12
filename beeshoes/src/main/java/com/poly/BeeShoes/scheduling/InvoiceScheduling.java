package com.poly.BeeShoes.scheduling;

import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.constant.TrangThaiHoaDon;
import com.poly.BeeShoes.repository.HoaDonRepository;
import com.poly.BeeShoes.utility.ConvertUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InvoiceScheduling {

    private final HoaDonRepository hoaDonRepository;
    final long delayTimeRun = 1000 * 60 * 60 * 24 * 7;

    @Scheduled(fixedRate = delayTimeRun)
    public void deleteInvoiceAfterTimeDoNotConfirm() {
        LocalDate yesterday = LocalDate.now().minusDays(7);
        java.sql.Date date = java.sql.Date.valueOf(yesterday);
        List<HoaDon> hoaDonList = hoaDonRepository.findByNgayTaoBetweenAndTrangThai(
                ConvertUtility.DateToTimestamp(new Date()),
                ConvertUtility.DateToTimestamp(new Date(date.getTime())),
                TrangThaiHoaDon.ChoXacNhan
        );
        hoaDonRepository.deleteAll(hoaDonList);
    }
}
