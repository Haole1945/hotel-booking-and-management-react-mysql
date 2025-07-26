package com.dev.Hotel.repo;

import com.dev.Hotel.entity.LoaiPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoaiPhongRepository extends JpaRepository<LoaiPhong, String> {
    
    Optional<LoaiPhong> findByTenLp(String tenLp);
    
    boolean existsByTenLp(String tenLp);
    
    @Query("SELECT lp FROM LoaiPhong lp WHERE LOWER(lp.tenLp) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    java.util.List<LoaiPhong> findByTenLpContainingIgnoreCase(@Param("keyword") String keyword);
}
