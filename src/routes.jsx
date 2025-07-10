import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
// import Books from './pages/Books'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.auth.currentUser)

  if (!user) return <Navigate to="/" />
  if (role && user.role !== role) return <Navigate to="/dashboard" />

  return children
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    {/* <Route path="/books" element={
      <ProtectedRoute role="admin">
        <Books />
      </ProtectedRoute>
    } /> */}
  </Routes>
)

export default AppRoutes
