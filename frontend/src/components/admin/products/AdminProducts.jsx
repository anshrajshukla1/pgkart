import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../../../api/api.js'
import {
  fetchProducts, adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, adminUploadProductImage, adminFetchAllCategories
} from '../../../store/actions/index.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const EMPTY_FORM = {
  productName: '', description: '', price: '', discount: '',
  quantity: '', categoryId: ''
}

export default function AdminProducts() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [imageUploadId, setImageUploadId] = useState(null)

  const loadProducts = async (p = 0) => {
    setLoading(true)
    try {
      const res = await api.get(`/api/public/products?pageNumber=${p}&pageSize=12`)
      setProducts(res?.data?.content || [])
      setTotalPages(res?.data?.totalPages || 0)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await dispatch(adminFetchAllCategories())
      setCategories(data?.content || data || [])
    } catch {
      console.error('Failed to load categories')
    }
  }

  useEffect(() => {
    loadProducts(page)
    loadCategories()
  }, [page])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleEdit = (product) => {
    setForm({
      productName: product.productName || '',
      description: product.description || '',
      price: product.price || '',
      discount: product.discount || '',
      quantity: product.quantity || '',
      categoryId: product.category?.categoryId || ''
    })
    setEditId(product.productId)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.categoryId) { toast.error('Select a category'); return }
    setSaving(true)
    try {
      const payload = {
        productName: form.productName,
        description: form.description,
        price: Number(form.price),
        discount: Number(form.discount) || 0,
        quantity: Number(form.quantity),
      }

      let productId = editId
      if (editId) {
        await dispatch(adminUpdateProduct(editId, payload))
        toast.success('Product updated!')
      } else {
        const created = await dispatch(adminCreateProduct(form.categoryId, payload))
        productId = created.productId
        toast.success('Product created!')
      }

      // Upload image if selected
      if (imageFile && productId) {
        const fd = new FormData()
        fd.append('image', imageFile)
        await dispatch(adminUploadProductImage(productId, fd))
        toast.success('Image uploaded!')
      }

      setForm(EMPTY_FORM)
      setEditId(null)
      setShowForm(false)
      setImageFile(null)
      loadProducts(page)
    } catch {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await dispatch(adminDeleteProduct(id))
      toast.success(`"${name}" deleted`)
      loadProducts(page)
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div>
      <Helmet><title>Products - PGKart Admin</title></Helmet>

      <div className="admin-header">
        <h1>📦 Products</h1>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM) }}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{
          background: 'white', borderRadius: '20px', padding: '2rem',
          border: '1.5px solid var(--primary-light)', marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            {editId ? `✏️ Edit Product #${editId}` : '+ New Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Name *</label>
                <input className="form-control" name="productName" value={form.productName}
                  onChange={handleChange} placeholder="e.g. Premium Study Lamp" required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={form.description}
                  onChange={handleChange} placeholder="Product description..." rows={3}
                  style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input className="form-control" type="number" name="price" value={form.price}
                  onChange={handleChange} placeholder="0" min={0} step="0.01" required />
              </div>
              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input className="form-control" type="number" name="discount" value={form.discount}
                  onChange={handleChange} placeholder="0" min={0} max={100} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input className="form-control" type="number" name="quantity" value={form.quantity}
                  onChange={handleChange} placeholder="0" min={0} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-control" name="categoryId" value={form.categoryId}
                  onChange={handleChange} required>
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={e => setImageFile(e.target.files[0])}
                />
                {imageFile && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.25rem', display: 'block' }}>
                    📎 {imageFile.name}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '⏳ Saving...' : editId ? '💾 Update Product' : '+ Create Product'}
              </button>
              <button type="button" className="btn btn-outline"
                onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div style={{
        background: 'white', borderRadius: '20px', overflow: 'hidden',
        border: '1.5px solid var(--gray-200)', boxShadow: 'var(--shadow)'
      }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state" style={{ padding: '4rem' }}>
            <div className="empty-state-icon">📦</div>
            <h3>No products yet</h3>
            <p>Create your first product using the button above.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const img = product.image
                    ? (product.image.startsWith('http') ? product.image : `${BASE_URL}/images/products/${product.image}`)
                    : null
                  return (
                    <tr key={product.productId}>
                      <td>
                        {img ? (
                          <img src={img} alt={product.productName}
                            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', background: '#EEF2FF' }}
                            onError={e => { e.target.src = 'https://placehold.co/44x44/EEF2FF/4F46E5?text=P' }}
                          />
                        ) : (
                          <div style={{
                            width: '44px', height: '44px', background: '#EEF2FF', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                          }}>🛍️</div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: '200px' }}>{product.productName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.15rem' }}>
                          ID: #{product.productId}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        ₹{Math.round(product.specialPrice || product.price)}
                        {product.discount > 0 && (
                          <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--gray-400)', fontWeight: 400 }}>
                            ₹{Math.round(product.price)}
                          </div>
                        )}
                      </td>
                      <td>
                        {product.discount > 0 ? (
                          <span style={{
                            background: '#D1FAE5', color: '#065F46',
                            borderRadius: '20px', padding: '0.2rem 0.6rem',
                            fontSize: '0.75rem', fontWeight: 700
                          }}>{product.discount}%</span>
                        ) : '—'}
                      </td>
                      <td>
                        <span style={{
                          color: product.quantity === 0 ? 'var(--error)' : product.quantity <= 5 ? 'var(--accent)' : 'var(--success)',
                          fontWeight: 600, fontSize: '0.875rem'
                        }}>
                          {product.quantity === 0 ? '❌ Out' : product.quantity <= 5 ? `⚡ ${product.quantity}` : `✅ ${product.quantity}`}
                        </span>
                      </td>
                      <td style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                        {product.category?.categoryName || 'N/A'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => handleEdit(product)}>✏️ Edit</button>
                          <button className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => handleDelete(product.productId, product.productName)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '1.5rem' }}>
          <button className="page-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>←</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button key={i} className={`page-btn ${page === i ? 'active' : ''}`} onClick={() => setPage(i)}>
              {i + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>→</button>
        </div>
      )}
    </div>
  )
}
