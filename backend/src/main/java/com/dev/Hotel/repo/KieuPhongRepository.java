package com.dev.Hotel.repo;

import com.dev.Hotel.entity.KieuPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KieuPhongRepository extends JpaRepository<KieuPhong, String> {
    
    Optional<KieuPhong> findByTenKp(String tenKp);
    
    boolean existsByTenKp(String tenKp);
    
    @Query("SELECT kp FROM KieuPhong kp WHERE LOWER(kp.tenKp) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    java.util.List<KieuPhong> findByTenKpContainingIgnoreCase(@Param("keyword") String keyword);
    
    @Query("SELECT kp FROM KieuPhong kp WHERE kp.soLuongKhachO >= :minGuests")
    java.util.List<KieuPhong> findByMinimumGuests(@Param("minGuests") Integer minGuests);
}
