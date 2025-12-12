package com.poly.BeeShoes.controller.cms;

import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/cms")
public class ThuocTinhController {

    private final TheLoaiService theLoaiService;
    private final ChatLieuService chatLieuService;
    private final DeGiayService deGiayService;
    private final MauSacService mauSacService;
    private final ThuongHieuService thuongHieuService;
    private final KichCoService kichCoService;
    private final MuiGiayService muiGiayService;
    private final CoGiayService coGiayService;
    private final TagsService tagsService;
    @GetMapping("/shoe-category")
    public String theLoai(Model model) {
        List<TheLoai> lst = theLoaiService.getAll();
        model.addAttribute("lsttheloai", lst);
        return "cms/pages/products/shoes-cate";
    }

    @GetMapping("/shoe-material")
    public String chatLieu(Model model) {
        List<ChatLieu> lst = chatLieuService.getAll();
        model.addAttribute("lstchatlieu", lst);
        return "cms/pages/products/shoe-material";
    }

    @GetMapping("/shoe-brand")
    public String thuongHieu(Model model) {
        List<ThuongHieu> lst = thuongHieuService.getAll();
        model.addAttribute("lstthuonghieu", lst);
        return "cms/pages/products/brand";
    }
    @GetMapping("/tags")
    public String tags(Model model) {
        List<Tags> lst = tagsService.getAll();
        model.addAttribute("lsttags", lst);
        return "cms/pages/tags/tags";
    }

    @GetMapping("/shoe-sole")
    public String deGiay(Model model) {
        List<DeGiay> lst = deGiayService.getAll();
        model.addAttribute("lstdegiay", lst);
        return "cms/pages/products/de-giay";
    }

    @GetMapping("/shoe-toe")
    public String muiGiay(Model model) {
        List<MuiGiay> lst = muiGiayService.getAll();
        model.addAttribute("lstmuigiay", lst);
        return "cms/pages/products/mui-giay";
    }

    @GetMapping("/shoe-collar")
    public String coGiay(Model model) {
        List<CoGiay> lst = coGiayService.getAll();
        model.addAttribute("lstcogiay", lst);
        return "cms/pages/products/co-giay";
    }

    @GetMapping("/shoe-size")
    public String kichCo(Model model) {
        List<KichCo> lst = kichCoService.getAll();
        model.addAttribute("lstkichco", lst);
        return "cms/pages/products/kich-co";
    }

    @GetMapping("/shoe-color")
    public String mauSac(Model model) {
        List<MauSac> lst = mauSacService.getAll();
        model.addAttribute("lstmausac", lst);
        return "cms/pages/products/mau-sac";
    }
}
