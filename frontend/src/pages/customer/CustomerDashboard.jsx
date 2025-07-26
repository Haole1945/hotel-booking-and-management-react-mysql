import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Calendar, CreditCard, User, Clock, CheckCircle, XCircle } from 'lucide-react'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  })
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    // Mock data - sẽ thay thế bằng API calls
    setStats({
      totalBookings: 12,
      activeBookings: 2,
      completedBookings: 8,
      cancelledBookings: 2
    })

    setRecentBookings([
      {
        id: 1,
        roomNumber: '101',
        roomType: 'Deluxe',
        checkIn: '2024-01-15',
        checkOut: '2024-01-18',
        status: 'confirmed',
        total: 2400000
      },
      {
        id: 2,
        roomNumber: '205',
        roomType: 'Suite',
        checkIn: '2024-01-20',
        checkOut: '2024-01-22',
        status: 'pending',
        total: 1800000
      }
    ])
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận'
      case 'pending': return 'Chờ xác nhận'
      case 'cancelled': return 'Đã hủy'
      default: return 'Không xác định'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng, {user?.hoTen || `${user?.ho} ${user?.ten}`}!
        </h1>
        <p className="text-primary-100">
          Quản lý đặt phòng và thông tin cá nhân của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đặt phòng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/customer/booking" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-primary-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đặt phòng mới</h3>
            <p className="text-gray-600">Tìm và đặt phòng phù hợp với nhu cầu</p>
          </div>
        </Link>

        <Link to="/customer/history" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lịch sử đặt phòng</h3>
            <p className="text-gray-600">Xem tất cả đặt phòng đã thực hiện</p>
          </div>
        </Link>

        <Link to="/customer/profile" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thông tin cá nhân</h3>
            <p className="text-gray-600">Cập nhật thông tin và mật khẩu</p>
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Đặt phòng gần đây</h2>
          <Link to="/customer/history" className="text-primary-600 hover:text-primary-700 font-medium">
            Xem tất cả
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Phòng {booking.roomNumber}
                      </div>
                      <div className="text-sm text-gray-500">{booking.roomType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.checkIn} - {booking.checkOut}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.total.toLocaleString('vi-VN')} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
