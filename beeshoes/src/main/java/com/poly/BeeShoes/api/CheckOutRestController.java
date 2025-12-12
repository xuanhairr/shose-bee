package com.poly.BeeShoes.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.poly.BeeShoes.constant.TrangThaiHoaDon;
import com.poly.BeeShoes.dto.HoaDonDto;
import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.payment.vnpay.VNPayService;
import com.poly.BeeShoes.service.*;
import com.poly.BeeShoes.utility.ConvertUtility;
import com.poly.BeeShoes.utility.MailUtility;
import com.poly.BeeShoes.utility.Utility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@RestController
@RequestMapping("/check-out")
public class CheckOutRestController {
    @Autowired
    private VNPayService vnPayService;
    @Autowired
    private HoaDonService hoaDonService;
    @Autowired
    private VoucherService voucherService;
    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;
    @Autowired
    private ChiTietSanPhamService chiTietSanPhamService;
    @Autowired
    private UserService userService;
    @Autowired
    private KhachHangService khachHangService;
    @Autowired
    private NhanVienService nhanVienService;
    @Autowired
    private LichSuHoaDonService lichSuHoaDonService;
    @Autowired
    private MailUtility mailUtility;
    @Autowired
    private HinhThucThanhToanService hinhThucThanhToanService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/checkQty-of-prod")
    public ResponseEntity<String> checkQty(
            @RequestBody String listProdDetail
    ) {
        JsonArray jsonArray = JsonParser.parseString(listProdDetail).getAsJsonArray();
        AtomicBoolean check = new AtomicBoolean(true);
        jsonArray.forEach(item -> {
            JsonObject jsonObject = item.getAsJsonObject();
            Long idProdDetail = jsonObject.get("productDetailId").getAsLong();
            int qty = jsonObject.get("quantity").getAsInt();
            ChiTietSanPham prodDetail = chiTietSanPhamService.getById(idProdDetail);
            if (qty > prodDetail.getSoLuongTon()) {
                check.set(false);
            }
        });
        if (check.get()) {
            return new ResponseEntity<>("ok", HttpStatus.OK);
        }
        return ResponseEntity.notFound().header("status", "MaxNum").build();
    }

    @PostMapping("/placeOrder-online")
    public ResponseEntity<String> createOrderOnline(
            @RequestBody String paymentDto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String invoiceCode = hoaDonService.generateInvoiceCode();
        JsonObject jsonObject = JsonParser.parseString(paymentDto).getAsJsonObject();
        String notes = jsonObject.get("notes").getAsString();
        int total = jsonObject.get("total").getAsInt();
        int shippingFee = 0;
        if (jsonObject.get("shippingFee") != null) {
            shippingFee = jsonObject.get("shippingFee").getAsInt();
        }
        int totalAmount = jsonObject.get("totalAmount").getAsInt();
        String voucherCode = null;
        BigDecimal voucherValue = new BigDecimal(0);
        if (jsonObject.get("voucher") != null) {
            voucherCode = jsonObject.get("voucher").getAsString();
        }
        if (jsonObject.get("voucherValue") != null) {
            voucherValue = jsonObject.get("voucherValue").getAsBigDecimal();
        }
        JsonArray jsonArray = jsonObject.getAsJsonArray("productDetail");
        session.setAttribute("jsonArray", jsonArray);

        String customerName = jsonObject.get("customerName").getAsString();
        String customerPhone = jsonObject.get("customerPhone").getAsString();
        String customerEmail = jsonObject.get("customerEmail").getAsString();
        String addressReceive = jsonObject.get("addressReceive").getAsString();
        String orderCode = Utility.randomString(8);
        if (jsonObject.get("orderCode") != null) {
            orderCode = jsonObject.get("orderCode").getAsString();
        }
        HoaDon hoaDon = new HoaDon();
        if (request.getUserPrincipal() != null) {
            User user = userService.getByUsername(request.getUserPrincipal().getName());
            if (user.getNhanVien() == null) {
                KhachHang khachHang = khachHangService.getByMa(user.getKhachHang().getMaKhachHang());
                hoaDon.setKhachHang(khachHang);
            }
        }
        hoaDon.setMaVanChuyen(orderCode);
        hoaDon.setMaHoaDon(invoiceCode);
        hoaDon.setTrangThai(TrangThaiHoaDon.ChoXacNhan);
        hoaDon.setNgayTao(ConvertUtility.DateToTimestamp(new Date()));
        hoaDon.setTongTien(BigDecimal.valueOf(total));
        hoaDon.setSoTienDaThanhToan(BigDecimal.valueOf(totalAmount));
        hoaDon.setGiamGia(voucherValue);
        hoaDon.setThucThu(BigDecimal.valueOf(totalAmount));
        hoaDon.setPhiShip(BigDecimal.valueOf(shippingFee));
        hoaDon.setSdtNhan(customerPhone);
        hoaDon.setTenNguoiNhan(customerName);
        hoaDon.setDiaChiNhan(addressReceive);
        hoaDon.setEmailNguoiNhan(customerEmail);
        Voucher voucher = voucherService.getByMa(voucherCode);
        hoaDon.setVoucher(voucher);
        hoaDon.setLoaiHoaDon(false);

        session.setAttribute(invoiceCode, hoaDon);

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/";
        String vnpUrl = vnPayService.createOrder(invoiceCode, totalAmount, notes, baseUrl);
        return new ResponseEntity<>(vnpUrl, HttpStatus.OK);
    }

