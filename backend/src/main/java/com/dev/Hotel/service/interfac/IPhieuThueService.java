package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhieuThue;

import java.time.LocalDate;

public interface IPhieuThueService {
    
    // CRUD operations
    Response getAllPhieuThue();
    Response getPhieuThueById(Integer idPt);
    Response createPhieuThue(PhieuThue phieuThue);
    Response updatePhieuThue(Integer idPt, PhieuThue phieuThue);
    Response deletePhieuThue(Integer idPt);
    
    // Business logic
    Response getPhieuThueByKhachHang(String cccd);
    Response getPhieuThueByNhanVien(String idNv);
    Response getPhieuThueByPhieuDat(Integer idPd);
    Response getCurrentStays(LocalDate currentDate);
    
    // Check-in/Check-out management
    Response checkInFromBooking(Integer idPd);
    Response checkInWalkIn(PhieuThue phieuThue);
    Response checkOut(Integer idPt);
    Response extendStay(Integer idPt, LocalDate newCheckOut);
    
    // Search and filter
    Response searchPhieuThue(String keyword);
    Response getPhieuThueByDateRange(LocalDate startDate, LocalDate endDate);
    Response getTodayCheckIns();
    Response getTodayCheckOuts();
    
    // Reports
    Response getOccupancyReport(LocalDate date);
    Response getRevenueReport(LocalDate startDate, LocalDate endDate);
}
