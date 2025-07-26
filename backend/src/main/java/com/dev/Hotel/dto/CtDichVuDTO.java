package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CtDichVuDTO {
    
    private String idCtDv;
    private LocalDate ngaySuDung;
    private String ghiChu;
    private BigDecimal gia;
    private Integer soLuong;
    private String ttThanhToan;
    
    // Chi tiet phieu thue info
    private Integer idCtPt;
    
    // Dich vu info
    private String idDv;
    private String tenDv;
    private String donViTinh;
    
    // Hoa don info
    private String idHd;
    
    // Computed fields
    private BigDecimal thanhTien;
    
    public BigDecimal getThanhTien() {
        if (gia != null && soLuong != null) {
            return gia.multiply(BigDecimal.valueOf(soLuong));
        }
        return BigDecimal.ZERO;
    }
}
