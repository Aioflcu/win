import React, { useEffect, useState } from 'react'

function formDefaults() {
  return { coin: 'bitcoin', type: 'Buy', amount: '', price: '' }
}

export default function Portfolio({ onHoldingsChange }) {
  const [trades, setTrades] = useState([])
  const [form, setForm] = useState(formDefaults())

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('femico_trades') || '[]')
    setTrades(t)
    computeHoldings(t)
  }, [])

  function computeHoldings(list) {
    const map = {}
    list.forEach(tx => {
      const amt = parseFloat(tx.amount) || 0
      if (!map[tx.coin]) map[tx.coin] = 0
      if (tx.type === 'Buy' || tx.type === 'Received') map[tx.coin] += amt
      else map[tx.coin] -= amt
    })
    if (onHoldingsChange) onHoldingsChange(map)
  }

  function addTrade(e) {
    e.preventDefault()
    const next = [{ ...form, id: Date.now(), time: new Date().toISOString() }, ...trades]
    setTrades(next)
    localStorage.setItem('femico_trades', JSON.stringify(next))
    setForm(formDefaults())
    computeHoldings(next)
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <h4 className="font-semibold">Portfolio / Trades</h4>
      <form onSubmit={addTrade} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select value={form.coin} onChange={e => setForm(f => ({ ...f, coin: e.target.value }))} className="p-2 border rounded">
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="dogecoin">Dogecoin</option>
          <option value="cardano">Cardano</option>
          <option value="tether">Tether</option>
        </select>
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="p-2 border rounded">
          <option>Buy</option>
          <option>Sell</option>
          <option>Received</option>
          <option>Sent</option>
        </select>
        <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="Amount" className="p-2 border rounded" />
        <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Price (USD)" className="p-2 border rounded sm:col-span-2" />
        <div className="sm:col-span-3 flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Add Trade</button>
        </div>
      </form>

      <div className="mt-4 space-y-2">
        {trades.slice(0, 8).map(t => (
          <div key={t.id} className="p-2 border rounded flex justify-between">
            <div>
              <div className="font-medium">{t.type} {t.amount} {t.coin}</div>
              <div className="text-xs text-gray-500">{new Date(t.time).toLocaleString()}</div>
            </div>
            <div className="text-right">${(parseFloat(t.price) || 0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
