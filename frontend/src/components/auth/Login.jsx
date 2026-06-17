import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { loginUser, googleLoginUser } from '../../store/actions/index.js'
import { auth, googleProvider } from '../../firebase.js'
import { signInWithPopup } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading } = useSelector(state => state.auth)

  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ username: '', password: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(loginUser(form))
      navigate(from, { replace: true })
    } catch { /* toast already shown */ }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      await dispatch(googleLoginUser(idToken))
      navigate(from, { replace: true })
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to login with Google: ' + err.message)
      }
    }
  }

  return (
    <div className="auth-page">
      <Helmet>
        <title>Login - PGKart</title>
      </Helmet>

      <div className="auth-container">
        {/* Left Panel: Deep Teal Brand Banner */}
        <div className="auth-banner">
          <div className="auth-banner-content">
            <span className="auth-banner-logo">🛒</span>
            <h1 className="auth-banner-title">PGKart</h1>
            <p className="auth-banner-subtitle">
              Everything you need for your hostel life, curated with care and delivered right to your door.
            </p>
            <div className="auth-banner-features">
              <div className="auth-feature-item">⚡ Instant delivery to your room</div>
              <div className="auth-feature-item">📦 Pre-approved hostel list items</div>
              <div className="auth-feature-item">🛡️ Safe, secure payments & refund assurance</div>
            </div>
          </div>
        </div>

        {/* Right Panel: Form Card */}
        <div className="auth-form-card">
          <div className="auth-header">
            <h2>Welcome back!</h2>
            <p>Login to continue shopping on PGKart</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>Username or Email</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-base)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0, fontWeight: 500, color: 'var(--color-midnight)' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot Password?
                </Link>
              </div>
              <input
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{ marginTop: 'var(--space-xs)', borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)', marginTop: 'var(--space-md)' }}
              disabled={loading}
            >
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-lg) 0' }}>
            <hr style={{ flex: 1, borderColor: 'var(--color-secondary)', borderStyle: 'solid', opacity: 0.3 }} />
            <span style={{ padding: '0 var(--space-md)', color: 'var(--color-muted)', fontSize: 'var(--font-size-xs)' }}>or</span>
            <hr style={{ flex: 1, borderColor: 'var(--color-secondary)', borderStyle: 'solid', opacity: 0.3 }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', padding: '0.85rem', fontSize: 'var(--font-size-base)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-pill)', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
            Continue with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
