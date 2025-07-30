package com.dev.Hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.entity.NhanVien;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find customer first
        var khachHang = khachHangRepository.findByEmail(username);
        if (khachHang.isPresent()) {
            return User.builder()
                .username(khachHang.get().getEmail())
                .password(khachHang.get().getMatKhau())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("CUSTOMER")))
                .build();
        }

        // If not found, try to find employee
        NhanVien nhanVien = nhanVienRepository.findByEmailOrUsernameWithBoPhan(username, username)
            .orElseThrow(() -> new OurException("Username/Email not Found"));

        // Determine role based on department
        String role = determineUserRole(nhanVien);

        // Create UserDetails with appropriate role
        return User.builder()
            .username(nhanVien.getEmail())
            .password(nhanVien.getPassword())
            .authorities(Collections.singletonList(new SimpleGrantedAuthority(role)))
            .build();
    }

    /**
     * Determine user role based on department
     */
    private String determineUserRole(NhanVien nhanVien) {
        if (nhanVien.getBoPhan() == null) {
            return "EMPLOYEE"; // Default role
        }

        String tenBoPhan = nhanVien.getBoPhan().getTenBp();
        if (tenBoPhan == null) {
            return "EMPLOYEE";
        }

        // Check for admin/management roles
        if (tenBoPhan.toLowerCase().contains("quản lý") ||
            tenBoPhan.toLowerCase().contains("Admin") ||
            tenBoPhan.toLowerCase().contains("giám đốc")) {
            return "ADMIN";
        }

        // All other departments are employees
        return "EMPLOYEE";
    }
}
