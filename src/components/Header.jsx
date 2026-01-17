import React, { useEffect, useState } from 'react'
import { FaBell, FaUserCircle } from 'react-icons/fa'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState('Me')

  useEffect(() => {
    const u = localStorage.getItem('femico_user')
    if (u) setUser(u)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('femico_token')
    window.location.href = '/login'
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <div className="text-indigo-600 font-bold text-xl">FemiCoin</div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <button className="p-2 rounded hover:bg-gray-100">
              <FaBell size={18} />
            </button>

            <div className="relative">
              <button onClick={() => setOpen((v) => !v)} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                <FaUserCircle size={22} />
                <span className="hidden sm:inline">{user}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-10">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">Profile</button>
                  <a href="/dashboard/settings" className="block w-full text-left px-4 py-2 hover:bg-gray-50">Settings</a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-50">Logout</button>
                </div>
              )}
            </div>

            <div>
              <select className="border rounded p-2 text-sm">
                <option>EN</option>
                <option>ES</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
