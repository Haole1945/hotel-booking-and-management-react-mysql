# Stored Procedures - Lọc Phòng Trống Theo Hạng Phòng

## Mô tả chung

Tôi đã tạo ra 4 stored procedures để lọc và kiểm tra tình trạng phòng trống trong hệ thống quản lý khách sạn dựa trên:
- **Phiếu đặt** (phieudat): Phòng đã được đặt trước
- **Phiếu thuê** (phieuthue): Phòng đang được thuê
- **Chi tiết phiếu thuê** (ct_phieu_thue): Thông tin cụ thể về thời gian thuê từng phòng

## Các Stored Procedures

### 1. `FilterAvailableRoomsByCategory`
**Mục đích**: Stored procedure phức tạp với phân tích chi tiết và bảng tạm

**Tham số đầu vào**:
- `p_ngay_den` (DATE): Ngày check-in dự kiến
- `p_ngay_di` (DATE): Ngày check-out dự kiến

**Kết quả trả về**:
- Bảng 1: Tổng kết theo hạng phòng
- Bảng 2: Danh sách chi tiết từng phòng trống

**Cách sử dụng**:
```sql
CALL FilterAvailableRoomsByCategory('2025-08-01', '2025-08-03');
```

### 2. `GetAvailableRoomsByCategory` ⭐ **Khuyến nghị sử dụng**
**Mục đích**: Lấy tổng kết số lượng phòng trống theo từng hạng phòng (đơn giản, hiệu quả)

**Tham số đầu vào**:
- `p_ngay_den` (DATE): Ngày check-in dự kiến  
- `p_ngay_di` (DATE): Ngày check-out dự kiến

**Kết quả trả về**:
```
ID_HANG_PHONG | HANG_PHONG | KIEU_PHONG | LOAI_PHONG | SO_LUONG_KHACH_O | TONG_SO_PHONG | SO_PHONG_TRONG | GIA_HIEN_TAI
```

**Cách sử dụng**:
```sql
CALL GetAvailableRoomsByCategory('2025-08-01', '2025-08-03');
```

### 3. `GetDetailedAvailableRooms`
**Mục đích**: Lấy danh sách chi tiết từng phòng trống

**Tham số đầu vào**:
- `p_ngay_den` (DATE): Ngày check-in dự kiến
- `p_ngay_di` (DATE): Ngày check-out dự kiến  
- `p_id_hang_phong` (INT): ID hạng phòng cụ thể (NULL = tất cả)

**Kết quả trả về**:
```
SOPHONG | TANG | HANG_PHONG | KIEU_PHONG | LOAI_PHONG | SO_LUONG_KHACH_O | TEN_TRANG_THAI | GIA | TINH_TRANG_TUONG_LAI
```

**Cách sử dụng**:
```sql
-- Lấy tất cả phòng trống
CALL GetDetailedAvailableRooms('2025-08-01', '2025-08-03', NULL);

-- Lấy phòng trống của hạng phòng ID = 1
CALL GetDetailedAvailableRooms('2025-08-01', '2025-08-03', 1);
```

### 4. `CheckRoomAvailability`
**Mục đích**: Kiểm tra phòng cụ thể có khả dụng không

**Tham số đầu vào**:
- `p_so_phong` (VARCHAR): Số phòng cần kiểm tra
- `p_ngay_den` (DATE): Ngày check-in dự kiến
- `p_ngay_di` (DATE): Ngày check-out dự kiến

**Kết quả trả về**:
```
SOPHONG | HANG_PHONG | TEN_TRANG_THAI | TRANG_THAI_KHA_DUNG | LICH_XUNG_DOT
```

**Cách sử dụng**:
```sql
CALL CheckRoomAvailability('101', '2025-08-01', '2025-08-03');
```

## Logica Hoạt Động

### Kiểm tra trùng lặp thời gian
Các stored procedures sử dụng logic overlap để kiểm tra xung đột thời gian:

```sql
-- Điều kiện overlap: (A_start < B_end) AND (A_end > B_start)
(cpt.NGAY_DEN < p_ngay_di AND cpt.NGAY_DI > p_ngay_den)
```

### Xử lý các trường hợp
1. **Phòng đã thuê**: Kiểm tra `ct_phieu_thue` với thời gian thực tế
2. **Phòng đã đặt**: Kiểm tra `phieudat` với trạng thái 'Đã xác nhận' hoặc 'Chờ xác nhận'
3. **Khách vãng lai**: Phiếu thuê không có `ID_PD` (không qua đặt trước)

### Trạng thái phòng được xem xét
- `TT001`: Sẵn sàng ✅
- `TT002`: Có khách ❌
- `TT003`: Dơ ⚠️ (có thể sử dụng sau khi dọn dẹp)
- `TT004`: Đặt trước ❌  
- `TT005`: Bảo trì ❌

## Ví dụ Sử Dụng Thực Tế

### Scenario 1: Khách hàng muốn đặt phòng từ 1/8 đến 3/8/2025
```sql
CALL GetAvailableRoomsByCategory('2025-08-01', '2025-08-03');
```

### Scenario 2: Xem chi tiết phòng Standard
```sql
-- Lấy ID_HANG_PHONG của Standard từ kết quả trên, ví dụ = 1
CALL GetDetailedAvailableRooms('2025-08-01', '2025-08-03', 1);
```

### Scenario 3: Kiểm tra phòng 101 có trống không
```sql
CALL CheckRoomAvailability('101', '2025-08-01', '2025-08-03');
```

## Lưu ý quan trọng

1. **Hiệu suất**: `GetAvailableRoomsByCategory` được tối ưu cho truy vấn nhanh
2. **Tính chính xác**: Xem xét cả phiếu đặt và phiếu thuê để tránh double booking
3. **Linh hoạt**: Có thể lọc theo hạng phòng cụ thể hoặc kiểm tra từng phòng
4. **Thời gian thực**: Luôn lấy giá phòng mới nhất dựa trên `NGAY_AP_DUNG`

## Cài đặt

1. Chạy file `sql.sql` để tạo database schema
2. Chạy file `data.txt` để insert dữ liệu mẫu
3. Chạy file `stored_procedure_simple_available_rooms.sql` để tạo stored procedures
4. Test với các lệnh CALL ở trên