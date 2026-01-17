import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import WalletOverview from '../components/WalletOverview'
import TopCryptos from '../components/TopCryptos'
import QuickActions from '../components/QuickActions'
import Transactions from '../components/Transactions'
import News from '../components/News'
import Footer from '../components/Footer'
import PriceWatcher from '../components/PriceWatcher'
import Portfolio from '../components/Portfolio'
import Watchlist from '../components/Watchlist'

export default function Dashboard() {
  // Global demo state: holdings and transactions
  const [holdings, setHoldings] = useState({})
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // initial dummy holdings (in units)
    setHoldings({
      bitcoin: 0.075,
      ethereum: 0.9,
      dogecoin: 150,
      tether: 1200,
      cardano: 40,
    })

    // dummy transactions
    setTransactions([
      { id: 1, type: 'Received', coin: 'bitcoin', amount: 0.02, fiat: 1200, status: 'Success', time: '2h ago' },
      { id: 2, type: 'Sent', coin: 'ethereum', amount: 0.1, fiat: 180, status: 'Success', time: '1d ago' },
      { id: 3, type: 'Bought', coin: 'cardano', amount: 20, fiat: 15, status: 'Success', time: '3d ago' },
      { id: 4, type: 'Swapped', coin: 'dogecoin', amount: 100, fiat: 12, status: 'Success', time: '1w ago' },
      { id: 5, type: 'Received', coin: 'tether', amount: 500, fiat: 500, status: 'Success', time: '2w ago' },
    ])
  }, [])

  const addTransaction = (tx) => {
    setTransactions((s) => [{ ...tx, id: Date.now(), time: 'just now' }, ...s])
  }

  const updateHoldings = (newHoldings) => {
    setHoldings(newHoldings)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-4">
          <PriceWatcher />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WalletOverview holdings={holdings} setHoldings={updateHoldings} transactions={transactions} />
            <TopCryptos />
            <QuickActions holdings={holdings} setHoldings={updateHoldings} addTransaction={addTransaction} />
            <Portfolio onHoldingsChange={updateHoldings} />
          </div>
          <div className="space-y-6">
            <Transactions transactions={transactions} />
            <Watchlist />
            <News />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  )
}
