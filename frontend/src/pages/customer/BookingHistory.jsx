import React, { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react'
import Pagination from '../../components/common/Pagination'

const BookingHistory = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    fetchBookingHistory()
  }, [])

  const fetchBookingHistory = async () => {
    try {
      setLoading(true)
      // Mock data - sẽ thay thế bằng API call
      const mockBookings = [
        {
          id: 1,
          maPhieuThue: 'PT001',
          roomNumber: '101',
          roomType: 'Deluxe',
          checkIn: '2024-01-15',
          checkOut: '2024-01-18',
          status: 'completed',
          total: 2400000,
          createdAt: '2024-01-10',
          services: ['Wifi', 'Breakfast']
        },
        {
          id: 2,
          maPhieuThue: 'PT002',
          roomNumber: '205',
          roomType: 'Suite',
          checkIn: '2024-01-20',
          checkOut: '2024-01-22',
          status: 'confirmed',
          total: 1800000,
          createdAt: '2024-01-18',
          services: ['Wifi', 'Spa']
        },
        {
          id: 3,
          maPhieuThue: 'PT003',
          roomNumber: '301',
          roomType: 'Standard',
          checkIn: '2024-02-01',
          checkOut: '2024-02-03',
          status: 'cancelled',
          total: 1200000,
          createdAt: '2024-01-25',
          services: ['Wifi']
        },
        {
          id: 4,
          maPhieuThue: 'PT004',
          roomNumber: '102',
          roomType: 'Deluxe',
          checkIn: '2024-02-10',
          checkOut: '2024-02-12',
          status: 'pending',
          total: 1600000,
          createdAt: '2024-02-08',
          services: ['Wifi', 'Breakfast', 'Laundry']
        }
      ]
      
      setBookings(mockBookings)
      setFilteredBookings(mockBookings)
    } catch (error) {
      console.error('Error fetching booking history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành'
      case 'confirmed': return 'Đã xác nhận'
      case 'pending': return 'Chờ xác nhận'
      case 'cancelled': return 'Đã hủy'
      default: return 'Không xác định'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'confirmed': return <Calendar className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    applyFilters(status, dateFilter)
  }

  const handleDateFilter = (date) => {
    setDateFilter(date)
    applyFilters(statusFilter, date)
  }

  const applyFilters = (status, date) => {
    let filtered = [...bookings]

    if (status) {
      filtered = filtered.filter(booking => booking.status === status)
    }

    if (date) {
      const filterDate = new Date(date)
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate >= filterDate
      })
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setStatusFilter('')
    setDateFilter('')
    setFilteredBookings(bookings)
    setCurrentPage(1)
  }

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lịch sử đặt phòng</h1>
        <p className="text-gray-600 mt-2">Xem tất cả đặt phòng đã thực hiện</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn-outline w-full"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Kết quả ({filteredBookings.length} đặt phòng)
          </h2>
        </div>

        {filteredBookings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đặt phòng
                    </th>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.maPhieuThue}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.createdAt}
                        </div>
                      </td>
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
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{getStatusText(booking.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.total.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={bookingsPerPage}
              totalItems={filteredBookings.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đặt phòng nào
            </h3>
            <p className="text-gray-500">
              Bạn chưa có đặt phòng nào hoặc thử thay đổi bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingHistory
