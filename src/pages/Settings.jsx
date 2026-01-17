import React, { useEffect, useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({ alertThreshold: 5, currency: 'usd', notifications: true })

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('femico_settings') || '{}')
    setSettings({ alertThreshold: 5, currency: 'usd', notifications: true, ...s })
  }, [])

  function save() {
    localStorage.setItem('femico_settings', JSON.stringify(settings))
    alert('Settings saved')
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="mt-4 bg-white p-6 rounded shadow max-w-md">
        <label className="block text-sm">Alert threshold (%)</label>
        <input type="number" value={settings.alertThreshold} onChange={e => setSettings(s => ({ ...s, alertThreshold: parseFloat(e.target.value) }))} className="p-2 border rounded w-full mt-1" />

        <label className="block text-sm mt-3">Default currency</label>
        <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} className="p-2 border rounded w-full mt-1">
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>

        <label className="flex items-center space-x-2 mt-3">
          <input type="checkbox" checked={settings.notifications} onChange={e => setSettings(s => ({ ...s, notifications: e.target.checked }))} />
          <span className="text-sm">Enable browser notifications</span>
        </label>

        <div className="mt-4 text-right">
          <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  )
}
