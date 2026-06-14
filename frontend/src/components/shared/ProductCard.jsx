import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/actions/index.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'


export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)

  const {
    productId, productName, price, specialPrice, discount,
    quantity, image, description
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

  return (
    <div className="product-card" onClick={() => navigate(`/products/${productId}`)}>
      <div className="product-image-wrap">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            onError={e => { e.target.src = `https://placehold.co/300x300/EEF2FF/4F46E5?text=${encodeURIComponent(productName?.charAt(0) || 'P')}` }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '3rem', background: '#EEF2FF'
          }}>🛍️</div>
        )}

        {isOutOfStock && (
          <span className="product-badge badge-out-of-stock">Out of Stock</span>
        )}
        {!isOutOfStock && isLowStock && (
          <span className="product-badge badge-low-stock">Only {quantity} left!</span>
        )}
        {!isOutOfStock && !isLowStock && hasDiscount && (
          <span className="product-badge badge-discount">{discount}% OFF</span>
        )}
      </div>

      <div className="product-info">
        <div className="product-name" title={productName}>{productName}</div>


        <div className="product-price">
          <span className="price-special">₹{Math.round(displayPrice)}</span>
          {hasDiscount && (
            <>
              <span className="price-original">₹{Math.round(price)}</span>
              <span className="price-discount-pct">Save {discount}%</span>
            </>
          )}
        </div>

        <button
          className="add-to-cart-btn"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  )
}
