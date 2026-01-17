import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Watchlist() {
  const [list, setList] = useState([])
  const [coins, setCoins] = useState([])

  useEffect(() => {
    const w = JSON.parse(localStorage.getItem('femico_watchlist') || '[]')
    setList(w)
  }, [])

  useEffect(() => {
    if (list.length === 0) return
    axios.get('https://api.coingecko.com/api/v3/coins/markets', { params: { vs_currency: 'usd', ids: list.join(','), per_page: 50 } })
      .then(res => setCoins(res.data))
      .catch(() => setCoins([]))
  }, [list])

  if (list.length === 0) return (
    <section className="bg-white p-6 rounded shadow">
      <h4 className="font-semibold">Watchlist</h4>
      <div className="text-sm text-gray-500 mt-2">No favorites yet — star coins to add them here.</div>
    </section>
  )

  return (
    <section className="bg-white p-6 rounded shadow">
      <h4 className="font-semibold">Watchlist</h4>
      <div className="mt-3 space-y-2">
        {coins.map(c => (
          <Link to={`/dashboard/coin/${c.id}`} key={c.id} className="block p-2 border rounded hover:bg-gray-50 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={c.image} className="w-6 h-6" alt="" />
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.symbol.toUpperCase()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${c.current_price.toLocaleString()}</div>
              <div className={`text-sm ${c.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{c.price_change_percentage_24h?.toFixed(2)}%</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
