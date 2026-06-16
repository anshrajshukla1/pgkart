import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/logo.png" alt="PGKart Logo" style={{ height: '96px', marginBottom: '1rem', background: '#fff', padding: '8px', borderRadius: '12px' }} />
          <p>Everything your room needs, delivered fast. Student-friendly prices, trusted quality.</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
              <span
                key={i}
                style={{ fontSize: '1.2rem', cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=Stationery">Stationery</Link></li>
            <li><Link to="/products?category=Bath+%26+Toiletries">Bath & Toiletries</Link></li>
            <li><Link to="/products?category=Study+Essentials">Study Essentials</Link></li>
            <li><Link to="/products?category=Kitchen+Basics">Kitchen Basics</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="mailto:support.pgkart@gmail.com">support.pgkart@gmail.com</a></li>
            <li><Link to="/orders">Return & Exchanges</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 1rem' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem',
          justifyContent: 'center'
        }}>
          {['🚀 Fast Delivery', '💳 Secure Payments', '↩️ Easy Returns'].map(pill => (
            <span key={pill} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', padding: '0.35rem 0.9rem', fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.6)', fontWeight: '500'
            }}>{pill}</span>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} PGKart. Made with ❤️ for students across India.
      </div>
    </footer>
  )
}
