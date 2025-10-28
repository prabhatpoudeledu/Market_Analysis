"use client"

import { useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"

export default function NewsPage() {
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Market News</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Latest financial news and market updates from around the world
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Latest Market News & Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="tradingview-widget-container"
                style={{ height: "calc(100vh - 300px)", minHeight: "600px" }}
                ref={containerRef}
              >
                <div className="tradingview-widget-container__widget"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
