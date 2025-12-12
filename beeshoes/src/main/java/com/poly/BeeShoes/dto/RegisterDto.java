package com.poly.BeeShoes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterDto {
    @NotBlank(message = "Vui lòng nhập email !")
    @Email(message = "Vui lòng nhập đúng định dạng email !")
    String email;

    @Pattern(regexp = "^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$", flags = Pattern.Flag.UNICODE_CASE, message = "Vui lòng nhập đúng định dạng mật khẩu!")
    String password;

    @NotBlank(message = "Vui lòng nhập họ !")
    String ho;

    @NotBlank(message = "Vui lòng nhập tên đệm !")
    String tenDem;

    @NotBlank(message = "Vui lòng nhập tên !")
    String ten;

    @NotNull(message = "Vui lòng chọn giới tính !")
    boolean gioiTinh;

    @NotBlank(message = "Vui lòng chọn ngày sinh !")
    String ngaySinh;

    @NotBlank(message = "Vui lòng nhập số di động !")
    String sdt;
}
