"use client"

import { useEffect, useRef } from "react"

interface TradingViewSymbolInfoProps {
  symbol: string
}

export function TradingViewSymbolInfo({ symbol }: TradingViewSymbolInfoProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Clear any existing content
    container.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      locale: "en",
      colorTheme: "dark",
      isTransparent: true,
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ""
      }
    }
  }, [symbol])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}
