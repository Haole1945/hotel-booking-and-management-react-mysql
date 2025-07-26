import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { api } from '../../services/api'

const BackendStatus = () => {
  const [status, setStatus] = useState('checking') // 'checking', 'online', 'offline'
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    checkBackendStatus()
    const interval = setInterval(checkBackendStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkBackendStatus = async () => {
    try {
      await api.get('/health')
      setStatus('online')
      setShowStatus(false) 
    } catch (error) {
      setStatus('offline')
      setShowStatus(true) 
    }
  }

  if (!showStatus) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {status === 'checking' ? (
              <RefreshCw className="h-5 w-5 text-yellow-400 animate-spin" />
            ) : status === 'online' ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              {status === 'checking' ? 'Đang kiểm tra...' : 
               status === 'online' ? 'Backend đang hoạt động' : 
               'Backend không khả dụng'}
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              {status === 'offline' && (
                <>
                  <p>Hệ thống đang sử dụng dữ liệu mô phỏng.</p>
                  <p className="mt-1">Một số tính năng có thể bị hạn chế.</p>
                </>
              )}
            </div>
            <div className="mt-3">
              <button
                onClick={checkBackendStatus}
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Kiểm tra lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackendStatus
