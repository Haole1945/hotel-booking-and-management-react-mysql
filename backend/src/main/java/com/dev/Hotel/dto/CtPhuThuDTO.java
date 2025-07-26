package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CtPhuThuDTO {
    
    private String idCtPhuThu;
    private String ttThanhToan;
    private BigDecimal donGia;
    private Integer soLuong;
    
    // Chi tiet phieu thue info
    private Integer idCtPt;
    
    // Phu thu info
    private String idPhuThu;
    private String tenPhuThu;
    
    // Hoa don info
    private String idHd;
    
    // Computed fields
    private BigDecimal thanhTien;
    
    public BigDecimal getThanhTien() {
        if (donGia != null && soLuong != null) {
            return donGia.multiply(BigDecimal.valueOf(soLuong));
        }
        return BigDecimal.ZERO;
    }
}
