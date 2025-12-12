package com.poly.BeeShoes.scheduling;

import com.poly.BeeShoes.model.Voucher;
import com.poly.BeeShoes.repository.VoucherResponsitory;
import com.poly.BeeShoes.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
@Component
@RequiredArgsConstructor
public class VoucherScheduler {
    private final VoucherService voucherService;

    private final VoucherResponsitory voucherRepository;
    @Scheduled(fixedRate = 30000) // Chạy mỗi 30s
    public void updateVoucherStatus() {
        System.out.println("Cập Nhật Trạng Thái Voucher");
        List<Integer> trangThaiList = Arrays.asList(1, 2);
        List<Voucher> vouchers = voucherRepository.findAllByTrangThaiInOrderByNgayBatDauAsc(trangThaiList);
        voucherService.updateVoucherStatus(vouchers);
    }
}
