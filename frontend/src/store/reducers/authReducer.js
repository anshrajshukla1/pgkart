const user = JSON.parse(localStorage.getItem('pgkart_user') || 'null')
const initState = { user, loading: false, error: null }

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null }
    case 'AUTH_IDLE':
      return { ...state, loading: false, error: null }
    case 'LOGIN_SUCCESS':
      localStorage.setItem('pgkart_user', JSON.stringify(action.payload))
      return { ...state, user: action.payload, loading: false, error: null }
    case 'LOGOUT':
      localStorage.removeItem('pgkart_user')
      return { ...state, user: null, loading: false }
    case 'AUTH_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}
