package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.service.interfac.IPhieuDatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/phieu-dat")
@CrossOrigin(origins = "*")
public class PhieuDatController {

    @Autowired
    private IPhieuDatService phieuDatService;

    @GetMapping("/all")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllPhieuDat() {
        Response response = phieuDatService.getAllPhieuDat();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{idPd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> getPhieuDatById(@PathVariable("idPd") Integer idPd) {
        Response response = phieuDatService.getPhieuDatById(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> createPhieuDat(@RequestBody PhieuDat phieuDat) {
        Response response = phieuDatService.createPhieuDat(phieuDat);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{idPd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> updatePhieuDat(@PathVariable("idPd") Integer idPd, @RequestBody PhieuDat phieuDat) {
        Response response = phieuDatService.updatePhieuDat(idPd, phieuDat);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idPd}")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deletePhieuDat(@PathVariable("idPd") Integer idPd) {
        Response response = phieuDatService.deletePhieuDat(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/khach-hang/{cccd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> getPhieuDatByKhachHang(@PathVariable("cccd") String cccd) {
        Response response = phieuDatService.getPhieuDatByKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/nhan-vien/{idNv}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPhieuDatByNhanVien(@PathVariable("idNv") String idNv) {
        Response response = phieuDatService.getPhieuDatByNhanVien(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/trang-thai/{trangThai}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPhieuDatByTrangThai(@PathVariable("trangThai") String trangThai) {
        Response response = phieuDatService.getPhieuDatByTrangThai(trangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/date-range")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPhieuDatByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = phieuDatService.getPhieuDatByDateRange(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/confirm/{idPd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> confirmBooking(@PathVariable("idPd") Integer idPd) {
        Response response = phieuDatService.confirmBooking(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/cancel/{idPd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> cancelBooking(@PathVariable("idPd") Integer idPd, @RequestParam("reason") String reason) {
        Response response = phieuDatService.cancelBooking(idPd, reason);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-status/{idPd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateBookingStatus(@PathVariable("idPd") Integer idPd, @RequestParam("trangThai") String trangThai) {
        Response response = phieuDatService.updateBookingStatus(idPd, trangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Staff specific endpoints
    @GetMapping("/khach-hang/recent")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getRecentBookingsByCustomer(@RequestParam("cccd") String cccd) {
        Response response = phieuDatService.getPhieuDatByKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/pending")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPendingBookings() {
        Response response = phieuDatService.getPhieuDatByTrangThai("Chờ xác nhận");
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/today")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getTodayBookings() {
        LocalDate today = LocalDate.now();
        Response response = phieuDatService.getPhieuDatByDateRange(today, today);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/confirmed")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getConfirmedBookings() {
        Response response = phieuDatService.getConfirmedBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
