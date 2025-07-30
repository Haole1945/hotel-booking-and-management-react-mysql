import React, { useState } from 'react'
import { UserPlus, Save, X, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { customerService } from '../../services/customerService'
import { rentalService } from '../../services/rentalService'
import RoomMap from '../../components/staff/RoomMap'

const WalkInCheckIn = () => {
  const [loading, setLoading] = useState(false)
  const [customerData, setCustomerData] = useState({
    cccd: '',
    ho: '',
    ten: '',
    email: '',
    sdt: '',
    diaChi: '',
    ngaySinh: ''
  })
  const [rentalData, setRentalData] = useState({
    ngayDen: new Date().toISOString().split('T')[0],
    ngayDi: ''
  })
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showRoomMap, setShowRoomMap] = useState(true) // Hiện luôn mục chọn phòng

  const handleCustomerDataChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRentalDataChange = (field, value) => {
    setRentalData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!customerData.cccd || !customerData.ho || !customerData.ten || !customerData.sdt) {
      toast.error('Vui lòng điền đầy đủ thông tin khách hàng')
      return false
    }
    if (!rentalData.ngayDi) {
      toast.error('Vui lòng chọn ngày check-out')
      return false
    }
    if (new Date(rentalData.ngayDi) <= new Date(rentalData.ngayDen)) {
      toast.error('Ngày check-out phải sau ngày check-in')
      return false
    }
    if (!selectedRoom) {
      toast.error('Vui lòng chọn phòng')
      return false
    }
    return true
  }

  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
    // Không đóng room map nữa, để luôn hiển thị
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)

      // First, create or update customer
      let customerResponse
      try {
        // Check if customer exists
        await customerService.getCustomerById(customerData.cccd)
        // If exists, update
        customerResponse = await customerService.updateCustomer(customerData.cccd, customerData)
      } catch (error) {
        // If doesn't exist, create new
        customerResponse = await customerService.createCustomer(customerData)
      }

      if (customerResponse.statusCode !== 200) {
        throw new Error(customerResponse.message || 'Lỗi khi xử lý thông tin khách hàng')
      }

      // Then, create rental record
      const rentalPayload = {
        ngayLap: new Date().toISOString().split('T')[0],
        ngayDen: rentalData.ngayDen,
        ngayDi: rentalData.ngayDi,
        khachHang: {
          cccd: customerData.cccd
        },
        nhanVien: {
          idNv: 'NV001' // Should get from current user context
        },
        phong: {
          soPhong: selectedRoom.soPhong
        }
      }

      const rentalResponse = await rentalService.checkInWalkIn(rentalPayload)

      if (rentalResponse.statusCode === 200) {
        toast.success('Walk-in check-in thành công!')
        // Reset form
        setCustomerData({
          cccd: '',
          ho: '',
          ten: '',
          email: '',
          sdt: '',
          diaChi: '',
          ngaySinh: ''
        })
        setRentalData({
          ngayDen: new Date().toISOString().split('T')[0],
          ngayDi: ''
        })
        setSelectedRoom(null)
      } else {
        throw new Error(rentalResponse.message || 'Lỗi khi tạo phiếu thuê')
      }
    } catch (error) {
      console.error('Walk-in check-in error:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi check-in')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCustomerData({
      cccd: '',
      ho: '',
      ten: '',
      email: '',
      sdt: '',
      diaChi: '',
      ngaySinh: ''
    })
    setRentalData({
      ngayDen: new Date().toISOString().split('T')[0],
      ngayDi: ''
    })
    setSelectedRoom(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Walk-in Check-in</h1>
        <p className="text-gray-600 mt-2">Đăng ký check-in cho khách hàng không có đặt phòng trước</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="card">
          <div className="flex items-center mb-6">
            <UserPlus className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Thông tin khách hàng</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CCCD/CMND <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerData.cccd}
                onChange={(e) => handleCustomerDataChange('cccd', e.target.value)}
                className="input"
                placeholder="Nhập số CCCD/CMND"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerData.ho}
                onChange={(e) => handleCustomerDataChange('ho', e.target.value)}
                className="input"
                placeholder="Nhập họ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerData.ten}
                onChange={(e) => handleCustomerDataChange('ten', e.target.value)}
                className="input"
                placeholder="Nhập tên"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerData.sdt}
                onChange={(e) => handleCustomerDataChange('sdt', e.target.value)}
                className="input"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                className="input"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                value={customerData.ngaySinh}
                onChange={(e) => handleCustomerDataChange('ngaySinh', e.target.value)}
                className="input"
              />
            </div>



            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                value={customerData.diaChi}
                onChange={(e) => handleCustomerDataChange('diaChi', e.target.value)}
                className="input"
                rows="3"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </div>

        {/* Rental Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin lưu trú</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày check-in
              </label>
              <input
                type="date"
                value={rentalData.ngayDen}
                onChange={(e) => handleRentalDataChange('ngayDen', e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày check-out <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={rentalData.ngayDi}
                onChange={(e) => handleRentalDataChange('ngayDi', e.target.value)}
                className="input"
                min={rentalData.ngayDen}
                required
              />
            </div>


          </div>
        </div>

        {/* Room Selection */}
        <div className="card">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Chọn phòng</h2>
          </div>

          {/* Selected Room Info */}
          {selectedRoom && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <h3 className="font-semibold text-green-900">Phòng đã chọn: {selectedRoom.soPhong}</h3>
              <div className="text-sm text-green-700 mt-1">
                <p>Tầng: {selectedRoom.tang}</p>
                <p>Loại phòng: {selectedRoom.hangPhong?.kieuPhong?.tenKp || 'N/A'}</p>
                <p>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedRoom.hangPhong?.giaPhong || 0)}</p>
              </div>
            </div>
          )}

          {/* Room Map - Always visible */}
          <div className="border rounded-lg p-4">
            <RoomMap
              onRoomSelect={handleRoomSelect}
              selectedRoom={selectedRoom}
              checkInDate={rentalData.ngayDen}
              checkOutDate={rentalData.ngayDi}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline"
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Đặt lại
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Check-in
          </button>
        </div>
      </form>


    </div>
  )
}

export default WalkInCheckIn
