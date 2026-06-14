import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../../api/api.js'
import { fetchCart } from '../../store/actions/index.js'

const STEPS = ['Address', 'Review Order', 'Payment']

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
              addressId: savedAddress.addressId
            })
            dispatch(fetchCart())
            toast.success('🎉 Order placed successfully!')
            navigate('/orders')
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
  const grandTotal = subtotal + shipping

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
                  <input className="form-control" name="state" value={address.state}
                    onChange={handleAddrChange} placeholder="State" />
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
          <div className="summary-total">
            <span>Total</span>
            <span>₹{Math.round(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
