import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { fetchUserOrders, requestOrderReturn, addToCart } from '../../store/actions/index.js'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  Order_Placed: { label: 'Order Placed', class: 'status-confirmed', step: 0 },
  Confirmed: { label: 'Confirmed', class: 'status-confirmed', step: 1 },
  Shipped: { label: 'Shipped', class: 'status-shipped', step: 2 },
  Out_for_Delivery: { label: 'Out for Delivery', class: 'status-shipped', step: 3 },
  Delivered: { label: 'Delivered', class: 'status-delivered', step: 4 },
  Cancelled: { label: 'Cancelled', class: 'status-cancelled', step: -1 },
  PENDING: { label: 'Pending', class: 'status-pending', step: 0 },
}

const ORDER_STEPS = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']

function OrderStatusBar({ status }) {
  const info = STATUS_MAP[status] || STATUS_MAP['PENDING']
  const currentStep = info.step

  if (currentStep === -1) {
    return (
      <div style={{
        background: 'var(--color-error-bg)', borderRadius: 'var(--radius-small)', padding: '0.5rem 1rem',
        fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', fontWeight: 600, border: '1px solid var(--color-error)'
      }}>
        ❌ Order Cancelled
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'center', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
      {ORDER_STEPS.map((s, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep
        const isFuture = i > currentStep
        
        return (
          <React.Fragment key={s}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '0.25rem', minWidth: 'max-content'
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: isCompleted ? 'var(--color-secondary)' : (isActive ? 'var(--color-primary)' : 'transparent'),
                border: isFuture ? '2px solid var(--color-secondary)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isFuture ? 'var(--color-muted)' : 'white', fontSize: '0.7rem', fontWeight: 700,
                transition: 'all 0.3s'
              }}>
                {isCompleted ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600,
                color: isActive ? 'var(--color-primary)' : (isCompleted ? 'var(--color-secondary)' : 'var(--color-muted)')
              }}>{s}</span>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div style={{
                height: '2px', width: '40px', flexShrink: 0,
                background: isCompleted ? 'var(--color-secondary)' : 'var(--color-secondary)',
                opacity: isCompleted ? 1 : 0.4,
                alignSelf: 'flex-start', marginTop: '11px'
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function OrderHistory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading } = useSelector(state => state.orders)
  const [processingReturn, setProcessingReturn] = React.useState(null)
  const [returnConfirmModal, setReturnConfirmModal] = React.useState(null)
  const [activeTab, setActiveTab] = React.useState('All')

  const handleBuyAgain = async (order) => {
    try {
      await Promise.all(order.orderItems.map(item => {
        const pid = item.product?.productId || item.productId;
        return dispatch(addToCart(pid, item.quantity));
      }));
      toast.success('Items added to cart!');
      navigate('/cart');
    } catch (err) {
      toast.error('Failed to add items to cart');
    }
  }

  const handleReturnRequest = async () => {
    const orderId = returnConfirmModal;
    setReturnConfirmModal(null)
    setProcessingReturn(orderId)
    try {
      await dispatch(requestOrderReturn(orderId))
      toast.success('Return requested successfully')
      dispatch(fetchUserOrders())
    } catch (err) {
      toast.error('Failed to request return')
    } finally {
      setProcessingReturn(null)
    }
  }

  useEffect(() => {
    dispatch(fetchUserOrders())
  }, [dispatch])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-2xl) var(--space-base)', maxWidth: '900px', margin: '0 auto' }}>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-medium)', marginBottom: 'var(--space-base)' }} />
        ))}
      </div>
    )
  }

  const filteredOrders = orders ? orders.filter(order => {
    if (activeTab === 'All') return true
    if (activeTab === 'Active') {
      return ['Order_Placed', 'Confirmed', 'Shipped', 'Out_for_Delivery', 'PENDING'].includes(order.orderStatus)
    }
    if (activeTab === 'Delivered') return order.orderStatus === 'Delivered'
    if (activeTab === 'Cancelled') return order.orderStatus === 'Cancelled'
    return true
  }) : []

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', padding: 'var(--space-2xl) var(--space-base)', maxWidth: '900px', margin: '0 auto' }}>
      <Helmet><title>My Orders - PGKart</title></Helmet>

      <h1 style={{
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-midnight)',
        fontFamily: 'var(--font-heading)'
      }}>
        📦 My Orders
      </h1>

      <div style={{
        background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: 'var(--space-base)', 
        borderRadius: 'var(--radius-medium)', marginBottom: 'var(--space-lg)', border: '1px solid var(--color-warning)',
        display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'var(--font-size-sm)'
      }}>
        <span style={{ fontSize: '1.25rem' }}>📧</span>
        <div>
          <strong>Didn't receive order updates?</strong> Please check your email's <strong>Spam</strong> or <strong>Junk</strong> folder for order confirmation and future updates.
        </div>
      </div>

      {/* Filter Tab Pills */}
      <div style={{
        display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto',
        marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-xs)'
      }} className="hide-scrollbar">
        {['All', 'Active', 'Delivered', 'Cancelled'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid var(--color-secondary)',
              background: activeTab === t ? 'var(--color-primary)' : 'var(--color-white)',
              color: activeTab === t ? 'var(--color-white)' : 'var(--color-midnight)',
              fontWeight: 600,
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
            onMouseOver={(e) => {
              if (activeTab !== t) e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onMouseOut={(e) => {
              if (activeTab !== t) e.currentTarget.style.borderColor = 'var(--color-secondary)'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No orders found</h3>
          <p>Your orders will appear here once you make a purchase.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-base)', borderRadius: 'var(--radius-pill)', padding: '0.75rem 2rem' }}>
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {[...filteredOrders].reverse().map(order => {
            const statusInfo = STATUS_MAP[order.orderStatus] || STATUS_MAP['PENDING']
            const orderDate = order.orderDate
              ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })
              : 'N/A'

            return (
              <div key={order.orderId} style={{
                background: 'var(--color-white)', borderRadius: 'var(--radius-large)',
                border: '1.5px solid var(--color-secondary)', overflow: 'hidden',
                boxShadow: 'var(--shadow-resting)', transition: 'var(--transition-base)'
              }}>
                {/* Order Header */}
                <div style={{
                  background: 'rgba(11,29,45,0.03)', padding: '1rem 1.5rem',
                  borderBottom: '1.5px solid var(--color-secondary)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>
                      ORDER #{order.orderId}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-midnight)' }}>
                      {orderDate}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)' }}>
                      ₹{Math.round(order.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  {order.orderItems?.slice(0, 3).map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.5rem 0', borderBottom: '1px dashed var(--color-secondary)'
                    }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-midnight)', fontWeight: 500 }}>
                        {item.product?.productName || item.productName || `Product #${item.product?.productId || item.productId}`}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
                        Qty: {item.quantity} × ₹{Math.round(item.orderedProductPrice || 0)}
                      </span>
                    </div>
                  ))}
                  {order.orderItems?.length > 3 && (
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-sm)' }}>
                      + {order.orderItems.length - 3} more item(s)
                    </div>
                  )}

                  {/* Status bar */}
                  {order.orderStatus !== 'Cancelled' && (
                    <div style={{ marginTop: 'var(--space-lg)' }}>
                      <OrderStatusBar status={order.orderStatus} />
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.address && (
                    <div style={{
                      marginTop: 'var(--space-lg)', paddingTop: 'var(--space-base)', borderTop: '1px solid var(--color-secondary)',
                      fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', opacity: 0.9
                    }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-midnight)', marginBottom: 'var(--space-xs)' }}>📍 Delivery Address</div>
                      {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                      {order.address.country}
                      {order.address.mobileNumber && <div>📱 {order.address.mobileNumber}</div>}
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  <div style={{
                    marginTop: 'var(--space-lg)', paddingTop: 'var(--space-base)', borderTop: '1px solid var(--color-secondary)',
                    display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)'
                  }}>
                    {/* Ghost Buttons */}
                    <button
                      className="btn btn-outline"
                      style={{
                        borderRadius: 'var(--radius-pill)',
                        padding: '0.45rem 1.15rem',
                        fontSize: 'var(--font-size-xs)',
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-primary)',
                        background: 'transparent'
                      }}
                      onClick={() => handleBuyAgain(order)}
                    >
                      Buy Again
                    </button>
                    
                    <button
                      className="btn btn-outline"
                      style={{
                        borderRadius: 'var(--radius-pill)',
                        padding: '0.45rem 1.15rem',
                        fontSize: 'var(--font-size-xs)',
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-primary)',
                        background: 'transparent'
                      }}
                      onClick={() => {
                        toast.success('Adding items to your cart...')
                        navigate('/products')
                      }}
                    >
                      Buy Again
                    </button>

                    {/* Return Request button */}
                    {order.orderStatus === 'Delivered' && (
                      <div style={{ marginLeft: 'auto' }}>
                        {!order.returnStatus ? (
                          <button
                            className="btn"
                            style={{
                              borderColor: 'var(--color-error)',
                              color: 'var(--color-error)',
                              background: 'transparent',
                              border: '1.5px solid var(--color-error)',
                              borderRadius: 'var(--radius-pill)',
                              padding: '0.45rem 1.15rem',
                              fontSize: 'var(--font-size-xs)',
                              fontWeight: 600
                            }}
                            onClick={() => setReturnConfirmModal(order.orderId)}
                            disabled={processingReturn === order.orderId}
                          >
                            {processingReturn === order.orderId ? 'Processing...' : 'Request Return'}
                          </button>
                        ) : (
                          <div style={{
                            fontWeight: 600, fontSize: 'var(--font-size-xs)', padding: '0.45rem 1.15rem', borderRadius: 'var(--radius-pill)',
                            background: order.returnStatus === 'APPROVED' ? 'var(--color-success-bg)' :
                                        order.returnStatus === 'DECLINED' ? 'var(--color-error-bg)' : 'var(--color-warning-bg)',
                            color: order.returnStatus === 'APPROVED' ? 'var(--color-success)' :
                                   order.returnStatus === 'DECLINED' ? 'var(--color-error)' : 'var(--color-warning)'
                          }}>
                            Return Status: {order.returnStatus}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Return Confirmation Modal */}
      {returnConfirmModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(11,29,45,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-medium)', padding: 'var(--space-xl)', maxWidth: '400px', width: '90%',
            boxShadow: 'var(--shadow-floating)', border: '1.5px solid var(--color-secondary)'
          }}>
            <h3 style={{ margin: '0 0 var(--space-md)', color: 'var(--color-midnight)', fontSize: 'var(--font-size-lg)' }}>Confirm Return</h3>
            <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
              Are you sure you want to return this entire order? Once requested, you cannot cancel the return request.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => setReturnConfirmModal(null)}
                style={{ borderRadius: 'var(--radius-pill)', padding: '0.5rem 1.25rem' }}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{ background: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-pill)', padding: '0.5rem 1.25rem', border: 'none' }}
                onClick={handleReturnRequest}
                disabled={processingReturn === returnConfirmModal}
              >
                Yes, Request Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
