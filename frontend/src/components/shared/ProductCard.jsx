import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/actions/index.js'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)

  const {
    productId, productName, price, specialPrice, discount,
    quantity, image, description, category
  } = product

  const displayPrice = specialPrice || price
  const hasDiscount = discount > 0
  const isOutOfStock = quantity === 0
  const isLowStock = quantity > 0 && quantity <= 5

  const imageUrl = image
    ? (image.startsWith('http') ? image : `${BASE_URL}/images/products/${image}`)
    : null

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!auth?.user) {
      navigate('/login')
      return
    }
    dispatch(addToCart(productId, 1))
  }

  const categoryName = category?.categoryName || 'Essentials'
  // Mock rating/review details for UI representation as none exists in database model
  const mockStars = 5
  const mockReviewCount = 12

  return (
    <div className="product-card" onClick={() => navigate(`/products/${productId}`)}>
      {/* Image container */}
      <div className="product-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            onError={e => { e.target.src = `https://placehold.co/300x300/EEF2FF/0D5B63?text=${encodeURIComponent(productName?.charAt(0) || 'P')}` }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '3rem', background: 'var(--color-bg)', color: 'var(--color-secondary)'
          }}>
            <FiShoppingCart />
          </div>
        )}

        {/* Absolute Badges */}
        {hasDiscount && !isOutOfStock && (
          <div className="product-card-discount-badge">{discount}% OFF</div>
        )}

        <button 
          className="product-card-wishlist-btn" 
          onClick={(e) => {
            e.stopPropagation()
            // Visual feedback only as no wishlist logic exists in Redux store
          }}
          aria-label="Add to Wishlist"
        >
          <FiHeart style={{ fill: 'currentColor' }} />
        </button>
      </div>

      {/* Body details */}
      <div className="product-card-body">
        <span className="product-card-category">{categoryName}</span>
        
        <div className="product-card-name" title={productName}>
          {productName}
        </div>


        <div className="product-card-price-row">
          <span className="product-card-sale-price">₹{Math.round(displayPrice)}</span>
          {hasDiscount && (
            <span className="product-card-original-price">₹{Math.round(price)}</span>
          )}
        </div>

        <button
          className="product-card-add-btn"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          <FiShoppingCart />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  )
}
