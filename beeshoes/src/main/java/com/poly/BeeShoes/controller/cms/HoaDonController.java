package com.poly.BeeShoes.controller.cms;

import com.poly.BeeShoes.constant.TrangThaiHoaDon;
import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.service.HinhThucThanhToanService;
import com.poly.BeeShoes.service.HoaDonChiTietService;
import com.poly.BeeShoes.service.HoaDonService;
import com.poly.BeeShoes.service.LichSuHoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin("*")
@RequestMapping("/cms")
@RequiredArgsConstructor
public class HoaDonController {

    private final HoaDonService hoaDonService;
    private final HoaDonChiTietService hoaDonChiTietService;
    private final LichSuHoaDonService lichSuHoaDonService;
    private final HinhThucThanhToanService hinhThucThanhToanService;
    @GetMapping("/hoa-don")
    public String hoaDonPage(Model model) {
        List<HoaDon> hoaDonChoXacNhanList = hoaDonService.getAllHoaDonByTrangThai(TrangThaiHoaDon.ChoXacNhan);
        List<HoaDon> hoaDonChuanBiHangList = hoaDonService.getAllHoaDonByTrangThai(TrangThaiHoaDon.ChuanBiHang);
        List<HoaDon> hoaDonChoGiaoList = hoaDonService.getAllHoaDonByTrangThai(TrangThaiHoaDon.ChoGiao);
        List<HoaDon> hoaDonDangGiaoList = hoaDonService.getAllHoaDonByTrangThai(TrangThaiHoaDon.DangGiao);
        List<HoaDon> hoaDonThanhCongList = hoaDonService.getAllHoaDonByTrangThai(TrangThaiHoaDon.ThanhCong);
        List<HoaDon> hoaDonList = hoaDonService.getAllHoaDon();
        Long count = hoaDonService.count();
        model.addAttribute("hoaDonList", hoaDonList);
        model.addAttribute("hoaDonChoXacNhanList", hoaDonChoXacNhanList);
        model.addAttribute("hoaDonChuanBiHangList", hoaDonChuanBiHangList);
        model.addAttribute("hoaDonChoGiaoList", hoaDonChoGiaoList);
        model.addAttribute("hoaDonDangGiaoList", hoaDonDangGiaoList);
        model.addAttribute("hoaDonThanhCongList", hoaDonThanhCongList);
        model.addAttribute("count", count);
        return "cms/pages/orders/orders";
    }

    @GetMapping("/hoa-don/{maHoaDon}/chi-tiet")
    public String hoaDonChiTietPage(
            @PathVariable("maHoaDon") String maHoaDon,
            Model model
    ) {
        HoaDon hoaDon = hoaDonService.getHoaDonByMa(maHoaDon);
        List<LichSuHoaDon> lichSuHoaDonList = lichSuHoaDonService.getAllLichSuHoaDonByIdHoaDon(hoaDon.getId());
        List<LichSuHoaDon> lichSuHoaDonListNotSort = lichSuHoaDonService.getAllLichSuHoaDonNotSort(hoaDon.getId());
        List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietService.getHoaDonChiTietCuaHoaDonById(hoaDon.getId());
        if(hoaDon.getKhachHang() != null) {
            Long countHoaDonCuaKhachHang = hoaDonService.countHoaDonCuaKhachHang(hoaDon.getKhachHang().getId());
            model.addAttribute("countHoaDonCuaKhachHang", countHoaDonCuaKhachHang);
        }
        double tongTien = 0;
        for(HoaDonChiTiet hdct : hoaDonChiTietList) {
            tongTien = (hdct.getGiaBan().doubleValue() * hdct.getSoLuong()) + tongTien;
        }
        List<HinhThucThanhToan> hinhThucThanhToans = hoaDon.getHinhThucThanhToans();
        List<String> hinhThucList = new ArrayList<>();
        hinhThucThanhToans.forEach(hinhThucThanhToan -> {
            hinhThucList.add(hinhThucThanhToan.getHinhThuc());
            if(hinhThucThanhToan.getMaGiaoDich().equals("VNPAY")) {
                model.addAttribute("hinhThuc", hinhThucThanhToan.getMaGiaoDich());
            }
        });
        model.addAttribute("lichSuHoaDonList", lichSuHoaDonList);
        model.addAttribute("lichSuHoaDonListNotSort", lichSuHoaDonListNotSort);
        model.addAttribute("hoaDonChiTietList", hoaDonChiTietList);
        model.addAttribute("hoaDon", hoaDon);
        model.addAttribute("hinhThucs", hinhThucList);
        return "cms/pages/orders/order-details";
    }

    @GetMapping("/check-out")
    public String checkout() {
        return "cms/pages/orders/checkout";
    }

}
