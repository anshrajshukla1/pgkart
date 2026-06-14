import React from 'react'

export default function Loader({ message = 'Loading...' }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem'
    }}>
      <div className="spinner" />
      <p style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '500' }}>{message}</p>
    </div>
  )
}