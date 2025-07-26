package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "ct_dich_vu")
public class CtDichVu {
    @Id
    @Column(name = "ID_CT_DV")
    private String idCtDv;
    
    @Column(name = "NGAY_SU_DUNG")
    private LocalDate ngaySuDung;
    
    @Column(name = "GHI_CHU")
    private String ghiChu;
    
    @Column(name = "GIA")
    private BigDecimal gia;
    
    @Column(name = "SO_LUONG")
    private Integer soLuong;
    
    @Column(name = "TT_THANH_TOAN")
    private String ttThanhToan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CT_PT")
    private CtPhieuThue ctPhieuThue;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DV")
    private DichVu dichVu;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HD")
    private HoaDon hoaDon;
}