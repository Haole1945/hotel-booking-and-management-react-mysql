import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Users, Star, Wifi, Car, Coffee, Dumbbell } from 'lucide-react'
import RoomSearch from '../../components/common/RoomSearch'
import RoomResult from '../../components/common/RoomResult'

const HomePage = () => {
  const [roomSearchResults, setRoomSearchResults] = useState([])

  const handleSearchResult = (results) => {
    setRoomSearchResults(results)
  }

  const featuredRooms = [
    {
      id: 1,
      name: 'Phòng Deluxe',
      image: '/api/placeholder/400/300',
      price: '1,500,000',
      rating: 4.8,
      amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar']
    },
    {
      id: 2,
      name: 'Phòng Suite',
      image: '/api/placeholder/400/300',
      price: '2,500,000',
      rating: 4.9,
      amenities: ['Wifi', 'TV', 'Điều hòa', 'Jacuzzi']
    },
    {
      id: 3,
      name: 'Phòng Standard',
      image: '/api/placeholder/400/300',
      price: '800,000',
      rating: 4.5,
      amenities: ['Wifi', 'TV', 'Điều hòa']
    }
  ]

  const services = [
    {
      icon: Wifi,
      title: 'Wifi miễn phí',
      description: 'Kết nối internet tốc độ cao trong toàn bộ khách sạn'
    },
    {
      icon: Car,
      title: 'Bãi đỗ xe',
      description: 'Bãi đỗ xe rộng rãi, an toàn cho khách hàng'
    },
    {
      icon: Coffee,
      title: 'Nhà hàng',
      description: 'Nhà hàng phục vụ các món ăn ngon, đa dạng'
    },
    {
      icon: Dumbbell,
      title: 'Phòng gym',
      description: 'Phòng tập gym hiện đại với đầy đủ thiết bị'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chào mừng đến với Hotel Booking
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Trải nghiệm nghỉ dưỡng tuyệt vời với dịch vụ chất lượng cao
            </p>

            {/* Search Form - Using existing RoomSearch component */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <RoomSearch handleSearchResult={handleSearchResult} />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {roomSearchResults.length > 0 && (
        <section className="py-8">
          <div className="container">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kết quả tìm kiếm</h2>
            <RoomResult roomSearchResults={roomSearchResults} />
          </div>
        </section>
      )}

      {/* Featured Rooms */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Phòng nổi bật</h2>
            <p className="text-gray-600">Khám phá các loại phòng tuyệt vời của chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <div key={room.id} className="card hover:shadow-lg transition-shadow">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{room.rating}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary-600 mb-3">
                  {room.price} VNĐ<span className="text-sm text-gray-500">/đêm</span>
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/rooms/${room.id}`}
                  className="btn-primary w-full text-center"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/rooms" className="btn-outline">
              Xem tất cả phòng
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ nổi bật</h2>
            <p className="text-gray-600">Những tiện ích tuyệt vời dành cho bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
