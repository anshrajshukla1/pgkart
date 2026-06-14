import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import authReducer from './authReducer.js'
import cartReducer from './cartReducer.js'
import productReducer from './ProductReducer.js'
import errorReducer from './errorReducer.js'
import orderReducer from './orderReducer.js'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  error: errorReducer,
  orders: orderReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
export default store
