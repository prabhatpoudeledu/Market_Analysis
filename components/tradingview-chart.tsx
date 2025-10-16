"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface TradingViewChartProps {
  symbol: string
  height?: number
}

export function TradingViewChart({ symbol, height = 700 }: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!container.current) return

    // Clear any existing content
    container.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme === "light" ? "light" : "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ""
      }
    }
  }, [symbol, theme])

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: `${height}px`, width: "100%" }}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </div>
  )
}
