import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  Coffee,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStaff: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    totalServices: 0,
    totalAmenities: 0,
    pendingReservations: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    occupancyRate: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [revenueData, setRevenueData] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data - sẽ thay thế bằng API calls
      setStats({
        totalRooms: 50,
        occupiedRooms: 32,
        totalStaff: 25,
        totalCustomers: 1250,
        monthlyRevenue: 850000000,
        todayRevenue: 15000000,
        totalServices: 12,
        totalAmenities: 8,
        pendingReservations: 5,
        checkInsToday: 8,
        checkOutsToday: 12,
        occupancyRate: 64
      })

      setRecentActivities([
        {
          id: 1,
          type: 'reservation',
          description: 'Đặt phòng mới từ Nguyễn Văn A',
          time: '10 phút trước',
          status: 'success'
        },
        {
          id: 2,
          type: 'checkin',
          description: 'Check-in phòng 205 - Trần Thị B',
          time: '25 phút trước',
          status: 'success'
        },
        {
          id: 3,
          type: 'staff',
          description: 'Nhân viên mới được thêm vào hệ thống',
          time: '1 giờ trước',
          status: 'info'
        },
        {
          id: 4,
          type: 'maintenance',
          description: 'Báo cáo sự cố phòng 301',
          time: '2 giờ trước',
          status: 'warning'
        }
      ])

      setTopPerformers([
        {
          id: 1,
          name: 'Nguyễn Thị Lan',
          role: 'Lễ tân',
          performance: 95,
          tasks: 45
        },
        {
          id: 2,
          name: 'Trần Văn Nam',
          role: 'Lễ tân',
          performance: 92,
          tasks: 38
        },
        {
          id: 3,
          name: 'Lê Thị Hoa',
          role: 'Housekeeping',
          performance: 88,
          tasks: 52
        }
      ])

      setRevenueData([
        { month: 'T1', revenue: 650000000 },
        { month: 'T2', revenue: 720000000 },
        { month: 'T3', revenue: 680000000 },
        { month: 'T4', revenue: 750000000 },
        { month: 'T5', revenue: 820000000 },
        { month: 'T6', revenue: 850000000 }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'reservation': return <Calendar className="w-4 h-4 text-blue-600" />
      case 'checkin': return <UserCheck className="w-4 h-4 text-green-600" />
      case 'staff': return <Users className="w-4 h-4 text-purple-600" />
      case 'maintenance': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100'
      case 'warning': return 'bg-yellow-100'
      case 'info': return 'bg-blue-100'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng, {user?.hoTen || `${user?.ho} ${user?.ten}`}!
        </h1>
        <p className="text-purple-100">
          Dashboard quản lý - Tổng quan hoạt động khách sạn
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tỷ lệ lấp đầy</p>
              <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              <p className="text-xs text-gray-500">{stats.occupiedRooms}/{stats.totalRooms} phòng</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.monthlyRevenue / 1000000).toFixed(0)}M
              </p>
              <p className="text-xs text-gray-500">VNĐ</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-xs text-gray-500">+12% tháng này</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.todayRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">VNĐ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
            <p className="text-xl font-bold text-gray-900">{stats.pendingReservations}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Check-in hôm nay</p>
            <p className="text-xl font-bold text-gray-900">{stats.checkInsToday}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Check-out hôm nay</p>
            <p className="text-xl font-bold text-gray-900">{stats.checkOutsToday}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Nhân viên</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalStaff}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-yellow-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Dịch vụ</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalServices}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-emerald-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Star className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Tiện nghi</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalAmenities}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Link to="/admin/rooms" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý phòng</h3>
            <p className="text-gray-600 text-sm">Thêm, sửa, xóa phòng</p>
          </div>
        </Link>

        <Link to="/admin/staff" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý nhân viên</h3>
            <p className="text-gray-600 text-sm">Thông tin nhân viên</p>
          </div>
        </Link>

        <Link to="/admin/services" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Coffee className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý dịch vụ</h3>
            <p className="text-gray-600 text-sm">Dịch vụ khách sạn</p>
          </div>
        </Link>

        <Link to="/admin/amenities" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý tiện nghi</h3>
            <p className="text-gray-600 text-sm">Tiện nghi phòng</p>
          </div>
        </Link>

        <Link to="/admin/reports" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Báo cáo</h3>
            <p className="text-gray-600 text-sm">Thống kê & phân tích</p>
          </div>
        </Link>

        <Link to="/staff/reservations" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đặt phòng</h3>
            <p className="text-gray-600 text-sm">Xem đặt phòng</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
            <Link to="/admin/reports" className="text-purple-600 hover:text-purple-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`flex items-center p-4 rounded-lg ${getActivityColor(activity.status)}`}>
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Nhân viên xuất sắc</h2>
            <Link to="/admin/staff" className="text-purple-600 hover:text-purple-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">#{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                    <p className="text-xs text-gray-500">{performer.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{performer.performance}%</p>
                  <p className="text-xs text-gray-500">{performer.tasks} công việc</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Doanh thu 6 tháng gần đây</h2>
          <Link to="/admin/reports" className="text-purple-600 hover:text-purple-700 font-medium">
            Chi tiết
          </Link>
        </div>

        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
            <p className="text-sm text-gray-400 mt-2">Tích hợp với Chart.js hoặc Recharts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
