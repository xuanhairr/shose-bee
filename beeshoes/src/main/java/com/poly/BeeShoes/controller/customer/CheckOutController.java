package com.poly.BeeShoes.controller.customer;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;
import com.poly.BeeShoes.constant.TrangThaiHoaDon;
import com.poly.BeeShoes.dto.HoaDonDto;
import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.payment.vnpay.VNPayService;
import com.poly.BeeShoes.request.ProductCheckoutRequest;
import com.poly.BeeShoes.service.*;
import com.poly.BeeShoes.utility.ConvertUtility;
import com.poly.BeeShoes.utility.MailUtility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalTime;
import java.util.*;

@Controller
@RequiredArgsConstructor
public class CheckOutController {

    private final VNPayService vnPayService;
    private final ChiTietSanPhamService chiTietSanPhamService;
    private final VoucherService voucherService;
    private final UserService userService;
    private final GioHangService gioHangService;
    private final GioHangChiTietService gioHangChiTietService;
    private final HoaDonService hoaDonService;
    private final HoaDonChiTietService hoaDonChiTietService;
    private final MailUtility mailUtility;
    private final HinhThucThanhToanService hinhThucThanhToanService;
    private final LichSuHoaDonService lichSuHoaDonService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    Gson gson = new Gson();

    @PostMapping("/checkout")
    public String getCheckout(
            @RequestParam("maGiamGia") String ma,
            @RequestParam("listData") String list,
            HttpServletRequest request,
            Model model
    ) {
        User user = new User();
        if (request.getUserPrincipal() != null) {
            user = userService.getByUsername(request.getUserPrincipal().getName());
            System.out.println(request.getUserPrincipal().getName());
            model.addAttribute("userLogged", user);
        }
        float totalAmount = 0;
        float total = 0;
        Type listType = new TypeToken<List<ProductCheckoutRequest>>() {
        }.getType();
        List<ProductCheckoutRequest> listData = gson.fromJson(list, listType);
        System.out.println(Arrays.toString(listData.toArray()));
        System.out.println(ma);
        Map<ChiTietSanPham, Integer> productDetailMap = new HashMap<>();
        listData.forEach(data ->
                productDetailMap.put(chiTietSanPhamService.getById(data.getId_product_detail()), data.getQuantity())
        );
        for (Map.Entry<ChiTietSanPham, Integer> entry : productDetailMap.entrySet()) {
            total += (entry.getKey().getGiaBan().floatValue() * entry.getValue());
        }
        if (ma != null) {
            Voucher voucher = voucherService.getByMa(ma);
            if (voucher != null && voucher.getLoaiVoucher().equals("$")) {
                float maxValueOfVoucher = voucher.getGiaTriToiDa().floatValue();
                if (maxValueOfVoucher >= total) {
                    totalAmount = 0;
                    model.addAttribute("voucherValue", total);
                }
                totalAmount = total - maxValueOfVoucher;
                model.addAttribute("voucherValue", maxValueOfVoucher);
            } else if (voucher != null && voucher.getLoaiVoucher().equals("%")) {
                float percentOfVoucher = voucher.getGiaTriPhanTram();
                float maxValueOfVoucher = total / 100 * percentOfVoucher;
                if (maxValueOfVoucher > voucher.getGiaTriToiDa().floatValue()) {
                    maxValueOfVoucher = voucher.getGiaTriToiDa().floatValue();
                }
                totalAmount = total - maxValueOfVoucher;
                model.addAttribute("voucherValue", maxValueOfVoucher);
            } else {
                totalAmount = total;
            }
            model.addAttribute("voucher", voucher);
        }
        model.addAttribute("productDetailMap", productDetailMap);
        model.addAttribute("total", total);
        model.addAttribute("totalAmount", totalAmount);
        return "customer/pages/shop/checkout";
    }

