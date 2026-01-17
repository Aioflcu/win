import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'

// We'll attempt to dynamically import a local Lottie JSON at runtime: src/assets/welcome.json
// If it's not present, we keep the iframe fallback (previous behavior).

export default function Welcome() {
  const navigate = useNavigate()

  const [animData, setAnimData] = useState(null)
  const [ctaVisible, setCtaVisible] = useState(false)
  const ctaRef = useRef(null)

  useEffect(() => {
    // try to load a local Lottie JSON if present
    import('../assets/welcome.json')
      .then((m) => setAnimData(m.default || m))
      .catch(() => {
        // No local file — try fetching the chosen remote Lottie as a fallback.
        // This keeps the local-file-first reliability, but still allows using
        // the remote Lottie when available.
        fetch('https://assets6.lottiefiles.com/packages/lf20_touohxv0.json')
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch remote Lottie')
            return res.json()
          })
          .then((json) => setAnimData(json))
          .catch(() => {
            // final fallback: leave animData null so SVG shows
          })
      })

    // focus the CTA for accessibility after a short delay
    const t = setTimeout(() => {
      ctaRef.current?.focus()
      // animate CTA entrance
      setCtaVisible(true)
    }, 700)
    return () => clearTimeout(t)
  }, [])

  const goNext = () => {
    const token = localStorage.getItem('femico_token')
    if (token) navigate('/dashboard')
    else navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center welcome-gradient p-6">
      <div className="max-w-4xl w-full bg-white/80 dark:bg-[#071022]/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 flex flex-col justify-center space-y-6">
            <div className="text-indigo-600 font-extrabold text-4xl md:text-5xl">Welcome to FemiCoin</div>
            <div className="text-gray-700 dark:text-gray-300 text-lg">A polished demo crypto dashboard by Worldwide Investment Compensation Network (WICN).</div>
            <div className="text-sm text-gray-500">Manage your portfolio, watchlist, and get real-time alerts — demo mode only.</div>

            <div className="flex items-center space-x-3">
              <button
                ref={ctaRef}
                onClick={goNext}
                className={`btn-cta transition-all duration-500 ${ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                aria-label="Get started"
              >
                Get Started
              </button>
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded">Explore Demo</button>
            </div>
            <div className="text-xs text-gray-400">Client: Bryan Voth • Company: WICN</div>
          </div>

          <div className="relative p-6 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-white/60 dark:bg-[#0b1724] shadow-inner relative overflow-hidden flex items-center justify-center">
              <div style={{ width: 'min(60vw,240px)', height: 'min(60vw,240px)' }}>
                {animData ? (
                  <Lottie animationData={animData} loop={true} autoplay={true} />
                ) : (
                  <svg viewBox="0 0 120 120" className="w-full h-full">
                    <circle cx="60" cy="60" r="40" fill="#8b5cf6" opacity="0.12">
                      <animate attributeName="r" values="36;42;36" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="60" cy="60" r="26" fill="#06b6d4" opacity="0.14">
                      <animate attributeName="r" values="24;30;24" dur="5s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                )}
              </div>
              <div className="text-center absolute">
                <div className="text-2xl font-bold text-indigo-600">FemiCoin</div>
                <div className="text-xs text-gray-500">Secure • Fast • Intuitive</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
