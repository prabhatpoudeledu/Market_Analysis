"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function TradingViewHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    // Clear any existing content
    containerRef.current.innerHTML = ""

    // Create script element
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      exchanges: [],
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      symbolUrl: "",
      colorTheme: theme === "dark" ? "dark" : "light",
      hasTopBar: true,
      isDataSetEnabled: true,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      width: "100%",
      height: "100%",
    })

    containerRef.current.appendChild(script)

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [theme])

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Market Heatmap</h2>
        <p className="text-muted-foreground">
          Interactive S&P 500 heatmap showing real-time performance by sector and market cap
        </p>
      </div>
      <Card className="w-full overflow-hidden" style={{ height: "600px" }}>
        <div ref={containerRef} className="tradingview-widget-container w-full h-full">
          <div className="tradingview-widget-container__widget w-full h-full"></div>
        </div>
      </Card>
    </div>
  )
}
