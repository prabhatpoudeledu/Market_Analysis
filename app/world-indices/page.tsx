"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { MostActiveStocks } from "@/components/most-active-stocks"
import { MarketNews } from "@/components/market-news"
import { Maximize2, Minimize2 } from "lucide-react"

export default function WorldIndicesPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const expandedIndicesRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const initializeIndicesWidget = (container: HTMLDivElement | null, height = "100%") => {
    if (!container) return

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: height,
      symbolsGroups: [
        {
          name: "Indices",
          originalName: "Indices",
          symbols: [
            { name: "FOREXCOM:SPXUSD", displayName: "S&P 500" },
            { name: "FOREXCOM:NSXUSD", displayName: "US 100" },
            { name: "FOREXCOM:DJI", displayName: "Dow 30" },
            { name: "INDEX:NKY", displayName: "Nikkei 225" },
            { name: "INDEX:DEU40", displayName: "DAX Index" },
            { name: "FOREXCOM:UKXGBP", displayName: "UK 100" },
          ],
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "en",
    })

    container.innerHTML = ""
    container.appendChild(script)
  }

  useEffect(() => {
    initializeIndicesWidget(containerRef.current)
  }, [theme])

  useEffect(() => {
    if (expandedSection === "indices") {
      initializeIndicesWidget(expandedIndicesRef.current, "100%")
    }
  }, [expandedSection, theme])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">World Indices</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Global market indices and international stock market performance
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Global Market Indices</CardTitle>
              <Button variant="secondary" size="sm" onClick={() => setExpandedSection("indices")} className="gap-2">
                <Maximize2 className="h-4 w-4" />
                Expand
              </Button>
            </CardHeader>
            <CardContent>
              <div className="tradingview-widget-container h-[800px]" ref={containerRef}>
                <div className="tradingview-widget-container__widget"></div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setExpandedSection("gainers")}
                  className="gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  <Maximize2 className="h-4 w-4" />
                  Expand
                </Button>
              </div>
              <MostActiveStocks />
            </div>
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setExpandedSection("news")}
                  className="gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  <Maximize2 className="h-4 w-4" />
                  Expand
                </Button>
              </div>
              <MarketNews />
            </div>
          </div>
        </div>
      </main>

      {/* Global Market Indices Expanded */}
      <Dialog open={expandedSection === "indices"} onOpenChange={() => setExpandedSection(null)}>
        <DialogContent className="max-w-[100vw] h-[100vh] p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Global Market Indices</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="gap-2">
                <Minimize2 className="h-4 w-4" />
                Close
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 mt-4 h-[calc(100vh-120px)]">
            <div className="tradingview-widget-container h-full" ref={expandedIndicesRef}>
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Gainers Expanded */}
      <Dialog open={expandedSection === "gainers"} onOpenChange={() => setExpandedSection(null)}>
        <DialogContent className="max-w-[100vw] h-[100vh] p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Top Gainers</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="gap-2">
                <Minimize2 className="h-4 w-4" />
                Close
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 mt-4">
            <MostActiveStocks height={typeof window !== "undefined" ? window.innerHeight - 150 : 800} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Market News Expanded */}
      <Dialog open={expandedSection === "news"} onOpenChange={() => setExpandedSection(null)}>
        <DialogContent className="max-w-[100vw] h-[100vh] p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Market News</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="gap-2">
                <Minimize2 className="h-4 w-4" />
                Close
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 mt-4">
            <MarketNews height={typeof window !== "undefined" ? window.innerHeight - 150 : 800} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
