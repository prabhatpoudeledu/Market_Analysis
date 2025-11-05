"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/header"
import { useTheme } from "next-themes"
import { NewsList } from "@/components/news-list"

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("stories")
  const timelineRef = useRef<HTMLDivElement>(null)
  const quotesRef = useRef<HTMLDivElement>(null)
  const trendingRef = useRef<HTMLDivElement>(null)
  const heatmapRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!timelineRef.current) return

    timelineRef.current.innerHTML = `
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"><\/script>
      </div>
    `

    // Trigger widget reload
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!quotesRef.current) return

    quotesRef.current.innerHTML = `
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"><\/script>
      </div>
    `

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!trendingRef.current) return

    trendingRef.current.innerHTML = `
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-movers.js"><\/script>
      </div>
    `

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-movers.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!heatmapRef.current) return

    heatmapRef.current.innerHTML = `
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript">
          new TradingView.widget({
            "symbols": [
              "NASDAQ:AAPL",
              "NASDAQ:MSFT",
              "NASDAQ:GOOGL",
              "NASDAQ:NVDA",
              "NASDAQ:TSLA",
              "NASDAQ:META"
            ],
            "chartOnly": false,
            "width": "100%",
            "height": 500,
            "locale": "en",
            "colorTheme": "${theme === "dark" ? "dark" : "light"}"
          })
        </script>
      </div>
    `
  }, [theme])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-foreground">Market News & Analysis</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">Real-time financial news and market insights</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <NewsList />
        </div>
      </main>
    </div>
  )
}
