DELIMITER //

CREATE PROCEDURE GetAvailableRoomsByCategory(
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
        
        -- Số phòng trống có thể sử dụng được
        (SELECT COUNT(*) 
         FROM phong p2 
         WHERE p2.ID_HANG_PHONG = hp.ID_HANG_PHONG
         AND p2.ID_TT IN ('TT001') -- Chỉ tính phòng sẵn sàng
         AND p2.SOPHONG NOT IN (
             -- Loại bỏ phòng đã có lịch thuê/đặt trùng thời gian
             SELECT DISTINCT sub_cpt.SO_PHONG
             FROM ct_phieu_thue sub_cpt
             INNER JOIN phieuthue sub_pt ON sub_cpt.ID_PT = sub_pt.ID_PT
             LEFT JOIN phieudat sub_pd ON sub_pt.ID_PD = sub_pd.ID_PD
             WHERE sub_cpt.SO_PHONG IS NOT NULL
             AND (
                 -- Kiểm tra overlap thời gian thuê thực tế
                 (sub_cpt.NGAY_DEN < p_ngay_di AND sub_cpt.NGAY_DI > p_ngay_den)
                 OR
                 -- Kiểm tra overlap với phiếu đặt đã xác nhận
                 (sub_pd.ID_PD IS NOT NULL 
                  AND sub_pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
                  AND sub_pd.NGAY_BD_THUE < p_ngay_di 
                  AND sub_pd.NGAY_DI > p_ngay_den)
             )
         )) as SO_PHONG_TRONG,
        
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

-- Stored procedure để lấy danh sách chi tiết phòng trống
DELIMITER //

CREATE PROCEDURE GetDetailedAvailableRooms(
    IN p_ngay_den DATE,
    IN p_ngay_di DATE,
    IN p_id_hang_phong INT -- Tùy chọn: lọc theo hạng phòng cụ thể
)
BEGIN
    SELECT 
        p.SOPHONG,
        p.TANG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        kp.TEN_KP as KIEU_PHONG,
        lp.TEN_LP as LOAI_PHONG,
        kp.SO_LUONG_KHACH_O,
        tt.TEN_TRANG_THAI,
        COALESCE(gp.GIA, 0) as GIA,
        
        -- Kiểm tra xem phòng có lịch đặt/thuê trong tương lai không
        CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM ct_phieu_thue cpt
                INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
                LEFT JOIN phieudat pd ON pt.ID_PD = pd.ID_PD
                WHERE cpt.SO_PHONG = p.SOPHONG
                AND cpt.NGAY_DEN > p_ngay_di
                AND (pd.ID_PD IS NULL OR pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận'))
            ) THEN 'Có lịch sau'
            ELSE 'Trống hoàn toàn'
        END as TINH_TRANG_TUONG_LAI
        
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
    WHERE p.ID_TT = 'TT001' -- Chỉ phòng sẵn sàng
    AND (p_id_hang_phong IS NULL OR hp.ID_HANG_PHONG = p_id_hang_phong)
    AND p.SOPHONG NOT IN (
        -- Loại bỏ phòng đã có lịch thuê/đặt trùng thời gian
        SELECT DISTINCT cpt.SO_PHONG
        FROM ct_phieu_thue cpt
        INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
        LEFT JOIN phieudat pd ON pt.ID_PD = pd.ID_PD
        WHERE cpt.SO_PHONG IS NOT NULL
        AND (
            -- Kiểm tra overlap thời gian thuê thực tế
            (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
            OR
            -- Kiểm tra overlap với phiếu đặt đã xác nhận
            (pd.ID_PD IS NOT NULL 
             AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
             AND pd.NGAY_BD_THUE < p_ngay_di 
             AND pd.NGAY_DI > p_ngay_den)
        )
    )
    ORDER BY hp.ID_HANG_PHONG, p.SOPHONG;

END //

DELIMITER ;

-- Stored procedure để kiểm tra phòng cụ thể có trống không
DELIMITER //

CREATE PROCEDURE CheckRoomAvailability(
    IN p_so_phong VARCHAR(10),
    IN p_ngay_den DATE,
    IN p_ngay_di DATE
)
BEGIN
    SELECT 
        p.SOPHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        tt.TEN_TRANG_THAI,
        CASE 
            WHEN p.ID_TT != 'TT001' THEN 'Không khả dụng - Trạng thái phòng'
            WHEN EXISTS (
                SELECT 1 
                FROM ct_phieu_thue cpt
                INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
                LEFT JOIN phieudat pd ON pt.ID_PD = pd.ID_PD
                WHERE cpt.SO_PHONG = p.SOPHONG
                AND (
                    (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
                    OR
                    (pd.ID_PD IS NOT NULL 
                     AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
                     AND pd.NGAY_BD_THUE < p_ngay_di 
                     AND pd.NGAY_DI > p_ngay_den)
                )
            ) THEN 'Không khả dụng - Đã được đặt/thuê'
            ELSE 'Có thể đặt/thuê'
        END as TRANG_THAI_KHA_DUNG,
        
        -- Hiển thị lịch xung đột nếu có
        (SELECT GROUP_CONCAT(
            CONCAT('Từ ', cpt.NGAY_DEN, ' đến ', cpt.NGAY_DI) 
            SEPARATOR '; '
        )
         FROM ct_phieu_thue cpt
         INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
         LEFT JOIN phieudat pd ON pt.ID_PD = pd.ID_PD
         WHERE cpt.SO_PHONG = p.SOPHONG
         AND (
             (cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
             OR
             (pd.ID_PD IS NOT NULL 
              AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
              AND pd.NGAY_BD_THUE < p_ngay_di 
              AND pd.NGAY_DI > p_ngay_den)
         )
        ) as LICH_XUNG_DOT
        
    FROM phong p
    INNER JOIN hang_phong hp ON p.ID_HANG_PHONG = hp.ID_HANG_PHONG
    INNER JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
    INNER JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
    INNER JOIN trangthai tt ON p.ID_TT = tt.ID_TT
    WHERE p.SOPHONG = p_so_phong;

END //

DELIMITER ;

-- Ví dụ cách sử dụng:
-- CALL GetAvailableRoomsByCategory('2025-08-01', '2025-08-03');
-- CALL GetDetailedAvailableRooms('2025-08-01', '2025-08-03', NULL);
-- CALL GetDetailedAvailableRooms('2025-08-01', '2025-08-03', 1);
-- CALL CheckRoomAvailability('101', '2025-08-01', '2025-08-03');