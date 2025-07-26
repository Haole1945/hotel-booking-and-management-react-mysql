import React, { useState, useEffect } from 'react'
import { Search, UserX, CreditCard, Receipt, AlertCircle, CheckCircle, Calculator } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

const CheckOutPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [checkedInGuests, setCheckedInGuests] = useState([])
  const [filteredGuests, setFilteredGuests] = useState([])
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkOutData, setCheckOutData] = useState({
    actualCheckOut: '',
    additionalCharges: [],
    damages: [],
    notes: '',
    paymentMethod: 'cash'
  })
  const [bill, setBill] = useState({
    roomCharges: 0,
    serviceCharges: 0,
    additionalCharges: 0,
    damages: 0,
    total: 0
  })

  useEffect(() => {
    fetchCheckedInGuests()
  }, [])

  const fetchCheckedInGuests = async () => {
    try {
      setLoading(true)
      // Gọi API thực tế thay vì mock data
      const response = await api.get('/api/phieu-thue/checked-in')
      const guestData = response.data.phieuThueList || []

      setCheckedInGuests(guestData)
      setFilteredGuests(guestData)
    } catch (error) {
      console.error('Error fetching checked-in guests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term) {
      setFilteredGuests(checkedInGuests)
      return
    }

    const filtered = checkedInGuests.filter(guest =>
      guest.customerName.toLowerCase().includes(term.toLowerCase()) ||
      guest.maPhieuThue.toLowerCase().includes(term.toLowerCase()) ||
      guest.roomNumber.includes(term) ||
      guest.customerPhone.includes(term)
    )
    setFilteredGuests(filtered)
  }

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest)
    setCheckOutData({
      actualCheckOut: new Date().toISOString().slice(0, 16),
      additionalCharges: [],
      damages: [],
      notes: '',
      paymentMethod: 'cash'
    })

    // Calculate bill
    const serviceCharges = guest.services.reduce((sum, service) => sum + service.price, 0)
    setBill({
      roomCharges: guest.roomCharges,
      serviceCharges: serviceCharges,
      additionalCharges: 0,
      damages: 0,
      total: guest.roomCharges + serviceCharges
    })
  }

  const addAdditionalCharge = () => {
    setCheckOutData(prev => ({
      ...prev,
      additionalCharges: [...prev.additionalCharges, { description: '', amount: 0 }]
    }))
  }

  const updateAdditionalCharge = (index, field, value) => {
    setCheckOutData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.map((charge, i) =>
        i === index ? { ...charge, [field]: value } : charge
      )
    }))

    // Recalculate bill
    const additionalTotal = checkOutData.additionalCharges.reduce((sum, charge) => sum + (Number(charge.amount) || 0), 0)
    const damagesTotal = checkOutData.damages.reduce((sum, damage) => sum + (Number(damage.amount) || 0), 0)
    setBill(prev => ({
      ...prev,
      additionalCharges: additionalTotal,
      damages: damagesTotal,
      total: prev.roomCharges + prev.serviceCharges + additionalTotal + damagesTotal
    }))
  }

  const removeAdditionalCharge = (index) => {
    setCheckOutData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.filter((_, i) => i !== index)
    }))
  }

  const addDamage = () => {
    setCheckOutData(prev => ({
      ...prev,
      damages: [...prev.damages, { description: '', amount: 0 }]
    }))
  }

  const updateDamage = (index, field, value) => {
    setCheckOutData(prev => ({
      ...prev,
      damages: prev.damages.map((damage, i) =>
        i === index ? { ...damage, [field]: value } : damage
      )
    }))
  }

  const removeDamage = (index) => {
    setCheckOutData(prev => ({
      ...prev,
      damages: prev.damages.filter((_, i) => i !== index)
    }))
  }

  const handleCheckOut = async () => {
    if (!selectedGuest) return

    try {
      setLoading(true)

      // TODO: Call API to perform check-out
      // const response = await checkOutService.performCheckOut(selectedGuest.id, checkOutData, bill)

      // Update guest status
      setCheckedInGuests(prev =>
        prev.filter(guest => guest.id !== selectedGuest.id)
      )

      toast.success(`Check-out thành công cho ${selectedGuest.customerName}!`)
      setSelectedGuest(null)
      setCheckOutData({
        actualCheckOut: '',
        additionalCharges: [],
        damages: [],
        notes: '',
        paymentMethod: 'cash'
      })
      setBill({
        roomCharges: 0,
        serviceCharges: 0,
        additionalCharges: 0,
        damages: 0,
        total: 0
      })

      // Refresh the list
      fetchCheckedInGuests()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi check-out')
      console.error('Check-out error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-out khách hàng</h1>
        <p className="text-gray-600 mt-2">Thực hiện check-out và thanh toán cho khách hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search and Guests List */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Khách đang lưu trú</h2>
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

          {/* Guests List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedGuest?.id === guest.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectGuest(guest)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{guest.customerName}</h3>
                      <p className="text-sm text-gray-600">{guest.maPhieuThue}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                      Đang lưu trú
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Phòng:</span> {guest.roomNumber} ({guest.roomType})
                    </div>
                    <div>
                      <span className="font-medium">SĐT:</span> {guest.customerPhone}
                    </div>
                    <div>
                      <span className="font-medium">Check-in:</span> {guest.checkIn}
                    </div>
                    <div>
                      <span className="font-medium">Check-out dự kiến:</span> {guest.checkOut}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Không có khách nào đang lưu trú</p>
              </div>
            )}
          </div>
        </div>

        {/* Check-out Form */}
        <div className="card">
          <div className="flex items-center mb-4">
            <UserX className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Thông tin check-out</h2>
          </div>

          {selectedGuest ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div><span className="font-medium">Tên:</span> {selectedGuest.customerName}</div>
                  <div><span className="font-medium">SĐT:</span> {selectedGuest.customerPhone}</div>
                  <div><span className="font-medium">Phòng:</span> {selectedGuest.roomNumber} ({selectedGuest.roomType})</div>
                  <div><span className="font-medium">Check-in:</span> {selectedGuest.actualCheckIn}</div>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Calculator className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Hóa đơn</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tiền phòng:</span>
                    <span>{bill.roomCharges.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dịch vụ:</span>
                    <span>{bill.serviceCharges.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí phát sinh:</span>
                    <span>{bill.additionalCharges.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bồi thường:</span>
                    <span>{bill.damages.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Tổng cộng:</span>
                    <span>{bill.total.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>

              {/* Check-out Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian check-out thực tế
                  </label>
                  <input
                    type="datetime-local"
                    value={checkOutData.actualCheckOut}
                    onChange={(e) => setCheckOutData(prev => ({ ...prev, actualCheckOut: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                {/* Additional Charges */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phí phát sinh
                    </label>
                    <button
                      onClick={addAdditionalCharge}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Thêm
                    </button>
                  </div>
                  {checkOutData.additionalCharges.map((charge, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Mô tả"
                        value={charge.description}
                        onChange={(e) => updateAdditionalCharge(index, 'description', e.target.value)}
                        className="input flex-1"
                      />
                      <input
                        type="number"
                        placeholder="Số tiền"
                        value={charge.amount}
                        onChange={(e) => updateAdditionalCharge(index, 'amount', e.target.value)}
                        className="input w-32"
                      />
                      <button
                        onClick={() => removeAdditionalCharge(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Damages */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bồi thường hư hỏng
                    </label>
                    <button
                      onClick={addDamage}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Thêm
                    </button>
                  </div>
                  {checkOutData.damages.map((damage, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Mô tả hư hỏng"
                        value={damage.description}
                        onChange={(e) => updateDamage(index, 'description', e.target.value)}
                        className="input flex-1"
                      />
                      <input
                        type="number"
                        placeholder="Số tiền"
                        value={damage.amount}
                        onChange={(e) => updateDamage(index, 'amount', e.target.value)}
                        className="input w-32"
                      />
                      <button
                        onClick={() => removeDamage(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={checkOutData.paymentMethod}
                    onChange={(e) => setCheckOutData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="input"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="card">Thẻ tín dụng</option>
                    <option value="transfer">Chuyển khoản</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú check-out
                  </label>
                  <textarea
                    value={checkOutData.notes}
                    onChange={(e) => setCheckOutData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input min-h-[80px]"
                    placeholder="Ghi chú thêm về quá trình check-out..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="btn-outline flex-1"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={loading || !checkOutData.actualCheckOut}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Xác nhận check-out
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn khách để check-out
              </h3>
              <p className="text-gray-500">
                Tìm kiếm và chọn khách hàng từ danh sách bên trái
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckOutPage
