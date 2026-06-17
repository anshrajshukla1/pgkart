import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import api from '../../../api/api'

const EMPTY_FORM = {
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  minOrderValue: '',
  active: true
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/coupons')
      setCoupons(res.data)
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCoupons() }, [])

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [e.target.name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: form.discountType === 'FREE_DELIVERY' ? 0 : Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue || 0),
        active: Boolean(form.active)
      }
      await api.post('/api/admin/coupons', payload)
      toast.success('Coupon saved!')
      setForm(EMPTY_FORM)
      setShowForm(false)
      loadCoupons()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return
    try {
      await api.delete(`/api/admin/coupons/${id}`)
      toast.success('Coupon deleted')
      loadCoupons()
    } catch {
      toast.error('Failed to delete coupon')
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>
          🎟️ Coupons
        </h1>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setShowForm(true) }}>
          + New Coupon
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1.5px solid var(--gray-200)', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            🎟️ Create Coupon
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input className="form-control" name="code" value={form.code}
                  onChange={handleChange} placeholder="e.g. SUMMER50" style={{ textTransform: 'uppercase' }} required />
              </div>
              <div className="form-group">
                <label className="form-label">Discount Type *</label>
                <select className="form-control" name="discountType" value={form.discountType} onChange={handleChange} required>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                  <option value="FREE_DELIVERY">Free Delivery</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {form.discountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 
                   form.discountType === 'FLAT' ? 'Flat Discount Amount (₹) *' : 'Discount Value (Not Required)'}
                </label>
                <input className="form-control" type="number" name="discountValue" value={form.discountValue}
                  onChange={handleChange} placeholder="0" min={form.discountType === 'FREE_DELIVERY' ? 0 : 1} required={form.discountType !== 'FREE_DELIVERY'} disabled={form.discountType === 'FREE_DELIVERY'} />
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Order Value (₹) *</label>
                <input className="form-control" type="number" name="minOrderValue" value={form.minOrderValue || ''}
                  onChange={handleChange} placeholder="e.g. 500" min={0} required />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.75rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }} />
                  <span style={{ fontWeight: 600 }}>Is Active?</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '⏳ Saving...' : '+ Create Coupon'}
              </button>
              <button type="button" className="btn btn-outline"
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div style={{
        background: 'white', borderRadius: '20px', overflow: 'hidden',
        border: '1.5px solid var(--gray-200)', boxShadow: 'var(--shadow)'
      }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="empty-state" style={{ padding: '4rem' }}>
            <div className="empty-state-icon">🎟️</div>
            <h3>No coupons yet</h3>
            <p>Create your first discount coupon using the button above.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>#{c.id}</td>
                    <td style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)' }}>{c.code}</td>
                    <td style={{ fontWeight: 600 }}>
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 400 }}>Min: ₹{c.minOrderValue}</div>
                    </td>
                    <td>
                      <span style={{
                        background: c.active ? '#D1FAE5' : '#FEE2E2',
                        color: c.active ? '#065F46' : '#991B1B',
                        borderRadius: '20px', padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem', fontWeight: 700
                      }}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => handleDelete(c.id, c.code)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
