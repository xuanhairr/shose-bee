package com.poly.BeeShoes.controller.cms;

import com.poly.BeeShoes.constant.Constant;
import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.model.SanPham;
import com.poly.BeeShoes.service.HoaDonService;
import com.poly.BeeShoes.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.calculatePercentageChange;

@Controller
@RequestMapping("/cms")
@RequiredArgsConstructor
public class DashboardController {
    private final HoaDonService hoaDonService;
    private final SanPhamService sanPhamService;

    @GetMapping({"/", "", "/index"})
    public String indexDashboard(Model model) {
        SimpleDateFormat sdf = new SimpleDateFormat(Constant.DATE_FORMATTER);
        Date endDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(endDate);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        Date startDate = calendar.getTime();
        List<HoaDon> lstHD = hoaDonService.getHoaDonBetwent(startDate, endDate);
        Date today = new Date();
        Calendar calendar_today = Calendar.getInstance();
        calendar_today.add(Calendar.DATE, -1);
        Date yesterday = calendar_today.getTime();
        List<HoaDon> lstToDay = hoaDonService.getAllByDate(today);
        List<HoaDon> lstYesterDay = hoaDonService.getAllByDate(yesterday);

        // Lấy top 6 sản phẩm có nhiều lượt mua nhất
        Map<Long, Map<String, Object>> productMap = new HashMap<>();
        lstHD.forEach(order -> {
            // Duyệt qua từng hóa đơn chi tiết của mỗi hóa đơn
            order.getHoaDonChiTiets().forEach(item -> {
                long productId = item.getChiTietSanPham().getSanPham().getId();
                int quantity = item.getSoLuong();
                BigDecimal totalRevenue = item.getGiaBan().multiply(BigDecimal.valueOf(quantity));

                // Nếu sản phẩm đã có trong Map, cập nhật thông tin số lượng bán và tổng tiền
                if (productMap.containsKey(productId)) {
                    Map<String, Object> productInfo = productMap.get(productId);
                    int currentQuantity = (int) productInfo.getOrDefault("soLuong", 0);
                    BigDecimal currentTotalRevenue = (BigDecimal) productInfo.getOrDefault("tongTien", BigDecimal.ZERO);
                    productInfo.put("soLuong", currentQuantity + quantity);
                    productInfo.put("tongTien", currentTotalRevenue.add(totalRevenue));
                } else {
                    Map<String, Object> productInfo = new HashMap<>();
                    productInfo.put("id", item.getChiTietSanPham().getSanPham().getId());
                    productInfo.put("ten", item.getChiTietSanPham().getSanPham().getTen());
                    productInfo.put("anh", item.getChiTietSanPham().getSanPham().getMainImage().getUrl());
                    productInfo.put("soLuong", quantity);
                    productInfo.put("tongTien", totalRevenue);
                    productInfo.put("giaBan", item.getChiTietSanPham().getGiaBan());
                    productMap.put(productId, productInfo);
                }
            });
        });
        List<Map<String, Object>> top6Products = productMap.values().stream()
                .sorted((p1, p2) -> Integer.compare((int) p2.get("soLuong"), (int) p1.get("soLuong")))
                .limit(10)
                .collect(Collectors.toList());

        Date date = new Date();
        String td = sdf.format(date);
        AtomicInteger total_money_today = new AtomicInteger();
        List<Object[]> data = hoaDonService.getAllRevenueCreatedByCreatDate(td);
        data.forEach(inv -> {
            BigDecimal money = (BigDecimal) inv[1];
            total_money_today.addAndGet(money.intValue());
        });
        int totalMoneyInt = total_money_today.get() / 1000;
        total_money_today.set(totalMoneyInt);

        int quantity_oder_today = lstToDay.size();
        int quantity_oder_yesterday = lstYesterDay.size();

        int total_yesterday = 0;
        int total_Today = 0;

        int total_store_yesterday = 0;
        int total_store_today = 0;
        int total_online_yesterday = 0;
        int total_online_today = 0;

        for (HoaDon hd : lstYesterDay) {
            total_yesterday += hd.getThucThu().intValue();
            if (hd.isLoaiHoaDon()) {
                total_store_yesterday += hd.getThucThu().intValue();
            } else {
                total_online_yesterday += hd.getThucThu().intValue();
            }
        }
        int quantity_online = 0;
        int quantity_store = 0;
        int quantity_numoder_discount = 0;
        for (HoaDon hd : lstToDay) {
            total_Today += hd.getThucThu().intValue();
            if (hd.isLoaiHoaDon()) {
                total_store_today += hd.getThucThu().intValue();
                quantity_store++;
            } else {
                total_online_today += hd.getThucThu().intValue();
                quantity_online++;
            }
            if (hd.getVoucher() != null) {
                quantity_numoder_discount++;
            }

        }
        List<SanPham> prList = sanPhamService.findByChiTietSanPham_SoLuongTonLessThan();
        Map<String, Object> online_data = createDataMap(total_online_today, quantity_online, calculatePercentageChange(total_online_yesterday, total_online_today), total_online_today >= total_online_yesterday);
        Map<String, Object> total_all_data = createDataMap(total_Today, lstToDay.size(), calculatePercentageChange(total_yesterday, total_Today), total_Today >= total_yesterday);
        Map<String, Object> in_store_data = createDataMap(total_store_today, quantity_store, calculatePercentageChange(total_store_yesterday, total_store_today), total_store_today >= total_store_yesterday);


        String dateToDay = sdf.format(today);
        String dateYesterday = sdf.format(yesterday);
        List<Object[]> discount = hoaDonService.getTotalDiscountByHourOfDay(dateToDay);
        List<Object[]> discount_yesterday = hoaDonService.getTotalDiscountByHourOfDay(dateYesterday);
        StringBuilder Labels = new StringBuilder();
        StringBuilder Values_today = new StringBuilder();
        StringBuilder Values_yesterday = new StringBuilder();
        int total_discount = 0;
        for (int i = 0; i < discount.size(); i++) {
            if (i > 0) {
                Labels.append("-");
                Values_today.append("-");
            }
            Object[] item = discount.get(i);
            BigDecimal money = (BigDecimal) item[1];
            total_discount += money.intValue();
            Labels.append(item[0]);
            Values_today.append(money.intValue() / 1000);
        }
        int total_yester = 0;
        for (int i = 0; i < discount_yesterday.size(); i++) {
            if (i > 0) {
                Values_yesterday.append("-");
            }
            Object[] item = discount_yesterday.get(i);
            BigDecimal money = (BigDecimal) item[1];
            total_yester += money.intValue();
            Values_yesterday.append(money.intValue() / 1000);
        }
        Map<Object, Object> discountChart = new HashMap<>();
        discountChart.put("value_yesterday", Values_yesterday);
        discountChart.put("value_today", Values_today);
        discountChart.put("number_discount", quantity_numoder_discount);
        discountChart.put("present", calculatePercentageChange(total_yester, total_discount));
        discountChart.put("direction", total_discount >= total_yester);
        discountChart.put("label", Labels);
        discountChart.put("total", total_discount);
        model.addAttribute("discount_chart", discountChart);
        model.addAttribute("product_less", prList);
        model.addAttribute("top_products", top6Products);
        model.addAttribute("online_data", online_data);
        model.addAttribute("total_money_today", total_money_today);
        model.addAttribute("quantity_oder_today", quantity_oder_today);
        model.addAttribute("quantity_oder_present", calculatePercentageChange(quantity_oder_yesterday, quantity_oder_today));
        model.addAttribute("quantity_oder_direction", quantity_oder_today >= quantity_oder_yesterday);
        model.addAttribute("total_all_data", total_all_data);
        model.addAttribute("in_store_data", in_store_data);
        return "cms/index";
    }

    public Map<String, Object> createDataMap(int total, int numOder, double percent, boolean direction) {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("total", total);
        dataMap.put("numOder", numOder);
        dataMap.put("percent", percent);
        dataMap.put("direction", direction);
        return dataMap;
    }
}
