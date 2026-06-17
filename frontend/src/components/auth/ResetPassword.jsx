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
        <div className="auth-container">
          {/* Left Panel: Deep Teal Brand Banner */}
          <div className="auth-banner">
            <div className="auth-banner-content">
              <span className="auth-banner-logo">🚫</span>
              <h1 className="auth-banner-title">Link Invalid</h1>
              <p className="auth-banner-subtitle">
                The password reset link you clicked is invalid or has expired. For security reasons, reset links are only valid for one hour.
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="auth-form-card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-midnight)', marginBottom: 'var(--space-sm)' }}>Invalid Link</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>This password reset link is invalid or missing.</p>
            <Link to="/forgot-password" className="btn btn-primary" style={{ display: 'inline-block', borderRadius: 'var(--radius-pill)', padding: '0.75rem 2rem', textDecoration: 'none' }}>
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <Helmet>
        <title>Set New Password - PGKart</title>
      </Helmet>

      <div className="auth-container">
        {/* Left Panel: Deep Teal Brand Banner */}
        <div className="auth-banner">
          <div className="auth-banner-content">
            <span className="auth-banner-logo">🔑</span>
            <h1 className="auth-banner-title">Create Password</h1>
            <p className="auth-banner-subtitle">
              Choose a strong password with at least 8 characters. Make sure it is unique to protect your PGKart account details.
            </p>
          </div>
        </div>

        {/* Right Panel: Form Card */}
        <div className="auth-form-card">
          <div className="auth-header">
            <h2>Create New Password</h2>
            <p>Please enter your new strong password</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>New Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-base)' }}>
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>Confirm New Password</label>
              <input
                className="form-control"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)', marginTop: 'var(--space-md)' }}
              disabled={loading}
            >
              {loading ? '⏳ Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
