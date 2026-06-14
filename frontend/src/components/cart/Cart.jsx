import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { removeFromCart, updateCartQuantity } from '../../store/actions/index.js'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector(s => s.cart)
  const auth = useSelector(s => s.auth)
  const { cartId, products = [], totalPrice = 0 } = cart

  const handleQuantityChange = (productId, qty) => {
    if (qty < 1) {
      dispatch(removeFromCart(cartId, productId))
    } else {
      dispatch(updateCartQuantity(cartId, productId, qty))
    }
  }

  if (!auth.user) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</p>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>Please Login</h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>You need to login to view your cart.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <Helmet><title>Cart - PGKart</title></Helmet>
        <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</p>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>Your cart is empty</h2>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Start shopping for hostel essentials!</p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem' }}>Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="container section">
      <Helmet><title>{`Cart (${products.length}) - PGKart`}</title></Helmet>
      <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#1F2937', marginBottom: '2rem' }}>
        Your Cart 🛒
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.map(product => {
            const imageUrl = product.image
              ? (product.image.startsWith('http') ? product.image : `http://localhost:8080/images/${product.image}`)
              : 'https://placehold.co/100x100/EEF2FF/4F46E5?text=PG'
            const qty = Number(product.quantity || 1)
            const price = Number(product.specialPrice || product.price || 0)
            const origPrice = Number(product.price || 0)

            return (
              <div key={product.productId} style={{
                background: 'white', borderRadius: '16px', border: '1.5px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.25rem',
                display: 'flex', gap: '1rem', alignItems: 'center'
              }}>
                <img src={imageUrl} alt={product.productName}
                  style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '10px', background: '#F3F4F6', flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1F2937', marginBottom: '0.35rem', 
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.productName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#4F46E5', fontSize: '1.1rem' }}>₹{price.toFixed(0)}</span>
                    {origPrice > price && (
                      <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.85rem' }}>₹{origPrice.toFixed(0)}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Quantity stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => handleQuantityChange(product.productId, qty - 1)}
                        style={{ padding: '0.4rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#374151' }}>−</button>
                      <span style={{ padding: '0.4rem 0.75rem', fontWeight: 600, borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', minWidth: '40px', textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => handleQuantityChange(product.productId, qty + 1)}
                        style={{ padding: '0.4rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#374151' }}>+</button>
                    </div>

                    <button onClick={() => dispatch(removeFromCart(cartId, product.productId))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '0.85rem', fontWeight: 600, padding: '0.4rem 0.75rem', borderRadius: '8px' }}
                      onMouseEnter={e => e.target.style.background = '#FEF2F2'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>
                      🗑 Remove
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1F2937' }}>₹{(price * qty).toFixed(0)}</div>
                  {qty > 1 && <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>₹{price.toFixed(0)} × {qty}</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1.5px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '1.5rem', position: 'sticky', top: '80px' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#1F2937', marginBottom: '1.5rem' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B7280' }}>
              <span>Subtotal ({products.length} items)</span>
              <span>₹{Number(totalPrice || 0).toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#10B981' }}>
              <span>🚚 Delivery</span>
              <span style={{ fontWeight: 600 }}>FREE</span>
            </div>
          </div>

          <div style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: '#4F46E5' }}>₹{Number(totalPrice || 0).toFixed(0)}</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>

          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
            ← Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  )
}
