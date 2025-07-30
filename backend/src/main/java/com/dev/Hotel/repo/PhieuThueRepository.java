package com.dev.Hotel.repo;

import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.entity.PhieuDat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhieuThueRepository extends JpaRepository<PhieuThue, Integer> {
    
    List<PhieuThue> findByKhachHang(KhachHang khachHang);
    
    List<PhieuThue> findByNhanVien(NhanVien nhanVien);
    
    List<PhieuThue> findByPhieuDat(PhieuDat phieuDat);
    
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.khachHang.cccd = :cccd")
    List<PhieuThue> findByKhachHangCccd(@Param("cccd") String cccd);
    
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.ngayDen BETWEEN :startDate AND :endDate")
    List<PhieuThue> findByNgayDenBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.ngayDi BETWEEN :startDate AND :endDate")
    List<PhieuThue> findByNgayDiBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.ngayDen <= :currentDate AND pt.ngayDi >= :currentDate")
    List<PhieuThue> findCurrentStays(@Param("currentDate") LocalDate currentDate);

    // Dashboard specific queries
    @Query("SELECT COUNT(pt) FROM PhieuThue pt WHERE pt.ngayDen = :date")
    long countByNgayNhanPhong(@Param("date") LocalDate date);

    @Query("SELECT COUNT(pt) FROM PhieuThue pt WHERE pt.ngayDi = :date")
    long countByNgayTraPhong(@Param("date") LocalDate date);

    @Query("SELECT pt FROM PhieuThue pt WHERE pt.ngayDi = :date")
    List<PhieuThue> findByNgayTraPhong(@Param("date") LocalDate date);
}
