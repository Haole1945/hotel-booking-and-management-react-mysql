package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PhongDTO {
    
    private String soPhong;
    private Integer tang;
    
    // Hang phong info
    private Integer idHangPhong;
    
    // Kieu phong info
    private String idKp;
    private String tenKp;
    private String moTaKp;
    private Integer soLuongKhachO;
    
    // Loai phong info
    private String idLp;
    private String tenLp;
    private String moTaLp;
    
    // Trang thai info
    private String idTt;
    private String tenTrangThai;
    
    // Images
    private List<String> danhSachAnhUrl;
    
    // Availability info
    private Boolean isAvailable;
}
