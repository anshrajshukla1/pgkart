import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { addToCart } from '../../store/actions/index.js'
import api from '../../api/api.js'
import Loader from '../shared/Loader.jsx'
import { FiShoppingCart, FiZap, FiTruck, FiShield, FiCheck } from 'react-icons/fi'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/api/public/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />

  if (!product) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">😕</div>
        <h3>Product not found</h3>
        <p>This product may have been removed or doesn't exist.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Products</Link>
      </div>
    )
  }

  const {
    productName, price, specialPrice, discount,
    quantity, image, image2, image3, image4, description, category
  } = product

  const displayPrice = specialPrice || price
  const hasDiscount = discount > 0
  const isOutOfStock = quantity === 0
  const isLowStock = quantity > 0 && quantity <= 5

  // Build ordered list of all available image URLs
  const allImages = [image, image2, image3, image4]
    .filter(Boolean)
    .map(img => img.startsWith('http') ? img : `${BASE_URL}/images/products/${img}`)

  const [activeThumbIdx, setActiveThumbIdx] = useState(0)
  const mainImage = allImages[activeThumbIdx] || null
  const handleAddToCart = async () => {
    if (!auth?.user) { navigate('/login'); return }
    setAdding(true)
    await dispatch(addToCart(product.productId, qty))
    setAdding(false)
  }

  const categoryName = category?.categoryName || 'Essentials'

  return (
    <div className="product-detail-page">
      <Helmet>
        <title>{productName} - PGKart</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="product-detail-breadcrumb" style={{ marginBottom: '1.5rem' }}>
        <Link to="/">Home</Link>
        {' / '}
        <Link to="/#shop">Products</Link>
        {' / '}
        <span style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>{productName}</span>
      </nav>

      <div className="product-detail-grid">
        {/* Left Column: Images */}
        <div className="product-detail-left">
          <div className="product-detail-main-image">
            {mainImage ? (
              <img
                src={mainImage}
                alt={productName}
                onError={e => { e.target.src = `https://placehold.co/500x500/EEF2FF/0D5B63?text=${encodeURIComponent(productName?.charAt(0) || 'P')}` }}
              />
            ) : (
              <div style={{
                width: '100%', height: '400px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '5rem', background: 'var(--color-bg)', color: 'var(--color-secondary)'
              }}>🛍️</div>
            )}
          </div>

          {/* Thumbnail row — only shown when there are 2+ images */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {allImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumbIdx(i)}
                  style={{
                    padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer',
                    outline: i === activeThumbIdx ? '2.5px solid var(--color-primary)' : '2px solid var(--color-secondary)',
                    overflow: 'hidden', background: 'none'
                  }}
                >
                  <img
                    src={src}
                    alt={`thumb-${i}`}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.src = `https://placehold.co/64x64/EEF2FF/0D5B63?text=${i + 1}` }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info details (Sticky on scroll) */}
        <div className="product-detail-right">
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)' }}>
            {categoryName}
          </span>
          <h1 className="product-detail-title">{productName}</h1>


          {/* Price & Stock badges */}
          <div className="product-detail-price-row">
            <span className="product-detail-sale-price">₹{Math.round(displayPrice)}</span>
            {hasDiscount && (
              <>
                <span className="product-detail-original-price">₹{Math.round(price)}</span>
                <span className="product-detail-stock-badge low-stock" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                  {discount}% OFF
                </span>
              </>
            )}

            {isOutOfStock ? (
              <span className="product-detail-stock-badge out-of-stock">❌ Out of Stock</span>
            ) : isLowStock ? (
              <span className="product-detail-stock-badge low-stock">⚡ Low Stock</span>
            ) : (
              <span className="product-detail-stock-badge in-stock">✓ In Stock</span>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-bg)', margin: 'var(--space-sm) 0' }} />

          {/* Stepper control */}
          {!isOutOfStock && (
            <div className="product-detail-qty-row">
              <span className="product-detail-qty-label">Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-base)' }}>
                <div className="product-detail-qty-stepper">
                  <button className="product-detail-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="product-detail-qty-value">{qty}</span>
                  <button className="product-detail-qty-btn" onClick={() => setQty(q => Math.min(quantity, q + 1))}>+</button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)' }}
              disabled={isOutOfStock || adding}
              onClick={handleAddToCart}
            >
              <FiShoppingCart />
              <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
            <button
              className="btn btn-outline"
              style={{ width: '100%', padding: '0.85rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)' }}
              disabled={isOutOfStock || adding}
              onClick={async () => {
                await handleAddToCart()
                navigate('/checkout')
              }}
            >
              <FiZap />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Highlights & Delivery info */}
          <div className="product-detail-highlights">
            <div className="product-detail-highlight-item">
              <span className="product-detail-highlight-icon"><FiShield /></span>
              <span>100% Genuine, student-vetted quality</span>
            </div>
            <div className="product-detail-highlight-item">
              <span className="product-detail-highlight-icon"><FiTruck /></span>
              <span>Fast local delivery direct to your PG/room</span>
            </div>
            <div className="product-detail-highlight-item">
              <span className="product-detail-highlight-icon"><FiCheck /></span>
              <span>Hassle-free 10-day returns policy</span>
            </div>
          </div>
        </div>

        {/* Full-width description below */}
        {description && (
          <div className="product-detail-desc-section">
            <h3 className="product-detail-desc-title">Description</h3>
            <p className="product-detail-desc-body">{description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
