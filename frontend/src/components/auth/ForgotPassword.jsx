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

      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2>Reset Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '1rem' }}>
              Check your inbox!
            </p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We've sent a password reset link to <strong>{email}</strong>. It will expire in 1 hour.
            </p>
            <Link to="/login" className="btn btn-outline" style={{ display: 'inline-block', textDecoration: 'none' }}>
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? '⏳ Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!submitted && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
