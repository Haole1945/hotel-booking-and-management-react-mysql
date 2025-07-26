package com.dev.Hotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "khach_hang")
public class KhachHang {
    @Id
    @NotBlank(message = "CCCD không được để trống")
    @Size(min = 9, max = 20, message = "CCCD phải từ 9-20 ký tự")
    @Column(name = "CCCD")
    private String cccd;

    @NotBlank(message = "Họ không được để trống")
    @Size(max = 50, message = "Họ không được quá 50 ký tự")
    @Column(name = "HO")
    private String ho;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 50, message = "Tên không được quá 50 ký tự")
    @Column(name = "TEN")
    private String ten;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải có 10-11 chữ số")
    @Column(name = "SDT")
    private String sdt;

    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được quá 100 ký tự")
    @Column(name = "EMAIL")
    private String email;

    @Size(max = 200, message = "Địa chỉ không được quá 200 ký tự")
    @Column(name = "DIA_CHI")
    private String diaChi;

    @Size(max = 20, message = "Mã số thuế không được quá 20 ký tự")
    @Column(name = "MA_SO_THUE")
    private String maSoThue;

    @Size(max = 255, message = "Mật khẩu không được quá 255 ký tự")
    @Column(name = "MAT_KHAU")
    private String matKhau;
}