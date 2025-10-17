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
      autosize: false,
      width: "100%",
      height: height,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme === "light" ? "light" : "dark",
      style: "1",
      locale: "en",
      backgroundColor: theme === "light" ? "rgba(255, 255, 255, 1)" : "rgba(19, 23, 34, 1)",
      gridColor: theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)",
      enable_publishing: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: false,
      studies: ["STD;SMA"],
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
      support_host: "https://www.tradingview.com",
      container_id: "tradingview_chart",
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ""
      }
    }
  }, [symbol, theme, height])

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: `${height}px`, width: "100%" }}>
      <div
        id="tradingview_chart"
        className="tradingview-widget-container__widget"
        style={{ height: "100%", width: "100%" }}
      ></div>
    </div>
  )
}
