import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity
} from 'lucide-react'

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  })
  const [reportType, setReportType] = useState('revenue')
  const [loading, setLoading] = useState(false)
  const [revenueData, setRevenueData] = useState({
    total: 0,
    growth: 0,
    daily: 0,
    monthly: 0,
    byService: []
  })

  useEffect(() => {
    fetchReportData()
  }, [dateRange, reportType])

  const fetchReportData = async () => {
    try {
      setLoading(true)

      // Gọi API để lấy dữ liệu báo cáo
      const response = await api.get('/api/reports', {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          type: reportType
        }
      })

      if (response.data.success) {
        setRevenueData(response.data.data || {})
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const exportReport = (format) => {
    // TODO: Implement export functionality
    console.log(`Exporting ${reportType} report as ${format}`)
  }

  const getGrowthIcon = (growth) => {
    return growth > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-2">Phân tích dữ liệu hoạt động kinh doanh</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchReportData()}
            className="btn-outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="btn-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Bộ lọc báo cáo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại báo cáo
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input"
            >
              <option value="revenue">Doanh thu</option>
              <option value="occupancy">Tỷ lệ lấp đầy</option>
              <option value="customer">Khách hàng</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchReportData}
              className="btn-primary w-full"
              disabled={loading}
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(revenueData.total / 1000000).toFixed(0)}M VNĐ
                  </p>
                  <div className="flex items-center mt-1">
                    {getGrowthIcon(revenueData.growth)}
                    <span className={`text-sm ml-1 ${getGrowthColor(revenueData.growth)}`}>
                      {revenueData.growth}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doanh thu/ngày</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(revenueData.daily / 1000000).toFixed(1)}M VNĐ
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doanh thu/tháng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(revenueData.monthly / 1000000).toFixed(0)}M VNĐ
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nguồn chính</p>
                  <p className="text-2xl font-bold text-gray-900">Phòng</p>
                  <p className="text-sm text-gray-500">76.5%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo dịch vụ</h3>
              <div className="space-y-4">
                {revenueData.byService.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                        <span className="text-sm text-gray-600">{service.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${service.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {(service.value / 1000000).toFixed(0)}M VNĐ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Biểu đồ doanh thu theo thời gian</p>
                  <p className="text-sm text-gray-400 mt-2">Tích hợp Chart.js</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xuất báo cáo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-6 h-6 text-red-600 mr-2" />
            <span className="font-medium">PDF</span>
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-medium">Excel</span>
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-medium">CSV</span>
          </button>
          <button
            onClick={() => exportReport('print')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-6 h-6 text-purple-600 mr-2" />
            <span className="font-medium">In</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
