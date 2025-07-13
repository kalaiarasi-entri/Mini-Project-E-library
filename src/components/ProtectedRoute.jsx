import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector((state) => state.auth.user)

  if (!user) {
    console.log(" Not logged in - redirecting to login.")
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(`Access denied for role: ${user.role}`)
    return <h2 className="text-danger text-center mt-5">Access Denied</h2>
  }

  return children
}
