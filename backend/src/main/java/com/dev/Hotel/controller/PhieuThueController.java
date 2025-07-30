package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.service.interfac.IPhieuThueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/phieu-thue")
@CrossOrigin(origins = "*")
public class PhieuThueController {

    @Autowired
    private IPhieuThueService phieuThueService;

    @GetMapping("/all")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllPhieuThue() {
        Response response = phieuThueService.getAllPhieuThue();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{idPt}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> getPhieuThueById(@PathVariable("idPt") Integer idPt) {
        Response response = phieuThueService.getPhieuThueById(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> createPhieuThue(@RequestBody PhieuThue phieuThue) {
        Response response = phieuThueService.createPhieuThue(phieuThue);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{idPt}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> updatePhieuThue(@PathVariable("idPt") Integer idPt, @RequestBody PhieuThue phieuThue) {
        Response response = phieuThueService.updatePhieuThue(idPt, phieuThue);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idPt}")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deletePhieuThue(@PathVariable("idPt") Integer idPt) {
        Response response = phieuThueService.deletePhieuThue(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/khach-hang/{cccd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> getPhieuThueByKhachHang(@PathVariable("cccd") String cccd) {
        Response response = phieuThueService.getPhieuThueByKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/nhan-vien/{idNv}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPhieuThueByNhanVien(@PathVariable("idNv") String idNv) {
        Response response = phieuThueService.getPhieuThueByNhanVien(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/phieu-dat/{idPd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPhieuThueByPhieuDat(@PathVariable("idPd") Integer idPd) {
        Response response = phieuThueService.getPhieuThueByPhieuDat(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/current-stays")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getCurrentStays() {
        LocalDate currentDate = LocalDate.now();
        Response response = phieuThueService.getCurrentStays(currentDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/checkin-from-booking/{idPd}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> checkInFromBooking(@PathVariable("idPd") Integer idPd) {
        Response response = phieuThueService.checkInFromBooking(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/checkin-walkin")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> checkInWalkIn(@RequestBody PhieuThue phieuThue) {
        Response response = phieuThueService.checkInWalkIn(phieuThue);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/checkout/{idPt}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> checkOut(@PathVariable("idPt") Integer idPt) {
        Response response = phieuThueService.checkOut(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/extend-stay/{idPt}")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> extendStay(@PathVariable("idPt") Integer idPt, 
                                               @RequestParam("newCheckOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newCheckOut) {
        Response response = phieuThueService.extendStay(idPt, newCheckOut);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/search")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> searchPhieuThue(@RequestParam("keyword") String keyword) {
        Response response = phieuThueService.searchPhieuThue(keyword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/date-range")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPhieuThueByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = phieuThueService.getPhieuThueByDateRange(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/today-checkins")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getTodayCheckIns() {
        Response response = phieuThueService.getTodayCheckIns();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/today-checkouts")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getTodayCheckOuts() {
        Response response = phieuThueService.getTodayCheckOuts();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/occupancy-report")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getOccupancyReport(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Response response = phieuThueService.getOccupancyReport(date);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/revenue-report")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getRevenueReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = phieuThueService.getRevenueReport(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
