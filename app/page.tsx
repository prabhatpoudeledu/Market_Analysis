import { Suspense } from "react"
import { getSectorPerformance } from "@/lib/fmp-api"
import { normalizeSectorName } from "@/lib/sector-stocks"
import { SectorHeatMap } from "@/components/sector-heat-map"
import { MarketOverview } from "@/components/market-overview"
import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

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

  // Calculate S&P 500 average (weighted average of all sectors)
  const spPerformance = sectors.length > 0 ? sectors.reduce((sum, s) => sum + s.performance, 0) / sectors.length : 0

  console.log("[v0] Processed sectors:", sectors.length, "S&P Performance:", spPerformance)

  return (
    <>
      {/* Sector Heat Map */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Sector Performance</h2>
          <p className="text-muted-foreground">Click on any sector to view detailed stock performance</p>
        </div>
        <SectorHeatMap sectors={sectors} />
      </section>

      {/* Market Overview */}
      <section>
        <MarketOverview sectors={sectors} spPerformance={spPerformance} />
      </section>
    </>
  )
}

function MarketDataSkeleton() {
  return (
    <>
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Sector Performance</h2>
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
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
