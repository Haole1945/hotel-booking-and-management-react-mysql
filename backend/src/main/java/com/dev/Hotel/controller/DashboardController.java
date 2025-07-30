package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.service.interfac.IDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private IDashboardService dashboardService;

    // Staff Dashboard Endpoints
    @GetMapping("/staff/stats")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getStaffStats() {
        Response response = dashboardService.getStaffStats();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/staff/activities")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getStaffActivities() {
        Response response = dashboardService.getStaffActivities();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/staff/tasks")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getStaffTasks() {
        Response response = dashboardService.getStaffTasks();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Admin Dashboard Endpoints (for future use)
    @GetMapping("/admin/stats")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAdminStats() {
        Response response = dashboardService.getAdminStats();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/top-performers")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAdminTopPerformers() {
        Response response = dashboardService.getAdminTopPerformers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/revenue-data")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAdminRevenueData() {
        Response response = dashboardService.getAdminRevenueData();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Customer Dashboard Endpoints (for future use)
    @GetMapping("/customer/stats")
    //@PreAuthorize("hasAuthority('CUSTOMER') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getCustomerStats(@RequestParam String cccd) {
        Response response = dashboardService.getCustomerStats(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Staff specific endpoints for customer management
    @GetMapping("/staff/recent-customers")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getRecentCustomers() {
        Response response = dashboardService.getRecentCustomers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/staff/today-checkins")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getTodayCheckIns() {
        Response response = dashboardService.getTodayCheckIns();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/staff/today-checkouts")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getTodayCheckOuts() {
        Response response = dashboardService.getTodayCheckOuts();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/staff/pending-reservations")
    //@PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Response> getPendingReservations() {
        Response response = dashboardService.getPendingReservations();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
