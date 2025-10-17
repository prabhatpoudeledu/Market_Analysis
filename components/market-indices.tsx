"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface IndexData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export function MarketIndices() {
  const [indices, setIndices] = useState<IndexData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIndices() {
      try {
        const symbols = ["SPY", "QQQ", "DIA", "^VIX", "GLD", "SLV", "IWM"]
        const names = ["S&P 500", "Nasdaq 100", "Dow Jones", "VIX", "Gold", "Silver", "Russell 2000"]

        const response = await fetch(`/api/indices?symbols=${symbols.join(",")}`)
        if (!response.ok) throw new Error("Failed to fetch indices")

        const data = await response.json()
        const formattedData = data.map((item: any, index: number) => ({
          symbol: symbols[index],
          name: names[index],
          price: item.price,
          change: item.change,
          changePercent: item.changePercent,
        }))

        setIndices(formattedData)
      } catch (error) {
        console.error("[v0] Error fetching market indices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIndices()
    const interval = setInterval(fetchIndices, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Indices</CardTitle>
          <CardDescription>Loading market data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-16 mb-2" />
                <div className="h-6 bg-muted rounded w-20 mb-1" />
                <div className="h-3 bg-muted rounded w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Indices</CardTitle>
        <CardDescription>Real-time market index performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {indices.map((index) => {
            const isPositive = index.changePercent >= 0
            const isVIX = index.symbol === "^VIX"
            const cleanSymbol = index.symbol.replace("^", "")

            return (
              <Link
                key={index.symbol}
                href={`/stock/${cleanSymbol}`}
                className="space-y-1 hover:bg-accent/50 p-2 rounded-md transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-muted-foreground">{index.name}</div>
                <div className="text-lg font-bold">${index.price.toFixed(2)}</div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-chart-1" : "text-chart-2"}`}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>
                    {isPositive ? "+" : ""}
                    {index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
