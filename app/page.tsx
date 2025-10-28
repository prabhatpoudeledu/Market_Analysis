import { Suspense } from "react"
import { getSectorPerformance } from "@/lib/fmp-api"
import { normalizeSectorName } from "@/lib/sector-stocks"
import { SectorHeatMap } from "@/components/sector-heat-map"
import { TradingViewHeatmap } from "@/components/tradingview-heatmap"
import { MarketIndices } from "@/components/market-indices"
import { AIMarketIntelligence } from "@/components/ai-market-intelligence"
import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

async function MarketData() {
  console.log("[v0] MarketData component rendering, fetching sector data...")
  const rawSectors = await getSectorPerformance()
  console.log("[v0] Raw sectors received:", rawSectors.length)

  // Transform and normalize sector data
  const sectors = rawSectors
    .filter((sector) => sector.sector && sector.changesPercentage !== undefined)
    .map((sector) => {
      // Handle both string and number formats
      let performance = 0
      if (typeof sector.changesPercentage === "string") {
        performance = Number.parseFloat(sector.changesPercentage.replace("%", ""))
      } else if (typeof sector.changesPercentage === "number") {
        performance = sector.changesPercentage
      }

      return {
        sector: normalizeSectorName(sector.sector),
        performance,
      }
    })

  console.log("[v0] Processed sectors:", sectors.length)

  return (
    <>
      {/* Market Indices */}
      <section>
        <MarketIndices />
      </section>

      {/* AI Market Intelligence */}
      <section>
        <AIMarketIntelligence />
      </section>

      {/* Sector Performance - Full width */}
      <section className="space-y-8">
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Sector Performance</h2>
            <p className="text-muted-foreground">Click on a sector to view detailed stock performance</p>
          </div>
          <SectorHeatMap sectors={sectors} />
        </div>

        {/* TradingView Heatmap */}
        <div>
          <TradingViewHeatmap />
        </div>
      </section>
    </>
  )
}

function MarketDataSkeleton() {
  return (
    <>
      <section>
        <MarketIndices />
      </section>

      {/* Skeleton for AI Intelligence */}
      <section>
        <Skeleton className="w-full h-[300px] rounded-lg" />
      </section>

      <section className="space-y-8">
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Sector Performance</h2>
            <p className="text-muted-foreground">Loading sector data...</p>
          </div>
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </div>
        <Skeleton className="w-full h-[600px] rounded-lg" />
      </section>
    </>
  )
}

export default function HomePage() {
  console.log("[v0] HomePage rendering")
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Market Sectors</h1>
            <p className="text-lg text-muted-foreground">Real-time sector performance and market analytics</p>
          </div>

          <Suspense fallback={<MarketDataSkeleton />}>
            <MarketData />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
