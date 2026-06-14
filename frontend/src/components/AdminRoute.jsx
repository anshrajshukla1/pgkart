import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute({ children }) {
  const auth = useSelector(state => state.auth)
  const isAdmin = auth?.user?.roles?.includes('ROLE_ADMIN')
  if (!auth?.user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
