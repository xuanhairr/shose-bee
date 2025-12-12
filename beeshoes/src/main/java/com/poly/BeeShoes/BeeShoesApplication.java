package com.poly.BeeShoes;

import com.poly.BeeShoes.model.ChucVu;
import com.poly.BeeShoes.model.NhanVien;
import com.poly.BeeShoes.model.Role;
import com.poly.BeeShoes.model.User;
import com.poly.BeeShoes.repository.ChucVuReponsitory;
import com.poly.BeeShoes.repository.NhanVienRepository;
import com.poly.BeeShoes.repository.UserRepository;
import com.poly.BeeShoes.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;

@SpringBootApplication
public class BeeShoesApplication {

    private final UserRepository userRepository;
    private final ChucVuReponsitory chucVuReponsitory;

    private final PasswordEncoder passwordEncoder;
    private final NhanVienRepository nhanVienRepository;

    public BeeShoesApplication(UserRepository userRepository, ChucVuReponsitory chucVuReponsitory, PasswordEncoder passwordEncoder, NhanVienRepository nhanVienRepository) {
        this.userRepository = userRepository;
        this.chucVuReponsitory = chucVuReponsitory;
        this.passwordEncoder = passwordEncoder;
        this.nhanVienRepository = nhanVienRepository;
    }


    public static void main(String[] args) {
        SpringApplication.run(BeeShoesApplication.class, args);
    }


    @Bean
    public CommandLineRunner init() {
        return args -> {
            // Kiểm tra xem bảng user có bản ghi nào không
            if (userRepository.count() == 0) {
                // Nếu không có bản ghi, thêm một bản ghi mặc định
                User defaultUser = new User();
                defaultUser.setEmail("admin@gmail.com");
                defaultUser.setPassword(passwordEncoder.encode("123"));
                defaultUser.setRole(Role.ADMIN);
                defaultUser.setTrangThai(true);
                defaultUser.setVerifyAt(Timestamp.from(Instant.now()));
                defaultUser.setNgayTao(Timestamp.from(Instant.now()));
                NhanVien nhanVien = new NhanVien();
                nhanVien.setCccd("000000000000");
                nhanVien.setSdt("0999999999");
                nhanVien.setMaNhanVien("ADMIN");
                nhanVien.setTrangThai(true);
                ChucVu chucVu = chucVuReponsitory.getFirstByTen("Giám Đốc");
                if (chucVu != null) {
                    nhanVien.setChucVu(chucVu);
                } else {
                    chucVu = new ChucVu();
                    chucVu.setTen("Giám Đốc");
                    chucVu.setNgayTao(Timestamp.from(Instant.now()));
                    chucVu = chucVuReponsitory.save(chucVu);
                    nhanVien.setChucVu(chucVu);
                }
                nhanVien.setHoTen("Tuấn Đẹp Trai");
                nhanVien.setNgaySinh(new Date(2001,12,22));
                nhanVien.setSoNha("22B");
                nhanVien.setPhuongXa("Phường Đồng Xuân");
                nhanVien.setQuanHuyen("Quận Hoàn Kiếm");
                nhanVien.setTinhThanhPho("Hà Nội");
                nhanVienRepository.save(nhanVien);
                defaultUser.setNhanVien(nhanVien);
                userRepository.save(defaultUser);
            }
        };
    }
}
