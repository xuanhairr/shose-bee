package com.poly.BeeShoes.controller.customer;

import com.poly.BeeShoes.model.ChiTietSanPham;
import com.poly.BeeShoes.model.QuanTri;
import com.poly.BeeShoes.model.SanPham;
import com.poly.BeeShoes.service.QuanTriService;
import com.poly.BeeShoes.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Controller
@RequiredArgsConstructor
public class HomeController {
    private final SanPhamService sanPhamService;
    private final QuanTriService quanTriService;

    @GetMapping({"", "/", "/index", "/light-bee/"})
    public String indexLightBee(Model model) {
        List<SanPham> lst2 = sanPhamService.findTop4GiamGia();
        List<SanPham> lst1 = sanPhamService.findTop4OrderByNgayTaoDesc(lst2);
        int size = Math.min(lst2.size(), 4);
        List<SanPham> firstFourItems = lst2.subList(0, size);
        List<QuanTri> list = quanTriService.getAll();
        if (!list.isEmpty()) {
            QuanTri quantri = list.get(0);
            int min = 0;
            int max = 0;
            if (quantri.getSan_pham_sale() != null) {
                for (ChiTietSanPham item : quantri.getSan_pham_sale().getChiTietSanPham()) {
                    if (item.getGiaGoc().intValue() > max) {
                        max = item.getGiaGoc().intValue();
                    }
                    if (min == 0) {
                        min = item.getGiaBan().intValue();
                    } else {
                        if (min > item.getGiaBan().intValue()) {
                            min = item.getGiaBan().intValue();
                        }
                    }
                }
            }
            int phanTramGiamGia = (int) Math.floor(((double) (max - min) / max) * 100);
            System.out.println("Phần Trăm :" + phanTramGiamGia);
            model.addAttribute("phanTramGiam", phanTramGiamGia);
            model.addAttribute("setupData", list.get(0));
        } else {
            QuanTri qtri = new QuanTri();
            qtri.setId(1L);
            qtri.setMo_ta1("Một nhãn hiệu chuyên tạo ra những sản phẩm thiết yếu sang trọng. Được tạo ra một cách có đạo đức với một thái độ kiên định\n"
                    + " cam kết chất lượng vượt trội.");
            qtri.setMo_ta2("Một nhãn hiệu chuyên tạo ra những sản phẩm thiết yếu sang trọng. Được tạo ra một cách có đạo đức với một thái độ kiên định\n"
                    + " cam kết chất lượng vượt trội.");
            qtri.setTitle1("Bộ sưu tập Thu-Đông 2030");
            qtri.setTitle2("Bộ sưu tập Xuân-Hạ 2030");
            qtri.setTitle_sp1("Bộ sưu tập giày 2030");
            qtri.setTitle_sp2("Giày Xuân 2030");
            qtri.setTitle_sp3("Phụ kiện");
            qtri.setTitle_sp_sale("Giày thể thao đơn giản");
            qtri.setBanner1("/assets/customer/img/hero/banner1.png");
            qtri.setBanner2("/assets/customer/img/hero/banner2.png");
            qtri.setSan_pham1(null);
            qtri.setSan_pham2(null);
            qtri.setSan_pham3(null);
            qtri.setSan_pham_sale(null);
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime oneMonthLater = now.plusMonths(1);
            qtri.setThoi_gian_sale(oneMonthLater);
            quanTriService.save(qtri);
            QuanTri quantri = quanTriService.getById(1L);
            quantri.setThoi_gian(Timestamp.valueOf(quantri.getThoi_gian_sale()));
            int min = 0;
            int max = 0;
            if (quantri.getSan_pham_sale() != null) {
                for (ChiTietSanPham item : quantri.getSan_pham_sale().getChiTietSanPham()) {
                    if (item.getGiaGoc().intValue() > max) {
                        max = item.getGiaGoc().intValue();
                    }
                    if (min == 0) {
                        min = item.getGiaBan().intValue();
                    } else {
                        if (min > item.getGiaBan().intValue()) {
                            min = item.getGiaBan().intValue();
                        }
                    }
                }
            }
            int phanTramGiamGia = (int) Math.floor(((double) (max - min) / max) * 100);
            model.addAttribute("phanTramGiam", phanTramGiamGia);
            model.addAttribute("setupData", quantri);
        }
        model.addAttribute("newproduct", lst1);
        model.addAttribute("saleproduct", firstFourItems);
        return "customer/index";
    }
}
