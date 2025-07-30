package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.service.interfac.IKhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/khach-hang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    @Autowired
    private IKhachHangService khachHangService;

    @GetMapping("/all")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllKhachHang() {
        Response response = khachHangService.getAllKhachHang();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{cccd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> getKhachHangById(@PathVariable("cccd") String cccd) {
        Response response = khachHangService.getKhachHangById(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-email/{email}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getKhachHangByEmail(@PathVariable("email") String email) {
        Response response = khachHangService.getKhachHangByEmail(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-sdt/{sdt}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getKhachHangBySdt(@PathVariable("sdt") String sdt) {
        Response response = khachHangService.getKhachHangBySdt(sdt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> createKhachHang(@RequestBody KhachHang khachHang) {
        Response response = khachHangService.createKhachHang(khachHang);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{cccd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> updateKhachHang(@PathVariable("cccd") String cccd, @RequestBody KhachHang khachHang) {
        Response response = khachHangService.updateKhachHang(cccd, khachHang);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{cccd}")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteKhachHang(@PathVariable("cccd") String cccd) {
        Response response = khachHangService.deleteKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/booking-history/{cccd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> getKhachHangBookingHistory(@PathVariable("cccd") String cccd) {
        Response response = khachHangService.getKhachHangBookingHistory(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/search")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> searchKhachHang(@RequestParam("keyword") String keyword) {
        Response response = khachHangService.searchKhachHang(keyword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/find-by-email-or-sdt")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getKhachHangByEmailOrSdt(@RequestParam("emailOrSdt") String emailOrSdt) {
        Response response = khachHangService.getKhachHangByEmailOrSdt(emailOrSdt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/validate")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> validateKhachHang(@RequestBody KhachHang khachHang) {
        Response response = khachHangService.validateKhachHang(khachHang);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/exists-by-email/{email}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable("email") String email) {
        boolean exists = khachHangService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists-by-sdt/{sdt}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Boolean> existsBySdt(@PathVariable("sdt") String sdt) {
        boolean exists = khachHangService.existsBySdt(sdt);
        return ResponseEntity.ok(exists);
    }
}
