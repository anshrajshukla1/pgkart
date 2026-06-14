import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { addToCart } from '../../store/actions/index.js'
import api from '../../api/api.js'
import Loader from '../shared/Loader.jsx'

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
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="empty-state-icon">😕</div>
        <h3>Product not found</h3>
        <p>This product may have been removed or doesn't exist.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Products</Link>
      </div>
    )
  }

  const {
    productName, price, specialPrice, discount,
    quantity, image, description
  } = product

  const displayPrice = specialPrice || price
  const hasDiscount = discount > 0
  const isOutOfStock = quantity === 0
  const isLowStock = quantity > 0 && quantity <= 5

  const imageUrl = image
    ? (image.startsWith('http') ? image : `${BASE_URL}/images/products/${image}`)
    : null

  const handleAddToCart = async () => {
    if (!auth?.user) { navigate('/login'); return }
    setAdding(true)
    await dispatch(addToCart(product.productId, qty))
    setAdding(false)
  }

  return (
    <div className="product-detail-page">
      <Helmet>
        <title>{productName} - PGKart</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.825rem', color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link>
        {' / '}
        <Link to="/products" style={{ color: 'var(--primary)' }}>Products</Link>
        {' / '}
        <span>{productName}</span>
      </nav>

      <div className="product-detail-grid">
        {/* Image */}
        <div className="product-detail-image">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              onError={e => { e.target.src = `https://placehold.co/500x500/EEF2FF/4F46E5?text=${encodeURIComponent(productName?.charAt(0) || 'P')}` }}
            />
          ) : (
            <div style={{
              width: '100%', height: '400px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '5rem', background: '#EEF2FF'
            }}>🛍️</div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <h1>{productName}</h1>

          {/* Stock */}
          {isOutOfStock ? (
            <div style={{
              background: '#FEE2E2', border: '1.5px solid #FCA5A5', borderRadius: '10px',
              padding: '0.75rem 1rem', color: '#991B1B', fontWeight: 600, fontSize: '0.875rem',
              marginBottom: '1.25rem'
            }}>
              ❌ Out of Stock
            </div>
          ) : isLowStock ? (
            <div className="low-stock-alert">
              ⚡ Only {quantity} left in stock — order soon!
            </div>
          ) : (
            <div style={{
              background: '#D1FAE5', border: '1.5px solid #6EE7B7', borderRadius: '10px',
              padding: '0.75rem 1rem', color: '#065F46', fontWeight: 600, fontSize: '0.875rem',
              marginBottom: '1.25rem'
            }}>
              ✅ In Stock ({quantity} available)
            </div>
          )}

          {/* Price */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '2.25rem',
                fontWeight: 800, color: 'var(--primary)'
              }}>
                ₹{Math.round(displayPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--gray-400)' }}>
                    ₹{Math.round(price)}
                  </span>
                  <span style={{
                    background: '#D1FAE5', color: '#065F46',
                    borderRadius: '20px', padding: '0.2rem 0.7rem',
                    fontSize: '0.85rem', fontWeight: 700
                  }}>
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            {hasDiscount && (
              <p style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}>
                You save ₹{Math.round(price - displayPrice)}
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-700)',
                marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>Description</h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, fontSize: '0.9rem' }}>{description}</p>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {!isOutOfStock && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem', display: 'block' }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(quantity, q + 1))}>+</button>
                </div>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>Max {quantity}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem', fontSize: '1rem' }}
              disabled={isOutOfStock || adding}
              onClick={handleAddToCart}
            >
              {adding ? '⏳ Adding...' : '🛒 Add to Cart'}
            </button>
            <button
              className="btn btn-accent"
              style={{ flex: 1, padding: '0.85rem', fontSize: '1rem' }}
              disabled={isOutOfStock || adding}
              onClick={async () => {
                await handleAddToCart()
                navigate('/cart')
              }}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
            marginTop: '1.5rem', paddingTop: '1.5rem',
            borderTop: '1px solid var(--gray-200)'
          }}>
            {['🔒 Secure Payment', '🚀 Fast Delivery', '↩️ Easy Returns'].map(b => (
              <span key={b} className="chip chip-primary">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
