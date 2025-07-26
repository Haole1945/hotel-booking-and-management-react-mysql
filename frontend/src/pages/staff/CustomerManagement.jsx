import React, { useState, useEffect } from 'react'
import {
  Search,
  Users,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  TrendingUp
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [customersPerPage] = useState(10)
  const [filters, setFilters] = useState({
    searchTerm: '',
    customerType: '',
    registrationDate: ''
  })
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCustomerDetail, setShowCustomerDetail] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Mock data - sẽ thay thế bằng API call
      const mockCustomers = [
        {
          id: 1,
          hoTen: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          soDienThoai: '0123456789',
          diaChi: '123 Đường ABC, Quận 1, TP.HCM',
          ngaySinh: '1990-05-15',
          gioiTinh: 'Nam',
          ngayDangKy: '2023-01-15',
          loaiKhachHang: 'VIP',
          tongDatPhong: 15,
          tongChiTieu: 25000000,
          lanCuoiDatPhong: '2024-01-10',
          trangThai: 'active'
        },
        {
          id: 2,
          hoTen: 'Trần Thị B',
          email: 'tranthib@email.com',
          soDienThoai: '0987654321',
          diaChi: '456 Đường XYZ, Quận 3, TP.HCM',
          ngaySinh: '1985-08-22',
          gioiTinh: 'Nữ',
          ngayDangKy: '2023-03-20',
          loaiKhachHang: 'Thường',
          tongDatPhong: 8,
          tongChiTieu: 12000000,
          lanCuoiDatPhong: '2024-01-05',
          trangThai: 'active'
        },
        {
          id: 3,
          hoTen: 'Lê Văn C',
          email: 'levanc@email.com',
          soDienThoai: '0369852147',
          diaChi: '789 Đường DEF, Quận 7, TP.HCM',
          ngaySinh: '1992-12-10',
          gioiTinh: 'Nam',
          ngayDangKy: '2023-06-10',
          loaiKhachHang: 'Thường',
          tongDatPhong: 3,
          tongChiTieu: 4500000,
          lanCuoiDatPhong: '2023-12-20',
          trangThai: 'inactive'
        }
      ]

      setCustomers(mockCustomers)
      setFilteredCustomers(mockCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
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
    let filtered = [...customers]

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(customer =>
        customer.hoTen.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.soDienThoai.includes(searchLower)
      )
    }

    // Filter by customer type
    if (currentFilters.customerType) {
      filtered = filtered.filter(customer => customer.loaiKhachHang === currentFilters.customerType)
    }

    // Filter by registration date
    if (currentFilters.registrationDate) {
      filtered = filtered.filter(customer =>
        new Date(customer.ngayDangKy) >= new Date(currentFilters.registrationDate)
      )
    }

    setFilteredCustomers(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      customerType: '',
      registrationDate: ''
    })
    setFilteredCustomers(customers)
    setCurrentPage(1)
  }

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'VIP': return 'text-purple-600 bg-purple-100'
      case 'Thường': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'inactive': return 'Không hoạt động'
      default: return 'Không xác định'
    }
  }

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetail(true)
  }

  // Get current customers for pagination
  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)

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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <p className="text-gray-600 mt-2">Xem và quản lý thông tin khách hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách VIP</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.loaiKhachHang === 'VIP').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.trangThai === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mới tháng này</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm và lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên, email, số điện thoại..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Customer Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại khách hàng
            </label>
            <select
              value={filters.customerType}
              onChange={(e) => handleFilterChange('customerType', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="VIP">VIP</option>
              <option value="Thường">Thường</option>
            </select>
          </div>

          {/* Registration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đăng ký từ ngày
            </label>
            <input
              type="date"
              value={filters.registrationDate}
              onChange={(e) => handleFilterChange('registrationDate', e.target.value)}
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
            Danh sách khách hàng ({filteredCustomers.length})
          </h2>
        </div>

        {filteredCustomers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thống kê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.hoTen}
                          </div>
                          <div className="text-sm text-gray-500">
                            Đăng ký: {customer.ngayDangKy}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                            {customer.soDienThoai}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            {customer.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(customer.loaiKhachHang)}`}>
                          {customer.loaiKhachHang}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{customer.tongDatPhong} đặt phòng</div>
                          <div className="text-gray-500">
                            {customer.tongChiTieu.toLocaleString('vi-VN')} VNĐ
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.trangThai)}`}>
                          {getStatusText(customer.trangThai)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={customersPerPage}
              totalItems={filteredCustomers.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có khách hàng nào
            </h3>
            <p className="text-gray-500">
              Không tìm thấy khách hàng nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showCustomerDetail && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết khách hàng
                </h3>
                <button
                  onClick={() => setShowCustomerDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.hoTen}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.gioiTinh}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.ngaySinh}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.soDienThoai}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.diaChi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loại khách hàng</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(selectedCustomer.loaiKhachHang)}`}>
                      {selectedCustomer.loaiKhachHang}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.trangThai)}`}>
                      {getStatusText(selectedCustomer.trangThai)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng đặt phòng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.tongDatPhong} lần</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng chi tiêu</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.tongChiTieu.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Lần cuối đặt phòng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.lanCuoiDatPhong}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCustomerDetail(false)}
                  className="btn-outline"
                >
                  Đóng
                </button>
                <button className="btn-primary">
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

export default CustomerManagement
