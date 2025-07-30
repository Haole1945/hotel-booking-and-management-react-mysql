package com.dev.Hotel.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    private String token;
    private String role;
    private String expirationTime;
    private String bookingConfirmationCode;

    // Legacy fields removed - using new entity DTOs

    // New entity DTOs
    private NhanVienDTO nhanVien;
    private KhachHangDTO khachHang;
    private PhongDTO phong;
    private PhieuDatDTO phieuDat;
    private PhieuThueDTO phieuThue;
    private HangPhongDTO hangPhong;

    // New entity lists
    private List<NhanVienDTO> nhanVienList;
    private List<KhachHangDTO> khachHangList;
    private List<PhongDTO> phongList;
    private List<PhieuDatDTO> phieuDatList;
    private List<PhieuThueDTO> phieuThueList;
    private List<HangPhongDTO> hangPhongList;

    // Dashboard data
    private Object stats;
    private Object activities;
    private Object tasks;


}
