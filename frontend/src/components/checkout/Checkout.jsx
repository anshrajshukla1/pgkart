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
        description: 'Room Essentials Order',
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
              discountAmount: discount,
              deliveryFee: shipping
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
  let shipping = subtotal >= 199 ? 0 : 49
  let discount = 0

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = subtotal * (appliedCoupon.discountValue / 100)
    } else if (appliedCoupon.discountType === 'FLAT') {
      discount = appliedCoupon.discountValue
    } else if (appliedCoupon.discountType === 'FREE_DELIVERY') {
      shipping = 0
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shipping)

  return (
    <div className="container" style={{
      padding: 'var(--space-2xl) var(--space-base)',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <Helmet><title>Checkout - PGKart</title></Helmet>

      <h1 style={{
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        color: 'var(--color-midnight)',
        marginBottom: 'var(--space-xl)',
        fontFamily: 'var(--font-heading)'
      }}>Checkout</h1>

      <StepIndicator current={step} />

      <div className="checkout-layout">
        {/* Main Content */}
        <div>
          {/* Step 0: Address */}
          {step === 0 && (
            <div style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-large)',
              padding: 'var(--space-xl)',
              border: '1.5px solid var(--color-secondary)',
              boxShadow: 'var(--shadow-resting)'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                marginBottom: 'var(--space-lg)',
                fontSize: 'var(--font-size-lg)',
                color: 'var(--color-midnight)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)'
              }}>
                <span>📍</span> Delivery Address
              </h2>
              <div className="address-grid" style={{ marginBottom: 'var(--space-base)' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>Street Address</label>
                  <input className="form-control" name="street" value={address.street}
                    onChange={handleAddrChange} placeholder="Room no., Building, Street" style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>City</label>
                  <input className="form-control" name="city" value={address.city}
                    onChange={handleAddrChange} placeholder="City" style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>State</label>
                  <select className="form-control" name="state" value={address.state} onChange={handleAddrChange} style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}>
                    <option value="">Select State</option>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>PIN Code</label>
                  <input className="form-control" name="pincode" value={address.pincode}
                    onChange={handleAddrChange} placeholder="6-digit PIN" maxLength={6} style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>Mobile Number</label>
                  <input className="form-control" name="mobileNumber" value={address.mobileNumber}
                    onChange={handleAddrChange} placeholder="10-digit mobile" maxLength={10} style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>Country</label>
                  <input className="form-control" name="country" value={address.country}
                    onChange={handleAddrChange} placeholder="Country" style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} />
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: 'var(--space-md)', borderRadius: 'var(--radius-pill)' }}
                onClick={() => { if (validateAddress()) setStep(1) }}
              >
                Continue to Review →
              </button>
            </div>
          )}

          {/* Step 1: Review */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-base)' }}>
              {/* Address Summary */}
              <div style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-medium)',
                padding: 'var(--space-lg)',
                border: '1.5px solid var(--color-secondary)',
                boxShadow: 'var(--shadow-resting)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--font-size-base)', color: 'var(--color-midnight)', margin: 0 }}>📍 Delivery Address</h3>
                  <button onClick={() => setStep(0)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                    Edit
                  </button>
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, margin: 0 }}>
                  {address.street}, {address.city}, {address.state} - {address.pincode}<br />
                  📱 {address.mobileNumber}
                </p>
              </div>

              {/* Items */}
              <div style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-medium)',
                padding: 'var(--space-lg)',
                border: '1.5px solid var(--color-secondary)',
                boxShadow: 'var(--shadow-resting)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--font-size-base)', color: 'var(--color-midnight)', marginBottom: 'var(--space-base)' }}>
                  🛒 Order Items ({products.length})
                </h3>
                {products.map(item => {
                  const qty = Number(item.quantity || 1)
                  const price = Number(item.specialPrice || item.price || 0)
                  return (
                    <div key={item.productId} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.75rem 0', borderBottom: '1px solid var(--color-bg)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-midnight)' }}>{item.productName}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>Qty: {qty}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{Math.round(price * qty)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Coupon Section */}
              <div style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-medium)',
                padding: 'var(--space-lg)',
                border: '1.5px solid var(--color-secondary)',
                boxShadow: 'var(--shadow-resting)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--font-size-base)', color: 'var(--color-midnight)', marginBottom: 'var(--space-base)' }}>
                  🎟️ Have a Coupon?
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <input className="form-control" placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} disabled={appliedCoupon} style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} />
                  {!appliedCoupon ? (
                    <button className="btn btn-outline" disabled={!couponCode || validatingCoupon} onClick={handleApplyCoupon} style={{ borderRadius: 'var(--radius-pill)', borderColor: 'var(--color-primary)', color: 'var(--color-primary)', padding: '0.5rem 1.5rem' }}>
                      {validatingCoupon ? '...' : 'Apply'}
                    </button>
                  ) : (
                    <button className="btn" style={{ backgroundColor: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-pill)', padding: '0.5rem 1.5rem', border: 'none' }} onClick={() => { setAppliedCoupon(null); setCouponCode('') }}>
                      Remove
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <div style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginTop: 'var(--space-sm)' }}>
                    Coupon "{appliedCoupon.code}" applied!
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-pill)', marginTop: 'var(--space-sm)' }}
                onClick={() => setStep(2)}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-large)',
              padding: 'var(--space-xl)',
              border: '1.5px solid var(--color-secondary)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-resting)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💳</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--font-size-lg)', color: 'var(--color-midnight)', marginBottom: 'var(--space-xs)' }}>
                Select Payment Method
              </h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
                All payments are securely processed and encrypted.
              </p>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                {/* Razorpay Option */}
                <div className="payment-option-card selected">
                  <div className="payment-option-card-radio"></div>
                  <div className="payment-option-card-details">
                    <span className="payment-option-card-title">Razorpay Secure Checkout</span>
                    <span className="payment-option-card-desc">UPI, Google Pay, Cards, Netbanking</span>
                  </div>
                </div>

                {/* COD Option */}
                <div 
                  className="payment-option-card"
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  onClick={() => toast.error('Cash on Delivery is currently unavailable for room addresses')}
                >
                  <div className="payment-option-card-radio"></div>
                  <div className="payment-option-card-details">
                    <span className="payment-option-card-title">Cash on Delivery (COD)</span>
                    <span className="payment-option-card-desc">Temporarily unavailable for this address</span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-pill)' }}
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
          <h3 style={{ borderBottom: '1px solid var(--color-bg)', paddingBottom: 'var(--space-sm)' }}>Order Summary</h3>
          {products.map(item => {
            const qty = Number(item.quantity || 1)
            const price = Number(item.specialPrice || item.price || 0)
            return (
              <div key={item.productId} className="summary-row" style={{ fontSize: 'var(--font-size-sm)' }}>
                <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-midnight)' }}>
                  {item.productName} ×{qty}
                </span>
                <span style={{ fontWeight: 500, color: 'var(--color-midnight)' }}>₹{Math.round(price * qty)}</span>
              </div>
            )
          })}
          <div className="summary-row" style={{ fontSize: 'var(--font-size-sm)' }}>
            <span style={{ color: 'var(--color-muted)' }}>Shipping {shipping === 0 && subtotal < 199 && '(Waived)'}</span>
            <span style={{ color: shipping === 0 ? 'var(--color-success)' : 'inherit', fontWeight: 600 }}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
          {appliedCoupon && (
            <div className="summary-row" style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
              <span>Discount ({appliedCoupon.code})</span>
              <span>-₹{Math.round(discount)}</span>
            </div>
          )}
          <div className="summary-total" style={{ borderTop: '2px solid var(--color-bg)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{Math.round(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(11,29,45,0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-large)', padding: '2.5rem 2rem',
            maxWidth: '450px', width: '100%', textAlign: 'center',
            boxShadow: 'var(--shadow-floating)', border: '1.5px solid var(--color-secondary)'
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-midnight)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-lg)' }}>
              Order Placed Successfully!
            </h2>
            
            <div style={{ background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', padding: '1.25rem', borderRadius: 'var(--radius-medium)', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-warning)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span> Important Notice
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)', lineHeight: 1.6 }}>
                Please check the <strong>Spam or Junk folder</strong> of your email for the order confirmation and future updates regarding your order.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => navigate('/orders')}
                className="btn btn-primary" style={{ padding: '0.85rem', width: '100%', fontSize: '1rem', borderRadius: 'var(--radius-pill)' }}
              >
                View My Orders
              </button>
              <button 
                onClick={() => navigate('/products')}
                style={{ padding: '0.85rem', width: '100%', background: 'transparent', border: '1.5px solid var(--color-secondary)', color: 'var(--color-midnight)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', borderRadius: 'var(--radius-pill)', transition: 'all 0.2s' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(13, 91, 99, 0.05)'
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--color-secondary)'
                }}
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
