package com.dev.Hotel.repo;

import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.KieuPhong;
import com.dev.Hotel.entity.LoaiPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HangPhongRepository extends JpaRepository<HangPhong, Integer> {
    
    List<HangPhong> findByKieuPhong(KieuPhong kieuPhong);
    
    List<HangPhong> findByLoaiPhong(LoaiPhong loaiPhong);
    
    @Query("SELECT hp FROM HangPhong hp WHERE hp.kieuPhong.idKp = :kieuPhongId")
    List<HangPhong> findByKieuPhongId(@Param("kieuPhongId") String kieuPhongId);
    
    @Query("SELECT hp FROM HangPhong hp WHERE hp.loaiPhong.idLp = :loaiPhongId")
    List<HangPhong> findByLoaiPhongId(@Param("loaiPhongId") String loaiPhongId);
    
    @Query("SELECT hp FROM HangPhong hp WHERE hp.kieuPhong.idKp = :kieuPhongId AND hp.loaiPhong.idLp = :loaiPhongId")
    List<HangPhong> findByKieuPhongAndLoaiPhong(@Param("kieuPhongId") String kieuPhongId, @Param("loaiPhongId") String loaiPhongId);
}
