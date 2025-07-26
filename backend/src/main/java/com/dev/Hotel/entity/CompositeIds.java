package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Embeddable
class GiaDichVuId implements Serializable {
    @Column(name = "ID_DV")
    private String idDv;
    
    @Column(name = "NGAY_AP_DUNG")
    private LocalDate ngayApDung;
}

@Data
@Embeddable
class ThayDoiGiaPhuThuId implements Serializable {
    @Column(name = "ID_PHU_THU")
    private String idPhuThu;
    
    @Column(name = "NGAY_AP_DUNG")
    private LocalDate ngayApDung;
}

@Data
@Embeddable
class CtKhuyenMaiId implements Serializable {
    @Column(name = "ID_KM")
    private String idKm;
    
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;
}

@Data
@Embeddable
class DoiPhongId implements Serializable {
    @Column(name = "ID_CT_PT")
    private Integer idCtPt;
    
    @Column(name = "SOPHONGMOI")
    private String soPhongMoi;
}

@Data
@Embeddable
class PhanQuyenId implements Serializable {
    @Column(name = "ID_NQ")
    private String idNq;
    
    @Column(name = "ID_BP")
    private String idBp;
}

@Data
@Embeddable
class QuanLyId implements Serializable {
    @Column(name = "ID_BP")
    private String idBp;

    @Column(name = "MANV")
    private String maNv;
}

@Data
@Embeddable
class CtKhachOId implements Serializable {
    @Column(name = "ID_CT_PT")
    private Integer idCtPt;

    @Column(name = "CCCD")
    private String cccd;
}