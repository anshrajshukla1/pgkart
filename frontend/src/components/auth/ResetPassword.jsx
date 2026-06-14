import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../../api/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!")
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }

    setLoading(true)
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: password })
      toast.success('Password successfully reset! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h2>Invalid Link 🚫</h2>
          <p style={{ color: 'var(--gray-500)', marginTop: '1rem' }}>This password reset link is invalid or missing.</p>
          <Link to="/forgot-password" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Request New Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <Helmet>
        <title>Set New Password - PGKart</title>
      </Helmet>

      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔑</div>
          <h2>Create New Password</h2>
          <p>Please enter your new strong password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              className="form-control"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? '⏳ Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
