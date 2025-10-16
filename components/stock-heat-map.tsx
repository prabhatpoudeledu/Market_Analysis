"use client"

import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Stock {
  symbol: string
  name: string
  performance: number
  price: number
  marketCap: number
}

interface StockHeatMapProps {
  stocks: Stock[]
}

export function StockHeatMap({ stocks }: StockHeatMapProps) {
  const router = useRouter()

  // Calculate sizes based on market cap
  const maxMarketCap = Math.max(...stocks.map((s) => s.marketCap))
  const minMarketCap = Math.min(...stocks.map((s) => s.marketCap))

  const getStockSize = (marketCap: number) => {
    // Normalize market cap to a size between 120 and 240
    const normalized = (marketCap - minMarketCap) / (maxMarketCap - minMarketCap)
    return 120 + normalized * 120
  }

  const getPerformanceColor = (performance: number) => {
    // Color scale from red (negative) to green (positive)
    if (performance >= 5) return "bg-chart-1/90 hover:bg-chart-1"
    if (performance >= 2) return "bg-chart-1/70 hover:bg-chart-1/80"
    if (performance >= 0) return "bg-chart-1/40 hover:bg-chart-1/50"
    if (performance >= -2) return "bg-chart-2/40 hover:bg-chart-2/50"
    if (performance >= -5) return "bg-chart-2/70 hover:bg-chart-2/80"
    return "bg-chart-2/90 hover:bg-chart-2"
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {stocks.map((stock) => {
          const size = getStockSize(stock.marketCap)
          const colorClass = getPerformanceColor(stock.performance)

          return (
            <button
              key={stock.symbol}
              onClick={() => router.push(`/stock/${stock.symbol}`)}
              className={`${colorClass} rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-3 cursor-pointer`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                minWidth: "120px",
                minHeight: "120px",
              }}
              title={`${stock.name} (${stock.symbol}): ${stock.performance >= 0 ? "+" : ""}${stock.performance.toFixed(2)}%`}
            >
              <span className="font-bold text-lg text-white">{stock.symbol}</span>
              <span className="text-sm text-white/90 mt-1">
                {stock.performance >= 0 ? "+" : ""}
                {stock.performance.toFixed(2)}%
              </span>
              <span className="text-xs text-white/80 mt-1">${stock.price.toFixed(2)}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
