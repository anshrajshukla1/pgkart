import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import api from '../../api/api.js'
import { fetchProducts } from '../../store/actions/index.js'
import ProductCard from '../shared/ProductCard.jsx'
import { FiCheckCircle, FiTruck, FiPercent, FiRefreshCw, FiStar } from 'react-icons/fi'

const HERO_IMAGES = [
  '/hero_graphic.png',
  '/hero_graphic_2.png',
  '/hero_graphic_3.png',
  '/hero_graphic_4.png',
  '/hero_graphic_5.png',
  '/hero_graphic_6.png'
]

const CATEGORIES_MOCK = [
  { icon: '🪣', name: 'Bath & Toiletries' },
  { icon: '📚', name: 'Study Essentials' },
  { icon: '🍳', name: 'Kitchen Basics' },
  { icon: '🛏️', name: 'Bedding & Comfort' },
  { icon: '📦', name: 'Storage & Organization' },
  { icon: '🎒', name: 'Starter Kits' },
  { icon: '🍜', name: 'Snacks & Beverages' },
  { icon: '🔌', name: 'Electronics & Accessories' },
]

const FEATURES = [
  { icon: <FiCheckCircle />, title: 'Verified Products', desc: 'Carefully selected, high quality PG essentials' },
  { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Get your room set up in no time' },
  { icon: <FiPercent />, title: 'Student Prices', desc: 'Budget-friendly, highly curated pricing' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '10-day hassle-free return policy' },
]

const TESTIMONIALS = [
  {
    stars: 5,
    quote: "PGKart made moving into my PG a breeze. Ordered everything in the morning, got it by evening!",
    author: "Rahul Sharma",
    college: "IIT Delhi"
  },
  {
    stars: 5,
    quote: "The student prices are unmatched. The study lamps and storage boxes are super high quality.",
    author: "Priya Mehta",
    college: "NIFT Mumbai"
  },
  {
    stars: 5,
    quote: "Hassle-free returns! I had to change the size of my bedding set and it was done in 2 days.",
    author: "Amit Kumar",
    college: "Christ University"
  }
]

const SORT_OPTIONS = [
  { label: 'Newest First', sortBy: 'productId', sortOrder: 'desc' },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Name A-Z', sortBy: 'productName', sortOrder: 'asc' },
]

function SkeletonCard() {
  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-large)', border: '1.5px solid var(--color-secondary)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '1.33' }} />
      <div style={{ padding: 'var(--space-base)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '80%' }} />
        <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '50%' }} />
        <div className="skeleton" style={{ height: '36px', borderRadius: '8px', marginTop: '0.25rem' }} />
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  const [categories, setCategories] = useState([])
  const [sortIndex, setSortIndex] = useState(0)
  const [page, setPage] = useState(0)
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0)

  const keyword = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  const { products = [], loading = false, totalPages = 0, totalElements = 0 } = useSelector(state => state.products || {})

  // Autoplay hero slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % HERO_IMAGES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/public/products/featured')
        setFeaturedProducts(res.data.content || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingFeatured(false)
      }
    }
    fetchFeatured()
  }, [])

  // Fetch all categories once
  useEffect(() => {
    api.get('/api/public/categories?pageSize=100')
      .then(res => setCategories(res.data.content || []))
      .catch(err => console.error(err))
  }, [])

  // Fetch products matching category / search filters
  useEffect(() => {
    let categoryId = undefined
    if (category) {
      if (categories.length === 0) return // Wait for categories to load
      const found = categories.find(c => c.categoryName.toLowerCase() === category.toLowerCase())
      if (found) categoryId = found.categoryId
      else categoryId = -1
    }

    const sort = SORT_OPTIONS[sortIndex]
    dispatch(fetchProducts({
      pageNumber: page,
      pageSize: 12,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      keyword: keyword || undefined,
      categoryId
    }))
  }, [dispatch, page, sortIndex, keyword, category, categories])

  // Handle URL hash or search params scrolling down to #shop
  useEffect(() => {
    if (keyword || category || window.location.hash === '#shop') {
      setTimeout(() => {
        const shopEl = document.getElementById('shop')
        if (shopEl) {
          shopEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    }
  }, [keyword, category])

  const getCategoryEmoji = (name) => {
    const found = CATEGORIES_MOCK.find(c => c.name.toLowerCase() === name.toLowerCase())
    return found ? found.icon : '📦'
  }

  const handleSort = (e) => {
    setSortIndex(Number(e.target.value))
    setPage(0)
  }

  const clearSearch = () => {
    setSearchParams({})
    setPage(0)
  }

  const handleScrollToShop = (e) => {
    e.preventDefault()
    const shopEl = document.getElementById('shop')
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div>
      <Helmet>
        <title>PGKart - Room & PG Essentials | Fast Delivery</title>
        <meta name="description" content="Shop room essentials online. Buckets, study lamps, toiletries, starter kits and more. Student-friendly prices with fast delivery." />
      </Helmet>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-left animate-fadeInUp">
            <div className="hero-badge" style={{ gap: '0.35rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💪</span>
              <span>LEVEL UP YOUR ROOM</span>
            </div>
            <span className="hero-eyebrow">PGKart Originals</span>
            <h1>
              Everything your room needs, <br />
              <span>delivered fast</span> 📦
            </h1>
            <p className="hero-subheadline">
              From bath essentials to study lamps — get everything for your PG life
              at student-friendly prices.
            </p>
            <div className="hero-actions">
              <a
                href="#shop"
                onClick={handleScrollToShop}
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Shop Now
              </a>
              <a
                href="#shop"
                onClick={handleScrollToShop}
                className="btn btn-outline"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Browse Shop
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-block">
              <div className="hero-image-wrap">
                {HERO_IMAGES.map((imgSrc, idx) => (
                  <img
                    key={imgSrc}
                    src={imgSrc}
                    alt={`PG Essentials illustration ${idx + 1}`}
                    className={`hero-slide-img ${idx === currentHeroIdx ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features Section - Full Width */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="trust-card">
                <div className="trust-card-icon">{f.icon}</div>
                <div className="trust-card-content">
                  <h4 className="trust-card-title">{f.title}</h4>
                  <p className="trust-card-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section" style={{ background: 'linear-gradient(180deg, var(--color-white) 0%, var(--color-bg) 100%)', padding: '4.5rem 1.5rem 3.5rem' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Shop by Category</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '6px' }}>Everything a student needs, organized for you</p>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <div
                key={cat.categoryId}
                className={`category-card ${category === cat.categoryName ? 'active' : ''}`}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.set('category', cat.categoryName)
                  newParams.delete('search')
                  setSearchParams(newParams)
                  setPage(0)
                }}
              >
                <div className="category-icon-wrapper">
                  <span className="category-icon">{getCategoryEmoji(cat.categoryName)}</span>
                </div>
                <span className="category-name">{cat.categoryName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog Section (#shop) */}
      <section id="shop" className="section" style={{ padding: '4rem 1.5rem', background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Explore PG Essentials</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '6px' }}>Curated products for student comfort and convenience</p>
            </div>
            <select
              value={sortIndex}
              onChange={handleSort}
              className="products-sort-select"
            >
              {SORT_OPTIONS.map((o, i) => (
                <option key={i} value={i}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Horizontal Category Filter Bar */}
          <div className="products-filter-bar" style={{ marginBottom: 'var(--space-base)' }}>
            <div className="products-category-pills">
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('category')
                  setSearchParams(newParams)
                  setPage(0)
                }}
                className={`products-category-pill ${!category ? 'active' : ''}`}
              >
                All Products
              </button>
              {categories.map(c => (
                <button
                  key={c.categoryId}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams)
                    newParams.set('category', c.categoryName)
                    setSearchParams(newParams)
                    setPage(0)
                  }}
                  className={`products-category-pill ${category === c.categoryName ? 'active' : ''}`}
                >
                  {c.categoryName}
                </button>
              ))}
            </div>
          </div>

          {/* Results Status Row */}
          <div className="products-status-row">
            <div className="products-results-count">
              {loading && 'Loading...'}
            </div>

            <div className="products-active-filters">
              {keyword && (
                <div className="products-filter-chip">
                  <span>Search: {keyword}</span>
                  <button onClick={() => {
                    const newParams = new URLSearchParams(searchParams)
                    newParams.delete('search')
                    setSearchParams(newParams)
                    setPage(0)
                  }}>×</button>
                </div>
              )}
              {category && (
                <div className="products-filter-chip">
                  <span>Category: {category}</span>
                  <button onClick={() => {
                    const newParams = new URLSearchParams(searchParams)
                    newParams.delete('category')
                    setSearchParams(newParams)
                    setPage(0)
                  }}>×</button>
                </div>
              )}
              {(keyword || category) && (
                <button
                  onClick={clearSearch}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-primary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textDecoration: 'underline'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', fontWeight: 500 }}>
              Sorted by: {SORT_OPTIONS[sortIndex].label}
            </div>
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="products-grid">
              {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state" style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-large)', padding: 'var(--space-4xl) var(--space-xl)' }}>
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or checking a different category.</p>
              <button className="btn btn-primary" onClick={clearSearch}>Browse All Products</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.productId} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                &larr;
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum = i
                if (totalPages > 7) {
                  if (page <= 3) pageNum = i
                  else if (page >= totalPages - 4) pageNum = totalPages - 7 + i
                  else pageNum = page - 3 + i
                }
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${page === pageNum ? 'active' : ''}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </button>
                )
              })}
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section" style={{ background: 'var(--color-white)', padding: '4rem 1.5rem' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', textAlign: 'left' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Featured Products</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '6px' }}>Handpicked essentials loved by students</p>
            </div>
            <Link to="/products" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Products →
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="products-grid featured-products-row">
              {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <h3>No featured products</h3>
              <p>Products marked as featured by admin will appear here.</p>
            </div>
          ) : (
            <div className="products-grid featured-products-row">
              {featuredProducts.slice(0, 8).map(p => <ProductCard key={p.productId} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
