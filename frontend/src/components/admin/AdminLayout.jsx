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
]

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="PGKart Logo" style={{ height: '76px', background: '#fff', padding: '6px', borderRadius: '8px', marginBottom: '8px' }} />
          <div style={{ fontSize: '0.7rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
            Admin Panel
          </div>
        </div>

        <nav style={{ flex: 1 }}>
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
        <div style={{ padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" className="sidebar-item" style={{ fontSize: '0.85rem' }}>
            <span>🏠</span> Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-item"
            style={{
              width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer',
              color: '#FCA5A5', background: 'transparent', fontSize: '0.9rem',
              fontFamily: 'var(--font-body)', fontWeight: 500
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
