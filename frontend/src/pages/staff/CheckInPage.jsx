import React, { useState, useEffect } from 'react'
import { Search, UserCheck, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

const CheckInPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkInData, setCheckInData] = useState({
    actualCheckIn: '',
    notes: '',
    specialRequests: ''
  })

  useEffect(() => {
    fetchTodayReservations()
  }, [])

  const fetchTodayReservations = async () => {
    try {
      setLoading(true)
      // Gọi API thực tế thay vì mock data
      const today = new Date().toISOString().split('T')[0]
      const response = await api.get(`/api/phieu-dat/ngay-den/${today}`)
      const reservationData = response.data.phieuDatList || []

      setReservations(reservationData)
      setFilteredReservations(reservationData)
    } catch (error) {
      console.error('Error fetching today reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term) {
      setFilteredReservations(reservations)
      return
    }

    const filtered = reservations.filter(reservation =>
      reservation.customerName.toLowerCase().includes(term.toLowerCase()) ||
      reservation.maPhieuThue.toLowerCase().includes(term.toLowerCase()) ||
      reservation.roomNumber.includes(term) ||
      reservation.customerPhone.includes(term)
    )
    setFilteredReservations(filtered)
  }

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation)
    setCheckInData({
      actualCheckIn: new Date().toISOString().slice(0, 16),
      notes: '',
      specialRequests: reservation.specialRequests || ''
    })
  }

  const handleCheckInDataChange = (field, value) => {
    setCheckInData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckIn = async () => {
    if (!selectedReservation) return

    try {
      setLoading(true)

      // TODO: Call API to perform check-in
      // const response = await checkInService.performCheckIn(selectedReservation.id, checkInData)

      // Update reservation status
      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === selectedReservation.id
            ? { ...reservation, status: 'checkedin' }
            : reservation
        )
      )

      toast.success(`Check-in thành công cho ${selectedReservation.customerName}!`)
      setSelectedReservation(null)
      setCheckInData({
        actualCheckIn: '',
        notes: '',
        specialRequests: ''
      })

      // Refresh the list
      fetchTodayReservations()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi check-in')
      console.error('Check-in error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'checkedin': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận'
      case 'checkedin': return 'Đã check-in'
      default: return 'Không xác định'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-in khách hàng</h1>
        <p className="text-gray-600 mt-2">Thực hiện check-in cho khách hàng có đặt phòng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search and Reservations List */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm đặt phòng</h2>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm theo tên, mã đặt phòng, số phòng, SĐT..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input"
            />
          </div>

          {/* Reservations List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReservation?.id === reservation.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectReservation(reservation)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{reservation.customerName}</h3>
                      <p className="text-sm text-gray-600">{reservation.maPhieuThue}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Phòng:</span> {reservation.roomNumber} ({reservation.roomType})
                    </div>
                    <div>
                      <span className="font-medium">SĐT:</span> {reservation.customerPhone}
                    </div>
                    <div>
                      <span className="font-medium">Check-in:</span> {reservation.checkIn}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span> {reservation.checkOut}
                    </div>
                  </div>

                  {reservation.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Ghi chú:</span> {reservation.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Không tìm thấy đặt phòng nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Check-in Form */}
        <div className="card">
          <div className="flex items-center mb-4">
            <UserCheck className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Thông tin check-in</h2>
          </div>

          {selectedReservation ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div><span className="font-medium">Tên:</span> {selectedReservation.customerName}</div>
                  <div><span className="font-medium">SĐT:</span> {selectedReservation.customerPhone}</div>
                  <div><span className="font-medium">Email:</span> {selectedReservation.customerEmail}</div>
                  <div><span className="font-medium">Phòng:</span> {selectedReservation.roomNumber} ({selectedReservation.roomType})</div>
                  <div><span className="font-medium">Tổng tiền:</span> {selectedReservation.total.toLocaleString('vi-VN')} VNĐ</div>
                </div>
              </div>

              {/* Check-in Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian check-in thực tế
                  </label>
                  <input
                    type="datetime-local"
                    value={checkInData.actualCheckIn}
                    onChange={(e) => handleCheckInDataChange('actualCheckIn', e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu đặc biệt
                  </label>
                  <textarea
                    value={checkInData.specialRequests}
                    onChange={(e) => handleCheckInDataChange('specialRequests', e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Ghi chú yêu cầu đặc biệt của khách..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú check-in
                  </label>
                  <textarea
                    value={checkInData.notes}
                    onChange={(e) => handleCheckInDataChange('notes', e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Ghi chú thêm về quá trình check-in..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="btn-outline flex-1"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCheckIn}
                  disabled={loading || !checkInData.actualCheckIn}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Xác nhận check-in
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn đặt phòng để check-in
              </h3>
              <p className="text-gray-500">
                Tìm kiếm và chọn đặt phòng từ danh sách bên trái
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckInPage
