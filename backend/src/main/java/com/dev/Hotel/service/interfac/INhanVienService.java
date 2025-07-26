package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.LoginRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.NhanVien;

public interface INhanVienService {
    
    // Authentication
    Response login(LoginRequest loginRequest);
    Response register(NhanVien nhanVien);
    
    // CRUD operations
    Response getAllNhanVien();
    Response getNhanVienById(String idNv);
    Response getNhanVienByEmail(String email);
    Response getNhanVienByUsername(String username);
    Response updateNhanVien(String idNv, NhanVien nhanVien);
    Response deleteNhanVien(String idNv);
    
    // Business logic
    Response changePassword(String idNv, String oldPassword, String newPassword);
    Response updateProfile(String idNv, NhanVien nhanVien);
    Response getMyInfo(String email);
    Response getNhanVienByBoPhan(String idBp);
    
    // Admin functions
    Response activateNhanVien(String idNv);
    Response deactivateNhanVien(String idNv);
}
