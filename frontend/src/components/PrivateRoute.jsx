import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PrivateRoute({ children }) {
  const auth = useSelector(state => state.auth)
  const location = useLocation()
  if (!auth?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}