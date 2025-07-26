package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "bo_phan")
public class BoPhan {
    @Id
    @Column(name = "ID_BP")
    private String idBp;
    
    @Column(name = "TENBP")
    private String tenBp;
    
    @OneToMany(mappedBy = "boPhan", cascade = CascadeType.ALL)
    private List<NhanVien> danhSachNhanVien;
}
