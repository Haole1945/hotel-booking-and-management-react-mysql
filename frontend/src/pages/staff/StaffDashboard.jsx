import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Building
} from 'lucide-react'

const StaffDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalReservations: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    pendingReservations: 0
  })
  const [todayActivities, setTodayActivities] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data - sẽ thay thế bằng API calls
      setStats({
        totalReservations: 45,
        checkInsToday: 8,
        checkOutsToday: 12,
        occupiedRooms: 32,
        availableRooms: 18,
        pendingReservations: 5
      })

      setTodayActivities([
        {
          id: 1,
          type: 'checkin',
          customerName: 'Nguyễn Văn A',
          roomNumber: '101',
          time: '14:00',
          status: 'pending'
        },
        {
          id: 2,
          type: 'checkout',
          customerName: 'Trần Thị B',
          roomNumber: '205',
          time: '11:00',
          status: 'completed'
        },
        {
          id: 3,
          type: 'checkin',
          customerName: 'Lê Văn C',
          roomNumber: '301',
          time: '15:30',
          status: 'pending'
        }
      ])

      setUpcomingTasks([
        {
          id: 1,
          task: 'Xác nhận đặt phòng cho khách VIP',
          priority: 'high',
          dueTime: '16:00'
        },
        {
          id: 2,
          task: 'Chuẩn bị phòng 102 cho khách check-in',
          priority: 'medium',
          dueTime: '17:00'
        },
        {
          id: 3,
          task: 'Liên hệ khách hàng về yêu cầu đặc biệt',
          priority: 'low',
          dueTime: '18:00'
        }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin': return <UserCheck className="w-4 h-4 text-green-600" />
      case 'checkout': return <UserX className="w-4 h-4 text-blue-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityText = (type) => {
    switch (type) {
      case 'checkin': return 'Check-in'
      case 'checkout': return 'Check-out'
      default: return 'Hoạt động'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return 'Bình thường'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng, {user?.hoTen || `${user?.ho} ${user?.ten}`}!
        </h1>
        <p className="text-blue-100">
          Dashboard lễ tân - Quản lý đặt phòng và dịch vụ khách hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đặt phòng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-in hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{stats.checkInsToday}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <UserX className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-out hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{stats.checkOutsToday}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <Building className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Phòng đã thuê</p>
              <p className="text-2xl font-bold text-gray-900">{stats.occupiedRooms}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Phòng trống</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableRooms}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReservations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/staff/reservations" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý đặt phòng</h3>
            <p className="text-gray-600">Xem và quản lý tất cả đặt phòng</p>
          </div>
        </Link>

        <Link to="/staff/checkin" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-in</h3>
            <p className="text-gray-600">Thực hiện check-in cho khách hàng</p>
          </div>
        </Link>

        <Link to="/staff/checkout" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserX className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-out</h3>
            <p className="text-gray-600">Thực hiện check-out cho khách hàng</p>
          </div>
        </Link>

        <Link to="/staff/customers" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý khách hàng</h3>
            <p className="text-gray-600">Thông tin và lịch sử khách hàng</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activities */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Hoạt động hôm nay</h2>
            <Link to="/staff/reservations" className="text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-4">
            {todayActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {getActivityText(activity.type)} - {activity.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Phòng {activity.roomNumber} • {activity.time}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  activity.status === 'completed'
                    ? 'text-green-600 bg-green-100'
                    : 'text-yellow-600 bg-yellow-100'
                }`}>
                  {activity.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Công việc sắp tới</h2>
            <span className="text-sm text-gray-500">{upcomingTasks.length} công việc</span>
          </div>

          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">
                    {task.task}
                  </div>
                  <div className="text-sm text-gray-500">
                    Thời hạn: {task.dueTime}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard
