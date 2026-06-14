const initState = { message: null }

export default function errorReducer(state = initState, action) {
  switch (action.type) {
    case 'SET_ERROR':
      return { message: action.payload }
    case 'CLEAR_ERROR':
      return { message: null }
    default:
      return state
  }
}
