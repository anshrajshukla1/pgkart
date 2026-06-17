import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../../api/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSubmitted(true)
      toast.success('Reset link sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Helmet>
        <title>Forgot Password - PGKart</title>
      </Helmet>

      <div className="auth-container">
        {/* Left Panel: Deep Teal Brand Banner */}
        <div className="auth-banner">
          <div className="auth-banner-content">
            <span className="auth-banner-logo">🔐</span>
            <h1 className="auth-banner-title">Reset Password</h1>
            <p className="auth-banner-subtitle">
              Don't worry! Enter your email address and we'll send you a link to reset your password and secure your account.
            </p>
            <div className="auth-banner-features">
              <div className="auth-feature-item">🔒 Secure, encrypted link generation</div>
              <div className="auth-feature-item">⏱️ One-hour link validity window</div>
              <div className="auth-feature-item">🛡️ Strong security protocols</div>
            </div>
          </div>
        </div>

        {/* Right Panel: Form Card */}
        <div className="auth-form-card">
          <div className="auth-header">
            <h2>Reset Password</h2>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p style={{ color: 'var(--color-success)', fontWeight: 600, marginBottom: '1rem' }}>
                Check your inbox!
              </p>
              <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                We've sent a password reset link to <strong>{email}</strong>. It will expire in 1 hour.
              </p>
              <Link to="/login" className="btn btn-outline" style={{ display: 'inline-block', borderRadius: 'var(--radius-pill)', padding: '0.65rem 1.5rem', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>Email Address</label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)', marginTop: 'var(--space-md)' }}
                disabled={loading}
              >
                {loading ? '⏳ Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!submitted && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                ← Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
