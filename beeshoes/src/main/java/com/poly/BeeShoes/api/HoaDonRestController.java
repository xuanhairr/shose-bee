package com.poly.BeeShoes.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.poly.BeeShoes.constant.TrangThaiHoaDon;
import com.poly.BeeShoes.dto.HoaDonDto;
import com.poly.BeeShoes.dto.LichSuHoaDonDto;
import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.request.*;
import com.poly.BeeShoes.service.*;
import com.poly.BeeShoes.utility.ConvertUtility;
import com.poly.BeeShoes.utility.MailUtility;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/hoa-don")
@RequiredArgsConstructor
public class HoaDonRestController {

    private final HoaDonService hoaDonService;
    private final LichSuHoaDonService lichSuHoaDonService;
    private final HoaDonChiTietService hoaDonChiTietService;
    private final UserService userService;
    private final RestTemplate restTemplate;
    private final VoucherService voucherService;
    private final ChiTietSanPhamService chiTietSanPhamService;
    private final MauSacService mauSacService;
    private final KichCoService kichCoService;
    private final SanPhamService sanPhamService;
    private final KhachHangService khachHangService;
    private final MailUtility mailUtility;
    private final HinhThucThanhToanService hinhThucThanhToanService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    Gson gson = new Gson();

//    @GetMapping("/get-all-hoadon")
//    public ResponseEntity<List<HoaDonResponse>> getAll() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
//            UserDetails userDetails = (UserDetails) auth.getPrincipal();
//            User user = userService.getByUsername(userDetails.getUsername());
//            if (user.getKhachHang() == null) {
//                return ResponseEntity.notFound().header("status", "NotIsCustomer").build();
//            }
//            List<HoaDon> lstHD = hoaDonService.getByKhachHang(user.getKhachHang());
//            List<HoaDonResponse> response = new ArrayList<>();
//            lstHD.forEach(item -> {
//                HoaDonResponse hd = new HoaDonResponse();
//                hd.setId(item.getId());
//                hd.setMaHoaDon(item.getMaHoaDon());
//                hd.setSdtNhan(item.getSdtNhan());
//                if (item.getPhiShip() != null) {
//                    hd.setPhiShip(item.getPhiShip().intValue());
//                }
//                if (item.getGiamGia() != null) {
//                    hd.setGiamGia(item.getGiamGia().intValue());
//                }
//
//                hd.setDiaChiNhan(item.getDiaChiNhan());
//                if (item.getVoucher() != null) {
//                    hd.setVoucher(item.getVoucher().getMa());
//                }
//                hd.setTenNguoiNhan(item.getTenNguoiNhan());
//                if (item.getThucThu() != null) {
//                    hd.setThucThu(item.getThucThu().intValue());
//                }
//                if (item.getTongTien() != null) {
//                    hd.setTongTien(item.getTongTien().intValue());
//                }
//                hd.setMaVanChuyen(item.getMaVanChuyen());
//                if (item.getSoTienCanThanhToan() != null) {
//                    hd.setSoTienCanThanhToan(item.getSoTienCanThanhToan().intValue());
//                }
//                if (item.getSoTienDaThanhToan() != null) {
//                    hd.setSoTienDaThanhToan(item.getSoTienDaThanhToan().intValue());
//                }
//                hd.setEmailNguoiNhan(item.getEmailNguoiNhan());
//                hd.setTrangThai(item.getTrangThai().name());
//                List<HoaDonChiTietResphone> hdctResponse = new ArrayList<>();
//                List<HoaDonChiTiet> listHDCT = item.getHoaDonChiTiets();
//                listHDCT.forEach(hdct -> {
//                    HoaDonChiTietResphone hdctres = new HoaDonChiTietResphone();
//                    hdctres.setId(hdct.getId());
//                    hdctres.setAnh(hdct.getChiTietSanPham().getAnh().getUrl());
//                    hdctres.setMaMauSac(hdct.getChiTietSanPham().getMauSac().getMaMauSac());
//                    hdctres.setTenMauSac(hdct.getChiTietSanPham().getMauSac().getTen());
//                    hdctres.setKichCo(hdct.getChiTietSanPham().getKichCo().getTen());
//                    hdctres.setTenSanPham(hdct.getChiTietSanPham().getSanPham().getTen());
//                    hdctres.setMaSanPham(hdct.getChiTietSanPham().getMaSanPham());
//                    hdctres.setGiaBan(hdct.getGiaBan().intValue());
//                    hdctres.setGiaGoc(hdct.getGiaGoc().intValue());
//                    hdctres.setSoLuong(hdct.getSoLuong());
//                    hdctres.setSoLuongTon(hdct.getChiTietSanPham().getSoLuongTon());
//                    hdctResponse.add(hdctres);
//                });
//                hd.setHoaDonChiTiet(hdctResponse);
//                List<LichSuHoaDonResphone> lshdResponse = new ArrayList<>();
//                List<LichSuHoaDon> listLSHD = item.getLichSuHoaDons();
//                listLSHD.forEach(lshd -> {
//                    LichSuHoaDonResphone lshdres = new LichSuHoaDonResphone();
//                    lshdres.setId(lshd.getId());
//                    lshdres.setHanhDong(lshd.getHanhDong());
//                    lshdres.setThoiGian(lshd.getThoiGian().toLocalDateTime());
//                    lshdResponse.add(lshdres);
//                });
//                hd.setLichSuHoaDon(lshdResponse);
//                response.add(hd);
//            });
//
//            return ResponseEntity.ok().body(response);
//        } else {
//            return ResponseEntity.notFound().header("status", "NotAuth").build();
//        }
//    }

