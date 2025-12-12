package com.poly.BeeShoes.api;

import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.request.AddToCartRquest;
import com.poly.BeeShoes.request.GioHangRequest;
import com.poly.BeeShoes.request.chiTietSanPhamApiRquest;
import com.poly.BeeShoes.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ShopRestController {
    private final ChiTietSanPhamService chiTietSanPhamService;
    private final GioHangService gioHangService;
    private final GioHangChiTietService gioHangChiTietService;
    private final VoucherService voucherService;
    private final HoaDonService hoaDonService;
    private final UserService userService;
    private final KhachHangService khachHangService;


    public Authentication getUserAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication;
    }

    @PostMapping("/add-product-to-cart")
    public ResponseEntity<List<GioHangRequest>> addProductToCart(@ModelAttribute AddToCartRquest request) {
        if (request.getProduct() == null) {
            return ResponseEntity.badRequest().header("status", "ProductNull").build();
        }
        ChiTietSanPham ctsp = chiTietSanPhamService.getById(request.getProduct());
        System.out.println(ctsp.getMaSanPham());
        System.out.println(ctsp.getKichCo().getTen());
        if (request.getQuantity() < 1) {
            return ResponseEntity.badRequest().header("status", "MinQuantity").build();
        }
        if (ctsp == null) {
            return ResponseEntity.notFound().header("status", "ProductDetailNull").build();
        }
        if (ctsp.getSoLuongTon() < 1) {
            return ResponseEntity.badRequest().header("status", "0Quantity").build();
        }
        Authentication auth = getUserAuth();
        Object principal = auth.getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            GioHang gh = gioHangService.getByKhachHang(user.getKhachHang());
            if (gh == null) {
                gh = new GioHang();
                gh.setKhachHang(user.getKhachHang());
                gh = gioHangService.save(gh);
            }
            GioHangChiTiet ghct = gioHangChiTietService.getByCTSP(ctsp, gh);
            if (ghct == null) {
                System.out.println("Null");
                ghct = new GioHangChiTiet();
                ghct.setChiTietSanPham(ctsp);
                ghct.setSoLuong(request.getQuantity());
                ghct.setGioHang(gh);
            } else {
                System.out.println("NotNull");
                if (request.isUpdate()) {
                    ghct.setSoLuong(request.getQuantity());
                } else {
                    ghct.setSoLuong(ghct.getSoLuong() + request.getQuantity());
                }
            }
            if (ghct.getSoLuong() > ctsp.getSoLuongTon()) {
                return ResponseEntity.badRequest().header("status", "MaxQuantity").build();
            }
            ghct = gioHangChiTietService.save(ghct);
            List<GioHangChiTiet> lst = gh.getGioHangChiTiets();
            lst.add(ghct);
            gh.setGioHangChiTiets(lst);
            gh = gioHangService.save(gh);
            List<GioHangChiTiet> lst_ghct = gh.getGioHangChiTiets();
            List<GioHangRequest> lst_res = new ArrayList<>();
            for (int i = 0; i < lst_ghct.size(); i++) {
                GioHangRequest ghResponse = new GioHangRequest();
                ghResponse.setSoLuong(lst_ghct.get(i).getSoLuong());
                ghResponse.setId(lst_ghct.get(i).getId());
                chiTietSanPhamApiRquest ctsp_res = new chiTietSanPhamApiRquest();
                ctsp_res.setId(lst_ghct.get(i).getChiTietSanPham().getId());
                ctsp_res.setTen(lst_ghct.get(i).getChiTietSanPham().getSanPham().getTen());
                ctsp_res.setAnh(lst_ghct.get(i).getChiTietSanPham().getAnh().getUrl());
                ctsp_res.setKichCo(lst_ghct.get(i).getChiTietSanPham().getKichCo().getTen());
                ctsp_res.setMauSac(lst_ghct.get(i).getChiTietSanPham().getMauSac().getTen());
                ctsp_res.setMaSanPham(lst_ghct.get(i).getChiTietSanPham().getMaSanPham());
                ctsp_res.setSoLuongTon(lst_ghct.get(i).getChiTietSanPham().getSoLuongTon());
                ctsp_res.setGiaBan(lst_ghct.get(i).getChiTietSanPham().getGiaBan().intValue());
                ctsp_res.setGiaGoc(lst_ghct.get(i).getChiTietSanPham().getGiaGoc().intValue());
                ghResponse.setChitietSanPham(ctsp_res);
                lst_res.add(ghResponse);
            }
            return ResponseEntity.ok().body(lst_res);
        } else {
            return ResponseEntity.notFound().header("status","NotAuth").build();
        }
    }

    @GetMapping("/get-all-voucher")
    public ResponseEntity<List<Voucher>> getAllVoucher() {
        Authentication auth = getUserAuth();
        Object principal = auth.getPrincipal();
        List<HoaDon> lstHD = new ArrayList<>();
        if (principal instanceof User) {
            User user = (User) principal;
            user = userService.getByUsername(user.getEmail());
            if (user.getKhachHang() != null) {
                lstHD = hoaDonService.getByKhachHang(user.getKhachHang());
            }
        }
        List<Voucher> lst = voucherService.getAllByTrangThai(2);
        lstHD.forEach((hoaDon -> {
            lst.removeIf(v -> v.equals(hoaDon.getVoucher()));
        }));
        lst.removeIf(v -> v.getSoLuong() < 1);
        for (Voucher vc : lst) {
            vc.setNguoiSua(null);
            vc.setNguoiTao(null);
            vc.setEndDate1(vc.getNgayKetThuc().toLocalDateTime());
        }
        return ResponseEntity.ok().body(lst);
    }

    @GetMapping("/get-all-voucher-by-customer")
    public ResponseEntity<List<Voucher>> getAllVoucher(@RequestParam("customer") Long id) {
        KhachHang khachHang = khachHangService.detail(id);
        List<Voucher> lst = voucherService.getAllByTrangThai(2);
        List<HoaDon> lstHD;
        lst = lst.stream().distinct().collect(Collectors.toList());
        if (khachHang != null) {
            lstHD = hoaDonService.getByKhachHang(khachHang);
            System.out.println(lstHD.size());
            lst.removeIf(voucher -> {
                for (HoaDon hoaDon : lstHD) {
                    if (hoaDon.getVoucher() != null && voucher.getMa().equals(hoaDon.getVoucher().getMa())) {
                        System.out.println(voucher.getMa());
                        return true;
                    }
                }
                return false;
            });
        }
        lst.removeIf(v -> v.getSoLuong() < 1);
        lst.forEach(vc -> {
            vc.setNguoiSua(null);
            vc.setNguoiTao(null);
            vc.setEndDate1(vc.getNgayKetThuc().toLocalDateTime());
        });
        return ResponseEntity.ok().body(lst);
    }

    @GetMapping("/get-product-in-cart")
    public ResponseEntity<List<GioHangRequest>> getAll() {
        Authentication auth = getUserAuth();
        Object principal = auth.getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            KhachHang khachHang = user.getKhachHang();
            GioHang gh = gioHangService.getByKhachHang(khachHang);
            if (gh == null) {
                gh = new GioHang();
                gh.setKhachHang(khachHang);
                gh.setNgayTao(Timestamp.from(Instant.now()));
                gioHangService.save(gh);
            } else {
                List<GioHangChiTiet> lst_ghct = gh.getGioHangChiTiets();
                List<GioHangRequest> lst = new ArrayList<>();
                for (int i = 0; i < lst_ghct.size(); i++) {
                    GioHangRequest ghResponse = new GioHangRequest();
                    ghResponse.setSoLuong(lst_ghct.get(i).getSoLuong());
                    ghResponse.setId(lst_ghct.get(i).getId());
                    chiTietSanPhamApiRquest ctsp = new chiTietSanPhamApiRquest();
                    ctsp.setId(lst_ghct.get(i).getChiTietSanPham().getId());
                    ctsp.setTen(lst_ghct.get(i).getChiTietSanPham().getSanPham().getTen());
                    ctsp.setAnh(lst_ghct.get(i).getChiTietSanPham().getAnh().getUrl());
                    ctsp.setKichCo(lst_ghct.get(i).getChiTietSanPham().getKichCo().getTen());
                    ctsp.setMauSac(lst_ghct.get(i).getChiTietSanPham().getMauSac().getTen());
                    ctsp.setMaSanPham(lst_ghct.get(i).getChiTietSanPham().getMaSanPham());
                    ctsp.setSoLuongTon(lst_ghct.get(i).getChiTietSanPham().getSoLuongTon());
                    ctsp.setGiaBan(lst_ghct.get(i).getChiTietSanPham().getGiaBan().intValue());
                    ctsp.setGiaGoc(lst_ghct.get(i).getChiTietSanPham().getGiaGoc().intValue());
                    ghResponse.setChitietSanPham(ctsp);
                    lst.add(ghResponse);
                }
                return ResponseEntity.ok().body(lst);
            }
            return ResponseEntity.ok().body(null);
        } else {
            return ResponseEntity.ok().body(null);
        }

    }

    @DeleteMapping("/del-shopping-cart-detail")
    public ResponseEntity deleteProduct(@RequestParam("id") Long id) {
        if (gioHangChiTietService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/update-shopping-cart-quantity")
    public ResponseEntity updateQuantity(@RequestParam("id") Long id, @RequestParam("calcul") String cal) {
        GioHangChiTiet ghct = gioHangChiTietService.getById(id);
        if (ghct != null) {
            if (cal.equalsIgnoreCase("plus")) {
                ghct.setSoLuong(ghct.getSoLuong() + 1);
            }
            if (!cal.equalsIgnoreCase("plus") && ghct.getSoLuong() > 1) {
                ghct.setSoLuong(ghct.getSoLuong() - 1);
            }
            if (ghct.getSoLuong() < 1) {
                return ResponseEntity.notFound().header("status", "minNum").build();
            }
            if (ghct.getSoLuong() > ghct.getChiTietSanPham().getSoLuongTon() || ghct.getChiTietSanPham().getSoLuongTon() < 1) {
                return ResponseEntity.notFound().header("status", "MaxNum").build();
            }
            gioHangChiTietService.save(ghct);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/set-shopping-cart-quantity")
    public ResponseEntity setQuantity(@RequestParam("id") Long id, @RequestParam("num") Integer num) {
        GioHangChiTiet ghct = gioHangChiTietService.getById(id);
        if (ghct != null) {
            ghct.setSoLuong(num);
            if (ghct.getSoLuong() < 1) {
                return ResponseEntity.notFound().header("status", "minNum").build();
            }
            if (ghct.getSoLuong() > ghct.getChiTietSanPham().getSoLuongTon() || ghct.getChiTietSanPham().getSoLuongTon() < 1) {
                return ResponseEntity.notFound().header("status", "MaxNum").build();
            }
            gioHangChiTietService.save(ghct);
            Map<String, Integer> map = new HashMap<>();
            map.put("num", ghct.getSoLuong());
            return ResponseEntity.ok().body(map);
        }
        return ResponseEntity.notFound().build();
    }

}
