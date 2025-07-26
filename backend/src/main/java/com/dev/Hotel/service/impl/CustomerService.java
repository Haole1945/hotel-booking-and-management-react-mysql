package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.CustomerRegisterRequest;
import com.dev.Hotel.dto.LoginRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.CustomerAuth;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.CustomerAuthRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.service.interfac.ICustomerService;
import com.dev.Hotel.utils.JWTUtils;
import com.dev.Hotel.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService implements ICustomerService {

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private CustomerAuthRepository customerAuthRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public Response registerCustomer(CustomerRegisterRequest request) {
        Response response = new Response();
        try {
            // Check if CCCD already exists
            if (khachHangRepository.existsById(request.getCccd())) {
                throw new OurException("CCCD đã được sử dụng");
            }

            // Check if email already exists
            if (customerAuthRepository.existsByEmail(request.getEmail())) {
                throw new OurException("Email đã được sử dụng");
            }

            // Create new KhachHang
            KhachHang khachHang = new KhachHang();
            khachHang.setCccd(request.getCccd());
            khachHang.setHo(request.getHo());
            khachHang.setTen(request.getTen());
            khachHang.setSdt(request.getSdt());
            khachHang.setEmail(request.getEmail());
            khachHang.setDiaChi(request.getDiaChi());
            khachHang.setMaSoThue(request.getMaSoThue());

            // Save KhachHang
            KhachHang savedKhachHang = khachHangRepository.save(khachHang);

            // Create CustomerAuth
            CustomerAuth customerAuth = new CustomerAuth();
            customerAuth.setCccd(request.getCccd());
            customerAuth.setMatKhau(passwordEncoder.encode(request.getMatKhau()));
            customerAuth.setKhachHang(savedKhachHang);

            // Save CustomerAuth
            customerAuthRepository.save(customerAuth);

            // Prepare response
            response.setStatusCode(200);
            response.setMessage("Đăng ký thành công");
            response.setKhachHang(Utils.mapKhachHangEntityToKhachHangDTO(savedKhachHang));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Có lỗi xảy ra trong quá trình đăng ký: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response loginCustomer(LoginRequest loginRequest) {
        Response response = new Response();
        try {
            // Find customer by email
            var customerAuth = customerAuthRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new OurException("Email hoặc mật khẩu không đúng"));

            // Authenticate customer
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMatKhau())
            );

            // Generate JWT token using KhachHang email
            var token = jwtUtils.generateTokenForCustomer(customerAuth.getKhachHang());

            // Prepare response
            response.setStatusCode(200);
            response.setMessage("Đăng nhập thành công");
            response.setToken(token);
            response.setRole("CUSTOMER");
            response.setExpirationTime("7 Days");
            response.setKhachHang(Utils.mapKhachHangEntityToKhachHangDTO(customerAuth.getKhachHang()));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Có lỗi xảy ra trong quá trình đăng nhập: " + e.getMessage());
        }
        return response;
    }
}
