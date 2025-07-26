package com.dev.Hotel.repo;

import com.dev.Hotel.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, String> {
    
    boolean existsByEmail(String email);
    
    boolean existsBySdt(String sdt);
    
    Optional<KhachHang> findByEmail(String email);
    
    Optional<KhachHang> findBySdt(String sdt);
    
    @Query("SELECT kh FROM KhachHang kh WHERE kh.email = :email OR kh.sdt = :sdt")
    Optional<KhachHang> findByEmailOrSdt(@Param("email") String email, @Param("sdt") String sdt);
}
