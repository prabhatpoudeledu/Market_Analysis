import { getCompanyProfile, getStocksBySymbols, getHistoricalPrices } from "@/lib/fmp-api"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { StockChart } from "@/components/stock-chart"
import { SECTOR_STOCKS } from "@/lib/sector-stocks"

interface StockPageProps {
  params: Promise<{
    symbol: string
  }>
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params
  const upperSymbol = symbol.toUpperCase()

  // Fetch stock data in parallel
  const [quotes, profile, historicalData] = await Promise.all([
    getStocksBySymbols([upperSymbol]),
    getCompanyProfile(upperSymbol),
    getHistoricalPrices(upperSymbol),
  ])

  const stock = quotes[0]

  if (!stock) {
    notFound()
  }

  // Find sector
  const sector = Object.entries(SECTOR_STOCKS).find(([_, symbols]) => symbols.includes(upperSymbol))?.[0] || "Unknown"

  // Get last 90 days of data
  const chartData = historicalData.slice(0, 90).reverse()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Link href="/stocks">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Stocks
            </Button>
          </Link>

          {/* Stock Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">{stock.symbol}</h1>
                <p className="text-xl text-muted-foreground mt-1">{stock.name}</p>
                <Link
                  href={`/sector/${encodeURIComponent(sector)}`}
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  {sector}
                </Link>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">${stock.price.toFixed(2)}</div>
                <div className="flex items-center gap-2 justify-end mt-2">
                  {stock.changesPercentage >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-chart-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-chart-2" />
                  )}
                  <span
                    className={`text-xl font-semibold ${stock.changesPercentage >= 0 ? "text-chart-1" : "text-chart-2"}`}
                  >
                    {stock.changesPercentage >= 0 ? "+" : ""}
                    {stock.changesPercentage.toFixed(2)}%
                  </span>
                  <span className={`text-lg ${stock.change >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                    ({stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price History (90 Days)</CardTitle>
              <CardDescription>Historical closing prices and trading volume</CardDescription>
            </CardHeader>
            <CardContent>
              <StockChart data={chartData} />
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Market Cap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stock.marketCap / 1e9).toFixed(2)}B</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>P/E Ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stock.pe ? stock.pe.toFixed(2) : "N/A"}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stock.volume / 1e6).toFixed(2)}M</div>
                <p className="text-xs text-muted-foreground mt-1">Avg: {(stock.avgVolume / 1e6).toFixed(2)}M</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>EPS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stock.eps ? stock.eps.toFixed(2) : "N/A"}</div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Information */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-lg font-semibold">${stock.open.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Previous Close</p>
                  <p className="text-lg font-semibold">${stock.previousClose.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Day Range</p>
                  <p className="text-lg font-semibold">
                    ${stock.dayLow.toFixed(2)} - ${stock.dayHigh.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">52 Week Range</p>
                  <p className="text-lg font-semibold">
                    ${stock.yearLow.toFixed(2)} - ${stock.yearHigh.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">50-Day Avg</p>
                  <p className="text-lg font-semibold">${stock.priceAvg50.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">200-Day Avg</p>
                  <p className="text-lg font-semibold">${stock.priceAvg200.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Profile */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CEO</p>
                    <p className="font-medium">{profile.ceo || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{profile.industry || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="font-medium">{profile.fullTimeEmployees || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Website</p>
                    {profile.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      <p className="font-medium">N/A</p>
                    )}
                  </div>
                </div>
                {profile.description && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm leading-relaxed">{profile.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
