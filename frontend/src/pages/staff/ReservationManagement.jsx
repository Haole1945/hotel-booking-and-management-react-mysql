import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import { bookingService } from '../../services/bookingService'

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [reservationsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  })

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      // Gọi API thực tế thay vì mock data
      const response = await bookingService.getAllBookings()
      const reservationData = response.phieuDatList || []

      // Transform data to match frontend format
      const transformedData = reservationData.map(booking => ({
        id: booking.idPd,
        maPhieuThue: `PD${booking.idPd}`,
        customerName: booking.hoTenKhachHang || 'N/A',
        customerPhone: booking.sdtKhachHang || 'N/A',
        roomNumber: 'TBD', // Will be assigned during check-in
        roomType: 'Standard', // Default value
        checkIn: booking.ngayBdThue,
        checkOut: booking.ngayDi,
        status: mapBackendStatusToFrontend(booking.trangThai),
        total: booking.soTienCoc || 0,
        createdAt: booking.ngayDat,
        cccd: booking.cccd,
        employeeId: booking.idNv,
        employeeName: booking.hoTenNhanVien
      }))

      setReservations(transformedData)
      setFilteredReservations(transformedData)
    } catch (error) {
      console.error('Error fetching reservations:', error)
      setReservations([])
      setFilteredReservations([])
    } finally {
      setLoading(false)
    }
  }

  // Map backend status to frontend status
  const mapBackendStatusToFrontend = (backendStatus) => {
    switch (backendStatus) {
      case 'Chờ xác nhận': return 'pending'
      case 'Đã xác nhận': return 'confirmed'
      case 'Đã nhận phòng': return 'checkedin'
      case 'Đã hủy': return 'cancelled'
      case 'Hoàn thành': return 'checkedout'
      default: return 'pending'
    }
  }

  // Map frontend status to backend status
  const mapFrontendStatusToBackend = (frontendStatus) => {
    switch (frontendStatus) {
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'checkedin': return 'Đã nhận phòng'
      case 'cancelled': return 'Đã hủy'
      case 'checkedout': return 'Hoàn thành'
      default: return 'Chờ xác nhận'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'checkedin': return 'text-green-600 bg-green-100'
      case 'checkedout': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận'
      case 'pending': return 'Chờ xác nhận'
      case 'cancelled': return 'Đã hủy'
      case 'checkedin': return 'Đã check-in'
      case 'checkedout': return 'Đã check-out'
      default: return 'Không xác định'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'checkedin': return <Check className="w-4 h-4" />
      case 'checkedout': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters) => {
    let filtered = [...reservations]

    // Filter by status
    if (currentFilters.status) {
      filtered = filtered.filter(reservation => reservation.status === currentFilters.status)
    }

    // Filter by date range
    if (currentFilters.dateFrom) {
      filtered = filtered.filter(reservation =>
        new Date(reservation.checkIn) >= new Date(currentFilters.dateFrom)
      )
    }

    if (currentFilters.dateTo) {
      filtered = filtered.filter(reservation =>
        new Date(reservation.checkOut) <= new Date(currentFilters.dateTo)
      )
    }

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(searchLower) ||
        reservation.maPhieuThue.toLowerCase().includes(searchLower) ||
        reservation.roomNumber.includes(searchLower)
      )
    }

    setFilteredReservations(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      searchTerm: ''
    })
    setFilteredReservations(reservations)
    setCurrentPage(1)
  }

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      const backendStatus = mapFrontendStatusToBackend(newStatus)

      if (newStatus === 'confirmed') {
        await bookingService.confirmBooking(reservationId)
      } else if (newStatus === 'cancelled') {
        await bookingService.cancelBooking(reservationId, 'Hủy bởi lễ tân')
      } else {
        await bookingService.updateBookingStatus(reservationId, backendStatus)
      }

      // Update local state
      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      )

      // Reapply filters
      applyFilters(filters)
    } catch (error) {
      console.error('Error updating reservation status:', error)
      alert('Có lỗi xảy ra khi cập nhật trạng thái đặt phòng')
    }
  }

  // Get current reservations for pagination
  const indexOfLastReservation = currentPage * reservationsPerPage
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation)

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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đặt phòng</h1>
        <p className="text-gray-600 mt-2">Xem và quản lý tất cả đặt phòng của khách sạn</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm và lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên khách, mã đặt phòng, số phòng..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="checkedin">Đã check-in</option>
              <option value="checkedout">Đã check-out</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="input"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="input"
            />
          </div>

          {/* Clear Filters */}
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
            Kết quả ({filteredReservations.length} đặt phòng)
          </h2>
        </div>

        {filteredReservations.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đặt phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
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
                  {currentReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.maPhieuThue}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.customerName}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Phòng {reservation.roomNumber}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.roomType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reservation.checkIn} - {reservation.checkOut}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="ml-1">{getStatusText(reservation.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.total.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={reservationsPerPage}
              totalItems={filteredReservations.length}
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
              Không tìm thấy đặt phòng nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationManagement
