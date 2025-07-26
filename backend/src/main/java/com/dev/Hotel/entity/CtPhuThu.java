package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ct_phu_thu")
public class CtPhuThu {
    @Id
    @Column(name = "ID_CT_PHU_THU")
    private String idCtPhuThu;
    
    @Column(name = "TT_THANH_TOAN")
    private String ttThanhToan;
    
    @Column(name = "DON_GIA")
    private BigDecimal donGia;
    
    @Column(name = "SO_LUONG")
    private Integer soLuong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PHU_THU")
    private PhuThu phuThu;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CT_PT")
    private CtPhieuThue ctPhieuThue;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HD")
    private HoaDon hoaDon;
}