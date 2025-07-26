package com.dev.Hotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "loai_phong")
public class LoaiPhong {
    @Id
    @NotBlank(message = "ID loại phòng không được để trống")
    @Size(max = 10, message = "ID loại phòng không được quá 10 ký tự")
    @Column(name = "ID_LP")
    private String idLp;

    @NotBlank(message = "Tên loại phòng không được để trống")
    @Size(max = 100, message = "Tên loại phòng không được quá 100 ký tự")
    @Column(name = "TEN_LP")
    private String tenLp;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    @Column(name = "MO_TA")
    private String moTa;
}