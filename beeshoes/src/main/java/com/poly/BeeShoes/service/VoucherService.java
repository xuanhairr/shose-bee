package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
public interface VoucherService {
    Voucher save(Voucher voucher);
    String genVoucherCode();
    List<Voucher> getAll();
    List<Voucher> getAllByTrangThai(Integer trangthai);
    Voucher getByMa(String ma);
     Voucher getById(Long id);
    Voucher update(Long id, Voucher voucher);
    Voucher delete(Long id);
    Page<Voucher> getAllpage(Integer page);
    Page <Voucher> SearchVoucher(String key,Integer page);
//    Page <Voucher> Searchlaoi(String loai,Integer page);
    Page <Voucher> Searchtt(Integer isTru,Integer page);
    Page <Voucher> findByCreatedat(LocalDateTime startDate, LocalDateTime endDate, Integer page);
    Page <Voucher> findBysoluong(Integer  soluong1, Integer  soluong2, Integer page);
    Page <Voucher> findBytienmat(BigDecimal TienMat1, BigDecimal  TienMat2, Integer page);
    Page <Voucher> findByphantram(Integer  phantram1, Integer  phantram2, Integer page);
    void updateVoucherStatus(List<Voucher> voucher);
    boolean existsByTen(String name,Long id);
//    String generateVoucherCode();
//    Voucher getByMa(String ma);
}
