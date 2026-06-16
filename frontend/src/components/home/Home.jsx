import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import api from '../../api/api.js'
import ProductCard from '../shared/ProductCard.jsx'

const CATEGORIES = [
  { icon: '🪣', name: 'Bath & Toiletries' },
  { icon: '📚', name: 'Study Essentials' },
  { icon: '🍳', name: 'Kitchen Basics' },
  { icon: '🛏️', name: 'Bedding & Comfort' },
  { icon: '📦', name: 'Storage & Organization' },
  { icon: '🍜', name: 'Snacks & Beverages' },
  { icon: '🔌', name: 'Electronics & Accessories' },
]

const FEATURES = [
  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your essentials with Fast Delivery' },
  { icon: '💰', title: 'Student Prices', desc: 'Curated affordable products for PG life' },
  { icon: '↩️', title: 'Easy Returns', desc: '10-day hassle-free return policy' },
  { icon: '✅', title: 'Quality Guaranteed', desc: 'Carefully selected, tested products' },
]

function SkeletonCard() {
  return (
    <div style={{
      background: 'white', borderRadius: '20px', border: '1.5px solid #E5E7EB', overflow: 'hidden'
    }}>
      <div className="skeleton" style={{ aspectRatio: 1 }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '80%' }} />
        <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '50%' }} />
        <div className="skeleton" style={{ height: '36px', borderRadius: '8px', marginTop: '0.25rem' }} />
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = React.useState([])
  const [loadingFeatured, setLoadingFeatured] = React.useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/public/products/featured')
        setFeaturedProducts(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingFeatured(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div>
      <Helmet>
        <title>PGKart - Hostel & PG Essentials | Fast Delivery</title>
        <meta name="description" content="Shop hostel essentials online. Buckets, study lamps, toiletries, starter kits and more. Student-friendly prices with fast delivery." />
      </Helmet>

      {/* Hero */}
      <section className="hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>
            Everything your room needs,<br />
            <span>delivered fast</span> 📦
          </h1>
          <p>
            From bath essentials to study lamps — get everything for your PG life
            at student-friendly prices.
          </p>
          <div className="hero-actions">
            <Link
              to="/products"
              className="btn btn-accent"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              Shop Now →
            </Link>
          </div>
          <div className="hero-pills">
            {['🚀 Fast Delivery', '💳 Razorpay Secure', '↩️ Easy Returns', '📞 24/7 Support'].map(p => (
              <div key={p} className="hero-pill">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Everything a hostel student needs, organized for you</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked essentials loved by students</p>
          </div>
          {loadingFeatured ? (
            <div className="products-grid">
              {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <h3>No featured products</h3>
              <p>Products marked as featured by admin will appear here.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map(p => <ProductCard key={p.productId} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem' }}>
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Why PGKart */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose PGKart?</h2>
            <p>We understand hostel life better than anyone</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {FEATURES.map(f => (
              <div key={f.title} className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-icon">{f.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 700,
                  fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--gray-900)'
                }}>{f.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
