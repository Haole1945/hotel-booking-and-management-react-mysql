-- =====================================================
-- STORED PROCEDURES HOÀN CHỈNH CHO VIỆC LỌC PHÒNG TRỐNG
-- Hỗ trợ cả schema hiện tại và schema có bảng ct_phieu_dat
-- =====================================================

-- Version 1: Cho schema hiện tại (không có ct_phieu_dat)
-- Phiếu đặt chỉ có thông tin chung, không chi tiết phòng cụ thể
DELIMITER //

CREATE PROCEDURE GetAvailableRoomsCurrentSchema(
    IN p_ngay_den DATE,
    IN p_ngay_di DATE
)
BEGIN
    -- Lấy số lượng phòng trống theo hạng phòng
    -- Dựa trên chi tiết phiếu thuê (ct_phieu_thue) và phiếu đặt tổng quát
    
    SELECT 
        hp.ID_HANG_PHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        kp.TEN_KP as KIEU_PHONG,
        lp.TEN_LP as LOAI_PHONG,
        kp.SO_LUONG_KHACH_O,
        
        -- Tổng số phòng sẵn sàng thuộc hạng này
        (SELECT COUNT(*) 
         FROM phong p1 
         WHERE p1.ID_HANG_PHONG = hp.ID_HANG_PHONG 
         AND p1.ID_TT = 'TT001') as TONG_SO_PHONG_SAN_SANG,
        
        -- Số phòng đã được thuê cụ thể (từ ct_phieu_thue)
        (SELECT COUNT(DISTINCT cpt.SO_PHONG)
         FROM ct_phieu_thue cpt
         INNER JOIN phong p2 ON cpt.SO_PHONG = p2.SOPHONG
         WHERE p2.ID_HANG_PHONG = hp.ID_HANG_PHONG
         AND (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)) as SO_PHONG_DA_THUE_CU_THE,
        
        -- Số phiếu đặt chưa check-in cho hạng phòng này
        (SELECT COUNT(*)
         FROM phieudat pd
         WHERE pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
         AND (pd.NGAY_BD_THUE < p_ngay_di AND pd.NGAY_DI > p_ngay_den)
         AND NOT EXISTS (
             SELECT 1 FROM phieuthue pt WHERE pt.ID_PD = pd.ID_PD
         )) as SO_PHIEU_DAT_CHUA_CHECKIN,
        
        -- Ước tính số phòng trống (bảo thủ)
        -- Lấy tổng phòng sẵn sàng trừ phòng đã thuê cụ thể trừ số phiếu đặt chưa check-in
        GREATEST(0, 
            (SELECT COUNT(*) FROM phong p3 WHERE p3.ID_HANG_PHONG = hp.ID_HANG_PHONG AND p3.ID_TT = 'TT001')
            - (SELECT COUNT(DISTINCT cpt.SO_PHONG)
               FROM ct_phieu_thue cpt
               INNER JOIN phong p4 ON cpt.SO_PHONG = p4.SOPHONG
               WHERE p4.ID_HANG_PHONG = hp.ID_HANG_PHONG
               AND (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den))
            - (SELECT COUNT(*)
               FROM phieudat pd
               WHERE pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
               AND (pd.NGAY_BD_THUE < p_ngay_di AND pd.NGAY_DI > p_ngay_den)
               AND NOT EXISTS (
                   SELECT 1 FROM phieuthue pt WHERE pt.ID_PD = pd.ID_PD
               ))
        ) as UOC_TINH_SO_PHONG_TRONG,
        
        -- Giá phòng hiện tại
        COALESCE(gp.GIA, 0) as GIA_HIEN_TAI,
        
        -- Cảnh báo về phiếu đặt chưa được phân phòng cụ thể
        CASE 
            WHEN (SELECT COUNT(*) FROM phieudat pd WHERE pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
                  AND (pd.NGAY_BD_THUE < p_ngay_di AND pd.NGAY_DI > p_ngay_den)
                  AND NOT EXISTS (SELECT 1 FROM phieuthue pt WHERE pt.ID_PD = pd.ID_PD)) > 0
            THEN 'CÓ PHIẾU ĐẶT CHƯA PHÂN PHÒNG'
            ELSE 'KHÔNG CÓ PHIẾU ĐẶT PENDING'
        END as CANH_BAO
        
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

