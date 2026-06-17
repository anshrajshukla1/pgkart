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
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-large)', border: '1.5px solid var(--color-bg)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '1.33' }} />
      <div style={{ padding: 'var(--space-base)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
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
    <div style={{ minHeight: 'calc(100vh - 72px)', padding: 'var(--space-2xl) var(--space-base)', background: 'var(--color-bg)' }}>
      <Helmet>
        <title>Products - PGKart | Room Essentials</title>
      </Helmet>

      <div className="container">
        {/* Horizontal Category + Sort Filter Bar */}
        <div className="products-filter-bar">
          <div className="products-category-pills">
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams)
                newParams.delete('category')
                setSearchParams(newParams)
                setPage(0)
              }}
              className={`products-category-pill ${!category ? 'active' : ''}`}
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
                className={`products-category-pill ${category === c.categoryName ? 'active' : ''}`}
              >
                {c.categoryName}
              </button>
            ))}
          </div>

          <select
            value={sortIndex}
            onChange={handleSort}
            className="products-sort-select"
          >
            {SORT_OPTIONS.map((o, i) => (
              <option key={i} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Status bar below filter (results count + active filters) */}
        <div className="products-status-row">
          <div className="products-results-count">
            {loading ? 'Loading...' : `${totalElements} products found`}
          </div>

          <div className="products-active-filters">
            {keyword && (
              <div className="products-filter-chip">
                <span>Search: {keyword}</span>
                <button onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('search')
                  setSearchParams(newParams)
                  setPage(0)
                }}>×</button>
              </div>
            )}
            {category && (
              <div className="products-filter-chip">
                <span>Category: {category}</span>
                <button onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('category')
                  setSearchParams(newParams)
                  setPage(0)
                }}>×</button>
              </div>
            )}
            {(keyword || category) && (
              <button
                onClick={clearSearch}
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-primary)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', fontWeight: 500 }}>
            Sorted by: {SORT_OPTIONS[sortIndex].label}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="products-grid">
            {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-large)', padding: 'var(--space-4xl) var(--space-xl)' }}>
            <div className="empty-state-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or check different categories.</p>
            <button className="btn btn-primary" onClick={clearSearch}>Browse All Products</button>
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
              &larr;
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
              &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
