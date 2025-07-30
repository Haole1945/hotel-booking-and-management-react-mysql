import React, { useState, useEffect } from 'react'
import { Users, Wrench, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { roomService } from '../../services/roomService'

const RoomMap = ({ onRoomSelect, selectedRoom, checkInDate, checkOutDate }) => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredRoom, setHoveredRoom] = useState(null)

  useEffect(() => {
    fetchRooms()
  }, [checkInDate, checkOutDate])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      let response

      if (checkInDate && checkOutDate) {
        // Get available rooms for the date range
        response = await roomService.getAvailableRoomsByDateRange(checkInDate, checkOutDate)
      } else {
        // Get all rooms
        response = await roomService.getAllRooms()
      }

      let roomData = response.phongList || response.data || []

      // If we have date range, mark rooms as booked if they're not available
      if (checkInDate && checkOutDate && roomData.length > 0) {
        // Get all rooms first
        const allRoomsResponse = await roomService.getAllRooms()
        const allRooms = allRoomsResponse.phongList || allRoomsResponse.data || []

        // Mark rooms as booked if they're not in the available list
        const availableRoomNumbers = roomData.map(room => room.soPhong)
        roomData = allRooms.map(room => {
          if (!availableRoomNumbers.includes(room.soPhong) && room.trangThai?.tenTrangThai === 'Trống') {
            return {
              ...room,
              trangThai: { tenTrangThai: 'Đã được đặt' }
            }
          }
          return room
        })
      }

      setRooms(roomData)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const getRoomStatusColor = (room) => {
    const status = room.trangThai?.tenTrangThai || room.status
    switch (status) {
      case 'Trống':
        return 'bg-green-100 border-green-300 hover:bg-green-200'
      case 'Đã có khách':
        return 'bg-white border-gray-300 hover:bg-gray-50'
      case 'Đang bảo trì':
        return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
      case 'Đã được đặt':
        return 'bg-blue-100 border-blue-300 hover:bg-blue-200'
      default:
        return 'bg-green-100 border-green-300 hover:bg-green-200'
    }
  }

  const getRoomStatusIcon = (room) => {
    const status = room.trangThai?.tenTrangThai || room.status
    switch (status) {
      case 'Trống':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Đã có khách':
        return <Users className="w-4 h-4 text-gray-600" />
      case 'Đang bảo trì':
        return <Wrench className="w-4 h-4 text-yellow-600" />
      case 'Đã được đặt':
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />
    }
  }

  const isRoomAvailable = (room) => {
    const status = room.trangThai?.tenTrangThai || room.status
    return status === 'Trống'
  }

  const handleRoomClick = (room) => {
    if (isRoomAvailable(room) && onRoomSelect) {
      onRoomSelect(room)
    }
  }

  const groupRoomsByFloor = (rooms) => {
    const grouped = {}
    rooms.forEach(room => {
      const floor = room.tang || 1
      if (!grouped[floor]) {
        grouped[floor] = []
      }
      grouped[floor].push(room)
    })
    
    // Sort rooms by room number within each floor
    Object.keys(grouped).forEach(floor => {
      grouped[floor].sort((a, b) => a.soPhong.localeCompare(b.soPhong))
    })
    
    return grouped
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">Đang tải sơ đồ phòng...</span>
      </div>
    )
  }

  const roomsByFloor = groupRoomsByFloor(rooms)
  const floors = Object.keys(roomsByFloor).sort((a, b) => parseInt(b) - parseInt(a)) // Descending order

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-700">Trống</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Đã có khách</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <Wrench className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-gray-700">Đang bảo trì</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-700">Đã được đặt</span>
        </div>
      </div>

      {/* Room Map */}
      <div className="space-y-4">
        {floors.map(floor => (
          <div key={floor} className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Tầng {floor}
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {roomsByFloor[floor].map(room => (
                <div
                  key={room.soPhong}
                  className={`
                    relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${getRoomStatusColor(room)}
                    ${selectedRoom?.soPhong === room.soPhong ? 'ring-2 ring-primary-500' : ''}
                    ${!isRoomAvailable(room) ? 'cursor-not-allowed opacity-75' : ''}
                  `}
                  onClick={() => handleRoomClick(room)}
                  onMouseEnter={() => setHoveredRoom(room)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      {getRoomStatusIcon(room)}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {room.soPhong}
                    </div>
                  </div>

                  {/* Tooltip */}
                  {hoveredRoom?.soPhong === room.soPhong && (
                    <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg min-w-48">
                      <div className="space-y-1">
                        <div><strong>Phòng:</strong> {room.soPhong}</div>
                        <div><strong>Tầng:</strong> {room.tang}</div>
                        <div><strong>Loại phòng:</strong> {room.hangPhong?.kieuPhong?.tenKp || 'N/A'}</div>
                        <div><strong>Hạng phòng:</strong> {room.hangPhong?.loaiPhong?.tenLp || 'N/A'}</div>
                        <div><strong>Giá:</strong> {formatPrice(room.hangPhong?.giaPhong || 0)}</div>
                        <div><strong>Sức chứa:</strong> {room.hangPhong?.soNguoiToiDa || 2} người</div>
                        <div><strong>Trạng thái:</strong> {room.trangThai?.tenTrangThai || 'N/A'}</div>
                        {room.currentGuest && (
                          <div className="border-t border-gray-700 pt-1 mt-1">
                            <div><strong>Khách:</strong> {room.currentGuest.name}</div>
                            <div><strong>Check-in:</strong> {room.currentGuest.checkIn}</div>
                            <div><strong>Check-out:</strong> {room.currentGuest.checkOut}</div>
                          </div>
                        )}
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Room Info */}
      {selectedRoom && (
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <h4 className="font-semibold text-primary-900 mb-2">Phòng đã chọn</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Số phòng:</strong> {selectedRoom.soPhong}</div>
            <div><strong>Tầng:</strong> {selectedRoom.tang}</div>
            <div><strong>Loại phòng:</strong> {selectedRoom.hangPhong?.kieuPhong?.tenKp || 'N/A'}</div>
            <div><strong>Giá:</strong> {formatPrice(selectedRoom.hangPhong?.giaPhong || 0)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomMap
