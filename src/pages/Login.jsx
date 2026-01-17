import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Accept demo admin and also client credentials
    const valid = (
      (username === 'admin' && password === '1234') ||
      (username === 'Bryanvoth' && password === 'xgbto1234') ||
      (username === 'Bryan Voth' && password === 'xgbto1234')
    )

    if (valid) {
      // set a simple token and store username
      localStorage.setItem('femico_token', 'demo-token')
      localStorage.setItem('femico_user', username)
      navigate('/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
  <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">FemiCoin</h1>
  <div className="text-center text-sm text-gray-500 mb-4">Login with demo accounts: <strong>admin/1234</strong> or <strong>Bryanvoth/xgbto1234</strong></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="1234"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
