const initState = { products: [], loading: false, totalPages: 0, totalElements: 0 }

export default function productReducer(state = initState, action) {
  switch (action.type) {
    case 'PRODUCTS_LOADING':
      return { ...state, loading: true }
    case 'SET_PRODUCTS':
      return { ...state, ...action.payload, loading: false }
    default:
      return state
  }
}