    @GetMapping("/vnpay-payment")
    @Transactional
    public String GetMapping(
            HttpServletRequest request,
            HttpSession session,
            Model model
    ) {
        int paymentStatus = vnPayService.orderReturn(request);
        int total = Integer.parseInt(request.getParameter("vnp_Amount")) / 100;
        String[] invoiceCode = request.getParameter("vnp_TxnRef").split("-");
        model.addAttribute("total", total);
        model.addAttribute("invoiceCode", invoiceCode[0]);
        if (paymentStatus == 1) {
            User user = new User();
            if (hoaDonService.getHoaDonByMa(invoiceCode[0]) == null) {
                HoaDon hoaDon = (HoaDon) session.getAttribute(invoiceCode[0]);
                Voucher voucher = hoaDon.getVoucher();
                HoaDon savedHoaDon = hoaDonService.save(hoaDon);
                //sửa lại thanh toán
                List<HinhThucThanhToan> httt = new ArrayList<>();
                HinhThucThanhToan ht = new HinhThucThanhToan();
                ht.setHinhThuc("VNPAY");
                ht.setTrangThai(false);
                ht.setTienThanhToan(BigDecimal.valueOf(total));
                ht.setTienThua(BigDecimal.ZERO);
                ht.setMaGiaoDich("VNPAY");
                ht.setNgayTao(Timestamp.from(Instant.now()));
                ht.setHoaDon(savedHoaDon);
                ht.setMoTa("Thanh Toán online bằng VNPAY");
                ht = hinhThucThanhToanService.save(ht);
                if (request.getUserPrincipal() != null) {
                    user = userService.getByUsername(request.getUserPrincipal().getName());
                    ht.setNguoiTao(user);
                }
                httt.add(ht);
                savedHoaDon.setHinhThucThanhToans(httt);
                HoaDon savedHoaDon2 = hoaDonService.save(savedHoaDon);


                StringBuilder listProduct = new StringBuilder();
                for (int i = 0; i < savedHoaDon2.getHoaDonChiTiets().size(); i++) {
                    HoaDonChiTiet hdct = savedHoaDon2.getHoaDonChiTiets().get(i);
                    if (i > 0) {
                        listProduct.append(",");
                    }
                    listProduct.append(hdct.getChiTietSanPham().getId());
                }
                model.addAttribute("listData", listProduct);

                HoaDonDto hoaDonDto = new HoaDonDto();
                hoaDonDto.setId(savedHoaDon2.getId());
                hoaDonDto.setMaHoaDon(savedHoaDon2.getMaHoaDon());
                hoaDonDto.setTenNguoiNhan(savedHoaDon2.getTenNguoiNhan());
                hoaDonDto.setSdtNhan(savedHoaDon2.getSdtNhan());
                hoaDonDto.setThucThu(savedHoaDon2.getThucThu());
                hoaDonDto.setTrangThai(savedHoaDon2.getTrangThai());

                LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
                lichSuHoaDon.setTrangThaiSauUpdate(TrangThaiHoaDon.ChoXacNhan);
                lichSuHoaDon.setHoaDon(savedHoaDon2);
                lichSuHoaDon.setThoiGian(ConvertUtility.DateToTimestamp(new Date()));
                lichSuHoaDon.setHanhDong("Đặt đơn hàng");
                lichSuHoaDonService.save(lichSuHoaDon);
                if (voucher != null) {
                    voucher.setSoLuong(voucher.getSoLuong() - 1);
                    voucherService.save(voucher);
                }

                JsonArray jsonArray = (JsonArray) session.getAttribute("jsonArray");
                for (JsonElement e : jsonArray) {
                    Long idPDetail = e.getAsJsonObject().get("productDetailId").getAsLong();
                    int quantity = e.getAsJsonObject().get("quantity").getAsInt();
                    HoaDonChiTiet hoaDonChiTiet = new HoaDonChiTiet();
                    ChiTietSanPham chiTietSanPham = chiTietSanPhamService.getById(idPDetail);
                    hoaDonChiTiet.setChiTietSanPham(chiTietSanPham);
                    hoaDonChiTiet.setGiaGoc(chiTietSanPham.getGiaBan());
                    hoaDonChiTiet.setGiaBan(chiTietSanPham.getGiaBan());
                    hoaDonChiTiet.setHoaDon(savedHoaDon2);
                    hoaDonChiTiet.setSoLuong(quantity);
                    hoaDonChiTietService.save(hoaDonChiTiet);
                    chiTietSanPham.setSoLuongTon(chiTietSanPham.getSoLuongTon() - quantity);
                    chiTietSanPhamService.save(chiTietSanPham);
                }
                session.removeAttribute("jsonArray");
                session.removeAttribute(invoiceCode[0]);

                if (request.getUserPrincipal() != null) {
                    user = userService.getByUsername(request.getUserPrincipal().getName());
                    System.out.println(request.getUserPrincipal().getName());
                    GioHang gioHang = gioHangService.findByCustomerId(user.getKhachHang().getId());
                    Long idHoaDon = hoaDonService.getHoaDonByMa(savedHoaDon2.getMaHoaDon()).getId();
                    List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietService.getHoaDonChiTietCuaHoaDonById(idHoaDon);
                    if (gioHang != null) {
                        hoaDonChiTietList.forEach(hoaDonChiTiet -> gioHangChiTietService.deleteByGioHangIdAndChiTietSanPhamId(gioHang.getId(), hoaDonChiTiet.getChiTietSanPham().getId()));
                    }
                }
                Notification notification = new Notification();
                notification.setCreatedBy("N/A");
                notification.setCreatorAvatarUrl("/assets/cms/img/160x160/img1.jpg");
                if (user != null && user.getNhanVien() != null) {
                    notification.setCreatedBy(user.getNhanVien().getHoTen());
                    notification.setCreatorAvatarUrl(user.getAvatar() == null ? "/assets/cms/img/160x160/img1.jpg" : user.getAvatar());
                } else if (user != null && user.getKhachHang() != null) {
                    notification.setCreatedBy(user.getKhachHang().getHoTen());
                    notification.setCreatorAvatarUrl(user.getAvatar() == null ? "/assets/cms/img/160x160/img1.jpg" : user.getAvatar());
                }
                notification.setTitle("Đặt đơn hàng");
                notification.setDescription("Vừa đặt đơn hàng " + savedHoaDon2.getMaHoaDon());
                LocalTime now = LocalTime.now();
                notification.setCreatedTime(now.getHour() + ":" + now.getMinute());
                Notification savedNoti = notificationService.save(notification);
                messagingTemplate.convertAndSend("/topic/newInvoice", hoaDonDto);
                messagingTemplate.convertAndSend("/topic/noti", savedNoti);
                mailUtility.sendMail(hoaDon.getEmailNguoiNhan(), "[LightBee Shop - Đặt hàng thành công]", "Đặt đơn hàng thành công, cảm ơn bạn đã tin tưởng chúng mình! <a href='/oder-tracking?oder=" + savedHoaDon.getMaHoaDon() + "'>Xem chi tiết đơn hàng</a>");
            }
            return "payment/vnpay/order-success";
        } else {
            return "payment/vnpay/order-failed";
        }
    }

