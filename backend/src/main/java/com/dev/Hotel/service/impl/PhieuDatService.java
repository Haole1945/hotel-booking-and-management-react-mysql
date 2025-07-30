package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.PhieuDatRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.service.interfac.IPhieuDatService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PhieuDatService implements IPhieuDatService {

    @Autowired
    private PhieuDatRepository phieuDatRepository;
    
    @Autowired
    private KhachHangRepository khachHangRepository;
    
    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Override
    public Response getAllPhieuDat() {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatById(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(phieuDat));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createPhieuDat(PhieuDat phieuDat) {
        Response response = new Response();
        try {
            // Validate booking dates
            if (!isValidBookingPeriod(phieuDat.getNgayBdThue(), phieuDat.getNgayDi())) {
                throw new OurException("Ngày đặt không hợp lệ");
            }
            
            PhieuDat savedPhieuDat = phieuDatRepository.save(phieuDat);
            response.setStatusCode(200);
            response.setMessage("Tạo phiếu đặt thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(savedPhieuDat));
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updatePhieuDat(Integer idPd, PhieuDat phieuDat) {
        Response response = new Response();
        try {
            PhieuDat existingPhieuDat = phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            // Update fields
            existingPhieuDat.setNgayDat(phieuDat.getNgayDat());
            existingPhieuDat.setNgayBdThue(phieuDat.getNgayBdThue());
            existingPhieuDat.setNgayDi(phieuDat.getNgayDi());
            existingPhieuDat.setTrangThai(phieuDat.getTrangThai());
            existingPhieuDat.setSoTienCoc(phieuDat.getSoTienCoc());
            existingPhieuDat.setKhachHang(phieuDat.getKhachHang());
            existingPhieuDat.setNhanVien(phieuDat.getNhanVien());
            
            PhieuDat updatedPhieuDat = phieuDatRepository.save(existingPhieuDat);
            response.setStatusCode(200);
            response.setMessage("Cập nhật phiếu đặt thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deletePhieuDat(Integer idPd) {
        Response response = new Response();
        try {
            phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            phieuDatRepository.deleteById(idPd);
            response.setStatusCode(200);
            response.setMessage("Xóa phiếu đặt thành công");
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByKhachHang(String cccd) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByKhachHangCccd(cccd);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByNhanVien(String idNv) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            List<PhieuDat> phieuDatList = phieuDatRepository.findByNhanVien(nhanVien);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByTrangThai(String trangThai) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByTrangThai(trangThai);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo trạng thái: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByDateRange(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByNgayDatBetween(startDate, endDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo khoảng thời gian: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response confirmBooking(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            phieuDat.setTrangThai("Đã xác nhận");
            PhieuDat updatedPhieuDat = phieuDatRepository.save(phieuDat);
            
            response.setStatusCode(200);
            response.setMessage("Xác nhận đặt phòng thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xác nhận đặt phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response cancelBooking(Integer idPd, String reason) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            phieuDat.setTrangThai("Đã hủy");
            PhieuDat updatedPhieuDat = phieuDatRepository.save(phieuDat);
            
            response.setStatusCode(200);
            response.setMessage("Hủy đặt phòng thành công. Lý do: " + reason);
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi hủy đặt phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateBookingStatus(Integer idPd, String trangThai) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            phieuDat.setTrangThai(trangThai);
            PhieuDat updatedPhieuDat = phieuDatRepository.save(phieuDat);
            
            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchPhieuDat(String keyword) {
        Response response = new Response();
        try {
            // This would require a custom query to search across multiple fields
            // For now, return all bookings
            List<PhieuDat> phieuDatList = phieuDatRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Tìm kiếm thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tìm kiếm: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUpcomingBookings(LocalDate date) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByNgayDatBetween(date, date.plusDays(7));
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy đặt phòng sắp tới: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayBookings() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();
            List<PhieuDat> phieuDatList = phieuDatRepository.findByNgayDatBetween(today, today);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy đặt phòng hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response validateBookingDates(LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            boolean isValid = isValidBookingPeriod(checkIn, checkOut);
            response.setStatusCode(200);
            response.setMessage(isValid ? "Ngày đặt hợp lệ" : "Ngày đặt không hợp lệ");
            response.setStats(isValid);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra ngày đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getConfirmedBookings() {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByTrangThai("Đã xác nhận");
            // Sắp xếp theo ngày bắt đầu thuê
            phieuDatList.sort((a, b) -> {
                if (a.getNgayBdThue() == null && b.getNgayBdThue() == null) return 0;
                if (a.getNgayBdThue() == null) return 1;
                if (b.getNgayBdThue() == null) return -1;
                return a.getNgayBdThue().compareTo(b.getNgayBdThue());
            });

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách đặt phòng đã xác nhận: " + e.getMessage());
        }
        return response;
    }

    @Override
    public boolean isValidBookingPeriod(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            return false;
        }
        return checkIn.isBefore(checkOut) && !checkIn.isBefore(LocalDate.now());
    }
}
