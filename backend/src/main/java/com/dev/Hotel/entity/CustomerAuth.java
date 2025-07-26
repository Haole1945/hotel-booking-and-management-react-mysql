package com.dev.Hotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "customer_auth")
public class CustomerAuth {
    @Id
    @Column(name = "CCCD")
    private String cccd;

    @JsonIgnore
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    @Column(name = "MAT_KHAU")
    private String matKhau;

    @OneToOne
    @JoinColumn(name = "CCCD", referencedColumnName = "CCCD")
    private KhachHang khachHang;
}
