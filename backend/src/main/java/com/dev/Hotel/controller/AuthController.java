package com.dev.Hotel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.Hotel.dto.CustomerRegisterRequest;
import com.dev.Hotel.dto.LoginRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.service.interfac.INhanVienService;
import com.dev.Hotel.service.interfac.ICustomerService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private INhanVienService nhanVienService;

    @Autowired
    private ICustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody CustomerRegisterRequest request) {
        Response response = customerService.registerCustomer(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/register-staff")
    public ResponseEntity<Response> registerStaff(@RequestBody NhanVien nhanVien) {
        Response response = nhanVienService.register(nhanVien);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest) {
        // Try customer login first, then staff login
        Response response = customerService.loginCustomer(loginRequest);
        if (response.getStatusCode() != 200) {
            response = nhanVienService.login(loginRequest);
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
