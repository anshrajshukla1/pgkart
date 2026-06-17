import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../../api/api.js'
import { removeFromCart, updateCartQuantity } from '../../store/actions/index.js'
import { FiTrash2, FiShoppingCart, FiArrowRight, FiArrowLeft } from 'react-icons/fi'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector(s => s.cart)
  const auth = useSelector(s => s.auth)
  const { cartId, products = [], totalPrice = 0 } = cart

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  const handleQuantityChange = (productId, qty) => {
    if (qty < 1) {
      dispatch(removeFromCart(cartId, productId))
    } else {
      dispatch(updateCartQuantity(cartId, productId, qty))
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setValidatingCoupon(true)
    try {
      const res = await api.get(`/api/public/coupons/validate?code=${couponCode}`)
      const coupon = res.data
      const currentSubtotal = Number(totalPrice || 0)
      if (coupon.minOrderValue && currentSubtotal < coupon.minOrderValue) {
        toast.error(`Minimum order value of ₹${coupon.minOrderValue} is required to use this coupon.`)
        setCouponCode('')
        setAppliedCoupon(null)
        return
      }
      setAppliedCoupon(coupon)
      toast.success('Coupon applied successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon')
      setCouponCode('')
      setAppliedCoupon(null)
    } finally {
      setValidatingCoupon(false)
    }
  }

  if (!auth.user) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">👤</div>
        <h3>Please Login</h3>
        <p>You need to login to view your cart and start shopping.</p>
        <Link to="/login" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '0.8rem 2rem' }}>Login Now</Link>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <Helmet><title>Cart - PGKart</title></Helmet>
        <div className="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '0.8rem 2.25rem' }}>
          Browse Products
        </Link>
      </div>
    )
  }

  const subtotal = Number(totalPrice || 0)
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = subtotal * (appliedCoupon.discountValue / 100)
    } else {
      discount = appliedCoupon.discountValue
    }
  }
  const grandTotal = Math.max(0, subtotal - discount)

  return (
    <div className="container" style={{ padding: 'var(--space-2xl) var(--space-base)' }}>
      <Helmet><title>{`Cart (${products.length}) - PGKart`}</title></Helmet>
      
      <div className="cart-title-row">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-midnight)', fontWeight: 700, margin: 0 }}>
          Your Cart
        </h1>
        <span className="cart-title-count">({products.length} items)</span>
      </div>

      <div className="cart-layout">
        {/* Left column: Cart Items list + Coupon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-base)' }}>
          <div className="cart-items-container">
            {products.map(product => {
              const imageUrl = product.image
                ? (product.image.startsWith('http') ? product.image : `http://localhost:8080/images/${product.image}`)
                : 'https://placehold.co/100x100/EEF2FF/0D5B63?text=PG'
              const qty = Number(product.quantity || 1)
              const price = Number(product.specialPrice || product.price || 0)
              const origPrice = Number(product.price || 0)

              return (
                <div key={product.productId} className="cart-item-row">
                  {/* Item Image */}
                  <img src={imageUrl} alt={product.productName} className="cart-item-image" />

                  {/* Item Details */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{product.productName}</div>
                    <div className="cart-item-variant">₹{price.toFixed(0)} each</div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="cart-item-stepper-wrap">
                    <div className="product-detail-qty-stepper">
                      <button className="product-detail-qty-btn" onClick={() => handleQuantityChange(product.productId, qty - 1)}>−</button>
                      <span className="product-detail-qty-value">{qty}</span>
                      <button className="product-detail-qty-btn" onClick={() => handleQuantityChange(product.productId, qty + 1)}>+</button>
                    </div>
                  </div>

                  {/* Total price for product */}
                  <div className="cart-item-price-wrap">
                    <span className="cart-item-price">₹{(price * qty).toFixed(0)}</span>
                  </div>

                  {/* Delete button */}
                  <button 
                    onClick={() => dispatch(removeFromCart(cartId, product.productId))}
                    className="cart-item-trash-btn"
                    aria-label="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Coupon Code section */}
          <div className="cart-coupon-card">
            <span className="cart-coupon-title">🎟️ Apply Coupon Discount</span>
            <div className="cart-coupon-input-wrapper">
              <input
                type="text"
                placeholder="Enter coupon code (e.g. STUDENT10)"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                disabled={appliedCoupon}
                className="cart-coupon-input"
              />
              {!appliedCoupon ? (
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || validatingCoupon}
                  className="cart-coupon-apply-btn"
                >
                  {validatingCoupon ? '...' : 'Apply'}
                </button>
              ) : (
                <button
                  onClick={() => { setAppliedCoupon(null); setCouponCode('') }}
                  className="cart-coupon-apply-btn"
                  style={{ backgroundColor: 'var(--color-error)' }}
                >
                  Remove
                </button>
              )}
            </div>
            {appliedCoupon && (
              <span style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                Coupon "{appliedCoupon.code}" applied! Save ₹{Math.round(discount)}
              </span>
            )}
          </div>
        </div>

        {/* Right column: Order Summary */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="summary-row" style={{ color: Number(totalPrice || 0) >= 199 ? 'var(--color-success)' : 'var(--color-muted)' }}>
            <span>Shipping</span>
            <span>{Number(totalPrice || 0) >= 199 ? 'FREE' : 'Calculated at checkout'}</span>
          </div>
          {appliedCoupon && (
            <div className="summary-row" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
              <span>Discount ({appliedCoupon.code})</span>
              <span>-₹{Math.round(discount)}</span>
            </div>
          )}
          <div className="summary-total">
            <span>Estimated Total</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{Math.round(grandTotal)}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.9rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)', marginTop: 'var(--space-base)' }}
            onClick={() => {
              // Pass coupon details to checkout state if checkout routing supports state propagation
              navigate('/checkout', { state: { coupon: appliedCoupon } })
            }}
          >
            <span>Proceed to Checkout</span>
            <FiArrowRight />
          </button>

          <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)', marginTop: 'var(--space-base)', color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>
            <FiArrowLeft />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
