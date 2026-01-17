import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CryptoCard from './CryptoCard'

import { useNavigate } from 'react-router-dom'

export default function TopCryptos() {
  const [coins, setCoins] = useState([])
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets', {
        params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, page: 1, sparkline: true },
      })
      .then((res) => setCoins(res.data))
      .catch((e) => console.error(e))
  }, [])

  useEffect(() => {
    if (!search) return setResults([])
    // simple search via CoinGecko list
    axios
      .get('https://api.coingecko.com/api/v3/search', { params: { query: search } })
      .then((res) => setResults(res.data.coins || []))
      .catch((e) => console.error(e))
  }, [search])

  const navigate = useNavigate()

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Top Cryptos</h3>
        <div className="flex items-center space-x-2">
          <input
            className="px-3 py-2 border rounded-md"
            placeholder="Search tokens"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {search ? (
          results.slice(0, 6).map((c) => (
            <div key={c.id} className="p-3 border rounded flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={c.thumb} alt="logo" className="w-6 h-6" />
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.symbol}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Rank {c.market_cap_rank || '-'}</div>
            </div>
          ))
        ) : (
          coins.map((coin) => <CryptoCard key={coin.id} coin={coin} />)
        )}
      </div>
    </section>
  )
}
