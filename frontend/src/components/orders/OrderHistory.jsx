import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { fetchUserOrders, requestOrderReturn } from '../../store/actions/index.js'
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
        background: '#FEE2E2', borderRadius: '8px', padding: '0.5rem 1rem',
        fontSize: '0.8rem', color: '#991B1B', fontWeight: 600
      }}>
        ❌ Order Cancelled
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'center', overflowX: 'auto', paddingBottom: '0.25rem' }}>
      {ORDER_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '0.25rem', minWidth: 'max-content'
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: i <= currentStep ? 'var(--success)' : 'var(--gray-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.7rem', fontWeight: 700,
              transition: 'background 0.3s'
            }}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize: '0.65rem', fontWeight: 600,
              color: i <= currentStep ? 'var(--success)' : 'var(--gray-400)'
            }}>{s}</span>
          </div>
          {i < ORDER_STEPS.length - 1 && (
            <div style={{
              height: '2px', width: '40px', flexShrink: 0,
              background: i < currentStep ? 'var(--success)' : 'var(--gray-200)',
              alignSelf: 'flex-start', marginTop: '11px'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function OrderHistory() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector(state => state.orders)
  const [processingReturn, setProcessingReturn] = React.useState(null)
  const [returnConfirmModal, setReturnConfirmModal] = React.useState(null)

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
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '16px', marginBottom: '1rem' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <Helmet><title>My Orders - PGKart</title></Helmet>

      <h1 style={{
        fontFamily: 'var(--font-heading)', fontSize: '1.75rem',
        fontWeight: 800, marginBottom: '2rem', color: 'var(--gray-900)'
      }}>
        📦 My Orders
      </h1>

      <div style={{
        background: '#FFFBEB', color: '#B45309', padding: '1rem', 
        borderRadius: '12px', marginBottom: '2rem', border: '1px solid #FEF3C7',
        display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem'
      }}>
        <span style={{ fontSize: '1.25rem' }}>📧</span>
        <div>
          <strong>Didn't receive order updates?</strong> Please check your email's <strong>Spam</strong> or <strong>Junk</strong> folder for order confirmation and future updates.
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Your orders will appear here once you make a purchase.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[...orders].reverse().map(order => {
            const statusInfo = STATUS_MAP[order.orderStatus] || STATUS_MAP['PENDING']
            const orderDate = order.orderDate
              ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })
              : 'N/A'

            return (
              <div key={order.orderId} style={{
                background: 'white', borderRadius: '20px',
                border: '1.5px solid var(--gray-200)', overflow: 'hidden',
                boxShadow: 'var(--shadow)', transition: 'var(--transition)'
              }}>
                {/* Order Header */}
                <div style={{
                  background: 'var(--gray-50)', padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--gray-200)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.2rem' }}>
                      ORDER #{order.orderId}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)' }}>
                      {orderDate}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                      ₹{Math.round(order.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  {order.orderItems?.slice(0, 3).map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.4rem 0', borderBottom: '1px dashed var(--gray-100)'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)', fontWeight: 500 }}>
                        {item.product?.productName || item.productName || `Product #${item.product?.productId || item.productId}`}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        Qty: {item.quantity} × ₹{Math.round(item.orderedProductPrice || 0)}
                      </span>
                    </div>
                  ))}
                  {order.orderItems?.length > 3 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>
                      + {order.orderItems.length - 3} more item(s)
                    </div>
                  )}

                  {/* Status bar */}
                  {order.orderStatus !== 'Cancelled' && (
                    <div style={{ marginTop: '1.25rem' }}>
                      <OrderStatusBar status={order.orderStatus} />
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.address && (
                    <div style={{
                      marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)',
                      fontSize: '0.85rem', color: 'var(--gray-600)'
                    }}>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>📍 Delivery Address</div>
                      {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                      {order.address.country}
                      {order.address.mobileNumber && <div>📱 {order.address.mobileNumber}</div>}
                    </div>
                  )}

                  {/* Return Request UI */}
                  {order.orderStatus === 'Delivered' && (
                    <div style={{
                      marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)',
                      display: 'flex', justifyContent: 'flex-end'
                    }}>
                      {!order.returnStatus ? (
                        <button
                          className="btn btn-outline"
                          style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                          onClick={() => setReturnConfirmModal(order.orderId)}
                          disabled={processingReturn === order.orderId}
                        >
                          {processingReturn === order.orderId ? 'Processing...' : 'Request Return'}
                        </button>
                      ) : (
                        <div style={{
                          fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px',
                          background: order.returnStatus === 'APPROVED' ? '#D1FAE5' :
                                      order.returnStatus === 'DECLINED' ? '#FEE2E2' : '#FEF3C7',
                          color: order.returnStatus === 'APPROVED' ? '#065F46' :
                                 order.returnStatus === 'DECLINED' ? '#991B1B' : '#92400E'
                        }}>
                          Return Status: {order.returnStatus}
                        </div>
                      )}
                    </div>
                  )}
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
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem', color: 'var(--gray-900)' }}>Confirm Return</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to return this entire order? Once requested, you cannot cancel the return request.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => setReturnConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: 'var(--error)' }}
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
