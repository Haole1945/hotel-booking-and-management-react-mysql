# Hotel Booking Management System - Frontend

Frontend React application cho hệ thống quản lý đặt phòng khách sạn.

## 🚀 Công nghệ sử dụng

- **React 18** - UI Library
- **Vite** - Build tool và dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Query** - Data fetching và caching
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── common/          # Components dùng chung
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicHeader.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── Footer.jsx
│   │   ├── CustomerSidebar.jsx
│   │   ├── StaffSidebar.jsx
│   │   └── AdminSidebar.jsx
│   └── layouts/         # Layout components
│       ├── PublicLayout.jsx
│       ├── CustomerLayout.jsx
│       ├── StaffLayout.jsx
│       └── AdminLayout.jsx
├── contexts/
│   └── AuthContext.jsx  # Authentication context
├── pages/
│   ├── public/          # Trang công khai
│   │   ├── HomePage.jsx
│   │   ├── RoomListPage.jsx
│   │   └── RoomDetailPage.jsx
│   ├── auth/            # Authentication pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── customer/        # Trang dành cho khách hàng
│   │   ├── CustomerDashboard.jsx
│   │   ├── BookingPage.jsx
│   │   └── CustomerProfile.jsx
│   ├── staff/           # Trang dành cho lễ tân
│   │   ├── StaffDashboard.jsx
│   │   ├── ReservationManagement.jsx
│   │   ├── CheckInPage.jsx
│   │   ├── CheckOutPage.jsx
│   │   └── CustomerManagement.jsx
│   └── admin/           # Trang dành cho quản lý
│       ├── AdminDashboard.jsx
│       ├── RoomManagement.jsx
│       ├── StaffManagement.jsx
│       ├── ServiceManagement.jsx
│       ├── AmenityManagement.jsx
│       └── ReportsPage.jsx
├── services/
│   └── authService.js   # API services
├── App.jsx              # Main app component
└── main.jsx            # Entry point
```

## 🔐 Phân quyền người dùng

### **Trang công khai** (Không cần đăng nhập)
- Trang chủ (`/`)
- Danh sách phòng (`/rooms`)
- Chi tiết phòng (`/rooms/:id`)
- Đăng nhập (`/login`)
- Đăng ký (`/register`)

### **Khách hàng** (`CUSTOMER`)
- Dashboard (`/customer`)
- Đặt phòng (`/customer/booking`)
- Thông tin cá nhân (`/customer/profile`)

### **Lễ tân** (`EMPLOYEE`)
- Dashboard (`/staff`)
- Quản lý đặt phòng (`/staff/reservations`)
- Check-in (`/staff/checkin`)
- Check-out (`/staff/checkout`)
- Quản lý khách hàng (`/staff/customers`)

### **Quản lý** (`ADMIN`)
- Dashboard (`/admin`)
- Quản lý phòng (`/admin/rooms`)
- Quản lý nhân viên (`/admin/staff`)
- Quản lý dịch vụ (`/admin/services`)
- Quản lý tiện nghi (`/admin/amenities`)
- Báo cáo & Thống kê (`/admin/reports`)

## 🛠️ Cài đặt và chạy

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build cho production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 🔧 Cấu hình

Tạo file `.env` trong thư mục root:

```env
VITE_API_BASE_URL=http://localhost:4040
VITE_APP_NAME=Hotel Booking Management System
```

## 🎨 Styling

Sử dụng Tailwind CSS với custom components:

- `.btn` - Base button styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button  
- `.btn-outline` - Outline button
- `.input` - Input field styles
- `.card` - Card container
- `.container` - Page container

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🔄 State Management

- **AuthContext** - Quản lý authentication state
- **React Query** - Server state management
- **Local State** - Component state với useState/useReducer

## 🚦 Routing

Sử dụng React Router với:
- **ProtectedRoute** - Bảo vệ routes theo role
- **Nested routing** - Layout-based routing
- **Dynamic routing** - Params và query strings

## 📡 API Integration

- Base URL: `http://localhost:4040`
- Authentication: Bearer token
- Auto token refresh
- Error handling

## 🎯 Tính năng chính

### ✅ Đã hoàn thành
- [x] Cấu trúc project với Vite
- [x] Authentication system
- [x] Role-based routing
- [x] Responsive layouts
- [x] Basic pages structure

### 🔄 Đang phát triển
- [ ] Room booking functionality
- [ ] Customer management
- [ ] Staff management
- [ ] Reports and analytics
- [ ] Real-time notifications

### 📋 Kế hoạch
- [ ] Advanced search and filters
- [ ] Payment integration
- [ ] Email notifications
- [ ] Mobile app
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.