    @PostMapping("/placeOrder-whenReceive")
    public ResponseEntity<String> createOrderWhenReceive(
            @RequestBody String paymentDto,
            HttpServletRequest request,
            Model model
    ) {
        JsonObject jsonObject = JsonParser.parseString(paymentDto).getAsJsonObject();
        String notes = jsonObject.get("notes").getAsString();
        int total = jsonObject.get("total").getAsInt();
        int shippingFee = 0;
        if (jsonObject.get("shippingFee") != null) {
            shippingFee = jsonObject.get("shippingFee").getAsInt();
        }
        int totalAmount = jsonObject.get("totalAmount").getAsInt();
        String voucherCode = null;
        BigDecimal voucherValue = new BigDecimal(0);
        if (jsonObject.get("voucher") != null) {
            voucherCode = jsonObject.get("voucher").getAsString();
        }
        if (jsonObject.get("voucherValue") != null || !jsonObject.get("voucherValue").isJsonNull()) {
            voucherValue = jsonObject.get("voucherValue").getAsBigDecimal();
        }
        JsonArray jsonArray = jsonObject.getAsJsonArray("productDetail");
        String customerName = jsonObject.get("customerName").getAsString();
        String customerPhone = jsonObject.get("customerPhone").getAsString();
        String customerEmail = jsonObject.get("customerEmail").getAsString();
        String addressReceive = jsonObject.get("addressReceive").getAsString();
        String orderCode = Utility.randomString(8);
        if (jsonObject.get("orderCode") != null) {
            orderCode = jsonObject.get("orderCode").getAsString();
        }
        HoaDon hoaDon = new HoaDon();
        User user = new User();
        if (request.getUserPrincipal() != null) {
            user = userService.getByUsername(request.getUserPrincipal().getName());
            if (user.getNhanVien() == null) {
                KhachHang khachHang = khachHangService.getByMa(user.getKhachHang().getMaKhachHang());
                hoaDon.setKhachHang(khachHang);
            }
        }
        hoaDon.setMaVanChuyen(orderCode);
        hoaDon.setMaHoaDon(hoaDonService.generateInvoiceCode());
        hoaDon.setTrangThai(TrangThaiHoaDon.ChoXacNhan);
        hoaDon.setNgayTao(ConvertUtility.DateToTimestamp(new Date()));
        hoaDon.setTongTien(BigDecimal.valueOf(total));
        hoaDon.setThucThu(BigDecimal.valueOf(totalAmount));
        hoaDon.setSoTienCanThanhToan(BigDecimal.valueOf(totalAmount));
        hoaDon.setGiamGia(voucherValue);
        hoaDon.setPhiShip(BigDecimal.valueOf(shippingFee));
        hoaDon.setSdtNhan(customerPhone);
        hoaDon.setTenNguoiNhan(customerName);
        hoaDon.setDiaChiNhan(addressReceive);
        hoaDon.setEmailNguoiNhan(customerEmail);
        Voucher voucher = voucherService.getByMa(voucherCode);
        hoaDon.setVoucher(voucher);
        hoaDon.setLoaiHoaDon(false);
        HoaDon savedHoaDon = hoaDonService.save(hoaDon);

        List<HinhThucThanhToan> httt = new ArrayList<>();
        HinhThucThanhToan ht = new HinhThucThanhToan();
        ht.setHinhThuc("Khi Nhận Hàng");
        ht.setTrangThai(false);
        ht.setTienThanhToan(BigDecimal.valueOf(totalAmount));
        ht.setTienThua(BigDecimal.ZERO);
        ht.setMaGiaoDich("COD");
        ht.setNgayTao(Timestamp.from(Instant.now()));
        ht.setHoaDon(savedHoaDon);
        if (request.getUserPrincipal() != null) {
            ht.setNguoiTao(user);
        }
        ht.setMoTa("Thanh Toán Khi Nhận Hàng");
        ht = hinhThucThanhToanService.save(ht);
        httt.add(ht);
        savedHoaDon.setHinhThucThanhToans(httt);
        HoaDon savedHoaDon2 = hoaDonService.save(savedHoaDon);

        HoaDonDto hoaDonDto = new HoaDonDto();
        hoaDonDto.setId(savedHoaDon2.getId());
        hoaDonDto.setMaHoaDon(savedHoaDon2.getMaHoaDon());
        hoaDonDto.setTenNguoiNhan(savedHoaDon2.getTenNguoiNhan());
        hoaDonDto.setSdtNhan(savedHoaDon2.getSdtNhan());
        hoaDonDto.setThucThu(savedHoaDon2.getThucThu());
        hoaDonDto.setTrangThai(savedHoaDon2.getTrangThai());
        messagingTemplate.convertAndSend("/topic/newInvoice", hoaDonDto);

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
        for (JsonElement e : jsonArray) {
            Long idPDetail = e.getAsJsonObject().get("productDetailId").getAsLong();
            int quantity = e.getAsJsonObject().get("quantity").getAsInt();
            HoaDonChiTiet hoaDonChiTiet = new HoaDonChiTiet();
            ChiTietSanPham chiTietSanPham = chiTietSanPhamService.getById(idPDetail);
            hoaDonChiTiet.setChiTietSanPham(chiTietSanPham);
            hoaDonChiTiet.setGiaBan(chiTietSanPham.getGiaBan());
            hoaDonChiTiet.setGiaGoc(chiTietSanPham.getGiaBan());
            hoaDonChiTiet.setHoaDon(savedHoaDon2);
            hoaDonChiTiet.setSoLuong(quantity);
            hoaDonChiTietService.save(hoaDonChiTiet);
            chiTietSanPham.setSoLuongTon(chiTietSanPham.getSoLuongTon() - quantity);
            chiTietSanPhamService.save(chiTietSanPham);

            System.out.println(e.getAsJsonObject().get("productDetailId").getAsInt());
            System.out.println(e.getAsJsonObject().get("quantity").getAsInt());
            System.out.println(notes + " " + totalAmount + " " + voucherCode);
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
        mailUtility.sendMail(customerEmail, "[LightBee Shop - Đặt hàng thành công]", "Đặt đơn hàng thành công, cảm ơn bạn đã tin tưởng chúng mình! <a href='http://localhost:8080/oder-tracking?oder=" + savedHoaDon.getMaHoaDon() + "'>Xem chi tiết đơn hàng</a>");
        String urlRedirect = "/orderSuccess?invoiceCode=" + savedHoaDon.getMaHoaDon() + "&totalAmount=" + savedHoaDon.getThucThu();
        return new ResponseEntity<>(urlRedirect, HttpStatus.OK);
    }

}
