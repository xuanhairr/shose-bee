package com.poly.BeeShoes.api;

import com.poly.BeeShoes.constant.Constant;
import com.poly.BeeShoes.model.HoaDon;
import com.poly.BeeShoes.service.HoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ThongKeRestController {
    private final HoaDonService hoaDonService;

    @GetMapping("/get-arr-count")
    public ResponseEntity<Map<String, Map<Object, Object>>> cntInvByHourOfDay() {
        SimpleDateFormat sdf = new SimpleDateFormat(Constant.DATE_FORMATTER);
        Map<String, Map<Object, Object>> resultMap = new HashMap<>();
        Map<Object, Object> todayMap = new HashMap<>();
        Map<Object, Object> yesterdayMap = new HashMap<>();

        List<Object[]> invToday = hoaDonService.getAllCountCreatedByCreatDate(sdf.format(new Date()));
        invToday.forEach(inv -> todayMap.put(inv[0], inv[1]));

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -1);
        Date yesterdayDate = calendar.getTime();
        String yesterday = sdf.format(yesterdayDate);
        List<Object[]> invYesterday = hoaDonService.getAllCountCreatedByCreatDate(yesterday);
        invYesterday.forEach(inv -> yesterdayMap.put(inv[0], inv[1]));

        resultMap.put("today", todayMap);
        resultMap.put("yesterday", yesterdayMap);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/get-detail-arr-count")
    public ResponseEntity<Map<String, Map<Object, Object>>> getAllCount() {
        SimpleDateFormat sdf = new SimpleDateFormat(Constant.DATE_FORMATTER);
        Map<String, Map<Object, Object>> resultMap = new HashMap<>();
        Map<Object, Object> storeToday = new HashMap<>();
        Map<Object, Object> onlineToday = new HashMap<>();
        Map<Object, Object> storeYesterday = new HashMap<>();
        Map<Object, Object> onlineYesterday = new HashMap<>();
        Map<Object, Object> resultData = new HashMap<>();

        List<Object[]> StoreToDay = hoaDonService.getCountCreatedByCreatDateAndTypeHD(sdf.format(new Date()), true);
        List<Object[]> OnlineToday = hoaDonService.getCountCreatedByCreatDateAndTypeHD(sdf.format(new Date()), false);
        StoreToDay.forEach(inv -> storeToday.put(inv[0], inv[1]));
        OnlineToday.forEach(inv -> onlineToday.put(inv[0], inv[1]));

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -1);
        Date yesterdayDate = calendar.getTime();
        String yesterday = sdf.format(yesterdayDate);
        List<Object[]> StoreYesterday = hoaDonService.getCountCreatedByCreatDateAndTypeHD(yesterday, true);
        StoreYesterday.forEach(inv -> storeYesterday.put(inv[0], inv[1]));
        List<Object[]> OnlineYesterday = hoaDonService.getCountCreatedByCreatDateAndTypeHD(yesterday, false);
        OnlineYesterday.forEach(inv -> onlineYesterday.put(inv[0], inv[1]));

        int quantity_store = 0;
        int quantity_online = 0;
        int total_store_revenue = 0;
        int total_online_revenue = 0;

        Date today = new Date();
        List<HoaDon> lstToDay = hoaDonService.getAllByDate(today);
        for (HoaDon hd : lstToDay) {
            if (hd.isLoaiHoaDon()) {
                quantity_store++;
                total_store_revenue += hd.getThucThu().intValue();
            } else {
                quantity_online++;
                total_online_revenue += hd.getThucThu().intValue();
            }
        }
        resultData.put("quantity_store", quantity_store);
        resultData.put("quantity_online", quantity_online);
        resultData.put("total_store_revenue", total_store_revenue);
        resultData.put("total_online_revenue", total_online_revenue);
        resultMap.put("storeToday", storeToday);
        resultMap.put("onlineToday", onlineToday);
        resultMap.put("storeYesterday", storeYesterday);
        resultMap.put("onlineYesterday", onlineYesterday);
        resultMap.put("data", resultData);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/get-quantity-oder-option")
    public ResponseEntity getQuantity(@RequestParam("start") String start,
                                      @RequestParam("end") String end) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        if (start.equals(end)) {

            DateTimeFormatter formatterInput = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            DateTimeFormatter formatterOutput = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            LocalDate date = LocalDate.parse(start, formatterInput);
            String startFormatted = date.format(formatterOutput);

            Map<Object, Object> storeToday = new HashMap<>();
            Map<Object, Object> onlineToday = new HashMap<>();
            Map<Object, Object> storeYesterday = new HashMap<>();
            Map<Object, Object> onlineYesterday = new HashMap<>();
            Map<Object, Object> resultData = new HashMap<>();

            List<Object[]> StoreToDay = hoaDonService.getCountCreatedByCreatDateAndTypeHD(startFormatted, true);
            StoreToDay.forEach(item -> storeToday.put(item[0], item[1]));
            List<Object[]> OnlineToday = hoaDonService.getCountCreatedByCreatDateAndTypeHD(startFormatted, false);
            OnlineToday.forEach(item -> onlineToday.put(item[0], item[1]));

            LocalDate dateFM = LocalDate.parse(start, formatterInput);
            LocalDate previousDay = dateFM.minusDays(1);
            String yesterday = previousDay.format(formatterOutput);
            List<Object[]> StoreYesterday = hoaDonService.getCountCreatedByCreatDateAndTypeHD(yesterday, true);
            StoreYesterday.forEach(inv -> storeYesterday.put(inv[0], inv[1]));
            List<Object[]> OnlineYesterday = hoaDonService.getCountCreatedByCreatDateAndTypeHD(yesterday, false);
            OnlineYesterday.forEach(inv -> onlineYesterday.put(inv[0], inv[1]));

            int quantity_store = 0;
            int quantity_online = 0;
            int total_store_revenue = 0;
            int total_online_revenue = 0;

            Date today = sdf.parse(start);
            List<HoaDon> lstToDay = hoaDonService.getAllByDate(today);
            for (HoaDon hd : lstToDay) {
                if (hd.isLoaiHoaDon()) {
                    quantity_store++;
                    total_store_revenue += hd.getThucThu().intValue();
                } else {
                    quantity_online++;
                    total_online_revenue += hd.getThucThu().intValue();
                }
            }
            resultData.put("online_today", onlineToday);
            resultData.put("online_yesterday", onlineYesterday);
            resultData.put("store_today", storeToday);
            resultData.put("store_yesterday", storeYesterday);
            resultData.put("quantity_store", quantity_store);
            resultData.put("quantity_online", quantity_online);
            resultData.put("total_store_revenue", total_store_revenue);
            resultData.put("total_online_revenue", total_online_revenue);
            resultData.put("today", start);
            resultData.put("yesterday", previousDay.format(formatterInput));
            resultData.put("check", true);
            return ResponseEntity.ok().body(resultData);
        } else {
            Date startDate = sdf.parse(start);
            Date endDate = sdf.parse(end);

            List<Object[]> store = hoaDonService.getAllRecordsCreatedByDateRange(startDate, endDate, true);
            BigDecimal total_store = hoaDonService.getTotalRevenueByDateRangeAndType(startDate, endDate, true);
            BigDecimal total_online = hoaDonService.getTotalRevenueByDateRangeAndType(startDate, endDate, false);
            List<Object[]> online = hoaDonService.getAllRecordsCreatedByDateRange(startDate, endDate, false);
            Map<Object, Object> response = new HashMap<>();
            Map<LocalDate, Object> store_map = new TreeMap<>();
            Map<LocalDate, Object> online_map = new TreeMap<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            AtomicInteger allCountStore = new AtomicInteger();
            store.forEach(item -> {
                String dateStr = (String) item[0];
                System.out.println(item[0]);
                LocalDate date = LocalDate.parse(dateStr.substring(0, 10), formatter);
                allCountStore.addAndGet(((Long) item[1]).intValue());
                store_map.put(date, ((Long) item[1]).intValue());
            });
            AtomicInteger allCountOnline = new AtomicInteger();
            online.forEach(item -> {
                String dateStr = (String) item[0];
                LocalDate date = LocalDate.parse(dateStr.substring(0, 10), formatter);
                allCountOnline.addAndGet(((Long) item[1]).intValue());
                online_map.put(date, ((Long) item[1]).intValue());
            });
            response.put("store_data", store_map);
            response.put("count_store", allCountStore);
            response.put("total_money_store", total_store.intValue());
            response.put("total_money_online", total_online.intValue());
            response.put("online_data", online_map);
            response.put("count_online", allCountOnline);
            response.put("check", false);
            System.out.println(response);
            return ResponseEntity.ok().body(response);
        }

    }

    @GetMapping("/get-revenue-option")
    public ResponseEntity getRevenue(@RequestParam("start") String start,
                                     @RequestParam("end") String end) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        SimpleDateFormat sdf = new SimpleDateFormat(Constant.DATE_FORMATTER);
        Date startDate = null;
        Date endDate = null;
        Date yesterday = null;

        try {
            startDate = dateFormat.parse(start);
            endDate = dateFormat.parse(end);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            calendar.add(Calendar.DATE, -1);
            yesterday = calendar.getTime();

        } catch (ParseException e) {
            e.printStackTrace();
        }
