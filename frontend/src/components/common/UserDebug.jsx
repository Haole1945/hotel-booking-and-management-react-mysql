import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const UserDebug = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: 'blue' }}>User Debug Info:</h4>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '11px' }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}

export default UserDebug
