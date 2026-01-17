import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function PriceWatcher() {
  const [alerts, setAlerts] = useState([])
  const [last, setLast] = useState({})

  useEffect(() => {
    const interval = setInterval(checkPrices, 60 * 1000)
    checkPrices()
    return () => clearInterval(interval)
  }, [])

  async function checkPrices() {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', { params: { vs_currency: 'usd', ids: 'bitcoin,ethereum', per_page: 2 } })
      const data = res.data
      const settings = JSON.parse(localStorage.getItem('femico_settings') || '{}')
      const threshold = settings.alertThreshold || 5

      const newAlerts = []
      data.forEach((coin) => {
        const prev = last[coin.id]
        // use price_change_percentage_24h from API
        const pct = coin.price_change_percentage_24h
        if (Math.abs(pct) >= threshold) {
          // if we haven't alerted recently for this direction
          if (!prev || prev.alertedPct !== pct) {
            newAlerts.push({ id: coin.id, name: coin.name, pct })
          }
        }
      })

      if (newAlerts.length > 0) {
        setAlerts((s) => [...newAlerts, ...s].slice(0, 5))
        // try browser notification
        if (Notification && Notification.permission === 'granted') {
          newAlerts.forEach(a => {
            new Notification(`${a.name} alert`, { body: `${a.name} moved ${a.pct.toFixed(2)}% in 24h` })
          })
        }
      }

      const updated = {}
      data.forEach(c => { updated[c.id] = { price: c.current_price, alertedPct: c.price_change_percentage_24h } })
      setLast(updated)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  if (alerts.length === 0) return null

  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <div key={i} className="p-2 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
          Alert: {a.name} moved {a.pct.toFixed(2)}% (24h)
        </div>
      ))}
    </div>
  )
}
