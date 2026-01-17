import React, { useEffect, useState } from 'react'

const SAMPLE_NEWS = [
  { id: 1, title: 'Bitcoin Holds Above $40k', preview: 'Markets steady after bullish momentum...', image: '', time: '2h ago' },
  { id: 2, title: 'Ethereum Upgrades Planned', preview: 'Developers propose improvements to scalability...', image: '', time: '5h ago' },
  { id: 3, title: 'DeFi TVL Rises', preview: 'Total value locked across DeFi grows as...', image: '', time: '1d ago' },
]

export default function News() {
  const [news, setNews] = useState([])

  useEffect(() => {
    // For demo use sample news. Could fetch a free feed if API key available.
    setNews(SAMPLE_NEWS)
  }, [])

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h4 className="text-lg font-semibold">News & Updates</h4>
      <div className="mt-3 space-y-3">
        {news.map((n) => (
          <div key={n.id} className="flex items-start space-x-3">
            <div className="w-16 h-12 bg-gray-100 rounded" />
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-gray-500">{n.preview}</div>
              <div className="text-xs text-gray-400">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
