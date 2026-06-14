import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/shared/Navbar.jsx'
import Footer from './components/shared/Footer.jsx'
import Loader from './components/shared/Loader.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

// Lazy-loaded pages
const Home = lazy(() => import('./components/home/Home.jsx'))
const Products = lazy(() => import('./components/products/Products.jsx'))
const ProductDetail = lazy(() => import('./components/products/ProductDetail.jsx'))
const Cart = lazy(() => import('./components/cart/Cart.jsx'))
const Checkout = lazy(() => import('./components/checkout/Checkout.jsx'))
const OrderHistory = lazy(() => import('./components/orders/OrderHistory.jsx'))
const Login = lazy(() => import('./components/auth/Login.jsx'))
const Register = lazy(() => import('./components/auth/Register.jsx'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'))
const Dashboard = lazy(() => import('./components/admin/dashboard/Dashboard.jsx'))
const AdminProducts = lazy(() => import('./components/admin/products/AdminProducts.jsx'))
const AdminOrders = lazy(() => import('./components/admin/orders/Orders.jsx'))
const Category = lazy(() => import('./components/admin/categories/Category.jsx'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public pages with Navbar + Footer */}
          <Route path="/" element={<><Navbar /><main><Home /></main><Footer /></>} />
          <Route path="/products" element={<><Navbar /><main><Products /></main><Footer /></>} />
          <Route path="/products/:id" element={<><Navbar /><main><ProductDetail /></main><Footer /></>} />
          <Route path="/login" element={<><Navbar /><main><Login /></main><Footer /></>} />
          <Route path="/register" element={<><Navbar /><main><Register /></main><Footer /></>} />
          {/* Protected customer routes */}
          <Route path="/cart" element={<PrivateRoute><><Navbar /><main><Cart /></main><Footer /></></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><><Navbar /><main><Checkout /></main><Footer /></></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><><Navbar /><main><OrderHistory /></main><Footer /></></PrivateRoute>} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<Category />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
