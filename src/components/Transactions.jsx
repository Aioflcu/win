import React from 'react'

function TransactionRow({ tx }) {
  return (
    <div className="p-3 border rounded flex items-center justify-between">
      <div>
        <div className="font-medium">{tx.type} • {tx.coin}</div>
        <div className="text-xs text-gray-500">{tx.time} • {tx.status}</div>
      </div>
      <div className="text-right">
        <div className="font-medium">{tx.amount} {tx.coin}</div>
        <div className="text-sm text-gray-500">${(tx.fiat || 0).toFixed(2)}</div>
      </div>
    </div>
  )
}

export default function Transactions({ transactions = [] }) {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h4 className="text-lg font-semibold">Recent Transactions</h4>
      <div className="mt-4 space-y-2">
        {transactions.slice(0, 8).map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </div>
    </section>
  )
}
