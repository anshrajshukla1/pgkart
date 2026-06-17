import React from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../store/actions/index.js'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/products', icon: '📦', label: 'Products' },
  { to: '/admin/orders', icon: '🧾', label: 'Orders' },
  { to: '/admin/categories', icon: '🗂️', label: 'Categories' },
  { to: '/admin/coupons', icon: '🎟️', label: 'Coupons' },
]

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <div className="admin-layout" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand" style={{ textAlign: 'center', padding: 'var(--space-md) var(--space-base) var(--space-base)' }}>
          <img src="/logo.png" alt="PGKart Logo" style={{ height: '56px', background: '#fff', padding: '6px', borderRadius: 'var(--radius-small)', marginBottom: '8px' }} />
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Admin Panel
          </div>
        </div>

        <nav style={{ flex: 1, marginTop: 'var(--space-md)' }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" className="sidebar-item" style={{ fontSize: '0.85rem' }}>
            <span>🏠</span> Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-item"
            style={{
              width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer',
              color: 'var(--color-accent)', background: 'transparent', fontSize: '0.9rem',
              fontFamily: 'var(--font-body)', fontWeight: 600
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Offset Main wrapper */}
      <div className="admin-main-wrapper">
        {/* Top Header Bar */}
        <header style={{
          height: '64px',
          background: 'var(--color-white)',
          borderBottom: '1px solid var(--color-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-lg)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: 'var(--shadow-resting)'
        }}>
          <span style={{ fontWeight: 700, color: 'var(--color-midnight)', fontSize: 'var(--font-size-base)', fontFamily: 'var(--font-heading)' }}>
            Welcome back, Admin
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--color-primary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem'
            }}>
              A
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="admin-content" style={{ background: 'var(--color-bg)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
