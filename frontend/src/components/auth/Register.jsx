import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { registerUser, googleLoginUser } from '../../store/actions/index.js'
import { auth, googleProvider } from '../../firebase.js'
import { signInWithPopup } from 'firebase/auth'
import toast from 'react-hot-toast'
export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.auth)

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(err => ({ ...err, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.username.trim() || form.username.length < 3) errs.username = 'Username must be at least 3 characters'
    if (!form.email.includes('@')) errs.email = 'Enter a valid email'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    try {
      await dispatch(registerUser({
        username: form.username,
        email: form.email,
        password: form.password
      }))
      navigate('/login')
    } catch { /* toast already shown */ }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      await dispatch(googleLoginUser(idToken))
      navigate('/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Google Sign In Error: ' + err.message)
      }
    }
  }

  return (
    <div className="auth-page">
      <Helmet>
        <title>Create Account - PGKart</title>
      </Helmet>

      <div className="auth-container">
        {/* Left Panel: Deep Teal Brand Banner */}
        <div className="auth-banner">
          <div className="auth-banner-content">
            <span className="auth-banner-logo">🎓</span>
            <h1 className="auth-banner-title">Join PGKart</h1>
            <p className="auth-banner-subtitle">
              Set up your student account in seconds and unlock special discounts, room-only bulk deals, and swift room delivery.
            </p>
            <div className="auth-banner-features">
              <div className="auth-feature-item">🔑 Quick registration and verification</div>
              <div className="auth-feature-item">🏷️ Student-exclusive coupon discounts</div>
              <div className="auth-feature-item">🛒 Fast and seamless cart checkout flow</div>
            </div>
          </div>
        </div>

        {/* Right Panel: Form Card */}
        <div className="auth-form-card">
          <div className="auth-header">
            <h2>Join PGKart</h2>
            <p>Create your free student account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
                autoFocus
              />
              {errors.username && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  {errors.username}
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-base)' }}>
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
              />
              {errors.email && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-base)' }}>
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
              />
              {errors.password && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-base)' }}>
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                required
              />
              {errors.confirmPassword && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)', marginTop: 'var(--space-md)' }}
              disabled={loading}
            >
              {loading ? '⏳ Creating account...' : 'Create Account 🎉'}
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
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Login here
            </Link>
          </div>

          <p style={{
            fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', textAlign: 'center',
            marginTop: 'var(--space-md)', lineHeight: 1.5, margin: 'var(--space-base) 0 0 0'
          }}>
            By registering, you agree to PGKart's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
