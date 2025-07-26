package com.dev.Hotel.repo;

import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhieuDatRepository extends JpaRepository<PhieuDat, Integer> {
    
    List<PhieuDat> findByKhachHang(KhachHang khachHang);
    
    List<PhieuDat> findByNhanVien(NhanVien nhanVien);
    
    List<PhieuDat> findByTrangThai(String trangThai);
    
    @Query("SELECT pd FROM PhieuDat pd WHERE pd.khachHang.cccd = :cccd")
    List<PhieuDat> findByKhachHangCccd(@Param("cccd") String cccd);
    
    @Query("SELECT pd FROM PhieuDat pd WHERE pd.ngayDat BETWEEN :startDate AND :endDate")
    List<PhieuDat> findByNgayDatBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT pd FROM PhieuDat pd WHERE pd.ngayBdThue >= :date AND pd.trangThai = :trangThai")
    List<PhieuDat> findUpcomingBookings(@Param("date") LocalDate date, @Param("trangThai") String trangThai);
}
