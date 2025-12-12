package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherResponsitory extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByMa(String ma);

    boolean existsByMa(String ma);

    @Query("select c  from Voucher c  where c.ma  like %?1% or c.ten like %?1%" +
            "or c.loaiVoucher like %?1%")
    List<Voucher> searchVC(String key);

    List<Voucher> findAllByTrangThaiAndSoLuongGreaterThan(Integer trangThai, Integer soluong);

    //  @Query("select t from Voucher t where t.loaiVoucher = :loai")
//  List<Voucher> searchloai(String loai);
//  Optional<Voucher> findByMavoucher(String maVoucher);
//  boolean existsByMaVoucher(String maVoucher);
    @Query("SELECT v FROM Voucher v WHERE v.ngayBatDau BETWEEN :startDate AND :endDate AND v.ngayKetThuc BETWEEN :startDate AND :endDate")
    List<Voucher> findByNgayBatDauBetweenAndNgayKetThuc(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT v FROM Voucher v WHERE v.trangThai = :isTru")
    List<Voucher> searchtt(Integer isTru);

    List<Voucher> findAllByTrangThaiInOrderByNgayBatDauAsc(List<Integer> trangThaiList);

    @Query("select c from Voucher c where c.soLuong BETWEEN :soluong1 and :soluong2")
    List<Voucher> findBySoLuongBetweenAndSoLuong(Integer soluong1, Integer soluong2);

    @Query("select c from Voucher c where c.giaTriTienMat BETWEEN :TienMat1 and :TienMat2")
    List<Voucher> findByGiaTriTienMatBetweenAndGiaTriTienMat(BigDecimal TienMat1, BigDecimal TienMat2);

    @Query("select c from Voucher c where c.giaTriPhanTram BETWEEN :phantram1 and :phantram2")
    List<Voucher> findByGiaTriPhanTramBetweenAndGiaTriPhanTram(Integer phantram1, Integer phantram2);

    Page<Voucher> findAllByTrangThaiNot(Integer trangThai, Pageable pageable);

    boolean existsByTen(String ten);

}
