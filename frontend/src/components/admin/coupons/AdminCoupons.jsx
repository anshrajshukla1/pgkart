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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 var(--space-base)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-midnight)', margin: 0 }}>
          🎟️ Coupon Management
        </h1>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setShowForm(true) }} style={{ borderRadius: 'var(--radius-pill)' }}>
          + New Coupon
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-large)', padding: 'var(--space-xl)', border: '1.5px solid var(--color-secondary)', marginBottom: 'var(--space-lg)', boxShadow: 'var(--shadow-resting)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 'var(--space-base)', fontSize: 'var(--font-size-base)', color: 'var(--color-midnight)', marginTop: 0 }}>
            🎟️ Create Coupon
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="address-grid" style={{ marginBottom: 'var(--space-base)' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>Coupon Code *</label>
                <input className="form-control" name="code" value={form.code}
                  onChange={handleChange} placeholder="e.g. SUMMER50" style={{ textTransform: 'uppercase', borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>Discount Type *</label>
                <select className="form-control" name="discountType" value={form.discountType} onChange={handleChange} style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} required>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                  <option value="FREE_DELIVERY">Free Delivery</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>
                  {form.discountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 
                   form.discountType === 'FLAT' ? 'Flat Discount Amount (₹) *' : 'Discount Value (Not Required)'}
                </label>
                <input className="form-control" type="number" name="discountValue" value={form.discountValue}
                  onChange={handleChange} placeholder="0" min={form.discountType === 'FREE_DELIVERY' ? 0 : 1} style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} required={form.discountType !== 'FREE_DELIVERY'} disabled={form.discountType === 'FREE_DELIVERY'} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>
                  {form.discountType === 'FREE_DELIVERY' ? 'Minimum Order Value (Not Required)' : 'Minimum Order Value (₹) *'}
                </label>
                <input className="form-control" type="number" name="minOrderValue" value={form.minOrderValue || ''}
                  onChange={handleChange} placeholder="e.g. 500" min={0} style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }} required={form.discountType !== 'FREE_DELIVERY'} disabled={form.discountType === 'FREE_DELIVERY'} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 'var(--space-base)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer', margin: 0, color: 'var(--color-midnight)' }}>
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: 'var(--color-primary)' }} />
                  <span style={{ fontWeight: 600 }}>Is Active?</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '0.65rem 1.5rem' }} disabled={saving}>
                {saving ? '⏳ Saving...' : '+ Create Coupon'}
              </button>
              <button type="button" className="btn btn-outline" style={{ borderRadius: 'var(--radius-pill)', padding: '0.65rem 1.5rem', borderColor: 'var(--color-secondary)' }}
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons cards grid */}
      <div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-base)' }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-medium)' }} />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="empty-state" style={{ padding: '4rem' }}>
            <div className="empty-state-icon">🎟️</div>
            <h3>No coupons yet</h3>
            <p>Create your first discount coupon using the button above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-base)' }}>
            {coupons.map(c => (
              <div 
                key={c.id} 
                style={{
                  background: 'var(--color-white)',
                  border: '2px dashed var(--color-primary)',
                  borderRadius: 'var(--radius-medium)',
                  padding: 'var(--space-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                  position: 'relative',
                  boxShadow: 'var(--shadow-resting)',
                  overflow: 'hidden'
                }}
              >
                {/* Status tag */}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span style={{
                    background: c.active ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                    color: c.active ? 'var(--color-success)' : 'var(--color-error)',
                    borderRadius: 'var(--radius-pill)', padding: '0.2rem 0.6rem',
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase'
                  }}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ fontSize: '2rem' }}>🎟️</span>
                  <div>
                    {/* Monospace Code Badge */}
                    <div style={{
                      fontFamily: 'monospace',
                      background: 'rgba(13, 91, 99, 0.1)',
                      color: 'var(--color-primary)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-small)',
                      fontWeight: 700,
                      fontSize: 'var(--font-size-base)',
                      display: 'inline-block',
                      letterSpacing: '0.5px'
                    }}>
                      {c.code}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', marginTop: '2px' }}>
                      ID: #{c.id}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--color-secondary)', paddingTop: 'var(--space-sm)' }}>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-midnight)' }}>
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Min. spend required: <strong>₹{c.minOrderValue}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <button 
                    className="btn" 
                    style={{ 
                      background: 'var(--color-error-bg)', 
                      color: 'var(--color-error)', 
                      border: 'none', 
                      borderRadius: 'var(--radius-pill)', 
                      padding: '0.45rem 1rem', 
                      fontSize: 'var(--font-size-xs)', 
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDelete(c.id, c.code)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
