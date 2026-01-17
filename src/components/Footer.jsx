import React from 'react'
import { FaTwitter, FaTelegram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">Worldwide Investment Compensation Network (WICN)</div>
          <div className="flex space-x-4 text-sm text-gray-600 mt-2">
            <a>About</a>
            <a>FAQs</a>
            <a>Support</a>
            <a>Privacy</a>
            <a>Terms</a>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaTwitter />
          <FaTelegram />
        </div>
      </div>
    </footer>
  )
}
