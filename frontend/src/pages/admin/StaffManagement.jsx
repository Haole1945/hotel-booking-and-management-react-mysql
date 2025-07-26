import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Shield,
  User
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'

const StaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [staffPerPage] = useState(10)
  const [filters, setFilters] = useState({
    searchTerm: '',
    role: '',
    status: '',
    department: ''
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [staffForm, setStaffForm] = useState({
    ho: '',
    ten: '',
    email: '',
    soDienThoai: '',
    diaChi: '',
    ngaySinh: '',
    gioiTinh: '',
    chucVu: '',
    phongBan: '',
    luong: '',
    ngayVaoLam: '',
    trangThai: 'active'
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      // Mock data - sẽ thay thế bằng API call
      const mockStaff = [
        {
          id: 1,
          ho: 'Nguyễn',
          ten: 'Thị Lan',
          hoTen: 'Nguyễn Thị Lan',
          email: 'lan.nguyen@hotel.com',
          soDienThoai: '0123456789',
          diaChi: '123 Đường ABC, Quận 1, TP.HCM',
          ngaySinh: '1990-05-15',
          gioiTinh: 'Nữ',
          chucVu: 'Lễ tân',
          phongBan: 'Front Office',
          luong: 12000000,
          ngayVaoLam: '2023-01-15',
          trangThai: 'active',
          role: 'EMPLOYEE'
        },
        {
          id: 2,
          ho: 'Trần',
          ten: 'Văn Nam',
          hoTen: 'Trần Văn Nam',
          email: 'nam.tran@hotel.com',
          soDienThoai: '0987654321',
          diaChi: '456 Đường XYZ, Quận 3, TP.HCM',
          ngaySinh: '1988-08-22',
          gioiTinh: 'Nam',
          chucVu: 'Lễ tân trưởng',
          phongBan: 'Front Office',
          luong: 15000000,
          ngayVaoLam: '2022-03-20',
          trangThai: 'active',
          role: 'EMPLOYEE'
        },
        {
          id: 3,
          ho: 'Lê',
          ten: 'Thị Hoa',
          hoTen: 'Lê Thị Hoa',
          email: 'hoa.le@hotel.com',
          soDienThoai: '0369852147',
          diaChi: '789 Đường DEF, Quận 7, TP.HCM',
          ngaySinh: '1992-12-10',
          gioiTinh: 'Nữ',
          chucVu: 'Housekeeping',
          phongBan: 'Housekeeping',
          luong: 10000000,
          ngayVaoLam: '2023-06-10',
          trangThai: 'active',
          role: 'EMPLOYEE'
        },
        {
          id: 4,
          ho: 'Phạm',
          ten: 'Minh Tuấn',
          hoTen: 'Phạm Minh Tuấn',
          email: 'tuan.pham@hotel.com',
          soDienThoai: '0741852963',
          diaChi: '321 Đường GHI, Quận 5, TP.HCM',
          ngaySinh: '1985-03-25',
          gioiTinh: 'Nam',
          chucVu: 'Quản lý',
          phongBan: 'Management',
          luong: 25000000,
          ngayVaoLam: '2021-01-01',
          trangThai: 'active',
          role: 'ADMIN'
        }
      ]

      setStaff(mockStaff)
      setFilteredStaff(mockStaff)
    } catch (error) {
      console.error('Error fetching staff:', error)
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
    let filtered = [...staff]

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(member =>
        member.hoTen.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.soDienThoai.includes(searchLower) ||
        member.chucVu.toLowerCase().includes(searchLower)
      )
    }

    // Filter by role
    if (currentFilters.role) {
      filtered = filtered.filter(member => member.role === currentFilters.role)
    }

    // Filter by status
    if (currentFilters.status) {
      filtered = filtered.filter(member => member.trangThai === currentFilters.status)
    }

    // Filter by department
    if (currentFilters.department) {
      filtered = filtered.filter(member => member.phongBan === currentFilters.department)
    }

    setFilteredStaff(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      role: '',
      status: '',
      department: ''
    })
    setFilteredStaff(staff)
    setCurrentPage(1)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      case 'suspended': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'inactive': return 'Nghỉ việc'
      case 'suspended': return 'Tạm nghỉ'
      default: return 'Không xác định'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'text-purple-600 bg-purple-100'
      case 'EMPLOYEE': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản lý'
      case 'EMPLOYEE': return 'Nhân viên'
      default: return 'Không xác định'
    }
  }

  const handleAddStaff = () => {
    setStaffForm({
      ho: '',
      ten: '',
      email: '',
      soDienThoai: '',
      diaChi: '',
      ngaySinh: '',
      gioiTinh: '',
      chucVu: '',
      phongBan: '',
      luong: '',
      ngayVaoLam: '',
      trangThai: 'active'
    })
    setShowAddModal(true)
  }

  const handleEditStaff = (member) => {
    setSelectedStaff(member)
    setStaffForm({
      ho: member.ho,
      ten: member.ten,
      email: member.email,
      soDienThoai: member.soDienThoai,
      diaChi: member.diaChi,
      ngaySinh: member.ngaySinh,
      gioiTinh: member.gioiTinh,
      chucVu: member.chucVu,
      phongBan: member.phongBan,
      luong: member.luong.toString(),
      ngayVaoLam: member.ngayVaoLam,
      trangThai: member.trangThai
    })
    setShowEditModal(true)
  }

  const handleViewStaff = (member) => {
    setSelectedStaff(member)
    setShowDetailModal(true)
  }

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        // TODO: Call API to delete staff
        setStaff(prev => prev.filter(member => member.id !== staffId))
        setFilteredStaff(prev => prev.filter(member => member.id !== staffId))
        toast.success('Xóa nhân viên thành công!')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa nhân viên')
      }
    }
  }

  const handleSaveStaff = async (e) => {
    e.preventDefault()
    try {
      if (showEditModal) {
        // TODO: Call API to update staff
        setStaff(prev => prev.map(member =>
          member.id === selectedStaff.id
            ? {
                ...member,
                ...staffForm,
                hoTen: `${staffForm.ho} ${staffForm.ten}`,
                luong: parseInt(staffForm.luong)
              }
            : member
        ))
        toast.success('Cập nhật nhân viên thành công!')
      } else {
        // TODO: Call API to create staff
        const newStaff = {
          id: Date.now(),
          ...staffForm,
          hoTen: `${staffForm.ho} ${staffForm.ten}`,
          luong: parseInt(staffForm.luong),
          role: 'EMPLOYEE'
        }
        setStaff(prev => [...prev, newStaff])
        toast.success('Thêm nhân viên thành công!')
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedStaff(null)
      applyFilters(filters)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu nhân viên')
    }
  }

  // Get current staff for pagination
  const indexOfLastStaff = currentPage * staffPerPage
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff)

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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
          <p className="text-gray-600 mt-2">Thêm, sửa, xóa và quản lý nhân viên khách sạn</p>
        </div>
        <button
          onClick={handleAddStaff}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhân viên
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang làm việc</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.trangThai === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quản lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.role === 'EMPLOYEE').length}
              </p>
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
              placeholder="Tên, email, SĐT, chức vụ..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="ADMIN">Quản lý</option>
              <option value="EMPLOYEE">Nhân viên</option>
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
              <option value="inactive">Nghỉ việc</option>
              <option value="suspended">Tạm nghỉ</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phòng ban
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Front Office">Front Office</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Management">Management</option>
              <option value="Security">Security</option>
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

      {/* Staff Table */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách nhân viên ({filteredStaff.length})
          </h2>
        </div>

        {filteredStaff.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chức vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lương
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
                  {currentStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.hoTen}
                          </div>
                          <div className="text-sm text-gray-500">
                            Vào làm: {member.ngayVaoLam}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                            {member.soDienThoai}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            {member.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.chucVu}</div>
                          <div className="text-sm text-gray-500">{member.phongBan}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                          {getRoleText(member.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.luong.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.trangThai)}`}>
                          {getStatusText(member.trangThai)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewStaff(member)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditStaff(member)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={staffPerPage}
              totalItems={filteredStaff.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có nhân viên nào
            </h3>
            <p className="text-gray-500">
              Không tìm thấy nhân viên nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Staff Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setSelectedStaff(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveStaff} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      value={staffForm.ho}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, ho: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={staffForm.ten}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, ten: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={staffForm.soDienThoai}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, soDienThoai: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={staffForm.diaChi}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, diaChi: e.target.value }))}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={staffForm.ngaySinh}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, ngaySinh: e.target.value }))}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={staffForm.gioiTinh}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, gioiTinh: e.target.value }))}
                      className="input"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      value={staffForm.chucVu}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, chucVu: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phòng ban
                    </label>
                    <select
                      value={staffForm.phongBan}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, phongBan: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Chọn phòng ban</option>
                      <option value="Front Office">Front Office</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Management">Management</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lương (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={staffForm.luong}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, luong: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày vào làm
                    </label>
                    <input
                      type="date"
                      value={staffForm.ngayVaoLam}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, ngayVaoLam: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={staffForm.trangThai}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, trangThai: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Nghỉ việc</option>
                      <option value="suspended">Tạm nghỉ</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedStaff(null)
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

      {/* Staff Detail Modal */}
      {showDetailModal && selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết nhân viên
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.hoTen}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.gioiTinh}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.ngaySinh}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.soDienThoai}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.diaChi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.chucVu}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phòng ban</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.phongBan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lương</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.luong.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày vào làm</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.ngayVaoLam}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedStaff.role)}`}>
                      {getRoleText(selectedStaff.role)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedStaff.trangThai)}`}>
                      {getStatusText(selectedStaff.trangThai)}
                    </span>
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
                    handleEditStaff(selectedStaff)
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

export default StaffManagement