//        System.out.println(yesterday);
        AtomicInteger total_money = new AtomicInteger();
        if (startDate.equals(endDate)) {
            Map<Object, Object> response = new HashMap<>();
            Map<Object, Object> yesterday_map = new HashMap<>();
            String date = sdf.format(startDate);
            String yester_day = sdf.format(yesterday);
            List<Object[]> data = hoaDonService.getAllRevenueCreatedByCreatDate(date);
            List<Object[]> yesterday_data = hoaDonService.getAllRevenueCreatedByCreatDate(yester_day);
            data.forEach(inv -> {
                BigDecimal money = (BigDecimal) inv[1];
                total_money.addAndGet(money.intValue());
                int moneyResult = money.intValue() / 1000;
                response.put(inv[0], moneyResult);
            });

            yesterday_data.forEach(inv -> {
                BigDecimal money = (BigDecimal) inv[1];
                int moneyResult = money.intValue() / 1000;
                yesterday_map.put(inv[0], moneyResult);
            });

            Map<String, Object> result = new HashMap<>();
            result.put("data", response);
            result.put("yesterday_data", yesterday_map);
            result.put("today_date", date);
            result.put("yesterday_date", yester_day);
            result.put("total_money", total_money.get());
            return ResponseEntity.ok().body(result);
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            Map<LocalDate, Object> response = new TreeMap<>();
            List<Object[]> data = hoaDonService.getAllRevenueCreatedByDateRange(startDate, endDate);
            data.forEach(inv -> {
//                System.out.println(inv[1]);
                String dateStr = (String) inv[0];
                LocalDate date = LocalDate.parse(dateStr.substring(0, 10), formatter);
                BigDecimal money = (BigDecimal) inv[1];
                total_money.addAndGet(money.intValue());
                int moneyResult = money.intValue() / 1000;
                response.put(date, moneyResult);
            });
            Map<String, Object> result = new HashMap<>();
            result.put("data", response);
            result.put("total_money", total_money.get());
            return ResponseEntity.ok().body(result);
        }
    }

    @GetMapping("/get-top-product")
    public ResponseEntity getTopPro(@RequestParam(name = "option") String option) {
        if (option.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        List<HoaDon> lstHD = null;

        if (option.equals("week")) {
            Date today = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(today);
            int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
            int daysToSubtract = (dayOfWeek == Calendar.SUNDAY) ? 6 : (dayOfWeek - Calendar.MONDAY);
            calendar.add(Calendar.DAY_OF_YEAR, -daysToSubtract);
            Date startOfWeek = calendar.getTime();
            lstHD = hoaDonService.getHoaDonBetwent(startOfWeek, today);
        } else if (option.equals("month")) {
            Date end = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(end);
            calendar.set(Calendar.DAY_OF_MONTH, 1);
            Date startDate = calendar.getTime();
            lstHD = hoaDonService.getHoaDonBetwent(startDate, end);
        } else if (option.equals("day")) {
            // Lấy ngày hiện tại
            Date today = new Date();

            // Tạo ngày bắt đầu của hôm nay (00:00:00)
            Calendar calendarStart = Calendar.getInstance();
            calendarStart.setTime(today);
            calendarStart.set(Calendar.HOUR_OF_DAY, 0);
            calendarStart.set(Calendar.MINUTE, 0);
            calendarStart.set(Calendar.SECOND, 0);
            Date startDate = calendarStart.getTime();

            // Tạo ngày kết thúc của hôm nay (23:59:59)
            Calendar calendarEnd = Calendar.getInstance();
            calendarEnd.setTime(today);
            calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
            calendarEnd.set(Calendar.MINUTE, 59);
            calendarEnd.set(Calendar.SECOND, 59);
            Date endDate = calendarEnd.getTime();

            lstHD = hoaDonService.getHoaDonBetwent(startDate, endDate);
        }
        Map<Long, Map<String, Object>> productMap = new HashMap<>();
        lstHD.forEach(order -> {
            order.getHoaDonChiTiets().forEach(item -> {
                long productId = item.getChiTietSanPham().getSanPham().getId();
                int quantity = item.getSoLuong();
                BigDecimal totalRevenue = item.getGiaBan().multiply(BigDecimal.valueOf(quantity));
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
//        System.out.println(top6Products);
        return ResponseEntity.ok().body(top6Products);
    }

}
