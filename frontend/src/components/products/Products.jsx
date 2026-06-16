import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { fetchProducts } from '../../store/actions/index.js'
import ProductCard from '../shared/ProductCard.jsx'

const SORT_OPTIONS = [
  { label: 'Newest First', sortBy: 'productId', sortOrder: 'desc' },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Name A-Z', sortBy: 'productName', sortOrder: 'asc' },
]

function SkeletonCard() {
  return (
    <div style={{ background: 'white', borderRadius: '20px', border: '1.5px solid #E5E7EB', overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: 1 }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '80%' }} />
        <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '50%' }} />
        <div className="skeleton" style={{ height: '36px', borderRadius: '8px', marginTop: '0.25rem' }} />
      </div>
    </div>
  )
}

export default function Products() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, loading, totalPages, totalElements } = useSelector(state => state.products)

  const [sortIndex, setSortIndex] = useState(0)
  const [page, setPage] = useState(0)

  const keyword = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  const [categories, setCategories] = useState([])

  // Fetch all categories once so we can map name -> id
  useEffect(() => {
    import('../../api/api.js').then(({ default: api }) => {
      api.get('/api/public/categories?pageSize=100').then(res => setCategories(res.data.content))
    })
  }, [])

  useEffect(() => {
    let categoryId = undefined
    if (category) {
      if (categories.length === 0) return // Wait for categories to load
      const found = categories.find(c => c.categoryName.toLowerCase() === category.toLowerCase())
      if (found) categoryId = found.categoryId
      else {
        // If category not found, we shouldn't show all products, we should show empty!
        // A hack is to pass a non-existent categoryId like -1
        categoryId = -1
      }
    }

    const sort = SORT_OPTIONS[sortIndex]
    dispatch(fetchProducts({
      pageNumber: page,
      pageSize: 50,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      keyword: keyword || undefined,
      categoryId
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [dispatch, page, sortIndex, keyword, category, categories])

  const handleSort = (e) => {
    setSortIndex(Number(e.target.value))
    setPage(0)
  }

  const clearSearch = () => {
    setSearchParams({})
    setPage(0)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2.5rem 1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}>
      <Helmet>
        <title>Products - PGKart | Hostel Essentials</title>
      </Helmet>

      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '2.25rem',
              fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.25rem',
              letterSpacing: '-0.02em'
            }}>
              {keyword ? `🔍 Results for "${keyword}"` : category ? `✨ ${category}` : '🛍️ All Products'}
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              {loading ? 'Loading...' : `${totalElements} products found`}
            </p>
            {(keyword || category) && (
              <button
                onClick={clearSearch}
                style={{
                  marginTop: '0.6rem', fontSize: '0.75rem', color: '#1E40AF',
                  background: '#DBEAFE', border: '1px solid #BFDBFE', padding: '4px 12px',
                  borderRadius: '16px', cursor: 'pointer', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#BFDBFE'}
                onMouseOut={(e) => e.currentTarget.style.background = '#DBEAFE'}
              >
                <span style={{fontSize: '0.9rem', lineHeight: 1}}>×</span> Clear Filter
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)' }}>Sort by:</label>
            <select
              value={sortIndex}
              onChange={handleSort}
              style={{ width: 'auto', padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontWeight: 600, color: 'var(--gray-700)', outline: 'none' }}
            >
              {SORT_OPTIONS.map((o, i) => (
                <option key={i} value={i}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Strip */}
        {categories.length > 0 && (
          <div style={{
            display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem',
            scrollbarWidth: 'none', msOverflowStyle: 'none'
          }} className="hide-scrollbar">
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams)
                newParams.delete('category')
                setSearchParams(newParams)
                setPage(0)
              }}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '24px', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.9rem',
                border: !category ? 'none' : '1.5px solid var(--gray-200)',
                background: !category ? 'var(--primary)' : 'white',
                color: !category ? 'white' : 'var(--gray-700)',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: !category ? '0 4px 12px rgba(79,70,229,0.2)' : 'none'
              }}
            >
              All Products
            </button>
            {categories.map(c => (
              <button
                key={c.categoryId}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.set('category', c.categoryName)
                  setSearchParams(newParams)
                  setPage(0)
                }}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '24px', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.9rem',
                  border: category === c.categoryName ? 'none' : '1.5px solid var(--gray-200)',
                  background: category === c.categoryName ? 'var(--primary)' : 'white',
                  color: category === c.categoryName ? 'white' : 'var(--gray-700)',
                  cursor: 'pointer', transition: 'all 0.2s', boxShadow: category === c.categoryName ? '0 4px 12px rgba(79,70,229,0.2)' : 'none'
                }}
              >
                {c.categoryName}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="products-grid">
            {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or browse all products.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.productId} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ←
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum = i
              if (totalPages > 7) {
                if (page <= 3) pageNum = i
                else if (page >= totalPages - 4) pageNum = totalPages - 7 + i
                else pageNum = page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${page === pageNum ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              )
            })}
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
