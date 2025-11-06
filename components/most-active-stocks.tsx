"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"

interface MostActiveStocksProps {
  height?: number
}

export function MostActiveStocks({ height = 800 }: MostActiveStocksProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      symbolsGroups: [
        {
          name: "Gainers & Losers",
          originalName: "Gainers & Losers",
          symbols: [
            { name: "FOREXCOM:SPXUSD", displayName: "S&P 500" },
            { name: "FOREXCOM:NSXUSD", displayName: "US 100" },
            { name: "FOREXCOM:DJI", displayName: "Dow 30" },
            { name: "CRYPTO:BTCUSD", displayName: "Bitcoin" },
            { name: "CRYPTO:ETHUSD", displayName: "Ethereum" },
          ],
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "en",
    })

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(script)
  }, [theme])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Gainers & Losers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="tradingview-widget-container" style={{ height: `${height}px` }} ref={containerRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </CardContent>
    </Card>
  )
}