-- Version 2: Kiểm tra phòng cụ thể có khả dụng không (schema hiện tại)
DELIMITER //

CREATE PROCEDURE CheckSpecificRoomAvailability(
    IN p_so_phong VARCHAR(10),
    IN p_ngay_den DATE,
    IN p_ngay_di DATE
)
BEGIN
    SELECT 
        p.SOPHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        tt.TEN_TRANG_THAI,
        
        -- Kiểm tra trạng thái phòng
        CASE 
            WHEN p.ID_TT != 'TT001' THEN 'KHÔNG KHẢ DỤNG - TRẠNG THÁI PHÒNG'
            WHEN EXISTS (
                SELECT 1 
                FROM ct_phieu_thue cpt
                WHERE cpt.SO_PHONG = p.SOPHONG
                AND (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
            ) THEN 'KHÔNG KHẢ DỤNG - ĐÃ ĐƯỢC THUÊ'
            ELSE 'CÓ THỂ SỬ DỤNG'
        END as TRANG_THAI_KHA_DUNG,
        
        -- Danh sách các lịch thuê xung đột
        (SELECT GROUP_CONCAT(
            CONCAT('Từ ', cpt.NGAY_DEN, ' đến ', cpt.NGAY_DI, ' (PT:', pt.ID_PT, ')') 
            SEPARATOR '; '
        )
         FROM ct_phieu_thue cpt
         INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
         WHERE cpt.SO_PHONG = p.SOPHONG
         AND (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
        ) as LICH_THUE_XUNG_DOT,
        
        -- Phiếu đặt tổng quát có thể ảnh hưởng
        (SELECT COUNT(*)
         FROM phieudat pd
         WHERE pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
         AND (pd.NGAY_BD_THUE < p_ngay_di AND pd.NGAY_DI > p_ngay_den)
         AND NOT EXISTS (
             SELECT 1 FROM phieuthue pt WHERE pt.ID_PD = pd.ID_PD
         )) as SO_PHIEU_DAT_CO_THE_ANH_HUONG,
        
        COALESCE(gp.GIA, 0) as GIA_HIEN_TAI
        
    FROM phong p
    INNER JOIN hang_phong hp ON p.ID_HANG_PHONG = hp.ID_HANG_PHONG
    INNER JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
    INNER JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
    INNER JOIN trangthai tt ON p.ID_TT = tt.ID_TT
    LEFT JOIN (
        SELECT 
            ID_HANG_PHONG,
            GIA,
            ROW_NUMBER() OVER (PARTITION BY ID_HANG_PHONG ORDER BY NGAY_AP_DUNG DESC) as rn
        FROM gia_phong 
        WHERE NGAY_AP_DUNG <= CURDATE()
    ) gp ON hp.ID_HANG_PHONG = gp.ID_HANG_PHONG AND gp.rn = 1
    WHERE p.SOPHONG = p_so_phong;

END //

DELIMITER ;

-- Version 3: Hiển thị thông tin xung đột chi tiết
DELIMITER //

CREATE PROCEDURE ShowBookingConflicts(
    IN p_ngay_den DATE,
    IN p_ngay_di DATE
)
BEGIN
    -- Hiển thị tất cả các xung đột về thời gian
    
    -- Phần 1: Phiếu đặt chưa check-in nhưng xung đột thời gian
    SELECT 
        'PHIEU_DAT_CHUA_CHECKIN' as LOAI_XUNG_DOT,
        pd.ID_PD,
        NULL as SO_PHONG_CU_THE,
        'Chưa phân phòng' as THONG_TIN_PHONG,
        pd.NGAY_BD_THUE,
        pd.NGAY_DI,
        pd.TRANG_THAI,
        CONCAT(kh.HO, ' ', kh.TEN) as KHACH_HANG,
        kh.SDT,
        pd.SO_TIEN_COC
    FROM phieudat pd
    INNER JOIN khach_hang kh ON pd.CCCD = kh.CCCD
    WHERE pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
    AND (pd.NGAY_BD_THUE < p_ngay_di AND pd.NGAY_DI > p_ngay_den)
    AND NOT EXISTS (
        SELECT 1 FROM phieuthue pt WHERE pt.ID_PD = pd.ID_PD
    )
    
    UNION ALL
    
    -- Phần 2: Phiếu thuê đã có phòng cụ thể và xung đột
    SELECT 
        'PHIEU_THUE_XUNG_DOT' as LOAI_XUNG_DOT,
        pt.ID_PT,
        cpt.SO_PHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP, ' (Phòng ', cpt.SO_PHONG, ')') as THONG_TIN_PHONG,
        cpt.NGAY_DEN,
        cpt.NGAY_DI,
        'Đang thuê' as TRANG_THAI,
        CONCAT(kh.HO, ' ', kh.TEN) as KHACH_HANG,
        kh.SDT,
        cpt.DON_GIA
    FROM ct_phieu_thue cpt
    INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
    INNER JOIN phong p ON cpt.SO_PHONG = p.SOPHONG
    INNER JOIN hang_phong hp ON p.ID_HANG_PHONG = hp.ID_HANG_PHONG
    INNER JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
    INNER JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
    INNER JOIN khach_hang kh ON pt.CCCD = kh.CCCD
    WHERE (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
    
    ORDER BY NGAY_BD_THUE, LOAI_XUNG_DOT;

END //

DELIMITER ;

-- Stored procedure tổng hợp để phân tích tình hình phòng trống
DELIMITER //

CREATE PROCEDURE AnalyzeRoomAvailability(
    IN p_ngay_den DATE,
    IN p_ngay_di DATE
)
BEGIN
    -- Tổng kết tình hình
    SELECT 
        'TONG_KET' as LOAI_THONG_TIN,
        COUNT(DISTINCT p.SOPHONG) as TONG_SO_PHONG,
        COUNT(DISTINCT CASE WHEN p.ID_TT = 'TT001' THEN p.SOPHONG END) as SO_PHONG_SAN_SANG,
        COUNT(DISTINCT CASE WHEN EXISTS (
            SELECT 1 FROM ct_phieu_thue cpt 
            WHERE cpt.SO_PHONG = p.SOPHONG 
            AND (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
        ) THEN p.SOPHONG END) as SO_PHONG_DA_THUE,
        (SELECT COUNT(*) FROM phieudat pd 
         WHERE pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
         AND (pd.NGAY_BD_THUE < p_ngay_di AND pd.NGAY_DI > p_ngay_den)
         AND NOT EXISTS (SELECT 1 FROM phieuthue pt WHERE pt.ID_PD = pd.ID_PD)
        ) as SO_PHIEU_DAT_CHUA_CHECKIN
    FROM phong p;
    
    -- Gọi stored procedure chính để lấy kết quả chi tiết
    CALL GetAvailableRoomsCurrentSchema(p_ngay_den, p_ngay_di);

END //

DELIMITER ;

-- =====================================================
-- HƯỚNG DẪN SỬ DỤNG CHO SCHEMA HIỆN TẠI
-- =====================================================

/*
-- Cách sử dụng với dữ liệu mẫu hiện có:

-- 1. Xem tổng kết phòng trống theo hạng phòng
CALL GetAvailableRoomsCurrentSchema('2025-08-01', '2025-08-03');

-- 2. Kiểm tra phòng cụ thể
CALL CheckSpecificRoomAvailability('101', '2025-08-01', '2025-08-03');
CALL CheckSpecificRoomAvailability('102', '2025-08-01', '2025-08-03');

-- 3. Xem chi tiết các xung đột
CALL ShowBookingConflicts('2025-08-01', '2025-08-03');

-- 4. Phân tích tổng thể
CALL AnalyzeRoomAvailability('2025-08-01', '2025-08-03');

-- LƯU Ý: 
-- - Với schema hiện tại, phiếu đặt chỉ có thông tin tổng quát, không chi tiết phòng
-- - Kết quả "ước tính" vì không biết chính xác phiếu đặt sẽ chọn phòng nào
-- - Để có kết quả chính xác 100%, cần bảng ct_phieu_dat

*/