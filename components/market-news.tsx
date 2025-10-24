"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"

interface MarketNewsProps {
  height?: number
}

export function MarketNews({ height = 800 }: MarketNewsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "en",
    })

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(script)
  }, [theme])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Latest Market News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="tradingview-widget-container" style={{ height: `${height}px` }} ref={containerRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </CardContent>
    </Card>
  )
}