    @PostMapping("/set-quantity")
    public ResponseEntity setNum(
            @RequestParam("id") Long id,
            @RequestParam("quantity") int num,
            HttpServletRequest request
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (num < 1) {
            return ResponseEntity.notFound().header("status", "quantityZero").build();
        }
        if (auth == null) {
            return ResponseEntity.notFound().header("status", "NotAuth").build();
        }
        HoaDonChiTiet hdct = hoaDonChiTietService.getById(id);
        if (!hdct.getHoaDon().getTrangThai().equals(TrangThaiHoaDon.ChoXacNhan)) {
            return ResponseEntity.notFound().header("status", "NotAcceptStatus").build();
        }
        if (hdct == null) {
            return ResponseEntity.notFound().header("status", "HDCTisNull").build();
        }
        ChiTietSanPham ctsp = hdct.getChiTietSanPham();
        if (hdct.getGiaBan().intValue() != ctsp.getGiaBan().intValue()) {
            return ResponseEntity.notFound().header("status", "ChangePrice").build();
        }
        int total = ctsp.getSoLuongTon() + hdct.getSoLuong();
        ctsp.setSoLuongTon(total - num);
        System.out.println(total);
        System.out.println(ctsp.getSoLuongTon());
        System.out.println(num);
        if (ctsp.getSoLuongTon() < 0) {
            return ResponseEntity.notFound().header("status", "maxQuantity").build();
        }
        hdct.setSoLuong(num);
        chiTietSanPhamService.save(ctsp);
        hdct = hoaDonChiTietService.save(hdct);
        HoaDon hd = tinhTien(hdct.getHoaDon());
        List<HoaDonChiTiet> lst = hd.getHoaDonChiTiets();
        int count = 0;
        for (HoaDonChiTiet item : lst) {
            count += item.getSoLuong();
        }
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hd);
        lichSuHoaDon.setHanhDong("cập nhật số lượng sản phẩm '" + ctsp.getMaSanPham() + "' là " + num + ".");
        if (request.getUserPrincipal() != null) {
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername(request.getUserPrincipal().getName()));
        }
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(hd.getTrangThai());
        lichSuHoaDon = lichSuHoaDonService.save(lichSuHoaDon);

        Map<String, Object> res = new HashMap<>();
        res.put("phiShip", hd.getPhiShip().intValue());
        res.put("tongTien", hd.getTongTien().intValue());
        res.put("quantity", hdct.getSoLuong());
        res.put("thucThu", hd.getThucThu().intValue());
        res.put("giamGia", hd.getGiamGia().intValue());
        res.put("idHDCT", hdct.getId().intValue());
        res.put("giaBan", hdct.getGiaBan().intValue());
        res.put("soLuong", hdct.getSoLuong());
        res.put("count", count);
        res.put("idHD", hd.getId());
        res.put("times", lichSuHoaDon.getThoiGian());
        res.put("message", lichSuHoaDon.getHanhDong());
        if (lichSuHoaDon.getNguoiThucHien() == null) {
            res.put("user", "anonymus");
        } else if (lichSuHoaDon.getNguoiThucHien().getNhanVien() != null) {
            res.put("user", lichSuHoaDon.getNguoiThucHien().getNhanVien().getHoTen());
        } else {
            res.put("user", lichSuHoaDon.getNguoiThucHien().getKhachHang().getHoTen());
        }
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/update-quantity")
    public ResponseEntity update(@RequestParam("id") Long id,
                                 @RequestParam("num") int num,
                                 @RequestParam("calcu") String calcu,
                                 HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.notFound().header("status", "NotAuth").build();
        }
        HoaDonChiTiet hdct = hoaDonChiTietService.getById(id);
        if (!hdct.getHoaDon().getTrangThai().equals(TrangThaiHoaDon.ChoXacNhan)) {
            return ResponseEntity.notFound().header("status", "NotAcceptStatus").build();
        }
        if (hdct == null) {
            return ResponseEntity.notFound().header("status", "HDCTisNull").build();
        }
        ChiTietSanPham ctsp = hdct.getChiTietSanPham();
        HoaDonChiTiet newHD = null;
        boolean isNew = false;
        if (ctsp.getGiaBan().intValue() == hdct.getGiaBan().intValue()) {
            if (calcu.equals("plus")) {
                if (ctsp.getSoLuongTon() - num < 0) {
                    return ResponseEntity.notFound().header("status", "maxQuantity").build();
                }
                hdct.setSoLuong(hdct.getSoLuong() + num);
                ctsp.setSoLuongTon(ctsp.getSoLuongTon() - num);
            } else {
                if (hdct.getSoLuong() - num < 1) {
                    return ResponseEntity.notFound().header("status", "minQuantity").build();
                }
                hdct.setSoLuong(hdct.getSoLuong() - num);
                ctsp.setSoLuongTon(ctsp.getSoLuongTon() + num);
            }
            //tính tổng tiền
            float total = tinhTong(hdct.getHoaDon().getHoaDonChiTiets());
            if (total > 50000000) {
                return ResponseEntity.notFound().header("status", "maxMoney").build();
            }

            ctsp = chiTietSanPhamService.save(ctsp);
            hdct = hoaDonChiTietService.save(hdct);
        } else {
            if (calcu.equals("plus")) {
                List<HoaDonChiTiet> lst = hdct.getHoaDon().getHoaDonChiTiets();
                for (HoaDonChiTiet item : lst) {
                    if (item.getChiTietSanPham().getId() == ctsp.getId() && item.getGiaBan().intValue() == ctsp.getGiaBan().intValue()) {
                        if (ctsp.getSoLuongTon() - num < 0) {
                            return ResponseEntity.notFound().header("status", "maxQuantity").build();
                        }
                        newHD = item;
                        newHD.setSoLuong(item.getSoLuong() + num);
                        ctsp.setSoLuongTon(ctsp.getSoLuongTon() - num);
                        break;
                    }
                }
                if (newHD == null) {
                    isNew = true;
                    newHD = new HoaDonChiTiet();
                    newHD.setSoLuong(num);
                    ctsp.setSoLuongTon(ctsp.getSoLuongTon() - num);
                    newHD.setChiTietSanPham(ctsp);
                    newHD.setGiaGoc(ctsp.getGiaGoc());
                    newHD.setGiaBan(ctsp.getGiaBan());
                    newHD.setHoaDon(hdct.getHoaDon());
                }
                float total = tinhTong(newHD.getHoaDon().getHoaDonChiTiets());
                if (total > 50000000) {
                    return ResponseEntity.notFound().header("status", "maxMoney").build();
                }
                ctsp = chiTietSanPhamService.save(ctsp);
                newHD = hoaDonChiTietService.save(newHD);
            } else {
                if (hdct.getSoLuong() - num < 1) {
                    return ResponseEntity.notFound().header("status", "minQuantity").build();
                } else {
                    hdct.setSoLuong(hdct.getSoLuong() - num);
                    ctsp.setSoLuongTon(ctsp.getSoLuongTon() + num);
                }
            }
        }
        ctsp = chiTietSanPhamService.save(ctsp);
        HoaDon hoaDonRes = hoaDonService.getHoaDonById(hdct.getHoaDon().getId());
        assert hoaDonRes != null;
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hoaDonRes);
        if (request.getUserPrincipal() != null) {
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername(request.getUserPrincipal().getName()));
        }
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(hoaDonRes.getTrangThai());
        if (isNew) {
            lichSuHoaDon.setHanhDong("Thêm sản phẩm '" + ctsp.getMaSanPham() + "' vào hóa đơn.");
            List<HoaDonChiTiet> lstHo = hoaDonRes.getHoaDonChiTiets();
            lstHo.add(newHD);
            hoaDonRes.setHoaDonChiTiets(lstHo);
        } else {
            if (calcu.equals("plus")) {
                lichSuHoaDon.setHanhDong("Tăng " + num + " sản phẩm '" + ctsp.getMaSanPham() + "' vào hóa đơn.");
            } else {
                lichSuHoaDon.setHanhDong("Giảm " + num + " sản phẩm '" + ctsp.getMaSanPham() + "' trong hóa đơn.");
            }
        }
        lichSuHoaDon = lichSuHoaDonService.save(lichSuHoaDon);
        hoaDonRes = tinhTien(hoaDonRes);
        List<HDCTResponse> lst = getHdctResponse(hoaDonRes, lichSuHoaDon);
        return ResponseEntity.ok().body(lst);
    }

    private float tinhTong(List<HoaDonChiTiet> hoaDonChiTiets) {
        List<HoaDonChiTiet> lstHDCT = new ArrayList<>(hoaDonChiTiets);
        Map<Long, HoaDonChiTiet> uniqueMap = new LinkedHashMap<>();
        for (HoaDonChiTiet dct : lstHDCT) {
            uniqueMap.putIfAbsent(dct.getId(), dct);
        }
        lstHDCT = new ArrayList<>(uniqueMap.values());
        float total = lstHDCT.stream()
                .map(dct -> dct.getGiaBan().floatValue() * dct.getSoLuong())
                .reduce(0f, Float::sum);
        return total;
    }

    private static List<HDCTResponse> getHdctResponse(HoaDon hoaDon, LichSuHoaDon lichSuHoaDon) {
        List<HDCTResponse> lst = new ArrayList<>();
        for (int i = 0; i < hoaDon.getHoaDonChiTiets().size(); i++) {
            HoaDonChiTiet newHD = hoaDon.getHoaDonChiTiets().get(i);
            HDCTResponse response = new HDCTResponse();
            response.setTimes(lichSuHoaDon.getThoiGian());
            response.setMessage(lichSuHoaDon.getHanhDong());
            if (lichSuHoaDon.getNguoiThucHien() == null) {
                response.setUser("anonymus");
            } else if (lichSuHoaDon.getNguoiThucHien().getNhanVien() != null) {
                response.setUser(lichSuHoaDon.getNguoiThucHien().getNhanVien().getHoTen());
            } else {
                response.setUser(lichSuHoaDon.getNguoiThucHien().getKhachHang().getHoTen());
            }
            response.setImg(newHD.getChiTietSanPham().getAnh().getUrl());
            response.setKichCo(newHD.getChiTietSanPham().getKichCo().getTen());
            response.setMaMauSac(newHD.getChiTietSanPham().getMauSac().getMaMauSac());
            response.setTenMau(newHD.getChiTietSanPham().getMauSac().getTen());
            response.setTen(newHD.getChiTietSanPham().getSanPham().getTen());
            response.setIdHDCT(newHD.getId());
            response.setIdCTSP(newHD.getChiTietSanPham().getId());
            response.setGiaBan(newHD.getGiaBan().intValue());
            response.setGiaGoc(newHD.getGiaGoc().intValue());
            response.setSoLuong(newHD.getSoLuong());
            response.setTongTien(hoaDon.getTongTien().intValue());
            response.setThucThu(hoaDon.getThucThu().intValue());
            response.setGiamGia(hoaDon.getGiamGia().intValue());
            response.setIdHD(hoaDon.getId());
            response.setPhiShip(hoaDon.getPhiShip().intValue());
            lst.add(response);
        }
        return lst;
    }

    @PostMapping("/xac-nhan")
    public ResponseEntity<String> xacNhanDon(
            @RequestBody List<String> maHoaDonList
    ) {
        List<HoaDon> hoaDonList = new ArrayList<>();
        maHoaDonList.forEach(ma -> {
            HoaDon hoaDon = hoaDonService.getHoaDonByMa(ma);
            String trangThaiBeforeUpdate = hoaDon.getTrangThai();
            if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.ChoXacNhan)) {
                hoaDon.setTrangThai(TrangThaiHoaDon.ChuanBiHang);
            } else if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.ChuanBiHang)) {
                hoaDon.setTrangThai(TrangThaiHoaDon.ChoGiao);
            } else if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.ChoGiao)) {
                hoaDon.setTrangThai(TrangThaiHoaDon.DangGiao);
            } else if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.DangGiao)) {
                hoaDon.setTrangThai(TrangThaiHoaDon.ThanhCong);
            }
            hoaDon.setNgayXacNhan(new Date());
            HoaDon updatedHoaDon = hoaDonService.save(hoaDon);
            LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
            lichSuHoaDon.setHoaDon(updatedHoaDon);
            lichSuHoaDon.setHanhDong("Thay đổi trạng thái từ: " + trangThaiBeforeUpdate + " -> " + updatedHoaDon.getTrangThai());
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername("tuyen"));
            lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
            String trangThaiSauUpdate = updatedHoaDon.getTrangThai();
            lichSuHoaDon.setTrangThaiSauUpdate(trangThaiSauUpdate);
            lichSuHoaDonService.save(lichSuHoaDon);
            hoaDonList.add(updatedHoaDon);
            System.out.println(updatedHoaDon.getMaHoaDon() + " | " + updatedHoaDon.getTrangThai());
        });
        return ResponseEntity.status(HttpStatus.OK).body("Xác nhận thành công đơn hàng");
    }

    @PostMapping("/refunded")
    public ResponseEntity hoanTien(@RequestParam("id") Long id, HttpServletRequest request) {
        HoaDon hoaDon = hoaDonService.getHoaDonById(id);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.notFound().header("status", "NotAuth").build();
        }
        if (hoaDon == null) {
            return ResponseEntity.notFound().header("status", "oderIsNull").build();
        }
        for (int i = 0; i < hoaDon.getHinhThucThanhToans().size(); i++) {
            if (hoaDon.getHinhThucThanhToans().get(i).getMaGiaoDich().equals("COD")) {
                return ResponseEntity.notFound().header("status", "invalidOder").build();
            }
        }
        if (!hoaDon.getTrangThai().equals("Hủy")) {
            return ResponseEntity.notFound().header("status", "invalidOder").build();
        }
        hoaDon.setTrangThai(TrangThaiHoaDon.HoanTra);
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hoaDon);
        User nt;
        if (request.getUserPrincipal() != null) {
            User user = userService.getByUsername(request.getUserPrincipal().getName());
            lichSuHoaDon.setNguoiThucHien(user);
            nt = user;
        } else {
            return ResponseEntity.notFound().header("status", "NotAuth").build();
        }
        lichSuHoaDon.setHanhDong("[" + nt.getNhanVien().getMaNhanVien() + "]Hoàn tiền cho đơn hàng.");
        lichSuHoaDon.setTrangThaiSauUpdate(TrangThaiHoaDon.HoanTra);
        lichSuHoaDon.setThoiGian(Timestamp.from(Instant.now()));
        HinhThucThanhToan httt = new HinhThucThanhToan();
        httt.setHoaDon(hoaDon);
        httt.setMaGiaoDich("REFUNDED");
        httt.setHinhThuc("BANKING");
        httt.setTienThanhToan(hoaDon.getSoTienDaThanhToan());
        httt.setTienThua(BigDecimal.ZERO);
        httt.setMoTa("Hoàn Tiền Đơn Hủy");
        httt.setNguoiTao(nt);
        httt.setNgayTao(Timestamp.from(Instant.now()));
        httt.setNgaySua(Timestamp.from(Instant.now()));
        httt.setTrangThai(true);
        hinhThucThanhToanService.save(httt);
        lichSuHoaDonService.save(lichSuHoaDon);
        HoaDon newHD = hoaDonService.save(hoaDon);
        mailUtility.sendMail(newHD.getEmailNguoiNhan(), "[LightBee-Thông báo hoàn tiền]", "Số tiền :<h1>" +
                newHD.getSoTienDaThanhToan().intValue() + "đ</h1> của đơn hàng " +
                newHD.getMaHoaDon() + "đã được hoàn trả bởi nhân viên :" +
                nt.getNhanVien().getMaNhanVien() + ". <br> Quý khách vui lòng kiểm tra lại ! <br>" +
                "Mọi thắc mắc vui lòng liên hệ :0866755653. <br>" +
                "Cảm ơn quý khách đã ủng hộ chúng tôi.");
        Map<String, Object> response = new HashMap<>();
        response.put("time", lichSuHoaDon.getThoiGian());
        response.put("user", lichSuHoaDon.getNguoiThucHien().getNhanVien().getHoTen());
        response.put("message", lichSuHoaDon.getHanhDong());
        response.put("status", newHD.getTrangThai());
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/payment-cashier")
    public ResponseEntity banTaiQuay(@ModelAttribute PaymentCashierRequest request) {
        TypePaymentRequest typePayment = gson.fromJson(request.getTypePayment(), TypePaymentRequest.class);
        System.out.println(request);
        Type listType = new TypeToken<List<ProductCashierRequest>>() {
        }.getType();
        List<ProductCashierRequest> listProduct = gson.fromJson(request.getProduct(), listType);
        for (ProductCashierRequest pcr : listProduct) {
            ChiTietSanPham ctsp = chiTietSanPhamService.getById(pcr.getId());
            if (ctsp.getSoLuongTon() <= 0) {
                return ResponseEntity.notFound().header("status", "zeroQuantityPro").build();
            }
            if (ctsp.getSoLuongTon() < pcr.getQuantity()) {
                return ResponseEntity.notFound().header("status", "minQuantityPro").build();
            }
        }
        int total = 0;
        int giamGia = 0;
        for (int i = 0; i < listProduct.size(); i++) {
            ProductCashierRequest pro = listProduct.get(i);
            ChiTietSanPham ctsp = chiTietSanPhamService.getById(pro.getId());
            total += ctsp.getGiaBan().intValue() * pro.getQuantity();
        }
        List<HoaDonChiTiet> lstHDCT = new ArrayList<>();
        List<HinhThucThanhToan> httt = new ArrayList<>();
        KhachHang kh = new KhachHang();
        if (!request.getCustomer().equals("#")) {
            kh = khachHangService.detail(Long.parseLong(request.getCustomer()));
        }
        HoaDon hd = new HoaDon();
        if (request.getVoucher() != null) {
            Voucher voucher = voucherService.getByMa(request.getVoucher());
            if (voucher != null && voucher.getSoLuong() <= 0) {
                return ResponseEntity.notFound().header("status", "ZeroVoucher").build();
            }
            if (voucher != null && total >= voucher.getGiaTriToiThieu().intValue()) {
                if (voucher.getLoaiVoucher().equals("$")) {
                    if (voucher.getGiaTriTienMat().intValue() > total) {
                        giamGia = total;
                    } else {
                        giamGia = voucher.getGiaTriTienMat().intValue();
                    }
                } else {
                    giamGia = total / 100 * voucher.getGiaTriPhanTram();
                    if (giamGia > voucher.getGiaTriToiDa().intValue()) {
                        giamGia = voucher.getGiaTriToiDa().intValue();
                    }
                }
                voucherService.save(voucher);
            }
            hd.setVoucher(voucher);
        }

        if (request.getCustomer().equals("#")) {
            hd.setTenNguoiNhan("Khách Lẻ");
            hd.setKhachHang(null);
            if (request.getReceivingType().equals("CP")) {
                hd.setTenNguoiNhan(request.getHoten());
                hd.setEmailNguoiNhan(request.getEmail());
                hd.setSdtNhan(request.getSdt());
                hd.setKhachHang(null);
            }
        } else {
            if (!request.getHoten().isBlank()) {
                hd.setTenNguoiNhan(request.getHoten());
            } else {
                hd.setTenNguoiNhan(kh.getHoTen());
            }
            if (!request.getSdt().isBlank()) {
                hd.setSdtNhan(request.getSdt());
            } else {
                hd.setSdtNhan(kh.getSdt());
            }
            if (!request.getEmail().isBlank()) {
                hd.setEmailNguoiNhan(request.getEmail());
            } else {
                hd.setEmailNguoiNhan(kh.getUser().getEmail());
            }
            hd.setKhachHang(kh);
        }
        hd.setLoaiHoaDon(true);
        int thucthu = 0;
        if (total > 2000000) {
            hd.setPhiShip(BigDecimal.ZERO);
            thucthu = total - giamGia;
        } else {
            hd.setPhiShip(BigDecimal.valueOf(request.getShippingFee()));
            thucthu = total - giamGia + request.getShippingFee();
        }
        hd.setMaHoaDon(hoaDonService.generateInvoiceCode());
        hd.setTongTien(BigDecimal.valueOf(total));
        hd.setGiamGia(BigDecimal.valueOf(giamGia));
        hd.setHinhThucThanhToans(httt);
        hd.setNgayTao(Timestamp.from(Instant.now()));
        hd.setThucThu(BigDecimal.valueOf(thucthu));
        if (request.getReceivingType().equals("TQ")) {
            hd.setDiaChiNhan("Tại Quầy");
            if (thucthu <= request.getTransfer() + request.getCash()) {
                hd.setSoTienDaThanhToan(BigDecimal.valueOf(thucthu));
                hd.setSoTienCanThanhToan(BigDecimal.ZERO);
            } else {
                hd.setSoTienDaThanhToan(BigDecimal.valueOf(request.getTransfer() + request.getCash()));
                int thieu = thucthu - request.getTransfer() + request.getCash();
                if (thieu > 0) {
                    return ResponseEntity.notFound().header("status", "paymentError").build();
                }
            }
            hd.setTrangThai(TrangThaiHoaDon.ThanhCong);
        } else {
            hd.setMaVanChuyen(request.getShippingCode());
            hd.setDiaChiNhan(request.getAddress());
            if (typePayment.isKhiNhanHang()) {
                hd.setSoTienCanThanhToan(BigDecimal.valueOf(thucthu));
                hd.setSoTienDaThanhToan(BigDecimal.ZERO);
            } else {
                if (thucthu <= request.getTransfer() + request.getCash()) {
                    hd.setSoTienDaThanhToan(BigDecimal.valueOf(thucthu));
                    hd.setSoTienCanThanhToan(BigDecimal.ZERO);
                } else {
                    hd.setSoTienDaThanhToan(BigDecimal.valueOf(request.getTransfer() + request.getCash()));
                    int thieu = thucthu - request.getTransfer() + request.getCash();
                    hd.setSoTienCanThanhToan(BigDecimal.valueOf(thieu));
                }
            }
            hd.setTrangThai(TrangThaiHoaDon.ChuanBiHang);
        }
        User userTH = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            User user = userService.getByUsername(userDetails.getUsername());
            if (user.getNhanVien() != null) {
                userTH = user;
                hd.setNhanVien(user.getNhanVien());
            } else {
                hd.setNhanVien(null);
            }
        }
        hd = hoaDonService.save(hd);
        int tienThua = 0;
        if (request.getCash() != null) {
            tienThua = request.getCash() + request.getTransfer() - hd.getThucThu().intValue();
        }
        if (typePayment.isChuyenKhoan()) {
            HinhThucThanhToan ht = new HinhThucThanhToan();
            ht.setHinhThuc("Chuyển Khoản");
            ht.setHoaDon(hd);
            ht.setTienThanhToan(BigDecimal.valueOf(request.getTransfer()));
            ht.setTienThua(BigDecimal.valueOf(tienThua));
            ht.setMaGiaoDich(request.getTransferCode());
            ht.setNgayTao(Timestamp.from(Instant.now()));
            ht.setTrangThai(true);
            ht.setMoTa("Chuyển Khoản");
            ht.setNguoiTao(userTH);
            ht = hinhThucThanhToanService.save(ht);
            httt.add(ht);
        }
        if (typePayment.isTienMat()) {
            HinhThucThanhToan ht = new HinhThucThanhToan();
            ht.setHinhThuc("Tiền Mặt");
            ht.setTienThanhToan(BigDecimal.valueOf(request.getCash()));
            ht.setTienThua(BigDecimal.valueOf(tienThua));
            ht.setHoaDon(hd);
            ht.setMaGiaoDich("CASH");
            ht.setNgayTao(Timestamp.from(Instant.now()));
            ht.setTrangThai(true);
            ht.setMoTa("Tiền Mặt");
            ht.setNguoiTao(userTH);
            ht = hinhThucThanhToanService.save(ht);
            httt.add(ht);
        }
        if (typePayment.isKhiNhanHang()) {
            HinhThucThanhToan ht = new HinhThucThanhToan();
            ht.setHinhThuc("Khi Nhận Hàng");
            ht.setTrangThai(true);
            ht.setTienThanhToan(BigDecimal.ZERO);
            ht.setTienThua(BigDecimal.ZERO);
            ht.setMaGiaoDich("COD");
            ht.setNgayTao(Timestamp.from(Instant.now()));
            ht.setHoaDon(hd);
            ht.setMoTa("Thanh Toán Khi Nhận Hàng");
            ht.setNguoiTao(userTH);
            ht = hinhThucThanhToanService.save(ht);
            httt.add(ht);
        }
        StringBuilder strPayment = new StringBuilder();
        for (int i = 0; i < httt.size(); i++) {
            HinhThucThanhToan ht = httt.get(i);
            if (i > 0) {
                strPayment.append(",");
            }
            strPayment.append(ht.getHinhThuc());
        }
        if (hd.getVoucher() != null) {
            Voucher voucher = hd.getVoucher();
            voucher.setSoLuong(voucher.getSoLuong() - 1);
            voucherService.save(voucher);
        }

        for (int i = 0; i < listProduct.size(); i++) {
            ProductCashierRequest pro = listProduct.get(i);
            ChiTietSanPham ctsp = chiTietSanPhamService.getById(pro.getId());
            HoaDonChiTiet hdct = new HoaDonChiTiet();
            hdct.setChiTietSanPham(ctsp);
            hdct.setHoaDon(hd);
            hdct.setSoLuong(pro.getQuantity());
            hdct.setGiaBan(ctsp.getGiaBan());
            hdct.setGiaGoc(ctsp.getGiaGoc());
            hdct = hoaDonChiTietService.save(hdct);
            lstHDCT.add(hdct);
            ctsp.setSoLuongTon(ctsp.getSoLuongTon() - pro.getQuantity());
            chiTietSanPhamService.save(ctsp);
        }

        hd.setHoaDonChiTiets(lstHDCT);
        String ten = hd.getNhanVien() == null ? "anonymous" : hd.getNhanVien().getHoTen();
        List<LichSuHoaDon> listLshd = new ArrayList<>();
        if (request.getReceivingType().equals("TQ")) {
            LichSuHoaDon lshd = new LichSuHoaDon();
            lshd.setHoaDon(hd);
            lshd.setHanhDong("Đơn Hàng Tạo Bởi :" + ten);
            lshd.setThoiGian(Timestamp.from(Instant.now()));
            lshd.setNguoiThucHien(userTH);
            lshd.setTrangThaiSauUpdate(TrangThaiHoaDon.ThanhCong);
            lshd = lichSuHoaDonService.save(lshd);
            listLshd.add(lshd);
        } else {
            LichSuHoaDon tao = new LichSuHoaDon();
            tao.setHoaDon(hd);
            tao.setHanhDong("Đơn Hàng Tạo Bởi " + ten + "Tại Quầy.");
            tao.setThoiGian(Timestamp.from(Instant.now()));
            tao.setNguoiThucHien(userTH);
            tao.setTrangThaiSauUpdate(TrangThaiHoaDon.ChoXacNhan);
            tao = lichSuHoaDonService.save(tao);
            LichSuHoaDon cb = new LichSuHoaDon();
            cb.setHoaDon(hd);
            cb.setHanhDong("Đơn Hàng được xác nhận bởi : " + ten);
            cb.setThoiGian(Timestamp.from(Instant.now()));
            cb.setNguoiThucHien(userTH);
            cb.setTrangThaiSauUpdate(TrangThaiHoaDon.ChuanBiHang);
            cb = lichSuHoaDonService.save(cb);
            listLshd.add(cb);
            listLshd.add(tao);
        }
        hd.setLichSuHoaDons(listLshd);
        hd = hoaDonService.save(hd);
        HoaDonDto hoaDonDto = new HoaDonDto();
        hoaDonDto.setId(hd.getId());
        hoaDonDto.setMaHoaDon(hd.getMaHoaDon());
        hoaDonDto.setTenNguoiNhan(hd.getTenNguoiNhan());
        hoaDonDto.setSdtNhan(hd.getSdtNhan());
        hoaDonDto.setThucThu(hd.getThucThu());
        hoaDonDto.setTrangThai(hd.getTrangThai());
        Notification notification = new Notification();
        notification.setCreatedBy("N/A");
        notification.setCreatorAvatarUrl("/assets/cms/img/160x160/img1.jpg");
        if (userTH != null && userTH.getNhanVien() != null) {
            notification.setCreatedBy(userTH.getNhanVien().getHoTen());
            notification.setCreatorAvatarUrl(userTH.getAvatar() == null ? "/assets/cms/img/160x160/img1.jpg" : userTH.getAvatar());
        }
        notification.setTitle("Tạo đơn hàng");
        notification.setDescription("Vừa tạo đơn hàng " + hd.getMaHoaDon());
        LocalTime now = LocalTime.now();
        notification.setCreatedTime(now.getHour() + ":" + now.getMinute());
        Notification savedNoti = notificationService.save(notification);
        messagingTemplate.convertAndSend("/topic/newInvoice", hoaDonDto);
        messagingTemplate.convertAndSend("/topic/noti", savedNoti);
        ResponseOder response = new ResponseOder();
        List<ProductInResponse> lstPro = new ArrayList<>();
        for (int i = 0; i < hd.getHoaDonChiTiets().size(); i++) {
            HoaDonChiTiet hdct = hd.getHoaDonChiTiets().get(i);
            ProductInResponse pro = new ProductInResponse();
            pro.setAnh(hdct.getChiTietSanPham().getAnh().getUrl());
            pro.setTen(hdct.getChiTietSanPham().getSanPham().getTen());
            pro.setId(hdct.getId());
            pro.setGiaGoc(hdct.getGiaGoc().intValue());
            pro.setGiaBan(hdct.getGiaBan().intValue());
            pro.setSoLuong(hdct.getSoLuong());
            pro.setKichCo(hdct.getChiTietSanPham().getKichCo().getTen());
            pro.setMauSac(hdct.getChiTietSanPham().getMauSac().getTen());
            pro.setMaSanPham(hdct.getChiTietSanPham().getMaSanPham());
            lstPro.add(pro);
        }
        response.setSanPham(lstPro);
        response.setDaThanhToan(hd.getSoTienDaThanhToan().intValue());
        response.setChuaThanhToan(hd.getSoTienCanThanhToan().intValue());
        response.setGiamGia(hd.getGiamGia().intValue());
        response.setPhiShip(hd.getPhiShip().intValue());
        response.setTenNguoiNhan(hd.getTenNguoiNhan());
        response.setHinhThucThanhToan(strPayment.toString());
        response.setSDT(hd.getSdtNhan());
        response.setMaHoaDon(hd.getMaHoaDon());
        response.setDiaChi(hd.getDiaChiNhan());
        response.setTongtien(hd.getTongTien().intValue());
        response.setThucthu(hd.getThucThu().intValue());
        response.setNgayTao(hd.getNgayTao());
        response.setType(request.getReceivingType());
        if (request.getReceivingType().equals("TQ")) {
            response.setNgayThanhToan(hd.getNgayTao());
        } else {
            response.setNgayThanhToan(null);
        }
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/huy")
    public ResponseEntity<String> huyDon(
            @RequestBody List<String> maHoaDonList
    ) {
        List<HoaDon> hoaDonList = new ArrayList<>();
        maHoaDonList.forEach(ma -> {
            HoaDon hoaDon = hoaDonService.getHoaDonByMa(ma);
            String trangThaiBeforeUpdate = hoaDon.getTrangThai();
            hoaDon.setTrangThai(TrangThaiHoaDon.Huy);
            hoaDon.setNgaySua(ConvertUtility.DateToTimestamp(new Date()));
            HoaDon updatedHoaDon = hoaDonService.save(hoaDon);
            if (updatedHoaDon.getVoucher() != null) {
                Voucher voucher = voucherService.getByMa(updatedHoaDon.getVoucher().getMa());
                voucher.setSoLuong(voucher.getSoLuong() + 1);
                voucherService.save(voucher);
            }
            updatedHoaDon.getHoaDonChiTiets().forEach(hdct -> {
                ChiTietSanPham chiTietSanPham = chiTietSanPhamService.getById(hdct.getChiTietSanPham().getId());
                chiTietSanPham.setSoLuongTon(chiTietSanPham.getSoLuongTon() + hdct.getSoLuong());
                chiTietSanPhamService.save(chiTietSanPham);
            });
            LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
            lichSuHoaDon.setHoaDon(updatedHoaDon);
            lichSuHoaDon.setHanhDong("Thay đổi trạng thái từ: " + trangThaiBeforeUpdate + " -> " + updatedHoaDon.getTrangThai());
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername("tuyen"));
            lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
            String trangThaiSauUpdate = updatedHoaDon.getTrangThai();
            lichSuHoaDon.setTrangThaiSauUpdate(trangThaiSauUpdate);
            lichSuHoaDonService.save(lichSuHoaDon);
            hoaDonList.add(updatedHoaDon);
            System.out.println(updatedHoaDon.getMaHoaDon() + " | " + updatedHoaDon.getTrangThai());
        });
        return new ResponseEntity<>("Hủy thành công đơn hàng", HttpStatus.OK);
    }

    @PostMapping("/xac-nhan-detail")
    public ResponseEntity xacNhanDonDetail(
            @RequestBody Long idHoaDon,
            HttpServletRequest request
    ) {
        HoaDon hoaDon = hoaDonService.getHoaDonById(idHoaDon);
        String trangThaiBeforeUpdate = hoaDon.getTrangThai();
        if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.ChoXacNhan)) {
            hoaDon.setTrangThai(TrangThaiHoaDon.ChuanBiHang);
        } else if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.ChuanBiHang)) {
            hoaDon.setTrangThai(TrangThaiHoaDon.ChoGiao);
        } else if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.ChoGiao)) {
            hoaDon.setTrangThai(TrangThaiHoaDon.DangGiao);
        } else if (hoaDon.getTrangThai().equals(TrangThaiHoaDon.DangGiao)) {
            hoaDon.setTrangThai(TrangThaiHoaDon.ThanhCong);
        }
        hoaDon.setNgayXacNhan(new Date());
        HoaDon updatedHoaDon = hoaDonService.save(hoaDon);
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(updatedHoaDon);
        lichSuHoaDon.setHanhDong("Thay đổi trạng thái từ: " + trangThaiBeforeUpdate + " -> " + updatedHoaDon.getTrangThai());
        if (request.getUserPrincipal() != null) {
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername(request.getUserPrincipal().getName()));
        }
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(updatedHoaDon.getTrangThai());
        LichSuHoaDon lshd = lichSuHoaDonService.save(lichSuHoaDon);
        LichSuHoaDonDto lshdDto = new LichSuHoaDonDto();
        lshdDto.setIdHoaDon(lshd.getHoaDon().getId());
        lshdDto.setId(lshd.getId());
        lshdDto.setHanhDong(lshd.getHanhDong());
        lshdDto.setTrangThaiSauUpdate(lshd.getTrangThaiSauUpdate());
        lshdDto.setThoiGian(lshd.getThoiGian());
        lshdDto.setHanhDong(lshd.getHanhDong());
        if (lshd.getNguoiThucHien() != null) {
            lshdDto.setNguoiThucHien(lshd.getNguoiThucHien().getNhanVien() != null ? lshd.getNguoiThucHien().getNhanVien().getHoTen() : "Anonymous");
        } else {
            lshdDto.setNguoiThucHien("Anoynomous");
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(lshdDto);
    }

    @PostMapping("/delete-product")
    public ResponseEntity xoaSanPham(@RequestParam("id") Long id, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = null;
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            user = userService.getByUsername(userDetails.getUsername());
        } else {
            return ResponseEntity.notFound().header("status", "NotAuth").build();
        }
        HoaDonChiTiet hdct = hoaDonChiTietService.getById(id);
        System.out.println(id);
        if (hdct == null) {
            return ResponseEntity.notFound().header("status", "HDCTNull").build();
        }
        HoaDon hoaDon = hdct.getHoaDon();
        List<HoaDonChiTiet> lst = hoaDon.getHoaDonChiTiets();
        if (lst.size() == 1) {
            return ResponseEntity.notFound().header("status", "minPro").build();
        }
        ChiTietSanPham chiTietSanPham = hdct.getChiTietSanPham();
        chiTietSanPham.setSoLuongTon(chiTietSanPham.getSoLuongTon() + hdct.getSoLuong());
        chiTietSanPhamService.save(chiTietSanPham);
        lst.remove(hdct);
        hoaDon.setHoaDonChiTiets(lst);
        hoaDon = tinhTien(hoaDon);
        hoaDonChiTietService.delete(hdct.getId());
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hoaDon);
        lichSuHoaDon.setHanhDong("Xóa sản phẩm '" + hdct.getChiTietSanPham().getMaSanPham() + "' khỏi hóa đơn.");
        if (request.getUserPrincipal() != null) {
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername(request.getUserPrincipal().getName()));
        }
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(hoaDon.getTrangThai());
        lichSuHoaDon = lichSuHoaDonService.save(lichSuHoaDon);
        if (user != null) {
            String tb = "[LightBee Shop - Thông báo cập nhật thông tin đơn hàng]";
            String body = "<h1>Bạn đã thực hiện xóa sản phẩm '" + hdct.getChiTietSanPham().getMaSanPham() + "' thành công!";
            mailUtility.sendMail(user.getEmail(), tb, body);
        }
        List<HoaDonChiTiet> lstHDCT = hoaDon.getHoaDonChiTiets();
        int slt = 0;
        if (lstHDCT != null && !lstHDCT.isEmpty()) {
            for (HoaDonChiTiet item : lstHDCT) {
                slt += item.getSoLuong();
            }
        }
        UpdateProductRquest rs = new UpdateProductRquest();
        rs.setId_hdct(hdct.getId());
        rs.setGiamGia(hoaDon.getGiamGia());
        rs.setTongTien(hoaDon.getTongTien());
        rs.setThucThu(hoaDon.getThucThu());
        rs.setPhiShip(hoaDon.getPhiShip().intValue());
        rs.setTimes(lichSuHoaDon.getThoiGian());
        rs.setMessage(lichSuHoaDon.getHanhDong());
        rs.setSoLuong(slt);
        rs.setId(hoaDon.getId());
        return ResponseEntity.ok().body(rs);
    }

    @PostMapping("/update-shipping-fee")
    public ResponseEntity shipping(@RequestParam("id") Long id, @RequestParam("shippingfee") int shipping) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.notFound().header("status", "NotAuth").build();
        }
        System.out.println(shipping);
        HoaDon hd = hoaDonService.getHoaDonById(id);
        hd.setPhiShip(BigDecimal.valueOf(shipping));
        HoaDon hoaDon = tinhTien(hd);
        int thucThu = hoaDon.getThucThu().intValue();
        int shippingfee = hoaDon.getPhiShip().intValue();
        Map<String, Integer> resultMap = new HashMap<>();
        resultMap.put("thucThu", thucThu);
        resultMap.put("shippingfee", shippingfee);
        return ResponseEntity.ok().body(resultMap);
    }

    private HoaDon tinhTien(HoaDon hoaDon) {
        List<HoaDonChiTiet> lstHDCT = new ArrayList<>(hoaDon.getHoaDonChiTiets());
        Map<Long, HoaDonChiTiet> uniqueMap = new LinkedHashMap<>();
        for (HoaDonChiTiet dct : lstHDCT) {
            uniqueMap.putIfAbsent(dct.getId(), dct);
        }
        lstHDCT = new ArrayList<>(uniqueMap.values());
        float total = lstHDCT.stream()
                .map(dct -> dct.getGiaBan().floatValue() * dct.getSoLuong())
                .reduce(0f, Float::sum);
        System.out.println("Total: " + total);

        hoaDon.setTongTien(BigDecimal.valueOf(total));

        if (hoaDon.getVoucher() != null) {
            Voucher vc = hoaDon.getVoucher();
            if (vc.getGiaTriToiThieu().intValue() > total) {
                hoaDon.setGiamGia(BigDecimal.ZERO);
                hoaDon.setVoucher(null);
            }
        }

        if (total > 2000000) {
            hoaDon.setPhiShip(BigDecimal.ZERO);
        }

        float thucThu = 0;

        if (hoaDon.getGiamGia() != null) {
            thucThu = total - hoaDon.getGiamGia().floatValue();
        } else {
            thucThu = total;
        }
        thucThu += hoaDon.getPhiShip().floatValue();
        hoaDon.setThucThu(BigDecimal.valueOf(thucThu));
        hoaDon = hoaDonService.save(hoaDon);
        return hoaDon;
    }

    @PostMapping("/add-product")
    public ResponseEntity themsanPham(@ModelAttribute AddProductOderRequest dt, HttpServletRequest request
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = null;
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            user = userService.getByUsername(userDetails.getUsername());
        } else {
            return ResponseEntity.notFound().header("status", "NotAuth").build();
        }
        HoaDon hoaDon = hoaDonService.getHoaDonById(dt.getId());
        if (!hoaDon.getTrangThai().equals(TrangThaiHoaDon.ChoXacNhan)) {
            return ResponseEntity.notFound().header("status", "NotAcceptStatus").build();
        }
        if (hoaDon == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "HoaDonNull").build();
        }
        if (dt.getSoLuong() < 1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "numMin").build();
        }
        MauSac mauSac = mauSacService.getMauSacByMa(dt.getMauSac());
        KichCo kichCo = kichCoService.getById(dt.getKichCo());
        SanPham sanPham = sanPhamService.getById(dt.getSanPham());
        ChiTietSanPham ctsp = chiTietSanPhamService.getBySizeAndColorAndProduct(kichCo, mauSac, sanPham);

        if (ctsp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("status", "CTSPNull").build();
        }

        List<HoaDonChiTiet> lst = hoaDon.getHoaDonChiTiets();
        List<HoaDonChiTiet> lstNew = lst.stream()
                .filter(hoaDonChiTiet -> hoaDonChiTiet.getChiTietSanPham().getId().equals(ctsp.getId()))
                .collect(Collectors.toList());

        HoaDonChiTiet hdct = null;
        for (HoaDonChiTiet hoaDonChiTiet : lstNew) {
            if (hoaDonChiTiet.getGiaBan().equals(ctsp.getGiaBan())) {
                hdct = hoaDonChiTiet;
                break;
            }
        }
        boolean isNew = true;
        if (hdct != null) {
            hdct.setSoLuong(hdct.getSoLuong() + dt.getSoLuong());
            isNew = false;
        } else {
            hdct = new HoaDonChiTiet();
            hdct.setHoaDon(hoaDon);
            hdct.setChiTietSanPham(ctsp);
            hdct.setSoLuong(dt.getSoLuong());
            hdct.setGiaGoc(ctsp.getGiaGoc());
            hdct.setGiaBan(ctsp.getGiaBan());
            isNew = true;
        }

        if (hdct.getSoLuong() < 1) {
            return ResponseEntity.notFound().header("status", "MinQuantity").build();
        }
        if (hdct.getSoLuong() > hdct.getChiTietSanPham().getSoLuongTon()) {
            return ResponseEntity.notFound().header("status", "MaxQuantity").build();
        }

        hdct = hoaDonChiTietService.save(hdct);
        lst.add(hdct);
        hoaDon.setHoaDonChiTiets(lst);
        hoaDon = hoaDonService.save(hoaDon);
        hoaDon = tinhTien(hoaDon);
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hoaDon);
        lichSuHoaDon.setHanhDong("Thêm sản phẩm '" + ctsp.getMaSanPham() + "' vào hóa đơn.");
        if (request.getUserPrincipal() != null) {
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername(request.getUserPrincipal().getName()));
        }
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(hoaDon.getTrangThai());
        lichSuHoaDon = lichSuHoaDonService.save(lichSuHoaDon);
        if (user != null) {
            String tb = "[LightBee Shop - Thông báo cập nhật thông tin đơn hàng]";
            String body = "<h1>Bạn đã thực hiện xóa sản phẩm '" + hdct.getChiTietSanPham().getMaSanPham() + "' vào hóa đơn!";
            mailUtility.sendMail(user.getEmail(), tb, body);
        }
        UpdateProductRquest rs = new UpdateProductRquest();
        rs.setSoLuong(hdct.getSoLuong());
        rs.setId(ctsp.getId());
        rs.setIdHD(hoaDon.getId());
        rs.setId_hdct(hdct.getId());
        rs.setMaSanPham(ctsp.getMaSanPham());
        rs.setGiaGoc(ctsp.getGiaGoc().intValue());
        rs.setGiaBan(ctsp.getGiaBan().intValue());
        rs.setTen(ctsp.getSanPham().getTen());
        rs.setSale(isNew);
        rs.setAnh(ctsp.getAnh().getUrl());
        rs.setKichCo(ctsp.getKichCo().getTen());
        rs.setMauSac(ctsp.getMauSac().getTen());
        rs.setSoLuongTon(ctsp.getSoLuongTon());
        rs.setTimes(lichSuHoaDon.getThoiGian());
        rs.setMessage(lichSuHoaDon.getHanhDong());
        if (lichSuHoaDon.getNguoiThucHien() == null) {
            rs.setUser("anonymus");
        } else if (lichSuHoaDon.getNguoiThucHien().getNhanVien() != null) {
            rs.setUser(lichSuHoaDon.getNguoiThucHien().getNhanVien().getHoTen());
        } else {
            rs.setUser(lichSuHoaDon.getNguoiThucHien().getKhachHang().getHoTen());
        }
        rs.setTongTien(hoaDon.getTongTien());
        rs.setThucThu(hoaDon.getThucThu());
        rs.setGiamGia(hoaDon.getGiamGia());
        rs.setPhiShip(hoaDon.getPhiShip().intValue());
        return ResponseEntity.status(HttpStatus.OK).body(rs);
    }

    @PostMapping("/huy-detail")
    public ResponseEntity<LichSuHoaDonDto> huyDonDetail(
            @RequestParam("id") Long idHoaDon,
            @RequestParam("lydo") String lydo,
            HttpServletRequest request
    ) {
        HoaDon hoaDon = hoaDonService.getHoaDonById(idHoaDon);
        hoaDon.setTrangThai(TrangThaiHoaDon.Huy);
        hoaDon.setNgaySua(ConvertUtility.DateToTimestamp(new Date()));
        HoaDon updatedHoaDon = hoaDonService.save(hoaDon);
        if (updatedHoaDon.getVoucher() != null) {
            Voucher voucher = voucherService.getByMa(updatedHoaDon.getVoucher().getMa());
            voucher.setSoLuong(voucher.getSoLuong() + 1);
            voucherService.save(voucher);
        }
        updatedHoaDon.getHoaDonChiTiets().forEach(hdct -> {
            ChiTietSanPham chiTietSanPham = chiTietSanPhamService.getById(hdct.getChiTietSanPham().getId());
            chiTietSanPham.setSoLuongTon(chiTietSanPham.getSoLuongTon() + hdct.getSoLuong());
            chiTietSanPhamService.save(chiTietSanPham);
        });
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(updatedHoaDon);
        lichSuHoaDon.setHanhDong("Lý Do: " + lydo);
        if (request.getUserPrincipal() != null) {
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername(request.getUserPrincipal().getName()));
        }
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(updatedHoaDon.getTrangThai());
        LichSuHoaDon lshd = lichSuHoaDonService.save(lichSuHoaDon);
        LichSuHoaDonDto lshdDto = new LichSuHoaDonDto();
        lshdDto.setIdHoaDon(lshd.getHoaDon().getId());
        lshdDto.setId(lshd.getId());
        lshdDto.setHanhDong(lshd.getHanhDong());
        lshdDto.setTrangThaiSauUpdate(lshd.getTrangThaiSauUpdate());
        lshdDto.setThoiGian(lshd.getThoiGian());
        if (lshd.getNguoiThucHien() != null) {
            lshdDto.setNguoiThucHien(lshd.getNguoiThucHien().getNhanVien() != null ? lshd.getNguoiThucHien().getNhanVien().getHoTen() : "Anonymous");
        } else {
            lshdDto.setNguoiThucHien("Anoynomous");
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(lshdDto);
    }

    @PostMapping("/hoan-tac-detail")
    public ResponseEntity<LichSuHoaDonDto> hoanTacDetail(
            @RequestBody Long idHoaDon,
            HttpServletRequest request
    ) {
        HoaDon hoaDon = hoaDonService.getHoaDonById(idHoaDon);
        hoaDon.setTrangThai(TrangThaiHoaDon.ChoXacNhan);
        hoaDon.setNgaySua(ConvertUtility.DateToTimestamp(new Date()));
        HoaDon updatedHoaDon = hoaDonService.save(hoaDon);
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(updatedHoaDon);
        lichSuHoaDon.setHanhDong("Hoàn tác trạng thái về: " + updatedHoaDon.getTrangThai());
        if (request.getUserPrincipal() != null) {
            lichSuHoaDon.setNguoiThucHien(userService.getByUsername(request.getUserPrincipal().getName()));
        }
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(updatedHoaDon.getTrangThai());
        LichSuHoaDon lshd = lichSuHoaDonService.save(lichSuHoaDon);
        LichSuHoaDonDto lshdDto = new LichSuHoaDonDto();
        lshdDto.setId(lshd.getId());
        lshdDto.setIdHoaDon(lshd.getHoaDon().getId());
        lshdDto.setHanhDong(lshd.getHanhDong());
        lshdDto.setThoiGian(lshd.getThoiGian());
        if (lshd.getNguoiThucHien() != null) {
            lshdDto.setNguoiThucHien(lshd.getNguoiThucHien().getNhanVien() != null ? lshd.getNguoiThucHien().getNhanVien().getHoTen() : "Anonymous");
        } else {
            lshdDto.setNguoiThucHien("Anoynomous");
        }
        lshdDto.setTrangThaiSauUpdate(lshd.getTrangThaiSauUpdate());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(lshdDto);
    }

    @GetMapping("/{id}/lich-su")
    public ResponseEntity<List<LichSuHoaDonDto>> lichSuHoaDon(@PathVariable Long id) {
        List<LichSuHoaDon> lichSuHoaDonList = lichSuHoaDonService.getAllLichSuHoaDonByIdHoaDon(id);
        List<LichSuHoaDonDto> lichSuHoaDonDtoList =
                lichSuHoaDonList
                        .stream()
                        .map(lshd -> new LichSuHoaDonDto(
                                lshd.getId(), lshd.getHoaDon().getId(), lshd.getHanhDong(),
                                lshd.getThoiGian(), lshd.getNguoiThucHien().getNhanVien().getHoTen(),
                                lshd.getTrangThaiSauUpdate()
                        )).collect(Collectors.toList());
        return new ResponseEntity<>(lichSuHoaDonDtoList, HttpStatus.OK);
    }

    @GetMapping("/printOrder")
    public ResponseEntity<String> callApiGHN(
            @RequestParam("token") String token
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", "68b8b44f-a88d-11ee-8bfa-8a2dda8ec551");
        HttpEntity entity = new HttpEntity<>(headers);
        String apiUrl = "https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token=" + token;

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);
        return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
    }

    @PostMapping("/update-receive-address")
    public ResponseEntity<String> updateReceiveAddress(
            @RequestBody String data,
            HttpServletRequest request
    ) {
        JsonObject response = JsonParser.parseString(data).getAsJsonObject();
        Long invoiceId = response.get("invoiceId").getAsLong();
        String cusName = response.get("customerName").getAsString();
        String cusPhone = response.get("customerPhone").getAsString();
        BigDecimal shippingFee = BigDecimal.valueOf(response.get("shippingFee").getAsLong());
        String cusHouseNum = response.get("customerHouseNumber").getAsString();
        String receiveAddress = response.get("updateAddress").getAsString();

        HoaDon needUpdate = hoaDonService.getHoaDonById(invoiceId);
        needUpdate.setNgaySua(ConvertUtility.DateToTimestamp(new Date()));
        needUpdate.setTenNguoiNhan(cusName);
        needUpdate.setSdtNhan(cusPhone);
        needUpdate.setPhiShip(shippingFee);
        needUpdate.setDiaChiNhan(cusHouseNum + "," + receiveAddress);
        HoaDon updated = hoaDonService.save(needUpdate);
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHanhDong("Cập nhật địa chỉ nhận hàng");
        lichSuHoaDon.setHoaDon(updated);
        lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
        lichSuHoaDon.setTrangThaiSauUpdate(updated.getTrangThai());
        if (request.getUserPrincipal() != null) {
            User loggedUser = userService.getByUsername(request.getUserPrincipal().getName());
            lichSuHoaDon.setNguoiThucHien(loggedUser);
        }
        lichSuHoaDonService.save(lichSuHoaDon);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

//    @GetMapping("/getWard")
//    public ResponseEntity callWardGHN(
//            @RequestParam("district_id") int districtID
//    ) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Token", "68b8b44f-a88d-11ee-8bfa-8a2dda8ec551");
//        HttpEntity entity = new HttpEntity<>(headers);
//        String apiUrl = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + districtID;
//
//        String stringResponse = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class).getBody();
//        JsonObject jsonObject = JsonParser.parseString(stringResponse).getAsJsonObject();
//        if(!jsonObject.get("data").isJsonNull()) {
//            JsonArray arrayData = jsonObject.getAsJsonArray("data");
//            if (arrayData != null) {
//                for (JsonElement e : arrayData) {
//                    JsonObject ward = new JsonObject();
//                    ward.addProperty("Code", e.getAsJsonObject().get("WardCode").getAsString());
//                    ward.addProperty("Name", e.getAsJsonObject().get("WardName").getAsString());
//                    ward.addProperty("DistrictID", e.getAsJsonObject().get("DistrictID").getAsInt());
//                    try (BufferedWriter writer = new BufferedWriter(new FileWriter("F:/lightbee/beeshoes/src/main/resources/static/assets/address-json/ward.json", true))) {
//                        writer.write(ward + ",");
//                    } catch (Exception ex) {
//                        ex.printStackTrace();
//                    }
//                }
//            }
//        }
//        return new ResponseEntity<>(stringResponse, HttpStatus.OK);
//    }
}
