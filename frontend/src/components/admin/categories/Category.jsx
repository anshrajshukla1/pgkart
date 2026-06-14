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
    <div>
      <Helmet><title>Categories - PGKart Admin</title></Helmet>

      <div className="admin-header">
        <h1>🗂️ Categories</h1>
        <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          {categories.length} categories
        </span>
      </div>

      {/* Create new */}
      <form
        onSubmit={handleCreate}
        style={{
          background: 'white', borderRadius: '16px', padding: '1.5rem',
          border: '1.5px solid var(--gray-200)', marginBottom: '1.5rem',
          boxShadow: 'var(--shadow)', display: 'flex', gap: '0.75rem', alignItems: 'flex-end'
        }}
      >
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <label className="form-label">New Category Name</label>
          <input
            className="form-control"
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Bath & Toiletries"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={creating || !newName.trim()}
          style={{ whiteSpace: 'nowrap' }}
        >
          {creating ? '⏳ Creating...' : '+ Add Category'}
        </button>
      </form>

      {/* Categories list */}
      <div style={{
        background: 'white', borderRadius: '20px', overflow: 'hidden',
        border: '1.5px solid var(--gray-200)', boxShadow: 'var(--shadow)'
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
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.categoryId}>
                  <td style={{ color: 'var(--gray-400)', fontSize: '0.8rem', width: '60px' }}>
                    #{cat.categoryId}
                  </td>
                  <td>
                    {editId === cat.categoryId ? (
                      <input
                        className="form-control"
                        style={{ maxWidth: '320px', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat.categoryId); if (e.key === 'Escape') setEditId(null) }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                        🗂️ {cat.categoryName}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {editId === cat.categoryId ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-success" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                          onClick={() => handleUpdate(cat.categoryId)}>Save</button>
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                          onClick={() => setEditId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => { setEditId(cat.categoryId); setEditName(cat.categoryName) }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
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
        )}
      </div>
    </div>
  )
}
