package com.dev.Hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.repo.CustomerAuthRepository;
import com.dev.Hotel.entity.NhanVien;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private CustomerAuthRepository customerAuthRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find customer first
        var customerAuth = customerAuthRepository.findByEmail(username);
        if (customerAuth.isPresent()) {
            return User.builder()
                .username(customerAuth.get().getKhachHang().getEmail())
                .password(customerAuth.get().getMatKhau())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("CUSTOMER")))
                .build();
        }

        // If not found, try to find employee
        NhanVien nhanVien = nhanVienRepository.findByEmailOrUsername(username, username)
            .orElseThrow(() -> new OurException("Username/Email not Found"));

        // Create UserDetails with employee role
        return User.builder()
            .username(nhanVien.getEmail())
            .password(nhanVien.getPassword())
            .authorities(Collections.singletonList(new SimpleGrantedAuthority("EMPLOYEE")))
            .build();
    }
}
