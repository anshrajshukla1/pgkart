import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, removeFromCart, updateCartQuantity } from '../../store/actions/index.js'
import api from '../../api/api.js'
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiShoppingBag, FiCornerDownLeft, FiTrash2 } from 'react-icons/fi'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const cart = useSelector(state => state.cart)
  const auth = useSelector(state => state.auth)
  const cartCount = cart?.products?.length || 0
  const isLoggedIn = !!auth?.user
  const isAdmin = auth?.user?.roles?.includes('ROLE_ADMIN')

  const { cartId, products = [], totalPrice = 0 } = cart

  // Handle scroll trigger
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard listener for Cmd+K, Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable
      if (isInput && e.key !== 'Escape') return

      if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k') || (e.key === '/')) {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
        setCartDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto focus input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus()
      }, 50)
    } else {
      setSearch('')
      setResults([])
    }
  }, [searchOpen])

  // Debounced search autocomplete
  useEffect(() => {
    if (!search.trim()) {
      setResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await api.get('/api/public/products', {
          params: { keyword: search.trim(), size: 5 }
        })
        setResults(res.data.content || [])
      } catch (err) {
        console.error('Search error', err)
      } finally {
        setSearching(false)
      }
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  // Automatically slide open Cart Drawer when items count increases
  const prevCartCount = useRef(cartCount)
  useEffect(() => {
    if (cartCount > prevCartCount.current && !searchOpen) {
      setCartDrawerOpen(true)
    }
    prevCartCount.current = cartCount
  }, [cartCount, searchOpen])

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (!e.target.closest('.user-menu-wrapper')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (cartDrawerOpen || searchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartDrawerOpen, searchOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearchOpen(false)
    }
  }

  const handleLogout = () => {
    setMenuOpen(false)
    dispatch(logoutUser())
    navigate('/')
  }

  const handleQuantityChange = (productId, qty) => {
    if (qty < 1) {
      dispatch(removeFromCart(cartId, productId))
    } else {
      dispatch(updateCartQuantity(cartId, productId, qty))
    }
  }

  const handleShopLinkClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      const shopEl = document.getElementById('shop')
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`)
    setSearchOpen(false)
  }

  const handleSuggestionClick = (keyword) => {
    setSearch(keyword)
    navigate(`/products?search=${encodeURIComponent(keyword)}`)
    setSearchOpen(false)
  }

  return (
    <>
      {/* Hidden toggles for mobile sidebar drawer control */}
      <input type="checkbox" id="drawer-toggle" className="hidden-toggle drawer-toggle-cb" />

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Left: Logo + Navigation Links */}
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              <img src="/logo.png" alt="PGKart Logo" />
            </Link>
            <div className="navbar-nav-links">
              <Link to="/" className={`navbar-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="/products" className={`navbar-nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
                Shop
              </Link>
            </div>
          </div>

          {/* Center: Stretched Search Pill */}
          <div className="navbar-center">
            <div className="navbar-search-pill" onClick={() => setSearchOpen(true)}>
              <FiSearch className="search-pill-icon" />
              <span className="search-pill-placeholder">Search PG essentials...</span>
              <span className="search-pill-kbd">⌘K</span>
            </div>
          </div>

          {/* Right: Actions Cluster */}
          <div className="navbar-right">
            {/* Mobile Search Trigger Icon */}
            <button 
              onClick={() => setSearchOpen(true)} 
              className="navbar-icon-btn mobile-search-btn" 
              aria-label="Search"
              style={{ background: 'transparent', border: 'none' }}
            >
              <FiSearch />
            </button>

            {/* Wishlist placeholder icon */}
            <Link to="/products" className="navbar-icon-btn" aria-label="Wishlist">
              <FiHeart />
            </Link>

            {/* Cart Icon button */}
            <button 
              onClick={() => setCartDrawerOpen(true)} 
              className="navbar-icon-btn" 
              aria-label="Cart"
              style={{ background: 'transparent', border: 'none' }}
            >
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Profile Dropdown or Auth Links */}
            {isLoggedIn ? (
              <div className="user-menu-wrapper">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="user-menu-btn"
                  aria-label="User Account"
                >
                  <FiUser style={{ fontSize: '1.1rem' }} />
                  <span className="desktop-only-username" style={{ marginLeft: '4px' }}>
                    {auth.user.username || 'Account'}
                  </span>
                </button>
                {menuOpen && (
                  <div className="user-dropdown-menu">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="user-dropdown-item"
                      >
                        <FiSettings style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="user-dropdown-item"
                    >
                      <FiShoppingBag style={{ marginRight: '8px', verticalAlign: 'middle' }} /> My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="user-dropdown-item"
                    >
                      <FiUser style={{ marginRight: '8px', verticalAlign: 'middle' }} /> My Profile
                    </Link>
                    <hr style={{ margin: '0.4rem 0', border: 'none', borderTop: '1px solid var(--color-bg)' }} />
                    <button
                      onClick={handleLogout}
                      className="user-dropdown-item logout"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      <FiLogOut style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-desktop" style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1.2rem', borderRadius: 'var(--radius-pill)' }}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', borderRadius: 'var(--radius-pill)' }}>Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger icon trigger */}
            <label htmlFor="drawer-toggle" className="navbar-icon-btn hamburger-btn" aria-label="Menu">
              <FiMenu />
            </label>
          </div>
        </div>
      </nav>

      {/* Spotlight Search Overlay Dialog */}
      {searchOpen && (
        <div className="spotlight-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="spotlight-search-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit}>
              <div className="spotlight-search-header">
                <FiSearch className="spotlight-search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products, starter kits, bedding..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="spotlight-search-input"
                />
                <kbd className="spotlight-search-kbd-hint">ESC</kbd>
              </div>
            </form>

            <div className="spotlight-search-body">
              {!search.trim() ? (
                <>
                  <div className="spotlight-section-title">Popular Searches</div>
                  <div className="spotlight-suggestions-grid">
                    <button className="spotlight-suggestion-chip" onClick={() => handleSuggestionClick('Bedding Set')}>🛏️ Bedding Set</button>
                    <button className="spotlight-suggestion-chip" onClick={() => handleSuggestionClick('Bucket')}>🪣 Bucket & Mug</button>
                    <button className="spotlight-suggestion-chip" onClick={() => handleSuggestionClick('Lamp')}>📚 Study Lamp</button>
                    <button className="spotlight-suggestion-chip" onClick={() => handleSuggestionClick('Storage Box')}>📦 Hangers & Organizers</button>
                    <button className="spotlight-suggestion-chip" onClick={() => handleSuggestionClick('Power Strip')}>🔌 Power Strip</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="spotlight-section-title">
                    {searching ? 'Searching PGKart...' : (results.length > 0 ? 'Search Results' : 'No matches found')}
                  </div>
                  {results.length > 0 && (
                    <div className="spotlight-results-list">
                      {results.map(product => {
                        const { productId, productName, price, specialPrice, image, category } = product
                        const displayPrice = specialPrice || price
                        const imageUrl = image
                          ? (image.startsWith('http') ? image : `${BASE_URL}/images/products/${image}`)
                          : null

                        return (
                          <div
                            key={productId}
                            className="spotlight-result-item"
                            onClick={() => handleResultClick(productId)}
                          >
                            {imageUrl ? (
                              <img src={imageUrl} alt={productName} className="spotlight-result-img" />
                            ) : (
                              <div className="spotlight-result-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', color: 'var(--color-primary)', fontSize: '1.25rem' }}>
                                <FiShoppingCart />
                              </div>
                            )}
                            <div className="spotlight-result-info">
                              <span className="spotlight-result-name">{productName}</span>
                              <span className="spotlight-result-category">{category?.categoryName || 'Essentials'}</span>
                            </div>
                            <span className="spotlight-result-price">₹{Math.round(displayPrice)}</span>
                            <FiCornerDownLeft style={{ opacity: 0.35, fontSize: '0.85rem' }} />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <div className={`cart-drawer-overlay ${cartDrawerOpen ? 'open' : ''}`} onClick={() => setCartDrawerOpen(false)}>
        <div className={`cart-drawer ${cartDrawerOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h3>Shopping Cart ({cartCount} items)</h3>
            <button className="cart-drawer-close-btn" onClick={() => setCartDrawerOpen(false)}>
              <FiX />
            </button>
          </div>

          <div className="cart-drawer-body">
            {products.length === 0 ? (
              <div className="cart-drawer-empty">
                <FiShoppingCart className="empty-icon" />
                <span className="empty-title">Your cart is empty</span>
                <span className="empty-subtitle">Add PG essentials from our shop to get started!</span>
                <button className="btn btn-primary" onClick={() => {
                  setCartDrawerOpen(false)
                  navigate('/products')
                }}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="cart-drawer-items-list">
                {products.map(product => {
                  const qty = Number(product.quantity || 1)
                  const price = Number(product.specialPrice || product.price || 0)
                  const imageUrl = product.image
                    ? (product.image.startsWith('http') ? product.image : `${BASE_URL}/images/products/${product.image}`)
                    : null

                  return (
                    <div key={product.productId} className="cart-drawer-item-row">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.productName} className="cart-drawer-item-img" />
                      ) : (
                        <div className="cart-drawer-item-img empty-img">
                          <FiShoppingCart />
                        </div>
                      )}
                      
                      <div className="cart-drawer-item-details">
                        <span className="cart-drawer-item-name">{product.productName}</span>
                        <span className="cart-drawer-item-price">₹{price.toFixed(0)} each</span>
                        
                        <div className="cart-drawer-item-actions">
                          <div className="product-detail-qty-stepper" style={{ borderScale: '0.8' }}>
                            <button className="product-detail-qty-btn" onClick={() => handleQuantityChange(product.productId, qty - 1)}>−</button>
                            <span className="product-detail-qty-value">{qty}</span>
                            <button className="product-detail-qty-btn" onClick={() => handleQuantityChange(product.productId, qty + 1)}>+</button>
                          </div>

                          <button 
                            className="cart-drawer-item-remove-btn" 
                            onClick={() => dispatch(removeFromCart(cartId, product.productId))}
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="cart-drawer-item-price-total">
                        ₹{(price * qty).toFixed(0)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {products.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="cart-drawer-summary-row">
                <span>Subtotal</span>
                <span className="summary-price font-semibold">₹{Number(totalPrice).toFixed(0)}</span>
              </div>
              <div className="cart-drawer-summary-row shipping-row">
                <span>Shipping</span>
                <span className="summary-shipping font-semibold">FREE</span>
              </div>
              <div className="cart-drawer-summary-row total-row">
                <span>Total Amount</span>
                <span className="summary-total-price font-bold">₹{Number(totalPrice).toFixed(0)}</span>
              </div>

              <button 
                className="btn btn-primary cart-drawer-checkout-btn"
                onClick={() => {
                  setCartDrawerOpen(false)
                  if (!auth?.user) {
                    navigate('/login')
                  } else {
                    navigate('/checkout')
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Right Drawer (CSS Checkbox toggle controlled) */}
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <div className="mobile-drawer">
        <div className="mobile-drawer-header">
          <Link to="/" className="navbar-brand" onClick={() => { document.getElementById('drawer-toggle').checked = false }}>
            <span style={{ fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>PGKart</span>
          </Link>
          <label htmlFor="drawer-toggle" className="mobile-drawer-close" aria-label="Close menu">
            <FiX />
          </label>
        </div>
        <div className="mobile-drawer-body">
          <Link
            to="/"
            onClick={() => { document.getElementById('drawer-toggle').checked = false }}
            className={`mobile-drawer-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => { document.getElementById('drawer-toggle').checked = false }}
            className={`mobile-drawer-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Shop
          </Link>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--color-bg)' }} />
          {!isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/login"
                onClick={() => { document.getElementById('drawer-toggle').checked = false }}
                className="btn btn-outline"
                style={{ width: '100%', textAlign: 'center', borderRadius: 'var(--radius-pill)' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => { document.getElementById('drawer-toggle').checked = false }}
                className="btn btn-primary"
                style={{ width: '100%', textAlign: 'center', borderRadius: 'var(--radius-pill)' }}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                Logged in as: {auth.user.username}
              </span>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => { document.getElementById('drawer-toggle').checked = false }}
                  className="btn btn-outline"
                  style={{ width: '100%', textAlign: 'center', borderRadius: 'var(--radius-pill)' }}
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/orders"
                onClick={() => { document.getElementById('drawer-toggle').checked = false }}
                className="btn btn-outline"
                style={{ width: '100%', textAlign: 'center', borderRadius: 'var(--radius-pill)' }}
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => { document.getElementById('drawer-toggle').checked = false }}
                className="btn btn-outline"
                style={{ width: '100%', textAlign: 'center', borderRadius: 'var(--radius-pill)' }}
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  document.getElementById('drawer-toggle').checked = false
                  handleLogout()
                }}
                className="btn btn-primary"
                style={{ width: '100%', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-error)' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
