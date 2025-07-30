package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.repo.PhieuDatRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.service.interfac.IPhieuThueService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PhieuThueService implements IPhieuThueService {

    @Autowired
    private PhieuThueRepository phieuThueRepository;
    
    @Autowired
    private PhieuDatRepository phieuDatRepository;
    
    @Autowired
    private KhachHangRepository khachHangRepository;
    
    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Override
    public Response getAllPhieuThue() {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueById(Integer idPt) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(phieuThue));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createPhieuThue(PhieuThue phieuThue) {
        Response response = new Response();
        try {
            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);
            response.setStatusCode(200);
            response.setMessage("Tạo phiếu thuê thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(savedPhieuThue));
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updatePhieuThue(Integer idPt, PhieuThue phieuThue) {
        Response response = new Response();
        try {
            PhieuThue existingPhieuThue = phieuThueRepository.findById(idPt)
                .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));
            
            // Update fields
            existingPhieuThue.setNgayLap(phieuThue.getNgayLap());
            existingPhieuThue.setNgayDen(phieuThue.getNgayDen());
            existingPhieuThue.setNgayDi(phieuThue.getNgayDi());
            existingPhieuThue.setKhachHang(phieuThue.getKhachHang());
            existingPhieuThue.setNhanVien(phieuThue.getNhanVien());
            existingPhieuThue.setPhieuDat(phieuThue.getPhieuDat());
            
            PhieuThue updatedPhieuThue = phieuThueRepository.save(existingPhieuThue);
            response.setStatusCode(200);
            response.setMessage("Cập nhật phiếu thuê thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(updatedPhieuThue));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deletePhieuThue(Integer idPt) {
        Response response = new Response();
        try {
            phieuThueRepository.findById(idPt)
                .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));
            
            phieuThueRepository.deleteById(idPt);
            response.setStatusCode(200);
            response.setMessage("Xóa phiếu thuê thành công");
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByKhachHang(String cccd) {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findByKhachHangCccd(cccd);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByNhanVien(String idNv) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            List<PhieuThue> phieuThueList = phieuThueRepository.findByNhanVien(nhanVien);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByPhieuDat(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            List<PhieuThue> phieuThueList = phieuThueRepository.findByPhieuDat(phieuDat);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCurrentStays(LocalDate currentDate) {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findCurrentStays(currentDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khách đang ở: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkInFromBooking(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));
            
            if (!"Đã xác nhận".equals(phieuDat.getTrangThai())) {
                throw new OurException("Phiếu đặt chưa được xác nhận");
            }
            
            // Create new PhieuThue from PhieuDat
            PhieuThue phieuThue = new PhieuThue();
            phieuThue.setNgayLap(LocalDate.now());
            phieuThue.setNgayDen(phieuDat.getNgayBdThue());
            phieuThue.setNgayDi(phieuDat.getNgayDi());
            phieuThue.setKhachHang(phieuDat.getKhachHang());
            phieuThue.setNhanVien(phieuDat.getNhanVien());
            phieuThue.setPhieuDat(phieuDat);
            
            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);
            
            // Update booking status
            phieuDat.setTrangThai("Đã nhận phòng");
            phieuDatRepository.save(phieuDat);
            
            response.setStatusCode(200);
            response.setMessage("Check-in thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(savedPhieuThue));
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi check-in: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkInWalkIn(PhieuThue phieuThue) {
        Response response = new Response();
        try {
            phieuThue.setNgayLap(LocalDate.now());
            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);
            
            response.setStatusCode(200);
            response.setMessage("Check-in walk-in thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(savedPhieuThue));
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi check-in walk-in: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkOut(Integer idPt) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));
            
            // Update check-out date to today
            phieuThue.setNgayDi(LocalDate.now());
            PhieuThue updatedPhieuThue = phieuThueRepository.save(phieuThue);
            
            response.setStatusCode(200);
            response.setMessage("Check-out thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(updatedPhieuThue));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi check-out: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response extendStay(Integer idPt, LocalDate newCheckOut) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));
            
            if (newCheckOut.isBefore(phieuThue.getNgayDi())) {
                throw new OurException("Ngày check-out mới phải sau ngày check-out hiện tại");
            }
            
            phieuThue.setNgayDi(newCheckOut);
            PhieuThue updatedPhieuThue = phieuThueRepository.save(phieuThue);
            
            response.setStatusCode(200);
            response.setMessage("Gia hạn lưu trú thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(updatedPhieuThue));
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi gia hạn lưu trú: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchPhieuThue(String keyword) {
        Response response = new Response();
        try {
            // This would require a custom query to search across multiple fields
            // For now, return all rental records
            List<PhieuThue> phieuThueList = phieuThueRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Tìm kiếm thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tìm kiếm: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByDateRange(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findByNgayDenBetween(startDate, endDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo khoảng thời gian: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayCheckIns() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();
            List<PhieuThue> phieuThueList = phieuThueRepository.findByNgayDenBetween(today, today);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy check-in hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayCheckOuts() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();
            List<PhieuThue> phieuThueList = phieuThueRepository.findByNgayDiBetween(today, today);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy check-out hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getOccupancyReport(LocalDate date) {
        Response response = new Response();
        try {
            // This would require complex calculations
            // For now, return a simple message
            response.setStatusCode(200);
            response.setMessage("Báo cáo công suất đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo công suất: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getRevenueReport(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            // This would require complex calculations with pricing
            // For now, return a simple message
            response.setStatusCode(200);
            response.setMessage("Báo cáo doanh thu đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo doanh thu: " + e.getMessage());
        }
        return response;
    }
}
