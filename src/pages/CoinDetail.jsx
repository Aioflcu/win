import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale)

export default function CoinDetail() {
  const { id } = useParams()
  const [coin, setCoin] = useState(null)
  const [chart, setChart] = useState(null)

  useEffect(() => {
    if (!id) return
    axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, { params: { localization: false, tickers: false, market_data: true } })
      .then(res => setCoin(res.data))
      .catch(e => console.error(e))

    axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, { params: { vs_currency: 'usd', days: 30, interval: 'daily' } })
      .then(res => {
        const labels = res.data.prices.map(p => new Date(p[0]).toLocaleDateString())
        const data = res.data.prices.map(p => p[1])
        setChart({ labels, data })
      })
      .catch(e => console.error(e))
  }, [id])

  if (!coin) return <div className="p-6">Loading...</div>

  const market = coin.market_data || {}

  const chartData = chart ? {
    labels: chart.labels,
    datasets: [{ label: `${coin.name} price (USD)`, data: chart.data, borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.08)' }]
  } : null

  return (
    <div className="p-6">
      <Link to="/dashboard" className="text-sm text-indigo-600">← Back</Link>
      <div className="mt-4 bg-white p-6 rounded shadow">
        <div className="flex items-center space-x-4">
          <img src={coin.image.small} alt="logo" className="w-12 h-12" />
          <div>
            <div className="text-xl font-bold">{coin.name} <span className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</span></div>
            <div className="text-sm text-gray-500">Market Rank: {coin.market_cap_rank}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="text-3xl font-bold">${market.current_price?.usd?.toLocaleString() || '-'}</div>
            <div className="text-sm text-gray-500">24h: {market.price_change_percentage_24h?.toFixed(2)}%</div>
            <div className="mt-4">
              {chartData && <Line data={chartData} />}
            </div>
          </div>

          <div>
            <div className="p-3 border rounded mb-3">
              <div className="text-sm text-gray-500">Market Cap</div>
              <div className="font-medium">${market.market_cap?.usd?.toLocaleString() || '-'}</div>
            </div>
            <div className="p-3 border rounded mb-3">
              <div className="text-sm text-gray-500">24h Volume</div>
              <div className="font-medium">${market.total_volume?.usd?.toLocaleString() || '-'}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-500">Circulating Supply</div>
              <div className="font-medium">{market.circulating_supply?.toLocaleString() || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
