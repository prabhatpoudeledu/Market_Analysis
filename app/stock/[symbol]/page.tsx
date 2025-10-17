import { getCompanyProfile, getStocksBySymbols } from "@/lib/fmp-api"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TradingViewSymbolInfo } from "@/components/tradingview-symbol-info"
import { ExpandableChart } from "@/components/expandable-chart"
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
  const [quotes, profile] = await Promise.all([getStocksBySymbols([upperSymbol]), getCompanyProfile(upperSymbol)])

  const stock = quotes[0]

  if (!stock) {
    notFound()
  }

  // Find sector
  const sector = Object.entries(SECTOR_STOCKS).find(([_, symbols]) => symbols.includes(upperSymbol))?.[0] || "Unknown"

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

          <div className="flex flex-col gap-6" style={{ minHeight: "calc(100vh - 300px)" }}>
            {/* Key Metrics & Trading Information - 30% */}
            <Card className="flex-[0_0_30%]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Key Metrics & Trading Info</CardTitle>
                <CardDescription className="text-xs">Real-time data from TradingView and market data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* TradingView Symbol Info */}
                <div>
                  <TradingViewSymbolInfo symbol={upperSymbol} />
                </div>

                {/* Trading Information */}
                <div className="border-t pt-3">
                  <h3 className="text-xs font-semibold mb-2">Trading Details</h3>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Open</p>
                      <p className="text-sm font-semibold">${stock.open.toFixed(2)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Previous Close</p>
                      <p className="text-sm font-semibold">${stock.previousClose.toFixed(2)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Day Range</p>
                      <p className="text-sm font-semibold">
                        ${stock.dayLow.toFixed(2)} - ${stock.dayHigh.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">52 Week Range</p>
                      <p className="text-sm font-semibold">
                        ${stock.yearLow.toFixed(2)} - ${stock.yearHigh.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">50-Day Avg</p>
                      <p className="text-sm font-semibold">${stock.priceAvg50.toFixed(2)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">200-Day Avg</p>
                      <p className="text-sm font-semibold">${stock.priceAvg200.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart - 50% */}
            <Card className="flex-[0_0_50%]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Price Chart</CardTitle>
                <CardDescription className="text-xs">
                  Interactive chart powered by TradingView - Click expand for fullscreen view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpandableChart symbol={upperSymbol} stockName={stock.name} height={900} />
              </CardContent>
            </Card>

            {/* Company Profile - 20% (moved to bottom) */}
            {profile && (
              <Card className="flex-[0_0_20%]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Company Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">CEO</p>
                      <p className="text-xs font-medium truncate">{profile.ceo || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Industry</p>
                      <p className="text-xs font-medium truncate">{profile.industry || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="text-xs font-medium">{profile.fullTimeEmployees || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Website</p>
                      {profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-primary hover:underline truncate block"
                        >
                          Visit Site
                        </a>
                      ) : (
                        <p className="text-xs font-medium">N/A</p>
                      )}
                    </div>
                  </div>
                  {profile.description && (
                    <div className="space-y-0.5 mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-xs leading-relaxed line-clamp-2">{profile.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
