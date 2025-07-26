import { api } from './api'

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      // If backend is not running, simulate login with mock data
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.warn('Backend not available, simulating login...')

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check mock users first
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')
        const mockUser = mockUsers.find(user => user.email === credentials.email)

        if (mockUser) {
          const token = 'mock-token-' + Date.now()
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(mockUser))

          return {
            success: true,
            token: token,
            user: mockUser
          }
        }

        // Default admin user for testing
        if (credentials.email === 'admin@hotel.com' && credentials.matKhau === 'admin123') {
          const adminUser = {
            id: 1,
            ho: 'Admin',
            ten: 'System',
            email: 'admin@hotel.com',
            role: 'ADMIN'
          }
          const token = 'mock-admin-token'
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(adminUser))

          return {
            success: true,
            token: token,
            user: adminUser
          }
        }

        // Default staff user for testing
        if (credentials.email === 'staff@hotel.com' && credentials.matKhau === 'staff123') {
          const staffUser = {
            id: 2,
            ho: 'Nhân viên',
            ten: 'Lễ tân',
            email: 'staff@hotel.com',
            role: 'EMPLOYEE'
          }
          const token = 'mock-staff-token'
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(staffUser))

          return {
            success: true,
            token: token,
            user: staffUser
          }
        }

        throw { message: 'Email hoặc mật khẩu không đúng' }
      }

      throw error.response?.data || error.message
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      // If backend is not running, simulate successful registration
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.warn('Backend not available, simulating registration...')

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check if user already exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')
        const userExists = existingUsers.find(user => user.email === userData.email)

        if (userExists) {
          throw { message: 'Email đã được sử dụng' }
        }

        // Save user to localStorage
        const newUser = {
          id: Date.now(),
          ...userData,
          role: 'CUSTOMER',
          createdAt: new Date().toISOString()
        }
        delete newUser.matKhau // Don't store password

        existingUsers.push(newUser)
        localStorage.setItem('mockUsers', JSON.stringify(existingUsers))

        return {
          success: true,
          message: 'Đăng ký thành công',
          user: newUser
        }
      }

      throw error.response?.data || error.message
    }
  },

  async logout() {
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/nhanvien/my-info')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Helper methods from old ApiService
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'ADMIN'
  },

  isEmployee() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'EMPLOYEE'
  },

  isUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'CUSTOMER'
  }
}

export default api
