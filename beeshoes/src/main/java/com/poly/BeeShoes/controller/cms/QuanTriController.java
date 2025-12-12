package com.poly.BeeShoes.controller.cms;

import com.poly.BeeShoes.model.QuanTri;
import com.poly.BeeShoes.model.User;
import com.poly.BeeShoes.service.QuanTriService;
import com.poly.BeeShoes.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/cms/quan-tri")
public class QuanTriController {
    private final QuanTriService quanTriService;
    private final SanPhamService sanPhamService;

    @GetMapping("")
    public String quanTri(Model model) {
        List<QuanTri> list = quanTriService.getAll();

        QuanTri strip;
        if (list.isEmpty()) {
            strip = new QuanTri();
            strip.setId(1L);
            strip.setMo_ta1("Một nhãn hiệu chuyên tạo ra những sản phẩm thiết yếu sang trọng. Được tạo ra một cách có đạo đức với một thái độ kiên định\n"
                    + " cam kết chất lượng vượt trội.");
            strip.setMo_ta2("Một nhãn hiệu chuyên tạo ra những sản phẩm thiết yếu sang trọng. Được tạo ra một cách có đạo đức với một thái độ kiên định\n"
                    + " cam kết chất lượng vượt trội.");
            strip.setTitle1("Bộ sưu tập Thu-Đông 2030");
            strip.setTitle2("Bộ sưu tập Xuân-Hạ 2030");
            strip.setTitle_sp1("Bộ sưu tập giày 2030");
            strip.setTitle_sp2("Giày Xuân 2030");
            strip.setTitle_sp3("Phụ kiện");
            strip.setTitle_sp_sale("Giày thể thao đơn giản");
            strip.setBanner1("/assets/customer/img/hero/banner1.png");
            strip.setBanner2("/assets/customer/img/hero/banner2.png");
            strip.setSan_pham1(null);
            strip.setSan_pham2(null);
            strip.setSan_pham3(null);
            strip.setSan_pham_sale(null);
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime oneMonthLater = now.plusMonths(1);
            strip.setThoi_gian_sale(oneMonthLater);
            quanTriService.save(strip);
        }
        QuanTri quantri = quanTriService.getById(1L);
        quantri.setThoi_gian(Timestamp.valueOf(quantri.getThoi_gian_sale()));
        model.addAttribute("quanTri", quantri);
        model.addAttribute("listSP", sanPhamService.findByTrangThaiEquals(true));
        model.addAttribute("listSPSales", sanPhamService.getAllDiscount());
        return "cms/pages/quantri/quan-tri";
    }

    @PostMapping("/update")
    public String update(Model model, @ModelAttribute("quanTri") QuanTri quanTri) {
        System.out.println(quanTri.toString());
        QuanTri updatedQuanTri = quanTriService.getById(1L);
        updatedQuanTri.setBanner1(quanTri.getBanner1());
        updatedQuanTri.setTitle1(quanTri.getTitle1());
        updatedQuanTri.setMo_ta1(quanTri.getMo_ta1());
        updatedQuanTri.setBanner2(quanTri.getBanner2());
        updatedQuanTri.setTitle2(quanTri.getTitle2());
        updatedQuanTri.setMo_ta2(quanTri.getMo_ta2());
        updatedQuanTri.setSan_pham1(quanTri.getSan_pham1());
        updatedQuanTri.setTitle_sp1(quanTri.getTitle_sp1());
        updatedQuanTri.setSan_pham2(quanTri.getSan_pham2());
        updatedQuanTri.setTitle_sp2(quanTri.getTitle_sp2());
        updatedQuanTri.setSan_pham3(quanTri.getSan_pham3());
        updatedQuanTri.setTitle_sp3(quanTri.getTitle_sp3());
        updatedQuanTri.setSan_pham_sale(quanTri.getSan_pham_sale());
        updatedQuanTri.setTitle_sp_sale(quanTri.getTitle_sp_sale());
        updatedQuanTri.setThoi_gian_sale(quanTri.getThoi_gian_sale());
        quanTriService.update(updatedQuanTri, 1L);
        return "redirect:/cms/quan-tri";
    }
}
