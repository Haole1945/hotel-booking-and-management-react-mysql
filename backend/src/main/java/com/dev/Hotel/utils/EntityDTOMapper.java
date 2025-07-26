package com.dev.Hotel.utils;

import com.dev.Hotel.dto.*;
import com.dev.Hotel.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class EntityDTOMapper {
    
    // NhanVien mapping
    public static NhanVienDTO mapNhanVienToDTO(NhanVien nhanVien) {
        if (nhanVien == null) return null;
        
        NhanVienDTO dto = new NhanVienDTO();
        dto.setIdNv(nhanVien.getIdNv());
        dto.setHo(nhanVien.getHo());
        dto.setTen(nhanVien.getTen());
        dto.setPhai(nhanVien.getPhai());
        dto.setNgaySinh(nhanVien.getNgaySinh());
        dto.setDiaChi(nhanVien.getDiaChi());
        dto.setSdt(nhanVien.getSdt());
        dto.setEmail(nhanVien.getEmail());
        dto.setHinh(nhanVien.getHinh());
        dto.setUsername(nhanVien.getUsername());
        
        if (nhanVien.getBoPhan() != null) {
            dto.setIdBp(nhanVien.getBoPhan().getIdBp());
            dto.setTenBp(nhanVien.getBoPhan().getTenBp());
        }
        
        return dto;
    }
    
    // KhachHang mapping
    public static KhachHangDTO mapKhachHangToDTO(KhachHang khachHang) {
        if (khachHang == null) return null;
        
        KhachHangDTO dto = new KhachHangDTO();
        dto.setCccd(khachHang.getCccd());
        dto.setHo(khachHang.getHo());
        dto.setTen(khachHang.getTen());
        dto.setSdt(khachHang.getSdt());
        dto.setEmail(khachHang.getEmail());
        dto.setDiaChi(khachHang.getDiaChi());
        dto.setMaSoThue(khachHang.getMaSoThue());
        
        return dto;
    }
    
    // Phong mapping
    public static PhongDTO mapPhongToDTO(Phong phong) {
        if (phong == null) return null;
        
        PhongDTO dto = new PhongDTO();
        dto.setSoPhong(phong.getSoPhong());
        dto.setTang(phong.getTang());
        
        if (phong.getHangPhong() != null) {
            dto.setIdHangPhong(phong.getHangPhong().getIdHangPhong());
            
            if (phong.getHangPhong().getKieuPhong() != null) {
                dto.setIdKp(phong.getHangPhong().getKieuPhong().getIdKp());
                dto.setTenKp(phong.getHangPhong().getKieuPhong().getTenKp());
                dto.setMoTaKp(phong.getHangPhong().getKieuPhong().getMoTa());
                dto.setSoLuongKhachO(phong.getHangPhong().getKieuPhong().getSoLuongKhachO());
            }
            
            if (phong.getHangPhong().getLoaiPhong() != null) {
                dto.setIdLp(phong.getHangPhong().getLoaiPhong().getIdLp());
                dto.setTenLp(phong.getHangPhong().getLoaiPhong().getTenLp());
                dto.setMoTaLp(phong.getHangPhong().getLoaiPhong().getMoTa());
            }
        }
        
        if (phong.getTrangThai() != null) {
            dto.setIdTt(phong.getTrangThai().getIdTt());
            dto.setTenTrangThai(phong.getTrangThai().getTenTrangThai());
            dto.setIsAvailable("Trống".equals(phong.getTrangThai().getTenTrangThai()));
        }
        
        return dto;
    }
    
    // PhieuDat mapping
    public static PhieuDatDTO mapPhieuDatToDTO(PhieuDat phieuDat) {
        if (phieuDat == null) return null;
        
        PhieuDatDTO dto = new PhieuDatDTO();
        dto.setIdPd(phieuDat.getIdPd());
        dto.setNgayDat(phieuDat.getNgayDat());
        dto.setNgayBdThue(phieuDat.getNgayBdThue());
        dto.setNgayDi(phieuDat.getNgayDi());
        dto.setTrangThai(phieuDat.getTrangThai());
        dto.setSoTienCoc(phieuDat.getSoTienCoc());
        
        if (phieuDat.getKhachHang() != null) {
            dto.setCccd(phieuDat.getKhachHang().getCccd());
            dto.setHoTenKhachHang(phieuDat.getKhachHang().getHo() + " " + phieuDat.getKhachHang().getTen());
            dto.setSdtKhachHang(phieuDat.getKhachHang().getSdt());
            dto.setEmailKhachHang(phieuDat.getKhachHang().getEmail());
        }
        
        if (phieuDat.getNhanVien() != null) {
            dto.setIdNv(phieuDat.getNhanVien().getIdNv());
            dto.setHoTenNhanVien(phieuDat.getNhanVien().getHo() + " " + phieuDat.getNhanVien().getTen());
        }
        
        // Audit fields
        dto.setCreatedAt(phieuDat.getCreatedAt());
        dto.setUpdatedAt(phieuDat.getUpdatedAt());
        dto.setCreatedBy(phieuDat.getCreatedBy());
        dto.setUpdatedBy(phieuDat.getUpdatedBy());
        
        return dto;
    }
    
    // List mapping methods
    public static List<NhanVienDTO> mapNhanVienListToDTO(List<NhanVien> nhanVienList) {
        return nhanVienList.stream().map(EntityDTOMapper::mapNhanVienToDTO).collect(Collectors.toList());
    }
    
    public static List<KhachHangDTO> mapKhachHangListToDTO(List<KhachHang> khachHangList) {
        return khachHangList.stream().map(EntityDTOMapper::mapKhachHangToDTO).collect(Collectors.toList());
    }
    
    public static List<PhongDTO> mapPhongListToDTO(List<Phong> phongList) {
        return phongList.stream().map(EntityDTOMapper::mapPhongToDTO).collect(Collectors.toList());
    }
    
    public static List<PhieuDatDTO> mapPhieuDatListToDTO(List<PhieuDat> phieuDatList) {
        return phieuDatList.stream().map(EntityDTOMapper::mapPhieuDatToDTO).collect(Collectors.toList());
    }
}
