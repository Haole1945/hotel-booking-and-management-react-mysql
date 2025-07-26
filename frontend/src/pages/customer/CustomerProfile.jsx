import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User, Mail, Phone, MapPin, Calendar, Lock, Save, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

const CustomerProfile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    ho: user?.ho || '',
    ten: user?.ten || '',
    email: user?.email || '',
    soDienThoai: user?.soDienThoai || '',
    diaChi: user?.diaChi || '',
    ngaySinh: user?.ngaySinh || '',
    gioiTinh: user?.gioiTinh || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      // TODO: Call API to update profile
      toast.success('Cập nhật thông tin thành công!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    try {
      // TODO: Call API to change password
      toast.success('Đổi mật khẩu thành công!')
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản của bạn</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="ho"
                    value={formData.ho}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                    name="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="ngaySinh"
                    value={formData.ngaySinh}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gioiTinh"
                    value={formData.gioiTinh}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {formData.ho} {formData.ten}
            </h3>
            <p className="text-gray-500">{formData.email}</p>
            <button className="btn-outline mt-4">
              Thay đổi ảnh đại diện
            </button>
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Lock className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
            </div>

            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn-outline w-full"
              >
                Đổi mật khẩu
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="btn-outline flex-1"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerProfile
