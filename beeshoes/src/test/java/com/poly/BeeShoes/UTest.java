package com.poly.BeeShoes;

import com.poly.BeeShoes.constant.TrangThaiHoaDon;
import com.poly.BeeShoes.model.*;
import com.poly.BeeShoes.repository.HoaDonRepository;
import com.poly.BeeShoes.repository.NhanVienRepository;
import com.poly.BeeShoes.repository.NotificationRepository;
import com.poly.BeeShoes.repository.UserRepository;
import com.poly.BeeShoes.utility.ConvertUtility;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.*;

@SpringBootTest
public class UTest {

//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private NhanVienRepository nhanVienRepository;
//
//    @Autowired
//    private HoaDonRepository hoaDonRepository;
//
//    @Autowired
//    private NotificationRepository notificationRepository;
//
//    @Test
//    public void invoice() throws ParseException {
//        String date = "2024-04-12";
//        String date2 = "2024-04-11";
//        List<Object[]> data = hoaDonRepository.getTotalDiscountByHourOfDay(date);
//        List<Object[]> data2 = hoaDonRepository.getTotalDiscountByHourOfDay(date2);
//        data.forEach(item -> {
//            System.out.println(item[0]);
//            System.out.println(item[1]);
//        });
//        data2.forEach(item -> {
//            System.out.println(item[0]);
//            System.out.println(item[1]);
//        });
//    }
//
//    @Test
//    public void testHKH() {
//        Long id = 32L;
//        String email = "ngadtqph28985@fpt.edu.vn";
//        String phoneNumber = "0768241337";
//        String cccd = "010201006558";
//        NhanVien nhanVien = nhanVienRepository.findById(id).get();
//        User user = userRepository.findByNhanVien_Id(id);
//
//        boolean emailExists = userRepository.existsByEmail(email);
//        boolean phoneNumberExists = nhanVienRepository.existsBySdt(phoneNumber);
//        boolean cccdExists = nhanVienRepository.existsByCccd(cccd);
//        System.out.println(emailExists + " " + phoneNumberExists + " " + cccdExists);
//        if (user.getEmail().equalsIgnoreCase(email)) {
//            emailExists = false;
//        }
//        if (nhanVien.getSdt().equalsIgnoreCase(phoneNumber)) {
//            phoneNumberExists = false;
//        }
//        if (nhanVien.getCccd().equalsIgnoreCase(cccd)) {
//            cccdExists = false;
//        }
//        System.out.println(emailExists + " " + phoneNumberExists + " " + cccdExists);
//
//        Map<String, Boolean> result = new HashMap<>();
//        result.put("email", emailExists);
//        result.put("phoneNumber", phoneNumberExists);
//        result.put("cccd", cccdExists);
//
//    }

}
