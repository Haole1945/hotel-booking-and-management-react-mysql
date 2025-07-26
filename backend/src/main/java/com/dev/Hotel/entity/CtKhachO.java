package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ctkhacho")
public class CtKhachO {
    @EmbeddedId
    private CtKhachOId id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCtPt")
    @JoinColumn(name = "ID_CT_PT")
    private CtPhieuThue ctPhieuThue;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("cccd")
    @JoinColumn(name = "CCCD")
    private KhachHang khachHang;
}
