package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "anh_hang_phong")
public class AnhHangPhong {
    @Id
    @Column(name = "ID_ANH_HANG_PHONG")
    private String idAnhHangPhong;
    
    @Column(name = "URL_ANH")
    private String urlAnh;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HANG_PHONG")
    private HangPhong hangPhong;
}