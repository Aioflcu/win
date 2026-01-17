import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default function WalletOverview({ holdings = {}, setHoldings = () => {}, transactions = [] }) {
  const [prices, setPrices] = useState({})
  const [fiatTotal, setFiatTotal] = useState(0)
  const [pnl, setPnl] = useState({ total: 0, byCoin: {} })

  useEffect(() => {
    const ids = Object.keys(holdings).join(',')
    if (!ids) return
    axios
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      .then((res) => {
        setPrices(res.data)
      })
      .catch((e) => console.error(e))
  }, [holdings])

  useEffect(() => {
    // compute fiat total
    let total = 0
    Object.entries(holdings).forEach(([id, amount]) => {
      const p = prices[id]?.usd || 0
      total += p * amount
    })
    setFiatTotal(total)
    // compute P&L using stored trades
    try {
      const trades = JSON.parse(localStorage.getItem('femico_trades') || '[]')
      const byCoin = {}
      trades.forEach((t) => {
        const coin = t.coin
        const amt = parseFloat(t.amount) || 0
        const price = parseFloat(t.price) || 0
        if (!byCoin[coin]) byCoin[coin] = { boughtQty: 0, boughtCost: 0 }
        if (t.type === 'Buy' || t.type === 'Received') {
          byCoin[coin].boughtQty += amt
          byCoin[coin].boughtCost += amt * price
        } else if (t.type === 'Sell' || t.type === 'Sent') {
          // For simplicity treat sell as reducing boughtQty (FIFO not implemented)
          byCoin[coin].boughtQty -= amt
          byCoin[coin].boughtCost -= amt * price
        }
      })

      let totalPnl = 0
      const byCoinPnl = {}
      Object.entries(holdings).forEach(([coin, qty]) => {
        const market = prices[coin]?.usd || 0
        const info = byCoin[coin] || { boughtQty: 0, boughtCost: 0 }
        const avgCost = info.boughtQty > 0 ? info.boughtCost / info.boughtQty : 0
        const unrealized = qty * (market - avgCost)
        byCoinPnl[coin] = { qty, avgCost, market, unrealized }
        totalPnl += unrealized
      })
      setPnl({ total: totalPnl, byCoin: byCoinPnl })
    } catch (e) {
      console.error(e)
    }
  }, [holdings, prices])

  const labels = Object.keys(holdings)
  const data = {
    labels,
    datasets: [
      {
        data: labels.map((id) => (prices[id]?.usd || 0) * holdings[id]),
        backgroundColor: ['#6366F1', '#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'],
      },
    ],
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Wallet Overview</h2>
        <div className="text-sm text-gray-500">Total balance</div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <div className="text-3xl font-bold">${fiatTotal.toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">Dummy total • Fiat equivalent (USD)</div>
            <div className="mt-2 text-sm">
              <span className={`font-medium ${pnl.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>Total P&L: ${pnl.total.toFixed(2)}</span>
              <span className="text-xs text-gray-500 ml-2">(unrealized)</span>
            </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(holdings).map(([id, amt]) => (
              <div key={id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium capitalize">{id}</div>
                  <div className="text-xs text-gray-500">{amt} • ${(prices[id]?.usd * amt || 0).toFixed(2)}</div>
                </div>
                <div className="text-sm text-right">
                  <div className="text-gray-600">{prices[id]?.usd ? '$' + prices[id].usd.toFixed(2) : '-'}</div>
                  <div className={`text-xs ${pnl.byCoin[id] && pnl.byCoin[id].unrealized >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pnl.byCoin[id] ? `${pnl.byCoin[id].unrealized >= 0 ? '+' : ''}$${pnl.byCoin[id].unrealized.toFixed(2)}` : '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-48">
          <Pie data={data} />
        </div>
      </div>
    </section>
  )
}
