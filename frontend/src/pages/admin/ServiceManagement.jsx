import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Coffee,
  Filter,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Star
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

const ServiceManagement = () => {
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesPerPage] = useState(12)
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    status: '',
    priceRange: ''
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [serviceForm, setServiceForm] = useState({
    tenDichVu: '',
    moTa: '',
    gia: '',
    danhMuc: '',
    trangThai: 'active',
    thoiGianThucHien: '',
    donVi: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      // Gọi API để lấy danh sách dịch vụ
      const response = await api.get('/api/dich-vu')
      const serviceData = response.data.dichVuList || []

      setServices(serviceData)
      setFilteredServices(serviceData)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters) => {
    let filtered = [...services]

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(service =>
        service.tenDichVu.toLowerCase().includes(searchLower) ||
        service.moTa.toLowerCase().includes(searchLower) ||
        service.danhMuc.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (currentFilters.category) {
      filtered = filtered.filter(service => service.danhMuc === currentFilters.category)
    }

    // Filter by status
    if (currentFilters.status) {
      filtered = filtered.filter(service => service.trangThai === currentFilters.status)
    }

    // Filter by price range
    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split('-').map(Number)
      filtered = filtered.filter(service => {
        const price = service.gia
        return max ? price >= min && price <= max : price >= min
      })
    }

    setFilteredServices(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      status: '',
      priceRange: ''
    })
    setFilteredServices(services)
    setCurrentPage(1)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'inactive': return 'Ngừng hoạt động'
      case 'maintenance': return 'Bảo trì'
      default: return 'Không xác định'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Wellness': return 'text-purple-600 bg-purple-100'
      case 'Food & Beverage': return 'text-orange-600 bg-orange-100'
      case 'Housekeeping': return 'text-blue-600 bg-blue-100'
      case 'Transportation': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleAddService = () => {
    setServiceForm({
      tenDichVu: '',
      moTa: '',
      gia: '',
      danhMuc: '',
      trangThai: 'active',
      thoiGianThucHien: '',
      donVi: 'phút'
    })
    setShowAddModal(true)
  }

  const handleEditService = (service) => {
    setSelectedService(service)
    setServiceForm({
      tenDichVu: service.tenDichVu,
      moTa: service.moTa,
      gia: service.gia.toString(),
      danhMuc: service.danhMuc,
      trangThai: service.trangThai,
      thoiGianThucHien: service.thoiGianThucHien,
      donVi: service.donVi
    })
    setShowEditModal(true)
  }

  const handleViewService = (service) => {
    setSelectedService(service)
    setShowDetailModal(true)
  }

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        // TODO: Call API to delete service
        setServices(prev => prev.filter(service => service.id !== serviceId))
        setFilteredServices(prev => prev.filter(service => service.id !== serviceId))
        toast.success('Xóa dịch vụ thành công!')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa dịch vụ')
      }
    }
  }

  const handleSaveService = async (e) => {
    e.preventDefault()
    try {
      if (showEditModal) {
        // TODO: Call API to update service
        setServices(prev => prev.map(service =>
          service.id === selectedService.id
            ? {
                ...service,
                ...serviceForm,
                gia: parseInt(serviceForm.gia)
              }
            : service
        ))
        toast.success('Cập nhật dịch vụ thành công!')
      } else {
        // TODO: Call API to create service
        const newService = {
          id: Date.now(),
          ...serviceForm,
          gia: parseInt(serviceForm.gia),
          soLuongDat: 0,
          danhGia: 0,
          hinhAnh: '/api/placeholder/300/200'
        }
        setServices(prev => [...prev, newService])
        toast.success('Thêm dịch vụ thành công!')
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedService(null)
      applyFilters(filters)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu dịch vụ')
    }
  }

  // Get current services for pagination
  const indexOfLastService = currentPage * servicesPerPage
  const indexOfFirstService = indexOfLastService - servicesPerPage
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService)

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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý dịch vụ</h1>
          <p className="text-gray-600 mt-2">Thêm, sửa, xóa và quản lý dịch vụ khách sạn</p>
        </div>
        <button
          onClick={handleAddService}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dịch vụ mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Coffee className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng dịch vụ</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter(s => s.trangThai === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bảo trì</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter(s => s.trangThai === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu dịch vụ</p>
              <p className="text-2xl font-bold text-gray-900">15M</p>
              <p className="text-xs text-gray-500">VNĐ/tháng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
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
              placeholder="Tên dịch vụ, mô tả..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Wellness">Wellness</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Transportation">Transportation</option>
            </select>
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
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>

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
              <option value="0-100000">Dưới 100K</option>
              <option value="100000-300000">100K - 300K</option>
              <option value="300000-500000">300K - 500K</option>
              <option value="500000-999999999">Trên 500K</option>
            </select>
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

      {/* Services Grid */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách dịch vụ ({filteredServices.length})
          </h2>
        </div>

        {filteredServices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentServices.map((service) => (
                <div key={service.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={service.hinhAnh}
                    alt={service.tenDichVu}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {service.tenDichVu}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.trangThai)}`}>
                        {getStatusText(service.trangThai)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.moTa}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Danh mục:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(service.danhMuc)}`}>
                          {service.danhMuc}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Giá:</span>
                        <span className="font-semibold text-gray-900">
                          {service.gia.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thời gian:</span>
                        <span>{service.thoiGianThucHien} {service.donVi}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Đánh giá:</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{service.danhGia}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Đã đặt:</span>
                        <span>{service.soLuongDat} lần</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewService(service)}
                        className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Xem
                      </button>
                      <button
                        onClick={() => handleEditService(service)}
                        className="flex-1 text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              itemsPerPage={servicesPerPage}
              totalItems={filteredServices.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có dịch vụ nào
            </h3>
            <p className="text-gray-500">
              Không tìm thấy dịch vụ nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setSelectedService(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên dịch vụ
                  </label>
                  <input
                    type="text"
                    value={serviceForm.tenDichVu}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, tenDichVu: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={serviceForm.moTa}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, moTa: e.target.value }))}
                    className="input min-h-[80px]"
                    placeholder="Mô tả chi tiết về dịch vụ..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={serviceForm.gia}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, gia: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={serviceForm.danhMuc}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, danhMuc: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Transportation">Transportation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian thực hiện
                    </label>
                    <input
                      type="number"
                      value={serviceForm.thoiGianThucHien}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, thoiGianThucHien: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đơn vị
                    </label>
                    <select
                      value={serviceForm.donVi}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, donVi: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="phút">Phút</option>
                      <option value="giờ">Giờ</option>
                      <option value="ngày">Ngày</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={serviceForm.trangThai}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, trangThai: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedService(null)
                    }}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {showEditModal ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {showDetailModal && selectedService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết dịch vụ
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <img
                  src={selectedService.hinhAnh}
                  alt={selectedService.tenDichVu}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.tenDichVu}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedService.danhMuc)}`}>
                      {selectedService.danhMuc}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giá</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.gia.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thời gian</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.thoiGianThucHien} {selectedService.donVi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900">{selectedService.danhGia}/5</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng đặt</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.soLuongDat} lần</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedService.trangThai)}`}>
                      {getStatusText(selectedService.trangThai)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.moTa}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn-outline"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleEditService(selectedService)
                  }}
                  className="btn-primary"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceManagement
