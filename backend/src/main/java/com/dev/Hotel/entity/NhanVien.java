package com.dev.Hotel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "nhan_vien")
public class NhanVien {
    @Id
    @NotBlank(message = "ID nhân viên không được để trống")
    @Size(max = 10, message = "ID nhân viên không được quá 10 ký tự")
    @Column(name = "ID_NV")
    private String idNv;

    @NotBlank(message = "Họ không được để trống")
    @Size(max = 50, message = "Họ không được quá 50 ký tự")
    @Column(name = "HO")
    private String ho;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 50, message = "Tên không được quá 50 ký tự")
    @Column(name = "TEN")
    private String ten;

    @Pattern(regexp = "^(Nam|Nữ)$", message = "Phái phải là 'Nam' hoặc 'Nữ'")
    @Column(name = "PHAI")
    private String phai;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @Column(name = "NGAY_SINH")
    private LocalDate ngaySinh;

    @Size(max = 200, message = "Địa chỉ không được quá 200 ký tự")
    @Column(name = "DIA_CHI")
    private String diaChi;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải có 10-11 chữ số")
    @Column(name = "SDT")
    private String sdt;

    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được quá 100 ký tự")
    @Column(name = "EMAIL")
    private String email;

    @Size(max = 200, message = "Đường dẫn hình ảnh không được quá 200 ký tự")
    @Column(name = "HINH")
    private String hinh;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
    @Column(name = "USERNAME")
    private String username;

    @JsonIgnore
    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
    @Column(name = "PASSWORD")
    private String password;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_BP")
    private BoPhan boPhan;
}