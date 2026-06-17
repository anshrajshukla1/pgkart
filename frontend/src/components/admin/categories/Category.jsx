import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  adminFetchAllCategories, adminCreateCategory,
  adminUpdateCategory, adminDeleteCategory
} from '../../../store/actions/index.js'

export default function Category() {
  const dispatch = useDispatch()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [creating, setCreating] = useState(false)

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await dispatch(adminFetchAllCategories())
      setCategories(data?.content || data || [])
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCategories() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await dispatch(adminCreateCategory(newName.trim()))
      toast.success(`Category "${newName}" created!`)
      setNewName('')
      loadCategories()
    } catch {
      toast.error('Failed to create category')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdate = async (id) => {
    if (!editName.trim()) return
    try {
      await dispatch(adminUpdateCategory(id, editName.trim()))
      toast.success('Category updated!')
      setEditId(null)
      setEditName('')
      loadCategories()
    } catch {
      toast.error('Failed to update category')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This may affect products.`)) return
    try {
      await dispatch(adminDeleteCategory(id))
      toast.success(`Category "${name}" deleted`)
      loadCategories()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 var(--space-base)' }}>
      <Helmet><title>Categories - PGKart Admin</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-midnight)', margin: 0 }}>
          🗂️ Categories
        </h1>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', fontWeight: 600 }}>
          {categories.length} categories
        </span>
      </div>

      {/* Create new */}
      <form
        onSubmit={handleCreate}
        style={{
          background: 'var(--color-white)', borderRadius: 'var(--radius-large)', padding: 'var(--space-xl)',
          border: '1.5px solid var(--color-secondary)', marginBottom: 'var(--space-lg)',
          boxShadow: 'var(--shadow-resting)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}
      >
        <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '240px' }}>
          <label className="form-label" style={{ color: 'var(--color-midnight)', fontWeight: 500 }}>New Category Name</label>
          <input
            className="form-control"
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Bath & Toiletries"
            style={{ borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={creating || !newName.trim()}
          style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-pill)', padding: '0.65rem 1.75rem' }}
        >
          {creating ? '⏳ Creating...' : '+ Add Category'}
        </button>
      </form>

      {/* Categories list */}
      <div style={{
        background: 'var(--color-white)', borderRadius: 'var(--radius-large)', overflow: 'hidden',
        border: '1.5px solid var(--color-secondary)', boxShadow: 'var(--shadow-resting)', marginBottom: 'var(--space-lg)'
      }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="empty-state-icon">🗂️</div>
            <h3>No categories yet</h3>
            <p>Create your first category above.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Category Name</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.categoryId}>
                    <td style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                      #{cat.categoryId}
                    </td>
                    <td>
                      {editId === cat.categoryId ? (
                        <input
                          className="form-control"
                          style={{ maxWidth: '320px', padding: '0.4rem 0.75rem', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-small)', borderColor: 'var(--color-secondary)' }}
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat.categoryId); if (e.key === 'Escape') setEditId(null) }}
                        />
                      ) : (
                        <span style={{ fontWeight: 600, color: 'var(--color-midnight)' }}>
                          🗂️ {cat.categoryName}
                        </span>
                      )}
                    </td>
                    <td>
                      {editId === cat.categoryId ? (
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'flex-end' }}>
                          <button className="btn btn-primary" style={{ padding: '0.4rem 1.15rem', fontSize: 'var(--font-size-xs)', borderRadius: 'var(--radius-pill)' }}
                            onClick={() => handleUpdate(cat.categoryId)}>Save</button>
                          <button className="btn btn-outline" style={{ padding: '0.4rem 1.15rem', fontSize: 'var(--font-size-xs)', borderRadius: 'var(--radius-pill)', borderColor: 'var(--color-secondary)' }}
                            onClick={() => setEditId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.4rem 1.15rem', fontSize: 'var(--font-size-xs)', borderRadius: 'var(--radius-pill)', borderColor: 'var(--color-secondary)' }}
                            onClick={() => { setEditId(cat.categoryId); setEditName(cat.categoryName) }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn"
                            style={{ padding: '0.4rem 1.15rem', fontSize: 'var(--font-size-xs)', borderRadius: 'var(--radius-pill)', background: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'none', fontWeight: 600 }}
                            onClick={() => handleDelete(cat.categoryId, cat.categoryName)}
                          >
                            🗑️ Delete
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
    </div>
  )
}
