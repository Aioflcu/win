import React, { useState } from 'react'
import Modal from './ui/Modal'

export default function QuickActions({ holdings = {}, setHoldings = () => {}, addTransaction = () => {} }) {
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [form, setForm] = useState({ token: '', amount: '', address: '' })

  const tokens = Object.keys(holdings)

  const openWithdraw = () => setShowWithdraw(true)
  const closeWithdraw = () => setShowWithdraw(false)

  const submitWithdraw = (e) => {
    e.preventDefault()
    const { token, amount, address } = form
    const amt = parseFloat(amount)
    if (!token || !amt || !address) return alert('fill all fields')

    // Deduct from holdings
    const current = holdings[token] || 0
    const newHoldings = { ...holdings, [token]: Math.max(0, current - amt) }
    setHoldings(newHoldings)

    // Add pending tx
    addTransaction({ type: 'Sent', coin: token, amount: amt, fiat: 0, status: 'Pending' })

    closeWithdraw()
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h4 className="text-lg font-semibold">Quick Actions</h4>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button className="p-3 bg-indigo-600 text-white rounded">Send</button>
        <button className="p-3 bg-gray-100 rounded">Receive</button>
        <button className="p-3 bg-green-600 text-white rounded">Buy</button>
        <button className="p-3 bg-red-600 text-white rounded">Sell</button>
        <button className="p-3 bg-purple-600 text-white rounded">Swap</button>
        <button onClick={openWithdraw} className="p-3 bg-yellow-500 text-white rounded">Withdraw</button>
      </div>

      <Modal open={showWithdraw} onClose={closeWithdraw} title="Withdraw">
        <form onSubmit={submitWithdraw} className="space-y-3">
          <div>
            <label className="block text-sm">Token</label>
            <select value={form.token} onChange={(e) => setForm((s) => ({ ...s, token: e.target.value }))} className="w-full p-2 border rounded">
              <option value="">Select token</option>
              {tokens.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm">Amount</label>
            <input value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Wallet Address</label>
            <input value={form.address} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} className="w-full p-2 border rounded" />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={closeWithdraw} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
