import { SECTOR_STOCKS } from "@/lib/sector-stocks"
import { getStocksBySymbols } from "@/lib/fmp-api"
import { Header } from "@/components/header"
import { StockTable } from "@/components/stock-table"
import { StockSearch } from "@/components/stock-search"

export default async function StocksPage() {
  // Get all stock symbols from all sectors
  const allSymbols = Array.from(new Set(Object.values(SECTOR_STOCKS).flat()))

  // Fetch all stock data
  const stocks = await getStocksBySymbols(allSymbols)

  // Add sector information to each stock
  const stocksWithSector = stocks.map((stock) => {
    // Find which sector this stock belongs to
    const sector =
      Object.entries(SECTOR_STOCKS).find(([_, symbols]) => symbols.includes(stock.symbol))?.[0] || "Unknown"

    return {
      ...stock,
      sector,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">All Stocks</h1>
            <p className="text-lg text-muted-foreground">
              Browse and search through {stocks.length} stocks across all sectors
            </p>
          </div>

          <div className="flex justify-center">
            <StockSearch />
          </div>

          {/* Stock Table */}
          <StockTable stocks={stocksWithSector} />
        </div>
      </main>
    </div>
  )
}
