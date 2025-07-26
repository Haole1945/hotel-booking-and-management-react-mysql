package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tiennghi")
public class TienNghi {
    @Id
    @Column(name = "ID_TN")
    private String idTn;
    
    @Column(name = "TEN_TN")
    private String tenTn;
    
    @Column(name = "ICON")
    private String icon;
}
