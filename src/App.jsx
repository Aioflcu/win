import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CoinDetail from './pages/CoinDetail'
import Settings from './pages/Settings'
import Welcome from './pages/Welcome'

function App() {
  const isLoggedIn = Boolean(localStorage.getItem('femico_token'))

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/*"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route path="/dashboard/coin/:id" element={isLoggedIn ? <CoinDetail /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" replace />} />
  <Route path="/" element={<Welcome />} />
    </Routes>
  )
}

export default App
