import api from '../../api/api.js'
import toast from 'react-hot-toast'

// ===== AUTH =====
export const loginUser = (credentials) => async (dispatch) => {
  dispatch({ type: 'AUTH_LOADING' })
  try {
    const { data } = await api.post('/api/auth/signin', credentials)
    dispatch({ type: 'LOGIN_SUCCESS', payload: data })
    dispatch(fetchCart())
    toast.success(`Welcome back, ${data.username}! 👋`)
    return data
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed'
    dispatch({ type: 'AUTH_ERROR', payload: msg })
    toast.error(msg)
    throw err
  }
}

export const googleLoginUser = (idToken) => async (dispatch) => {
  dispatch({ type: 'AUTH_LOADING' })
  try {
    const { data } = await api.post('/api/auth/google', { idToken })
    dispatch({ type: 'LOGIN_SUCCESS', payload: data })
    dispatch(fetchCart())
    toast.success(`Welcome, ${data.username}! 👋`)
    return data
  } catch (err) {
    const msg = err.response?.data?.message || 'Google login failed'
    dispatch({ type: 'AUTH_ERROR', payload: msg })
    toast.error(msg)
    throw err
  }
}

export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: 'AUTH_LOADING' })
  try {
    await api.post('/api/auth/signup', userData)
    dispatch({ type: 'AUTH_IDLE' })
    toast.success('Account created! Please login. 🎉')
  } catch (err) {
    // Spring validation errors come as { errors: [{defaultMessage}] } or { message: '...' }
    const data = err.response?.data
    const msg = data?.errors?.[0]?.defaultMessage || data?.message || 'Registration failed'
    dispatch({ type: 'AUTH_ERROR', payload: msg })
    toast.error(msg)
    throw err
  }
}

export const logoutUser = () => (dispatch) => {
  dispatch({ type: 'LOGOUT' })
  dispatch({ type: 'CLEAR_CART' })
  toast.success('Logged out successfully')
}

// ===== PRODUCTS =====
export const fetchProducts = (params = {}) => async (dispatch) => {
  dispatch({ type: 'PRODUCTS_LOADING' })
  try {
    const {
      pageNumber = 0,
      pageSize = 50,
      sortBy = 'productId',
      sortOrder = 'asc',
      keyword,
      categoryId
    } = params

    let url = `/api/public/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    if (keyword) {
      url = `/api/public/products/keyword/${encodeURIComponent(keyword)}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    }
    if (categoryId) {
      url = `/api/public/categories/${categoryId}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    }

    const { data } = await api.get(url)
    dispatch({
      type: 'SET_PRODUCTS', payload: {
        products: data.content || [],
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0
      }
    })
  } catch (err) {
    console.error('Failed to fetch products', err)
    dispatch({ type: 'SET_PRODUCTS', payload: { products: [], totalPages: 0, totalElements: 0 } })
  }
}

// ===== CART =====
export const fetchCart = () => async (dispatch) => {
  try {
    const { data } = await api.get('/api/carts/users/cart')
    dispatch({
      type: 'SET_CART', payload: {
        cartId: data.cartId,
        products: data.products || [],
        totalPrice: data.totalPrice || 0
      }
    })
  } catch (err) {
    if (err.response?.status !== 401) console.error('Cart fetch error', err)
  }
}

export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  try {
    await api.post(`/api/carts/products/${productId}/quantity/${quantity}`)
    dispatch(fetchCart())
    toast.success('Added to cart! 🛒')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not add to cart')
  }
}

export const removeFromCart = (cartId, productId) => async (dispatch) => {
  try {
    await api.delete(`/api/carts/${cartId}/product/${productId}`)
    dispatch(fetchCart())
    toast.success('Removed from cart')
  } catch (err) {
    toast.error('Could not remove item')
  }
}

export const updateCartQuantity = (cartId, productId, quantity) => async (dispatch) => {
  try {
    await api.put(`/api/carts/${cartId}/products/${productId}/quantity/${quantity}`)
    dispatch(fetchCart())
  } catch (err) {
    toast.error('Could not update quantity')
  }
}

// ===== ORDERS =====
export const fetchUserOrders = () => async (dispatch) => {
  dispatch({ type: 'ORDERS_LOADING' })
  try {
    const { data } = await api.get('/api/orders/user')
    dispatch({ type: 'SET_ORDERS', payload: Array.isArray(data) ? data : data.content || [] })
  } catch (error) {
    console.error('Failed to fetch orders', error)
    dispatch({ type: 'SET_ORDERS', payload: [] })
  }
}

export const requestOrderReturn = (orderId) => async () => {
  const { data } = await api.post(`/api/orders/${orderId}/return`)
  return data
}

export const createRazorpayOrder = async (amount, pgkartOrderId) => {
  const { data } = await api.post('/api/payment/razorpay/create-order', {
    amount: Math.round(amount * 100),
    currency: 'INR',
    pgkartOrderId
  })
  return data
}

export const verifyAndPlaceOrder = async (verifyData) => {
  const { data } = await api.post('/api/payment/razorpay/verify', verifyData)
  return data
}

// ===== ADMIN =====
export const adminFetchAllOrders = (params = {}) => async () => {
  const { pageNumber = 0, pageSize = 20 } = params
  const { data } = await api.get(`/api/admin/orders?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=orderId&sortOrder=desc`)
  return data
}

export const adminUpdateOrderStatus = (orderId, status) => async () => {
  const { data } = await api.put(`/api/admin/orders/${orderId}/tracking`, { orderStatus: status })
  return data
}

export const adminHandleReturnRequest = (orderId, approve) => async () => {
  const { data } = await api.put(`/api/admin/orders/${orderId}/return?approve=${approve}`)
  return data
}

export const adminFetchAllCategories = () => async () => {
  const { data } = await api.get('/api/public/categories')
  return data
}

export const adminCreateCategory = (name) => async () => {
  const { data } = await api.post('/api/admin/categories', { categoryName: name })
  return data
}

export const adminUpdateCategory = (id, name) => async () => {
  const { data } = await api.put(`/api/admin/categories/${id}`, { categoryName: name })
  return data
}

export const adminDeleteCategory = (id) => async () => {
  await api.delete(`/api/admin/categories/${id}`)
}

export const adminCreateProduct = (categoryId, productData) => async () => {
  const { data } = await api.post(`/api/admin/categories/${categoryId}/product`, productData)
  return data
}

export const adminUpdateProduct = (productId, productData) => async () => {
  const { data } = await api.put(`/api/admin/products/${productId}`, productData)
  return data
}

export const adminDeleteProduct = (productId) => async () => {
  await api.delete(`/api/admin/product/${productId}`)
}

export const adminUploadProductImage = (productId, formData) => async () => {
  const { data } = await api.put(`/api/admin/products/${productId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

// Legacy aliases for backward compatibility
export const getUserCart = fetchCart
export const getUserAddresses = () => async () => { /* no-op */ }
