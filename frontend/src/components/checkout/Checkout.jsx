import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../../api/api.js'
import { fetchCart } from '../../store/actions/index.js'

const STEPS = ['Address', 'Review Order', 'Payment']

const INDIA_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
]

function StepIndicator({ current }) {
  return (
    <div className="checkout-stepper">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`step ${i === current ? 'active' : ''} ${i < current ? 'completed' : ''}`}>
            <div className="step-number">
              {i < current ? '✓' : i + 1}
            </div>
            <span className="step-label">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-connector ${i < current ? 'completed' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { products, totalPrice, cartId } = useSelector(state => state.cart)
  const auth = useSelector(state => state.auth)

  const [step, setStep] = useState(0)
  const [address, setAddress] = useState({
    street: '', city: '', state: '', country: 'India',
    pincode: '', mobileNumber: ''
  })
  const [placing, setPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setValidatingCoupon(true)
    try {
      const res = await api.get(`/api/public/coupons/validate?code=${couponCode}`)
      setAppliedCoupon(res.data)
      toast.success('Coupon applied successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon')
      setCouponCode('')
      setAppliedCoupon(null)
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleAddrChange = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }))

  const validateAddress = () => {
    const { street, city, state, pincode, mobileNumber } = address
    if (!street || !city || !state || !pincode || !mobileNumber) {
      toast.error('Please fill all address fields')
      return false
    }
    if (!/^\d{6}$/.test(pincode)) { toast.error('Enter a valid 6-digit PIN code'); return false }
    if (!/^\d{10}$/.test(mobileNumber)) { toast.error('Enter a valid 10-digit mobile number'); return false }
    return true
  }

  const handlePlaceOrder = async () => {
    if (placing) return  // prevent double-click
    setPlacing(true)
    try {
      // 1. Save Address (strip mobileNumber if backend rejects it, or keep — now supported)
      const addressPayload = {
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        mobileNumber: address.mobileNumber
      }
      const { data: savedAddress } = await api.post('/api/addresses', addressPayload)

      // 2. Create Razorpay Order
      const amountInPaise = Math.round(grandTotal * 100)
      const { data: rzpOrder } = await api.post('/api/payment/razorpay/create-order', {
        amount: amountInPaise,
        currency: 'INR',
        pgkartOrderId: cartId
      })

      // 3. Load Razorpay script
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload = resolve
          s.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
          document.body.appendChild(s)
        })
      }

      // 4. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'PGKart',
        description: 'Hostel Essentials Order',
        order_id: rzpOrder.razorpayOrderId,
        prefill: {
          name: auth?.user?.username || '',
          contact: address.mobileNumber
        },
        theme: { color: '#4F46E5' },
        handler: async (response) => {
          try {
            await api.post('/api/payment/razorpay/verify', {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              addressId: savedAddress.addressId,
              couponCode: appliedCoupon ? appliedCoupon.code : null,
              discountAmount: discount
            })
            dispatch(fetchCart())
            setOrderSuccess(true)
          } catch (e) {
            console.error('Verify error:', e)
            toast.error('Payment verification failed. Contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false)
            toast('Payment cancelled', { icon: 'ℹ️' })
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        console.error('Razorpay payment failed:', resp.error)
        toast.error('Payment failed: ' + (resp.error?.description || 'Unknown error'))
        setPlacing(false)
      })
      rzp.open()
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message)
      toast.error(err.response?.data?.message || err.message || 'Failed to create order. Try again.')
      setPlacing(false)
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    )
  }

  const subtotal = Number(totalPrice || 0)
  const shipping = 0 // subtotal > 499 ? 0 : 49
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = subtotal * (appliedCoupon.discountValue / 100)
    } else {
      discount = appliedCoupon.discountValue
    }
  }
  const grandTotal = Math.max(0, subtotal - discount + shipping)

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem',
      maxWidth: '900px', margin: '0 auto'
    }}>
      <Helmet><title>Checkout - PGKart</title></Helmet>

      <h1 style={{
        fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800,
        color: 'var(--gray-900)', marginBottom: '2rem'
      }}>Checkout</h1>

      <StepIndicator current={step} />

      <div className="checkout-layout">
        {/* Main Content */}
        <div>
          {/* Step 0: Address */}
          {step === 0 && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1.5px solid var(--gray-200)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                📍 Delivery Address
              </h2>
              <div className="address-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Street Address</label>
                  <input className="form-control" name="street" value={address.street}
                    onChange={handleAddrChange} placeholder="Room no., Building, Street" />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-control" name="city" value={address.city}
                    onChange={handleAddrChange} placeholder="City" />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select className="form-control" name="state" value={address.state} onChange={handleAddrChange}>
                    <option value="">Select State</option>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input className="form-control" name="pincode" value={address.pincode}
                    onChange={handleAddrChange} placeholder="6-digit PIN" maxLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input className="form-control" name="mobileNumber" value={address.mobileNumber}
                    onChange={handleAddrChange} placeholder="10-digit mobile" maxLength={10} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-control" name="country" value={address.country}
                    onChange={handleAddrChange} placeholder="Country" />
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
                onClick={() => { if (validateAddress()) setStep(1) }}
              >
                Continue to Review →
              </button>
            </div>
          )}

          {/* Step 1: Review */}
          {step === 1 && (
            <div>
              {/* Address Summary */}
              <div style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                border: '1.5px solid var(--gray-200)', marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem' }}>📍 Delivery Address</h3>
                  <button onClick={() => setStep(0)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                    Edit
                  </button>
                </div>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {address.street}, {address.city}, {address.state} - {address.pincode}<br />
                  📱 {address.mobileNumber}
                </p>
              </div>

              {/* Items */}
              <div style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                border: '1.5px solid var(--gray-200)', marginBottom: '1rem'
              }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                  🛒 Order Items ({products.length})
                </h3>
                {products.map(item => {
                  const qty = Number(item.quantity || 1)
                  const price = Number(item.specialPrice || item.price || 0)
                  return (
                    <div key={item.productId} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.6rem 0', borderBottom: '1px solid var(--gray-100)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Qty: {qty}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{Math.round(price * qty)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Coupon Section */}
              <div style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                border: '1.5px solid var(--gray-200)', marginBottom: '1rem'
              }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                  🎟️ Have a Coupon?
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="form-control" placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} disabled={appliedCoupon} />
                  {!appliedCoupon ? (
                    <button className="btn btn-outline" disabled={!couponCode || validatingCoupon} onClick={handleApplyCoupon}>
                      {validatingCoupon ? '...' : 'Apply'}
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={() => { setAppliedCoupon(null); setCouponCode('') }}>
                      Remove
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <div style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.5rem' }}>
                    Coupon "{appliedCoupon.code}" applied!
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                onClick={() => setStep(2)}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div style={{
              background: 'white', borderRadius: '20px', padding: '2rem',
              border: '1.5px solid var(--gray-200)', textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>
                Secure Payment
              </h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                Pay safely via Razorpay. Supports UPI, cards, and netbanking.
              </p>

              <div style={{
                background: '#EEF2FF', borderRadius: '12px', padding: '1.25rem',
                marginBottom: '2rem', border: '1px solid #C7D2FE'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['💳 Cards', '📱 UPI', '🏦 Netbanking'].map(m => (
                    <span key={m} style={{
                      background: 'white', borderRadius: '8px', padding: '0.4rem 0.9rem',
                      fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)',
                      border: '1px solid #C7D2FE'
                    }}>{m}</span>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem' }}
                disabled={placing}
                onClick={handlePlaceOrder}
              >
                {placing ? '⏳ Processing...' : `🔒 Pay ₹${Math.round(grandTotal)}`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          {products.map(item => {
            const qty = Number(item.quantity || 1)
            const price = Number(item.specialPrice || item.price || 0)
            return (
              <div key={item.productId} className="summary-row" style={{ fontSize: '0.8rem' }}>
                <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.productName} ×{qty}
                </span>
                <span>₹{Math.round(price * qty)}</span>
              </div>
            )
          })}
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
          {appliedCoupon && (
            <div className="summary-row" style={{ color: 'var(--success)', fontWeight: 600 }}>
              <span>Discount ({appliedCoupon.code})</span>
              <span>-₹{Math.round(discount)}</span>
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{Math.round(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div style={{
            background: 'white', borderRadius: '24px', padding: '2.5rem 2rem',
            maxWidth: '450px', width: '100%', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--gray-900)', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Order Placed Successfully!
            </h2>
            
            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#92400E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span> Important Notice
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#92400E', lineHeight: 1.6 }}>
                Please check the <strong>Spam or Junk folder</strong> of your email for the order confirmation and future updates regarding your order.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => navigate('/orders')}
                className="btn btn-primary" style={{ padding: '0.85rem', width: '100%', fontSize: '1rem' }}
              >
                View My Orders
              </button>
              <button 
                onClick={() => navigate('/products')}
                style={{ padding: '0.85rem', width: '100%', background: 'transparent', border: '1px solid var(--gray-200)', color: 'var(--gray-700)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', borderRadius: '12px', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
