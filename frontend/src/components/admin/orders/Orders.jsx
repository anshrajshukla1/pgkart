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
    <div>
      <Helmet><title>Orders - PGKart Admin</title></Helmet>

      <div className="admin-header">
        <h1>🧾 Orders</h1>
        <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          Manage all customer orders
        </span>
      </div>

      <div style={{
        background: 'white', borderRadius: '20px', overflow: 'hidden',
        border: '1.5px solid var(--gray-200)', boxShadow: 'var(--shadow)'
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
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{order.orderId}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.email || 'N/A'}</div>
                    </td>
                    <td style={{ color: 'var(--gray-500)' }}>
                      {order.orderItems?.length || 0} item(s)
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{Math.round(order.totalAmount || 0)}</td>
                    <td style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[order.orderStatus] || 'status-pending'}`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                      {order.returnStatus && (
                        <div style={{
                          marginTop: '0.4rem', fontSize: '0.7rem', fontWeight: 700,
                          color: order.returnStatus === 'REQUESTED' ? '#92400E' :
                                 order.returnStatus === 'APPROVED' ? '#065F46' : '#991B1B'
                        }}>
                          Return: {order.returnStatus}
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: '160px', marginBottom: '0.5rem' }}
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', background: 'var(--success)' }}
                            disabled={updating === order.orderId}
                            onClick={() => handleReturn(order.orderId, true)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                            disabled={updating === order.orderId}
                            onClick={() => handleReturn(order.orderId, false)}
                          >
                            Decline
                          </button>
                        </div>
                      )}
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
        <div className="pagination" style={{ marginTop: '1.5rem' }}>
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
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem', color: 'var(--gray-900)' }}>Confirm Action</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to {returnModal.approve ? 'approve' : 'decline'} this return request?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => setReturnModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: returnModal.approve ? 'var(--success)' : 'var(--error)' }}
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
