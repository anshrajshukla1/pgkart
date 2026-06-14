const initState = { orders: [], loading: false }

export default function orderReducer(state = initState, action) {
  switch (action.type) {
    case 'ORDERS_LOADING':
      return { ...state, loading: true }
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false }
    default:
      return state
  }
}
