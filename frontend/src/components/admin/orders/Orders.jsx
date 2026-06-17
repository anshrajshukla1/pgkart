import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  adminFetchAllOrders,
  adminUpdateOrderStatus,
  adminHandleReturnRequest
} from '../../../store/actions/index.js'

const STATUSES = ['Order_Placed', 'Confirmed', 'Shipped', 'Out_for_Delivery', 'Delivered', 'Cancelled']

const STATUS_CLASS = {
  Order_Placed: 'status-confirmed', Confirmed: 'status-confirmed',
  Shipped: 'status-shipped', Out_for_Delivery: 'status-shipped',
  Delivered: 'status-delivered', Cancelled: 'status-cancelled', PENDING: 'status-pending'
}

export default function Orders() {
  const dispatch = useDispatch()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [updating, setUpdating] = useState(null)

  const loadOrders = async (p = 0) => {
    setLoading(true)
    try {
      const data = await dispatch(adminFetchAllOrders({ pageNumber: p, pageSize: 15 }))
      setOrders(data?.content || data || [])
      setTotalPages(data?.totalPages || 1)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders(page) }, [page])

  const handleStatusChange = async (orderId, status) => {
    if (!status) return
    setUpdating(orderId)
    try {
      await dispatch(adminUpdateOrderStatus(orderId, status))
      toast.success(`Order #${orderId} updated to ${status}`)
      loadOrders(page)
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const [returnModal, setReturnModal] = React.useState(null)

  const handleReturn = (orderId, approve) => {
    setReturnModal({ orderId, approve })
  }

  const confirmReturn = async () => {
    if (!returnModal) return
    const { orderId, approve } = returnModal
    setReturnModal(null)
    setUpdating(orderId)
    try {
      await dispatch(adminHandleReturnRequest(orderId, approve))
      toast.success(approve ? 'Return approved' : 'Return declined')
      loadOrders(page)
    } catch {
      toast.error('Failed to process return')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 var(--space-base)' }}>
      <Helmet><title>Orders - PGKart Admin</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-midnight)', margin: 0 }}>
          🧾 Orders
        </h1>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', fontWeight: 600 }}>
          Manage customer orders
        </span>
      </div>

      <div style={{
        background: 'var(--color-white)', borderRadius: 'var(--radius-large)', overflow: 'hidden',
        border: '1.5px solid var(--color-secondary)', boxShadow: 'var(--shadow-resting)', marginBottom: 'var(--space-lg)'
      }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state" style={{ padding: '4rem' }}>
            <div className="empty-state-icon">🧾</div>
            <h3>No orders found</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.orderId}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>#{order.orderId}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-midnight)' }}>{order.email || 'N/A'}</div>
                    </td>
                    <td style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>
                      {order.orderItems?.length || 0} item(s)
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-midnight)' }}>₹{Math.round(order.totalAmount || 0)}</td>
                    <td style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-xs)' }}>
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[order.orderStatus] || 'status-pending'}`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                      {order.returnStatus && (
                        <div style={{
                          marginTop: '0.4rem', fontSize: 'var(--font-size-xs)', fontWeight: 700,
                          color: order.returnStatus === 'REQUESTED' ? 'var(--color-warning)' :
                                 order.returnStatus === 'APPROVED' ? 'var(--color-success)' : 'var(--color-error)'
                        }}>
                          Return: {order.returnStatus}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                        <select
                          className="form-control"
                          style={{
                            padding: '0.4rem 0.75rem',
                            fontSize: 'var(--font-size-xs)',
                            width: '160px',
                            borderRadius: 'var(--radius-pill)',
                            borderColor: 'var(--color-secondary)',
                            cursor: 'pointer'
                          }}
                          value={order.orderStatus || ''}
                          disabled={updating === order.orderId}
                          onChange={e => handleStatusChange(order.orderId, e.target.value)}
                        >
                          <option value="">Change status...</option>
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                        
                        {order.returnStatus === 'REQUESTED' && (
                          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '0.25rem 0.65rem', fontSize: 'var(--font-size-xs)', background: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-pill)', border: 'none' }}
                              disabled={updating === order.orderId}
                              onClick={() => handleReturn(order.orderId, true)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn"
                              style={{ padding: '0.25rem 0.65rem', fontSize: 'var(--font-size-xs)', background: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-pill)', border: 'none', fontWeight: 600 }}
                              disabled={updating === order.orderId}
                              onClick={() => handleReturn(order.orderId, false)}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <button className="page-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>←</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`page-btn ${page === i ? 'active' : ''}`} onClick={() => setPage(i)}>
              {i + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>→</button>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {returnModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(11,29,45,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-medium)', padding: 'var(--space-xl)', maxWidth: '400px', width: '90%',
            boxShadow: 'var(--shadow-floating)', border: '1.5px solid var(--color-secondary)'
          }}>
            <h3 style={{ margin: '0 0 var(--space-md)', color: 'var(--color-midnight)', fontSize: 'var(--font-size-lg)' }}>Confirm Action</h3>
            <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
              Are you sure you want to {returnModal.approve ? 'approve' : 'decline'} this return request?
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => setReturnModal(null)}
                style={{ borderRadius: 'var(--radius-pill)', padding: '0.5rem 1.25rem' }}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{ background: returnModal.approve ? 'var(--color-success)' : 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-pill)', padding: '0.5rem 1.25rem', border: 'none' }}
                onClick={confirmReturn}
                disabled={updating === returnModal.orderId}
              >
                Yes, {returnModal.approve ? 'Approve' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
