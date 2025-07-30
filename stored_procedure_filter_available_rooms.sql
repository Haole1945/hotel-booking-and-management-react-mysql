DELIMITER //

CREATE PROCEDURE FilterAvailableRoomsByCategory(
    IN p_ngay_den DATE,
    IN p_ngay_di DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Tạo bảng tạm để lưu kết quả
    DROP TEMPORARY TABLE IF EXISTS temp_available_rooms;
    CREATE TEMPORARY TABLE temp_available_rooms (
        ID_HANG_PHONG INT,
        TEN_KP VARCHAR(100),
        TEN_LP VARCHAR(100),
        TONG_SO_PHONG INT,
        SO_PHONG_TRONG INT,
        GIA DECIMAL(15,2)
    );

    -- Lấy tất cả các hạng phòng và thông tin cơ bản
    INSERT INTO temp_available_rooms (ID_HANG_PHONG, TEN_KP, TEN_LP, TONG_SO_PHONG, SO_PHONG_TRONG, GIA)
    SELECT 
        hp.ID_HANG_PHONG,
        kp.TEN_KP,
        lp.TEN_LP,
        COUNT(p.SOPHONG) as TONG_SO_PHONG,
        0 as SO_PHONG_TRONG,
        COALESCE(gp.GIA, 0) as GIA
    FROM hang_phong hp
    INNER JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
    INNER JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
    INNER JOIN phong p ON hp.ID_HANG_PHONG = p.ID_HANG_PHONG
    LEFT JOIN (
        SELECT 
            ID_HANG_PHONG,
            GIA,
            ROW_NUMBER() OVER (PARTITION BY ID_HANG_PHONG ORDER BY NGAY_AP_DUNG DESC) as rn
        FROM gia_phong 
        WHERE NGAY_AP_DUNG <= CURDATE()
    ) gp ON hp.ID_HANG_PHONG = gp.ID_HANG_PHONG AND gp.rn = 1
    WHERE p.ID_TT IN ('TT001', 'TT003', 'TT005') -- Chỉ tính phòng: Sẵn sàng, Dơ, Bảo trì
    GROUP BY hp.ID_HANG_PHONG, kp.TEN_KP, lp.TEN_LP, gp.GIA;

    -- Cập nhật số phòng trống sau khi loại bỏ phòng đã được đặt/thuê
    UPDATE temp_available_rooms tar
    SET SO_PHONG_TRONG = (
        SELECT COUNT(DISTINCT p.SOPHONG)
        FROM phong p
        WHERE p.ID_HANG_PHONG = tar.ID_HANG_PHONG
        AND p.ID_TT IN ('TT001', 'TT003', 'TT005') -- Phòng có thể sử dụng được
        AND p.SOPHONG NOT IN (
            -- Loại bỏ phòng đã được đặt trong khoảng thời gian
            SELECT DISTINCT cpt.SO_PHONG
            FROM ct_phieu_thue cpt
            INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
            INNER JOIN phieudat pd ON pt.ID_PD = pd.ID_PD
            WHERE cpt.SO_PHONG IS NOT NULL
            AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
            AND (
                -- Kiểm tra trùng lặp thời gian với phiếu đặt
                (pd.NGAY_BD_THUE <= p_ngay_di AND pd.NGAY_DI >= p_ngay_den)
                OR
                -- Kiểm tra trùng lặp thời gian với phiếu thuê
                (cpt.NGAY_DEN <= p_ngay_di AND cpt.NGAY_DI >= p_ngay_den)
            )
            
            UNION
            
            -- Loại bỏ phòng đã được thuê trực tiếp (không qua đặt trước)
            SELECT DISTINCT cpt.SO_PHONG
            FROM ct_phieu_thue cpt
            INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
            WHERE cpt.SO_PHONG IS NOT NULL
            AND pt.ID_PD IS NULL -- Phiếu thuê không có phiếu đặt (khách vãng lai)
            AND (cpt.NGAY_DEN <= p_ngay_di AND cpt.NGAY_DI >= p_ngay_den)
            
            UNION
            
            -- Loại bỏ phòng đã được đặt nhưng chưa có phiếu thuê
            SELECT DISTINCT p2.SOPHONG
            FROM phieudat pd
            INNER JOIN hang_phong hp2 ON 1=1 -- Tạm thời join để lấy hạng phòng
            INNER JOIN phong p2 ON hp2.ID_HANG_PHONG = p2.ID_HANG_PHONG
            WHERE pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
            AND pd.NGAY_BD_THUE <= p_ngay_di 
            AND pd.NGAY_DI >= p_ngay_den
            AND NOT EXISTS (
                SELECT 1 FROM phieuthue pt2 
                WHERE pt2.ID_PD = pd.ID_PD
            )
            AND p2.ID_HANG_PHONG = tar.ID_HANG_PHONG
        )
    );

    -- Hiển thị kết quả
    SELECT 
        ID_HANG_PHONG,
        CONCAT(TEN_LP, ' - ', TEN_KP) as HANG_PHONG,
        TEN_KP as KIEU_PHONG,
        TEN_LP as LOAI_PHONG,
        TONG_SO_PHONG,
        SO_PHONG_TRONG,
        GIA,
        CASE 
            WHEN SO_PHONG_TRONG > 0 THEN 'Còn phòng trống'
            ELSE 'Hết phòng'
        END as TRANG_THAI
    FROM temp_available_rooms
    ORDER BY ID_HANG_PHONG;

    -- Hiển thị danh sách chi tiết phòng trống
    SELECT 
        p.SOPHONG,
        CONCAT(lp.TEN_LP, ' - ', kp.TEN_KP) as HANG_PHONG,
        p.TANG,
        tt.TEN_TRANG_THAI,
        gp.GIA
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
    WHERE p.ID_TT IN ('TT001', 'TT003', 'TT005')
    AND p.SOPHONG NOT IN (
        -- Loại bỏ phòng đã được đặt/thuê trong khoảng thời gian
        SELECT DISTINCT cpt.SO_PHONG
        FROM ct_phieu_thue cpt
        INNER JOIN phieuthue pt ON cpt.ID_PT = pt.ID_PT
        LEFT JOIN phieudat pd ON pt.ID_PD = pd.ID_PD
        WHERE cpt.SO_PHONG IS NOT NULL
        AND (
            -- Trường hợp có phiếu đặt
            (pd.ID_PD IS NOT NULL AND pd.TRANG_THAI IN ('Đã xác nhận', 'Chờ xác nhận')
             AND (pd.NGAY_BD_THUE <= p_ngay_di AND pd.NGAY_DI >= p_ngay_den))
            OR
            -- Trường hợp thuê trực tiếp hoặc check thời gian thuê thực tế
            (cpt.NGAY_DEN <= p_ngay_di AND cpt.NGAY_DI >= p_ngay_den)
        )
    )
    ORDER BY hp.ID_HANG_PHONG, p.SOPHONG;

    -- Xóa bảng tạm
    DROP TEMPORARY TABLE IF EXISTS temp_available_rooms;

END //

DELIMITER ;

-- Gọi stored procedure với tham số mẫu
-- CALL FilterAvailableRoomsByCategory('2025-08-01', '2025-08-03');