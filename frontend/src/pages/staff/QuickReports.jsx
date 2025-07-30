import React, { useState, useEffect } from 'react'
import { BarChart3, Calendar, Users, TrendingUp, Download, RefreshCw } from 'lucide-react'
import { rentalService } from '../../services/rentalService'
import { bookingService } from '../../services/bookingService'

const QuickReports = () => {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState({
    todayCheckIns: [],
    todayCheckOuts: [],
    currentStays: [],
    pendingBookings: []
  })
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchReportData()
  }, [selectedDate])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const [checkInsResponse, checkOutsResponse, currentStaysResponse, pendingResponse] = await Promise.all([
        rentalService.getTodayCheckIns(),
        rentalService.getTodayCheckOuts(),
        rentalService.getCurrentStays(),
        bookingService.getPendingBookings()
      ])

      setReportData({
        todayCheckIns: checkInsResponse.phieuThueList || [],
        todayCheckOuts: checkOutsResponse.phieuThueList || [],
        currentStays: currentStaysResponse.phieuThueList || [],
        pendingBookings: pendingResponse.phieuDatList || []
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchReportData()
  }

  const handleExport = (reportType) => {
    // TODO: Implement export functionality
    console.log(`Exporting ${reportType} report`)
  }

  const ReportCard = ({ title, data, icon: Icon, color, onExport }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${color} mr-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="text-gray-500 hover:text-gray-700"
            title="Xuất báo cáo"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold text-gray-900 mb-4">
          {data.length} {title.toLowerCase()}
        </div>

        {data.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    {item.hoTenKhachHang || item.customerName || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.sdtKhachHang || item.customerPhone || 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {item.maPhieuThue || `PT${item.idPt}` || `PD${item.idPd}` || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.ngayDen || item.ngayBdThue || item.checkIn || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
            {data.length > 5 && (
              <div className="text-center text-sm text-gray-500 py-2">
                Và {data.length - 5} mục khác...
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo nhanh</h1>
          <p className="text-gray-600 mt-2">Tổng quan hoạt động hôm nay</p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày báo cáo
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-blue-50">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-in hôm nay</p>
              <p className="text-2xl font-bold text-blue-600">{reportData.todayCheckIns.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-out hôm nay</p>
              <p className="text-2xl font-bold text-green-600">{reportData.todayCheckOuts.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-purple-50">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách đang ở</p>
              <p className="text-2xl font-bold text-purple-600">{reportData.currentStays.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-yellow-50">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đặt phòng chờ</p>
              <p className="text-2xl font-bold text-yellow-600">{reportData.pendingBookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Check-in hôm nay"
          data={reportData.todayCheckIns}
          icon={Users}
          color="bg-blue-500"
          onExport={() => handleExport('checkins')}
        />

        <ReportCard
          title="Check-out hôm nay"
          data={reportData.todayCheckOuts}
          icon={TrendingUp}
          color="bg-green-500"
          onExport={() => handleExport('checkouts')}
        />

        <ReportCard
          title="Khách đang lưu trú"
          data={reportData.currentStays}
          icon={BarChart3}
          color="bg-purple-500"
          onExport={() => handleExport('current-stays')}
        />

        <ReportCard
          title="Đặt phòng chờ xác nhận"
          data={reportData.pendingBookings}
          icon={Calendar}
          color="bg-yellow-500"
          onExport={() => handleExport('pending-bookings')}
        />
      </div>
    </div>
  )
}

export default QuickReports
