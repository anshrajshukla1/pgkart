import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { adminFetchAllOrders } from '../../../store/actions/index.js'
import { useDispatch } from 'react-redux'
import api from '../../../api/api.js'

export default function Dashboard() {
  const dispatch = useDispatch()
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, users: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch orders and products independently so one failure doesn't blank the other
        let orders = []
        let totalOrderCount = 0
        let totalRevenue = 0
        try {
          const ordersData = await dispatch(adminFetchAllOrders({ pageSize: 5 }))
          orders = ordersData?.content || ordersData || []
          totalOrderCount = ordersData?.totalElements || orders.length
          totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)
        } catch (e) {
          console.error('Orders fetch failed:', e)
        }

        let totalProducts = 0
        try {
          const productsRes = await api.get('/api/public/products?pageSize=1')
          totalProducts = productsRes?.data?.totalElements || 0
        } catch (e) {
          console.error('Products count fetch failed:', e)
        }

        setStats({
          orders: totalOrderCount,
          revenue: totalRevenue,
          products: totalProducts,
        })
        setRecentOrders(orders.slice(0, 5))
      } catch (e) {
        console.error('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dispatch])

  const STATUS_CLASS = {
    Order_Placed: 'status-confirmed', Confirmed: 'status-confirmed',
    Shipped: 'status-shipped', Delivered: 'status-delivered',
    Cancelled: 'status-cancelled', PENDING: 'status-pending',
    Out_for_Delivery: 'status-shipped'
  }

  return (
    <div>
      <Helmet><title>Dashboard - PGKart Admin</title></Helmet>

      <div className="admin-header">
        <h1>📊 Dashboard</h1>
        <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '🧾', label: 'Total Orders', value: stats.orders, color: '#4F46E5' },
          { icon: '💰', label: 'Revenue (7 days)', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, color: '#10B981' },
          { icon: '📦', label: 'Products Listed', value: stats.products, color: '#F59E0B' }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>


      {/* Recent Orders */}
      <div style={{
        background: 'white', borderRadius: '20px', padding: '1.5rem',
        border: '1.5px solid var(--gray-200)', boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--gray-900)'
        }}>
          🧾 Recent Orders
        </h2>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '44px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-state-icon">🧾</div>
            <h3>No orders yet</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.orderId}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>#{order.orderId}</td>
                  <td>{order.email || 'N/A'}</td>
                  <td style={{ fontWeight: 700 }}>₹{Math.round(order.totalAmount || 0)}</td>
                  <td>
                    <span className={`status-badge ${STATUS_CLASS[order.orderStatus] || 'status-pending'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gray-400)' }}>
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
