const initState = { cartId: null, products: [], totalPrice: 0, loading: false }

export default function cartReducer(state = initState, action) {
  switch (action.type) {
    case 'CART_LOADING':
      return { ...state, loading: true }
    case 'SET_CART':
      return { ...state, ...action.payload, loading: false }
    case 'CLEAR_CART':
      return { ...initState }
    default:
      return state
  }
}
