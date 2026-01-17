import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

export default function CryptoCard({ coin }) {
  const navigate = useNavigate()
  const [fav, setFav] = useState(false)

  useEffect(() => {
    const w = JSON.parse(localStorage.getItem('femico_watchlist') || '[]')
    setFav(w.includes(coin.id))
  }, [coin.id])

  function toggleFav(e) {
    e.stopPropagation()
    const w = JSON.parse(localStorage.getItem('femico_watchlist') || '[]')
    let next
    if (w.includes(coin.id)) next = w.filter(x => x !== coin.id)
    else next = [coin.id, ...w]
    localStorage.setItem('femico_watchlist', JSON.stringify(next))
    setFav(next.includes(coin.id))
  }
  // prepare sparkline data (CoinGecko may provide sparkline_in_7d.price)
  const spark = coin.sparkline_in_7d?.price || null
  const sparkData = spark
    ? {
        labels: spark.map((_, i) => i),
        datasets: [
          {
            data: spark,
            borderColor: coin.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.3,
          },
        ],
      }
    : null

  return (
    <div onClick={() => navigate(`/dashboard/coin/${coin.id}`)} className="p-3 border rounded flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-3">
        <img src={coin.image} alt="logo" className="w-8 h-8" />
        <div>
          <div className="font-medium">{coin.name}</div>
          <div className="text-xs text-gray-500">{coin.symbol.toUpperCase()}</div>
        </div>
      </div>
      <div className="text-right flex items-center space-x-3">
        <div className="text-right">
          <div className="font-medium">${coin.current_price.toLocaleString()}</div>
          <div className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </div>
          {sparkData && (
            <div className="w-20 h-8 mt-1">
              <Line
                data={sparkData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { borderWidth: 1 }, point: { radius: 0 } },
                }}
              />
            </div>
          )}
        </div>
        <button onClick={toggleFav} className={`p-2 rounded ${fav ? 'text-yellow-400' : 'text-gray-300'}`}>
          <FaStar />
        </button>
      </div>
    </div>
  )
}
