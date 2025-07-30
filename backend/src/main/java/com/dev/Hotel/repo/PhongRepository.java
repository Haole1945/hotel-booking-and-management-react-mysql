package com.dev.Hotel.repo;

import com.dev.Hotel.entity.Phong;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhongRepository extends JpaRepository<Phong, String> {
    
    List<Phong> findByHangPhong(HangPhong hangPhong);
    
    List<Phong> findByTrangThai(TrangThai trangThai);
    
    List<Phong> findByTang(Integer tang);
    
    @Query("SELECT p FROM Phong p WHERE p.hangPhong.idHangPhong = :hangPhongId")
    List<Phong> findByHangPhongId(@Param("hangPhongId") Integer hangPhongId);
    
    @Query("SELECT p FROM Phong p WHERE p.trangThai.idTt = :trangThaiId")
    List<Phong> findByTrangThaiId(@Param("trangThaiId") String trangThaiId);
    
    @Query("SELECT p FROM Phong p WHERE p.trangThai.tenTrangThai = 'Trống'")
    List<Phong> findAvailableRooms();

    @Query("SELECT p FROM Phong p WHERE p.trangThai.tenTrangThai = 'Đã có khách'")
    List<Phong> findOccupiedRooms();

    @Query("SELECT p FROM Phong p WHERE p.trangThai.tenTrangThai = 'Đang bảo trì'")
    List<Phong> findMaintenanceRooms();

    @Query("SELECT p FROM Phong p WHERE p.trangThai.tenTrangThai = 'Đang dọn dẹp'")
    List<Phong> findCleaningRooms();

    // Dashboard specific queries
    @Query("SELECT COUNT(p) FROM Phong p WHERE p.trangThai.idTt = :trangThaiId")
    long countByTrangThai_IdTrangThai(@Param("trangThaiId") String trangThaiId);

    // Count queries for dashboard stats
    @Query("SELECT COUNT(p) FROM Phong p WHERE p.trangThai.tenTrangThai = 'Trống'")
    long countAvailableRooms();

    @Query("SELECT COUNT(p) FROM Phong p WHERE p.trangThai.tenTrangThai = 'Đã có khách'")
    long countOccupiedRooms();

    @Query("SELECT COUNT(p) FROM Phong p WHERE p.trangThai.tenTrangThai = 'Đang bảo trì'")
    long countMaintenanceRooms();

    @Query("SELECT COUNT(p) FROM Phong p WHERE p.trangThai.tenTrangThai = 'Đang dọn dẹp'")
    long countCleaningRooms();

    // Alternative method names for better readability
    default List<Phong> findEmptyRooms() {
        return findAvailableRooms();
    }

    default List<Phong> findRoomsWithGuests() {
        return findOccupiedRooms();
    }

    default List<Phong> findRoomsUnderMaintenance() {
        return findMaintenanceRooms();
    }
}
