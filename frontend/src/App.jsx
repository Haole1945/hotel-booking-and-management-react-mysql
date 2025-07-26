import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import BackendStatus from './components/common/BackendStatus'

// Public pages
import HomePage from './pages/public/HomePage'
import RoomListPage from './pages/public/RoomListPage'
import RoomDetailPage from './pages/public/RoomDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import BookingPage from './pages/customer/BookingPage'
import BookingHistory from './pages/customer/BookingHistory'
import CustomerProfile from './pages/customer/CustomerProfile'

// Staff pages (Lễ tân)
import StaffDashboard from './pages/staff/StaffDashboard'
import ReservationManagement from './pages/staff/ReservationManagement'
import CheckInPage from './pages/staff/CheckInPage'
import CheckOutPage from './pages/staff/CheckOutPage'
import CustomerManagement from './pages/staff/CustomerManagement'

// Admin pages (Quản lý)
import AdminDashboard from './pages/admin/AdminDashboard'
import RoomManagement from './pages/admin/RoomManagement'
import StaffManagement from './pages/admin/StaffManagement'
import ServiceManagement from './pages/admin/ServiceManagement'
import AmenityManagement from './pages/admin/AmenityManagement'
import ReportsPage from './pages/admin/ReportsPage'

// Layout components
import PublicLayout from './components/layouts/PublicLayout'
import CustomerLayout from './components/layouts/CustomerLayout'
import StaffLayout from './components/layouts/StaffLayout'
import AdminLayout from './components/layouts/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomListPage />} />
            <Route path="rooms/:id" element={<RoomDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CustomerDashboard />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          {/* Staff Routes (Lễ tân) */}
          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
              <StaffLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StaffDashboard />} />
            <Route path="reservations" element={<ReservationManagement />} />
            <Route path="checkin" element={<CheckInPage />} />
            <Route path="checkout" element={<CheckOutPage />} />
            <Route path="customers" element={<CustomerManagement />} />
          </Route>

          {/* Admin Routes (Quản lý) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="amenities" element={<AmenityManagement />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Trang không tồn tại</p>
              </div>
            </div>
          } />
        </Routes>
      </div>

      {/* Global Components */}
      <BackendStatus />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
