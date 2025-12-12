package com.poly.BeeShoes.controller;

import com.poly.BeeShoes.dto.ChangePasswordDto;
import com.poly.BeeShoes.dto.LoginDto;
import com.poly.BeeShoes.dto.RegisterDto;
import com.poly.BeeShoes.library.LibService;
import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.model.Role;
import com.poly.BeeShoes.model.User;
import com.poly.BeeShoes.service.HangKhachHangService;
import com.poly.BeeShoes.service.KhachHangService;
import com.poly.BeeShoes.service.UserService;
import com.poly.BeeShoes.utility.ConvertUtility;
import com.poly.BeeShoes.utility.MailUtility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequiredArgsConstructor
public class LoginRegisterController {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final KhachHangService khachHangService;
    private final HangKhachHangService hangKhachHangService; // page đăng ký nmmowr cho em
    private final MailUtility mailUtility;

    @GetMapping("/login")
    public String formLogin(Model model) {
        model.addAttribute("loginDto", new LoginDto());
        return "customer/auth/login";
    }

    @GetMapping("/login-handle")
    public String afterHandleLogin(Model model) {
        model.addAttribute("loginDto", new LoginDto());
        return "redirect:/login";
    }

    @GetMapping("/register")
    public String formRegister(Model model) {
        model.addAttribute("registerDto", new RegisterDto());
        return "customer/auth/register";
    }

    @GetMapping("/change-password")
    public String change(Model model) {
        model.addAttribute("newMessage", "");
        model.addAttribute("confirmMessage", "");
        model.addAttribute("changePassword", new ChangePasswordDto());
        return "customer/auth/change-password";
    }

    @PostMapping("/change-password")
    public String changePas(@ModelAttribute ChangePasswordDto dto, Model model) {
        String regex = "^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$";
        if (!dto.getNewPassword().matches(regex)) {
            model.addAttribute("newMessage", "Mật khẩu mới không hợp lệ.");
            return "customer/auth/change-password";
        }
        System.out.println(dto);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userService.getByUsername(userDetails.getUsername());
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            model.addAttribute("confirmMessage", "Nhập lại mật khẩu không khớp.");
            return "customer/auth/change-password";
        }
        String encodedOldPassword = user.getPassword();
        if (passwordEncoder.matches(dto.getPassword(), encodedOldPassword)) {
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            userService.update(user);
            return "redirect:/";
        } else {
            model.addAttribute("message", "Mật khẩu cũ không đúng.");
            return "customer/auth/change-password";
        }
    }

    @GetMapping("/forgot-password")
    public String forgot() {
        return "customer/auth/forgot-password";
    }

    @PostMapping("/forgot-password")
    public String forgotPass(@RequestParam("email") String email, Model model) {
        boolean exists = userService.existsByEmail(email);
        if (!exists) {
            model.addAttribute("message", "Email không tồn tại.");
            return "customer/auth/forgot-password";
        } else {
            User user = userService.getByUsername(email);
            String password = LibService.generateRandomString(10);
            user.setPassword(passwordEncoder.encode(password));
            userService.update(user);
            String tb = "Bạn đã tiến hàng yêu cầu mật khẩu mới !";
            String body = "<h1>mật khẩu mới !</h1><h2>email đăng nhập là : " + user.getEmail() + "</h2><h2>Mật Khẩu là : " + password + "</h2>";
            mailUtility.sendMail(user.getEmail(), tb, body);
        }
        return "redirect:/login";
    }


    @PostMapping("/login-handle")
    public String login(
            @Valid @ModelAttribute LoginDto loginDto,
            BindingResult bindingResult,
            HttpServletRequest request,
            HttpSession session,
            Model model
    ) {
        if (bindingResult.hasErrors()) {
            return "customer/auth/login";
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
            );
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
            User user = userService.getByUsername(authentication.getName());
            if (user.getRole() != Role.CUSTOMER) {
                return "redirect:/cms";
            }
            return "redirect:/";
        } catch (AuthenticationException ex) {
            ex.printStackTrace();
            model.addAttribute("message", "Sai email hoặc mật khẩu !");
            return "customer/auth/login";
        }
    }

    @PostMapping("/register")
    @Transactional
    public String register(
            @Valid @ModelAttribute RegisterDto registerDto,
            BindingResult bindingResult,
            HttpServletRequest request,
            HttpSession session,
            Model model
    ) {
        if (bindingResult.hasErrors()) {
            return "customer/auth/register";
        } else {
            if (userService.existByUsername(registerDto.getEmail())) {
                model.addAttribute("email", "Email đã tồn tại!");
                return "customer/auth/register";
            } else {
                try {
                    KhachHang khachHang = new KhachHang();
                    khachHang.setHoTen(registerDto.getHo() + " " + registerDto.getTenDem() + " " + registerDto.getTen());
                    khachHang.setTrangThai(true);
                    khachHang.setDiem(0);
                    khachHang.setNgayTao(ConvertUtility.DateToTimestamp(new Date()));
                    khachHang.setGioiTinh(registerDto.isGioiTinh());
                    khachHang.setSdt(registerDto.getSdt());
                    khachHang.setMaKhachHang(khachHangService.generateCustomerCode());
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date date = sdf.parse(registerDto.getNgaySinh());
                    khachHang.setNgaySinh(new java.sql.Date(date.getTime()));
                    KhachHang createdKhachHang = khachHangService.add(khachHang);

                    User user = new User();
                    user.setEmail(registerDto.getEmail());
                    user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
                    user.setTrangThai(true); // true = active
                    user.setKhachHang(khachHang);
                    user.setRole(Role.CUSTOMER);
                    user.setNgayTao(ConvertUtility.DateToTimestamp(new Date()));
                    User createdUser = userService.createNewUser(user);

                    if (createdKhachHang == null || createdUser == null) {
                        throw new RuntimeException("Lỗi khi tạo mới khách hàng , vui lòng thử lại!");
                    } else {
                        Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(registerDto.getEmail(), registerDto.getPassword())
                        );
                        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                        securityContext.setAuthentication(authentication);
                        session = request.getSession(true);
                        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
                        User userTest = (User) authentication.getPrincipal();
                        System.out.println("hi " + userTest.getKhachHang().getHoTen());
                        return "redirect:/light-bee/";
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                    model.addAttribute("message", "Lỗi khi tạo mới khách hàng , vui lòng thử lại!");
                    return "customer/auth/register";
                }
            }
        }
    }

    @GetMapping("/unauthorized")
    public String unauthorized() {
        return "cms/error/401";
    }
}
