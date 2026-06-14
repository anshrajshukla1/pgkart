import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { registerUser } from '../../store/actions/index.js'

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

  return (
    <div className="auth-page">
      <Helmet>
        <title>Create Account - PGKart</title>
      </Helmet>

      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
          <h2>Join PGKart</h2>
          <p>Create your free student account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              autoFocus
            />
            {errors.username && (
              <span style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '0.25rem', display: 'block' }}>
                {errors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
            {errors.email && (
              <span style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '0.25rem', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
            />
            {errors.password && (
              <span style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '0.25rem', display: 'block' }}>
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
            />
            {errors.confirmPassword && (
              <span style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '0.25rem', display: 'block' }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? '⏳ Creating account...' : 'Create Account 🎉'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Login here
          </Link>
        </div>

        <p style={{
          fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'center',
          marginTop: '1rem', lineHeight: 1.5
        }}>
          By registering, you agree to PGKart's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
