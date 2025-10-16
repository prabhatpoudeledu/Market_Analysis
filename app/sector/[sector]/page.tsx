import { getSectorStocks } from "@/lib/sector-stocks"
import { getStocksBySymbols } from "@/lib/fmp-api"
import { StockHeatMap } from "@/components/stock-heat-map"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface SectorPageProps {
  params: Promise<{
    sector: string
  }>
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { sector } = await params
  const decodedSector = decodeURIComponent(sector)

  // Get stock symbols for this sector
  const symbols = getSectorStocks(decodedSector)

  if (symbols.length === 0) {
    notFound()
  }

  // Fetch stock data
  const stocks = await getStocksBySymbols(symbols)

  // Transform stock data for heat map
  const stockData = stocks.map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    performance: stock.changesPercentage,
    price: stock.price,
    marketCap: stock.marketCap,
  }))

  // Calculate sector average
  const sectorAverage =
    stockData.length > 0 ? stockData.reduce((sum, s) => sum + s.performance, 0) / stockData.length : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Sectors
            </Button>
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{decodedSector}</h1>
            <div className="flex items-center gap-4 text-lg">
              <span className="text-muted-foreground">Sector Average:</span>
              <span className={`font-semibold ${sectorAverage >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                {sectorAverage >= 0 ? "+" : ""}
                {sectorAverage.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Stock Heat Map */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Stock Performance</h2>
              <p className="text-muted-foreground">Click on any stock to view detailed information and charts</p>
            </div>
            <StockHeatMap stocks={stockData} />
          </section>

          {/* Stock List */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold">All Stocks</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stockData
                .sort((a, b) => b.performance - a.performance)
                .map((stock) => (
                  <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                    <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{stock.symbol}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{stock.name}</p>
                        </div>
                        <span
                          className={`text-sm font-semibold ${stock.performance >= 0 ? "text-chart-1" : "text-chart-2"}`}
                        >
                          {stock.performance >= 0 ? "+" : ""}
                          {stock.performance.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">${stock.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Market Cap:</span>
                        <span className="font-medium">${(stock.marketCap / 1e9).toFixed(2)}B</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
