import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand column */}
        <div className="footer-brand">
          <Link to="/" style={{ display: 'inline-block' }}>
            <img 
              src="/logo.png" 
              alt="PGKart Logo" 
            />
          </Link>
          <p>Everything your room needs, delivered fast. Student-friendly prices, trusted quality.</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-icon" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="footer-social-icon" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="footer-social-icon" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="footer-social-icon" aria-label="Youtube"><FaYoutube /></a>
          </div>
        </div>

        {/* Shop/Categories Column */}
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=Study+Essentials">Study Essentials</Link></li>
            <li><Link to="/products?category=Bedding+%26+Comfort">Bedding & Comfort</Link></li>
            <li><Link to="/products?category=Kitchen+Basics">Kitchen Basics</Link></li>
            <li><Link to="/products?category=Bath+%26+Toiletries">Bath & Toiletries</Link></li>
          </ul>
        </div>

        {/* Account Column */}
        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="mailto:support.pgkart@gmail.com">support.pgkart@gmail.com</a></li>
            <li><Link to="/orders">Returns & Exchanges</Link></li>
            <li><a href="mailto:support.pgkart@gmail.com">FAQ & Support</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright-strip">
        &copy; {new Date().getFullYear()} PGKart. Made with &hearts; for students across India.
      </div>
    </footer>
  )
}
