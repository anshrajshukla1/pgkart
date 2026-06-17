import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../store/actions/index.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)
  const auth = useSelector(state => state.auth)
  const cartCount = cart?.cartItems ? cart.cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0
  const isLoggedIn = !!auth?.user
  const isAdmin = auth?.user?.roles?.includes('ROLE_ADMIN')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (!e.target.closest('.user-menu-wrapper')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`)
  }

  const handleLogout = () => {
    setMenuOpen(false)
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="PGKart Logo" style={{ height: '72px', marginRight: '4px', marginTop: '-10px', marginBottom: '-10px' }} />
      </Link>

      <div className="navbar-center">
        <form className="search-bar" onSubmit={handleSearch}>
          <span style={{ color: 'var(--gray-400)', fontSize: '1rem' }}>🔍</span>
          <input
            type="text"
            placeholder="Search hostel essentials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="navbar-actions">


        <Link to="/cart" className="cart-btn">
          🛒 Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {isLoggedIn ? (
          <div className="user-menu-wrapper" style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              👤 {auth.user.username || 'Account'}
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, background: 'white',
                borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid #E5E7EB', minWidth: '180px', zIndex: 200,
                padding: '0.5rem', animation: 'fadeInUp 0.15s ease'
              }}>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', padding: '0.65rem 1rem', borderRadius: '8px',
                      fontSize: '0.875rem', color: '#374151', fontWeight: '500',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '0.65rem 1rem', borderRadius: '8px',
                    fontSize: '0.875rem', color: '#374151', fontWeight: '500',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  👤 My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '0.65rem 1rem', borderRadius: '8px',
                    fontSize: '0.875rem', color: '#374151', fontWeight: '500',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  📦 My Orders
                </Link>
                <hr style={{ margin: '0.4rem 0', border: 'none', borderTop: '1px solid #E5E7EB' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block', width: '100%', padding: '0.65rem 1rem', borderRadius: '8px',
                    fontSize: '0.875rem', color: '#EF4444', fontWeight: '500', border: 'none',
                    background: 'transparent', textAlign: 'left', cursor: 'pointer',
                    transition: 'background 0.15s', fontFamily: 'var(--font-body)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
