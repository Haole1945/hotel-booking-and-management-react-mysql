package com.dev.Hotel.repo;

import com.dev.Hotel.entity.CustomerAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerAuthRepository extends JpaRepository<CustomerAuth, String> {
    
    @Query("SELECT ca FROM CustomerAuth ca JOIN ca.khachHang k WHERE k.email = :email")
    Optional<CustomerAuth> findByEmail(@Param("email") String email);
    
    @Query("SELECT CASE WHEN COUNT(ca) > 0 THEN true ELSE false END FROM CustomerAuth ca JOIN ca.khachHang k WHERE k.email = :email")
    boolean existsByEmail(@Param("email") String email);
}