    @GetMapping("/orderSuccess")
    @Transactional
    public String orderSuccess(
            @RequestParam("invoiceCode") String invoiceCode,
            @RequestParam("totalAmount") int totalAmount,
            HttpServletRequest request,
            Model model
    ) {
        User user = new User();
        Long idHoaDon = hoaDonService.getHoaDonByMa(invoiceCode).getId();
        List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietService.getHoaDonChiTietCuaHoaDonById(idHoaDon);
        if (request.getUserPrincipal() != null) {
            user = userService.getByUsername(request.getUserPrincipal().getName());
            System.out.println(request.getUserPrincipal().getName());
            GioHang gioHang = gioHangService.findByCustomerId(user.getKhachHang().getId());
            if (gioHang != null) {
                hoaDonChiTietList.forEach(hoaDonChiTiet -> gioHangChiTietService.deleteByGioHangIdAndChiTietSanPhamId(gioHang.getId(), hoaDonChiTiet.getChiTietSanPham().getId()));
            }
        }
        StringBuilder listProduct = new StringBuilder();
        for (int i = 0; i < hoaDonChiTietList.size(); i++) {
            HoaDonChiTiet hdct = hoaDonChiTietList.get(i);
            if (i > 0) {
                listProduct.append(",");
            }
            listProduct.append(hdct.getChiTietSanPham().getId());
        }
        model.addAttribute("listData", listProduct);
        model.addAttribute("invoiceCode", invoiceCode);
        model.addAttribute("total", totalAmount);
        return "payment/vnpay/order-success";
    }

    @GetMapping("/orderFailed")
    public String orderFailed() {
        return "payment/vnpay/order-failed";
    }

}
