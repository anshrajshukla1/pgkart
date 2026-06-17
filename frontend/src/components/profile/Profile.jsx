import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../../api/api.js'

export default function Profile() {
  const { user } = useSelector(state => state.auth)
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' })
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await api.post('/api/auth/update-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password updated successfully!')
      setPasswords({ oldPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section" style={{ background: '#F9FAFB', minHeight: 'calc(100vh - 72px)' }}>
      <Helmet>
        <title>My Profile - PGKart</title>
      </Helmet>
      
      <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1F2937' }}>My Profile</h2>
        
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👤 Account Details
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Username</label>
              <div style={{ fontSize: '1rem', color: '#111827', fontWeight: '500', padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
                {user?.username}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Email Address</label>
              <div style={{ fontSize: '1rem', color: '#111827', fontWeight: '500', padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔒 Change Password
          </h3>
          <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.oldPassword}
                onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                required
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
                minLength={6}
                placeholder="Enter new password"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
