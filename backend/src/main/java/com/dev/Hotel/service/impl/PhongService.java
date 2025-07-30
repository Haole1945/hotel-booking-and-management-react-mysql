package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.Phong;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.PhongRepository;
import com.dev.Hotel.repo.HangPhongRepository;
import com.dev.Hotel.repo.TrangThaiRepository;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.repo.PhieuDatRepository;
import com.dev.Hotel.service.interfac.IPhongService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PhongService implements IPhongService {
    
    @Autowired
    private PhongRepository phongRepository;
    
    @Autowired
    private HangPhongRepository hangPhongRepository;
    
    @Autowired
    private TrangThaiRepository trangThaiRepository;

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private PhieuDatRepository phieuDatRepository;
    
    @Override
    public Response getAllPhong() {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongById(String soPhong) {
        Response response = new Response();
        try {
            Phong phong = phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(phong));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response createPhong(Phong phong) {
        Response response = new Response();
        try {
            if (phongRepository.existsById(phong.getSoPhong())) {
                throw new OurException("Số phòng đã tồn tại: " + phong.getSoPhong());
            }
            
            Phong savedPhong = phongRepository.save(phong);
            response.setStatusCode(200);
            response.setMessage("Tạo phòng thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(savedPhong));
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response updatePhong(String soPhong, Phong phong) {
        Response response = new Response();
        try {
            Phong existingPhong = phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));
            
            existingPhong.setTang(phong.getTang());
            existingPhong.setHangPhong(phong.getHangPhong());
            existingPhong.setTrangThai(phong.getTrangThai());
            
            Phong updatedPhong = phongRepository.save(existingPhong);
            response.setStatusCode(200);
            response.setMessage("Cập nhật phòng thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(updatedPhong));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response deletePhong(String soPhong) {
        Response response = new Response();
        try {
            phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));
            
            phongRepository.deleteById(soPhong);
            response.setStatusCode(200);
            response.setMessage("Xóa phòng thành công");
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getAvailableRooms() {
        Response response = new Response();
        try {
            List<Phong> availableRooms = phongRepository.findAvailableRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(availableRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng trống: " + e.getMessage());
        }
        return response;
    }

    public Response getOccupiedRooms() {
        Response response = new Response();
        try {
            List<Phong> occupiedRooms = phongRepository.findOccupiedRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(occupiedRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng đã có khách: " + e.getMessage());
        }
        return response;
    }

    public Response getMaintenanceRooms() {
        Response response = new Response();
        try {
            List<Phong> maintenanceRooms = phongRepository.findMaintenanceRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(maintenanceRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng đang bảo trì: " + e.getMessage());
        }
        return response;
    }

    public Response getCleaningRooms() {
        Response response = new Response();
        try {
            List<Phong> cleaningRooms = phongRepository.findCleaningRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(cleaningRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng đang dọn dẹp: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getAvailableRoomsByDateRange(LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            if (checkIn == null || checkOut == null) {
                // Nếu không có ngày, trả về tất cả phòng trống
                List<Phong> availableRooms = phongRepository.findAvailableRooms();
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setPhongList(EntityDTOMapper.mapPhongListToDTO(availableRooms));
                return response;
            }

            // Lấy tất cả phòng
            List<Phong> allRooms = phongRepository.findAll();
            List<Phong> availableRooms = new ArrayList<>();

            for (Phong phong : allRooms) {
                // Kiểm tra phòng có trống trong khoảng thời gian không
                if (isRoomAvailableInDateRange(phong.getSoPhong(), checkIn, checkOut)) {
                    availableRooms.add(phong);
                }
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(availableRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra phòng trống: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongByHangPhong(Integer idHangPhong) {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findByHangPhongId(idHangPhong);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phòng theo hạng phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongByTang(Integer tang) {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findByTang(tang);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phòng theo tầng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongByTrangThai(String idTrangThai) {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findByTrangThaiId(idTrangThai);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phòng theo trạng thái: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response updateRoomStatus(String soPhong, String idTrangThai) {
        Response response = new Response();
        try {
            Phong phong = phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));
            
            var trangThai = trangThaiRepository.findById(idTrangThai)
                .orElseThrow(() -> new OurException("Trạng thái không tồn tại"));
            
            phong.setTrangThai(trangThai);
            Phong updatedPhong = phongRepository.save(phong);
            
            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái phòng thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(updatedPhong));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getRoomsByType(String idKieuPhong) {
        Response response = new Response();
        try {
            // This would require a custom query
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getRoomsByCategory(String idLoaiPhong) {
        Response response = new Response();
        try {
            // This would require a custom query
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response searchRooms(String keyword) {
        Response response = new Response();
        try {
            // Implementation for room search
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response filterRooms(Integer tang, String idHangPhong, String idTrangThai) {
        Response response = new Response();
        try {
            // Implementation for room filtering
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public boolean isRoomAvailable(String soPhong, LocalDate checkIn, LocalDate checkOut) {
        try {
            // Implementation for checking room availability
            return true; // Placeholder
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public Response checkRoomAvailability(String soPhong, LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            boolean isAvailable = isRoomAvailable(soPhong, checkIn, checkOut);
            response.setStatusCode(200);
            response.setMessage(isAvailable ? "Phòng có sẵn" : "Phòng không có sẵn");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra tình trạng phòng: " + e.getMessage());
        }
        return response;
    }

    // Helper method để kiểm tra phòng có trống trong khoảng thời gian không
    private boolean isRoomAvailableInDateRange(String soPhong, LocalDate checkIn, LocalDate checkOut) {
        try {
            // Kiểm tra phòng có tồn tại không
            Phong phong = phongRepository.findById(soPhong).orElse(null);
            if (phong == null) {
                return false;
            }

            // Kiểm tra trạng thái phòng hiện tại
            String trangThai = phong.getTrangThai().getTenTrangThai();
            if (!"Trống".equals(trangThai)) {
                return false;
            }

            // Kiểm tra xem có phiếu đặt nào đã xác nhận trong khoảng thời gian này không
            List<PhieuDat> conflictingBookings = phieuDatRepository.findByTrangThai("Đã xác nhận");
            for (PhieuDat booking : conflictingBookings) {
                if (booking.getNgayBdThue() != null && booking.getNgayDi() != null) {
                    // Kiểm tra overlap: (start1 <= end2) && (start2 <= end1)
                    if (booking.getNgayBdThue().isBefore(checkOut) && checkIn.isBefore(booking.getNgayDi())) {
                        return false; // Có conflict
                    }
                }
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
