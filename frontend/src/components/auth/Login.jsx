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
        toast.error('Failed to login with Google')
      }
    }
  }

  return (
    <div className="auth-page">
      <Helmet>
        <title>Login - PGKart</title>
      </Helmet>

      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
          <h2>Welcome back!</h2>
          <p>Login to continue shopping on PGKart</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              className="form-control"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username or email"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
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
              style={{ marginTop: '0.5rem' }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : 'Login →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <hr style={{ flex: 1, borderColor: 'var(--gray-200)', borderStyle: 'solid' }} />
          <span style={{ padding: '0 1rem', color: 'var(--gray-500)', fontSize: '0.875rem' }}>or</span>
          <hr style={{ flex: 1, borderColor: 'var(--gray-200)', borderStyle: 'solid' }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="btn btn-outline"
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  )
}
