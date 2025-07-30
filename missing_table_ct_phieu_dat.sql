-- Tạo bảng chi tiết phiếu đặt (bảng này bị thiếu trong schema gốc)
-- Bảng này cần thiết để lưu thông tin chi tiết về phòng/hạng phòng được đặt

CREATE TABLE IF NOT EXISTS `khachsan`.`ct_phieu_dat` (
  `ID_CT_PD` INT NOT NULL AUTO_INCREMENT,
  `ID_PD` INT NOT NULL,
  `ID_HANG_PHONG` INT NOT NULL,
  `SO_LUONG_PHONG` INT NOT NULL DEFAULT 1,
  `DON_GIA` DECIMAL(38, 2) NULL DEFAULT NULL,
  `GHI_CHU` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_CT_PD`),
  INDEX `ID_PD` (`ID_PD` ASC) VISIBLE,
  INDEX `ID_HANG_PHONG` (`ID_HANG_PHONG` ASC) VISIBLE,
  CONSTRAINT `fk_ctpd_pd` FOREIGN KEY (`ID_PD`) REFERENCES `khachsan`.`phieudat` (`ID_PD`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ctpd_hp` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `khachsan`.`hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Thêm dữ liệu mẫu cho ct_phieu_dat dựa trên phiếu đặt hiện có
INSERT INTO `khachsan`.`ct_phieu_dat` (`ID_PD`, `ID_HANG_PHONG`, `SO_LUONG_PHONG`, `DON_GIA`, `GHI_CHU`) VALUES
(1, 1, 1, 800000.00, 'Phòng Standard - 1 giường đôi'),
(2, 2, 1, 1200000.00, 'Phòng Superior - 1 giường đôi'),
(3, 4, 1, 1500000.00, 'Phòng Deluxe - 1 giường đôi + 1 giường đơn');

-- Stored procedure hoàn chỉnh với ct_phieu_dat
DELIMITER //

CREATE PROCEDURE GetAvailableRoomsWithBookingDetails(
    IN p_ngay_den DATE,
    IN p_ngay_di DATE
)
BEGIN
    -- Hiển thị tổng kết theo hạng phòng
    SELECT 
        hp.ID_HANG_PHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        kp.TEN_KP as KIEU_PHONG,
        lp.TEN_LP as LOAI_PHONG,
        kp.SO_LUONG_KHACH_O,
        
        -- Tổng số phòng thuộc hạng này
        (SELECT COUNT(*) 
         FROM phong p1 
         WHERE p1.ID_HANG_PHONG = hp.ID_HANG_PHONG) as TONG_SO_PHONG,
        
        -- Số phòng đã được đặt trong khoảng thời gian (từ ct_phieu_dat)
        COALESCE((SELECT SUM(ctpd.SO_LUONG_PHONG)
         FROM ct_phieu_dat ctpd
         INNER JOIN phieudat pd ON ctpd.ID_PD = pd.ID_PD
         WHERE ctpd.ID_HANG_PHONG = hp.ID_HANG_PHONG
         AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
         AND pd.NGAY_BD_THUE < p_ngay_di 
         AND pd.NGAY_DI > p_ngay_den), 0) as SO_PHONG_DA_DAT,
        
        -- Số phòng đã được thuê trong khoảng thời gian (từ ct_phieu_thue)
        (SELECT COUNT(DISTINCT cpt.SO_PHONG)
         FROM ct_phieu_thue cpt
         INNER JOIN phong p2 ON cpt.SO_PHONG = p2.SOPHONG
         WHERE p2.ID_HANG_PHONG = hp.ID_HANG_PHONG
         AND cpt.NGAY_DEN < p_ngay_di 
         AND cpt.NGAY_DI > p_ngay_den) as SO_PHONG_DA_THUE,
        
        -- Số phòng trống thực tế
        GREATEST(0, 
            (SELECT COUNT(*) FROM phong p3 WHERE p3.ID_HANG_PHONG = hp.ID_HANG_PHONG AND p3.ID_TT = 'TT001')
            - COALESCE((SELECT SUM(ctpd.SO_LUONG_PHONG)
               FROM ct_phieu_dat ctpd
               INNER JOIN phieudat pd ON ctpd.ID_PD = pd.ID_PD
               WHERE ctpd.ID_HANG_PHONG = hp.ID_HANG_PHONG
               AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
               AND pd.NGAY_BD_THUE < p_ngay_di 
               AND pd.NGAY_DI > p_ngay_den), 0)
            - (SELECT COUNT(DISTINCT cpt.SO_PHONG)
               FROM ct_phieu_thue cpt
               INNER JOIN phong p4 ON cpt.SO_PHONG = p4.SOPHONG
               WHERE p4.ID_HANG_PHONG = hp.ID_HANG_PHONG
               AND cpt.NGAY_DEN < p_ngay_di 
               AND cpt.NGAY_DI > p_ngay_den)
        ) as SO_PHONG_TRONG,
        
        -- Giá phòng hiện tại
        COALESCE(gp.GIA, 0) as GIA_HIEN_TAI
        
    FROM hang_phong hp
    INNER JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
    INNER JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
    LEFT JOIN (
        SELECT 
            ID_HANG_PHONG,
            GIA,
            ROW_NUMBER() OVER (PARTITION BY ID_HANG_PHONG ORDER BY NGAY_AP_DUNG DESC) as rn
        FROM gia_phong 
        WHERE NGAY_AP_DUNG <= CURDATE()
    ) gp ON hp.ID_HANG_PHONG = gp.ID_HANG_PHONG AND gp.rn = 1
    ORDER BY hp.ID_HANG_PHONG;

END //

DELIMITER ;

-- Stored procedure chi tiết với thông tin đặt phòng
DELIMITER //

CREATE PROCEDURE GetBookingConflictDetails(
    IN p_ngay_den DATE,
    IN p_ngay_di DATE,
    IN p_id_hang_phong INT
)
BEGIN
    -- Hiển thị chi tiết các phiếu đặt xung đột
    SELECT 
        'PHIEU_DAT' as LOAI,
        pd.ID_PD as ID_PHIEU,
        ctpd.ID_HANG_PHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        ctpd.SO_LUONG_PHONG,
        pd.NGAY_BD_THUE,
        pd.NGAY_DI,
        pd.TRANG_THAI,
        CONCAT(kh.HO, ' ', kh.TEN) as KHACH_HANG,
        kh.SDT,
        'Đã đặt ' || ctpd.SO_LUONG_PHONG || ' phòng' as GHI_CHU
    FROM ct_phieu_dat ctpd
    INNER JOIN phieudat pd ON ctpd.ID_PD = pd.ID_PD
    INNER JOIN hang_phong hp ON ctpd.ID_HANG_PHONG = hp.ID_HANG_PHONG
    INNER JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
    INNER JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
    INNER JOIN khach_hang kh ON pd.CCCD = kh.CCCD
    WHERE ctpd.ID_HANG_PHONG = COALESCE(p_id_hang_phong, ctpd.ID_HANG_PHONG)
    AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
    AND pd.NGAY_BD_THUE < p_ngay_di 
    AND pd.NGAY_DI > p_ngay_den
    
    UNION ALL
    
    -- Hiển thị chi tiết các phiếu thuê xung đột
    SELECT 
        'PHIEU_THUE' as LOAI,
        pt.ID_PT as ID_PHIEU,
        p.ID_HANG_PHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        1 as SO_LUONG_PHONG,
        cpt.NGAY_DEN,
        cpt.NGAY_DI,
        'Đang thuê' as TRANG_THAI,
        CONCAT(kh.HO, ' ', kh.TEN) as KHACH_HANG,
        kh.SDT,
        CONCAT('Phòng ', cpt.SO_PHONG) as GHI_CHU
    FROM ct_phieu_thue cpt
    INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
    INNER JOIN phong p ON cpt.SO_PHONG = p.SOPHONG
    INNER JOIN hang_phong hp ON p.ID_HANG_PHONG = hp.ID_HANG_PHONG
    INNER JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
    INNER JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
    INNER JOIN khach_hang kh ON pt.CCCD = kh.CCCD
    WHERE p.ID_HANG_PHONG = COALESCE(p_id_hang_phong, p.ID_HANG_PHONG)
    AND cpt.NGAY_DEN < p_ngay_di 
    AND cpt.NGAY_DI > p_ngay_den
    
    ORDER BY ID_HANG_PHONG, NGAY_BD_THUE;

END //

DELIMITER ;

-- Ví dụ sử dụng:
-- CALL GetAvailableRoomsWithBookingDetails('2025-08-01', '2025-08-03');
-- CALL GetBookingConflictDetails('2025-08-01', '2025-08-03', NULL);
-- CALL GetBookingConflictDetails('2025-08-01', '2025-08-03', 1);