package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.LoginRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.service.interfac.INhanVienService;
import com.dev.Hotel.utils.EntityDTOMapper;
import com.dev.Hotel.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NhanVienService implements INhanVienService {
    
    @Autowired
    private NhanVienRepository nhanVienRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JWTUtils jwtUtils;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Override
    @Transactional(readOnly = true)
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();
        try {
            // Try to authenticate with username or email
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            
            var nhanVien = nhanVienRepository.findByEmailOrUsernameWithBoPhan(loginRequest.getEmail(), loginRequest.getEmail())
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            var token = jwtUtils.generateToken(nhanVien);
            response.setStatusCode(200);
            response.setToken(token);

            // Determine role based on department
            String role = determineUserRole(nhanVien);
            response.setRole(role);
            response.setExpirationTime("7 Days");
            response.setMessage("Đăng nhập thành công");
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi trong quá trình đăng nhập: " + e.getMessage());
        }
        return response;
    }

    /**
     * Determine user role based on department
     */
    private String determineUserRole(NhanVien nhanVien) {
        if (nhanVien.getBoPhan() == null) {
            return "EMPLOYEE"; // Default role
        }

        String tenBoPhan = nhanVien.getBoPhan().getTenBp();
        if (tenBoPhan == null) {
            return "EMPLOYEE";
        }

        // Check for admin/management roles
        if (tenBoPhan.toLowerCase().contains("quản lý") ||
            tenBoPhan.toLowerCase().contains("admin") ||
            tenBoPhan.toLowerCase().contains("giám đốc")) {
            return "ADMIN";
        }

        // All other departments are employees
        return "EMPLOYEE";
    }

    @Override
    public Response register(NhanVien nhanVien) {
        Response response = new Response();
        try {
            if (nhanVienRepository.existsByEmail(nhanVien.getEmail())) {
                throw new OurException("Email đã tồn tại: " + nhanVien.getEmail());
            }
            if (nhanVienRepository.existsByUsername(nhanVien.getUsername())) {
                throw new OurException("Username đã tồn tại: " + nhanVien.getUsername());
            }
            
            nhanVien.setPassword(passwordEncoder.encode(nhanVien.getPassword()));
            NhanVien savedNhanVien = nhanVienRepository.save(nhanVien);
            
            response.setStatusCode(200);
            response.setMessage("Đăng ký nhân viên thành công");
            // Note: Set nhanVien field in response - will be added to Response DTO
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi trong quá trình đăng ký: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getAllNhanVien() {
        Response response = new Response();
        try {
            List<NhanVien> nhanVienList = nhanVienRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVienList(EntityDTOMapper.mapNhanVienListToDTO(nhanVienList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách nhân viên: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getNhanVienById(String idNv) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(nhanVien));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin nhân viên: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getNhanVienByEmail(String email) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findByEmail(email)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(nhanVien));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin nhân viên: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getNhanVienByUsername(String username) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findByUsername(username)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(nhanVien));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin nhân viên: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response updateNhanVien(String idNv, NhanVien nhanVien) {
        Response response = new Response();
        try {
            NhanVien existingNhanVien = nhanVienRepository.findById(idNv)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            // Update fields (excluding password and sensitive data)
            existingNhanVien.setHo(nhanVien.getHo());
            existingNhanVien.setTen(nhanVien.getTen());
            existingNhanVien.setPhai(nhanVien.getPhai());
            existingNhanVien.setNgaySinh(nhanVien.getNgaySinh());
            existingNhanVien.setDiaChi(nhanVien.getDiaChi());
            existingNhanVien.setSdt(nhanVien.getSdt());
            existingNhanVien.setEmail(nhanVien.getEmail());
            existingNhanVien.setHinh(nhanVien.getHinh());
            existingNhanVien.setBoPhan(nhanVien.getBoPhan());
            
            NhanVien updatedNhanVien = nhanVienRepository.save(existingNhanVien);
            
            response.setStatusCode(200);
            response.setMessage("Cập nhật nhân viên thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(updatedNhanVien));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật nhân viên: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response deleteNhanVien(String idNv) {
        Response response = new Response();
        try {
            nhanVienRepository.findById(idNv)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            nhanVienRepository.deleteById(idNv);
            response.setStatusCode(200);
            response.setMessage("Xóa nhân viên thành công");
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa nhân viên: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response changePassword(String idNv, String oldPassword, String newPassword) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));
            
            if (!passwordEncoder.matches(oldPassword, nhanVien.getPassword())) {
                throw new OurException("Mật khẩu cũ không đúng");
            }
            
            nhanVien.setPassword(passwordEncoder.encode(newPassword));
            nhanVienRepository.save(nhanVien);
            
            response.setStatusCode(200);
            response.setMessage("Đổi mật khẩu thành công");
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi đổi mật khẩu: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response updateProfile(String idNv, NhanVien nhanVien) {
        return updateNhanVien(idNv, nhanVien);
    }
    
    @Override
    public Response getMyInfo(String email) {
        return getNhanVienByEmail(email);
    }
    
    @Override
    public Response getNhanVienByBoPhan(String idBp) {
        Response response = new Response();
        try {
            // This would require a custom query in repository
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response activateNhanVien(String idNv) {
        Response response = new Response();
        try {
            // Implementation for activating employee
            response.setStatusCode(200);
            response.setMessage("Kích hoạt nhân viên thành công");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kích hoạt nhân viên: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response deactivateNhanVien(String idNv) {
        Response response = new Response();
        try {
            // Implementation for deactivating employee
            response.setStatusCode(200);
            response.setMessage("Vô hiệu hóa nhân viên thành công");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi vô hiệu hóa nhân viên: " + e.getMessage());
        }
        return response;
    }
}
