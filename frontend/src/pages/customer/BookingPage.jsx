import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RoomSearch from '../../components/common/RoomSearch'
import RoomResult from '../../components/common/RoomResult'
import Pagination from '../../components/common/Pagination'
import { roomService } from '../../services/roomService'
import { Search, Filter, MapPin } from 'lucide-react'

const BookingPage = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(6)
  const [filters, setFilters] = useState({
    priceRange: '',
    roomType: '',
    amenities: []
  })

  useEffect(() => {
    fetchAvailableRooms()
  }, [])

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getAvailableRooms()
      if (response.statusCode === 200) {
        setRooms(response.phongList || [])
        setFilteredRooms(response.phongList || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchResult = (searchResults) => {
    setRooms(searchResults)
    setFilteredRooms(searchResults)
    setCurrentPage(1)
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters) => {
    let filtered = [...rooms]

    // Filter by price range
    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split('-').map(Number)
      filtered = filtered.filter(room => {
        const price = room.giaPhong || 0
        return price >= min && price <= max
      })
    }

    // Filter by room type
    if (currentFilters.roomType) {
      filtered = filtered.filter(room =>
        room.tenKp?.toLowerCase().includes(currentFilters.roomType.toLowerCase())
      )
    }

    setFilteredRooms(filtered)
    setCurrentPage(1)
  }

  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom)

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Đặt phòng</h1>
          <p className="text-gray-600 mt-2">Tìm và đặt phòng phù hợp với nhu cầu của bạn</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <MapPin className="w-5 h-5" />
          <span>Hotel Booking</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm phòng</h2>
        </div>
        <RoomSearch handleSearchResult={handleSearchResult} />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Bộ lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="0-1000000">Dưới 1,000,000 VNĐ</option>
              <option value="1000000-2000000">1,000,000 - 2,000,000 VNĐ</option>
              <option value="2000000-5000000">2,000,000 - 5,000,000 VNĐ</option>
              <option value="5000000-999999999">Trên 5,000,000 VNĐ</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại phòng
            </label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ priceRange: '', roomType: '', amenities: [] })
                setFilteredRooms(rooms)
                setCurrentPage(1)
              }}
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
            Kết quả ({filteredRooms.length} phòng)
          </h2>
          <div className="text-sm text-gray-500">
            Hiển thị {currentRooms.length} trong tổng số {filteredRooms.length} phòng
          </div>
        </div>

        {filteredRooms.length > 0 ? (
          <>
            <RoomResult roomSearchResults={currentRooms} />
            <Pagination
              itemsPerPage={roomsPerPage}
              totalItems={filteredRooms.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy phòng nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage
