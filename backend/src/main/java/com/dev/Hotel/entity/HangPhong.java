package com.dev.Hotel.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "hang_phong")
public class HangPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_KP")
    private KieuPhong kieuPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_LP")
    private LoaiPhong loaiPhong;
    
    @JsonManagedReference("hangphong-phong")
    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<Phong> danhSachPhong;

    @JsonManagedReference("hangphong-anh")
    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<AnhHangPhong> danhSachAnh;
}