"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Bar, BarChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface MarketOverviewProps {
  sectors: Array<{ sector: string; performance: number }>
  spPerformance: number
}

const SECTOR_COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(346, 77%, 50%)", // Red
  "hsl(262, 83%, 58%)", // Purple
  "hsl(38, 92%, 50%)", // Orange
  "hsl(199, 89%, 48%)", // Cyan
  "hsl(48, 96%, 53%)", // Yellow
  "hsl(280, 67%, 55%)", // Magenta
  "hsl(162, 63%, 41%)", // Teal
  "hsl(24, 100%, 50%)", // Deep Orange
  "hsl(291, 64%, 42%)", // Deep Purple
  "hsl(340, 82%, 52%)", // Pink
]

const SECTOR_ABBR: Record<string, string> = {
  Technology: "Tech",
  "Financial Services": "Fin",
  Healthcare: "Health",
  Energy: "Energy",
  "Consumer Cyclical": "Cons Cyc",
  "Consumer Defensive": "Cons Def",
  Industrials: "Indust",
  "Basic Materials": "Materials",
  "Real Estate": "RE",
  Utilities: "Util",
  "Communication Services": "Comm",
}

export function MarketOverview({ sectors, spPerformance }: MarketOverviewProps) {
  const router = useRouter()
  const [hoveredSector, setHoveredSector] = useState<string | null>(null)

  // Sort sectors by performance
  const sortedSectors = [...sectors].sort((a, b) => b.performance - a.performance)

  // Calculate market statistics
  const gainers = sectors.filter((s) => s.performance > 0).length
  const losers = sectors.filter((s) => s.performance < 0).length
  const unchanged = sectors.filter((s) => s.performance === 0).length
  const avgPerformance = sectors.reduce((sum, s) => sum + s.performance, 0) / sectors.length
  const bestPerformer = sortedSectors[0]
  const worstPerformer = sortedSectors[sortedSectors.length - 1]

  const comparisonData = sortedSectors.map((sector, index) => ({
    sector: SECTOR_ABBR[sector.sector] || sector.sector,
    fullSector: sector.sector,
    performance: sector.performance,
    sp500: spPerformance,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length],
  }))

  const chartConfig: Record<string, { label: string; color: string }> = {
    sp500: {
      label: "S&P 500",
      color: "hsl(142, 71%, 45%)",
    },
  }

  sortedSectors.forEach((sector, index) => {
    chartConfig[sector.sector] = {
      label: sector.sector,
      color: SECTOR_COLORS[index % SECTOR_COLORS.length],
    }
  })

  const CustomLegend = (props: any) => {
    const { payload } = props

    const legendItems = [
      ...sortedSectors.map((sector, index) => ({
        value: sector.sector,
        color: SECTOR_COLORS[index % SECTOR_COLORS.length],
      })),
      {
        value: "S&P 500",
        color: "hsl(142, 71%, 45%)",
      },
    ]

    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {legendItems.map((entry, index) => (
          <button
            key={`legend-${index}`}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors"
            onMouseEnter={() => setHoveredSector(entry.value)}
            onMouseLeave={() => setHoveredSector(null)}
          >
            <div
              className="w-3 h-3 rounded"
              style={{
                backgroundColor: entry.color,
                opacity: hoveredSector === null || hoveredSector === entry.value ? 1 : 0.3,
              }}
            />
            <span
              className="text-xs font-medium"
              style={{
                opacity: hoveredSector === null || hoveredSector === entry.value ? 1 : 0.5,
              }}
            >
              {entry.value}
            </span>
          </button>
        ))}
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const sectorData = comparisonData.find((d) => d.sector === label)
    if (!sectorData) return null

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-2">{sectorData.fullSector}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Sector:</span>
            <span
              className={`text-xs font-mono font-semibold ${sectorData.performance >= 0 ? "text-chart-1" : "text-chart-2"}`}
            >
              {sectorData.performance >= 0 ? "+" : ""}
              {sectorData.performance.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">S&P 500:</span>
            <span className={`text-xs font-mono font-semibold ${spPerformance >= 0 ? "text-chart-1" : "text-chart-2"}`}>
              {spPerformance >= 0 ? "+" : ""}
              {spPerformance.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
            <span className="text-xs text-muted-foreground">vs S&P:</span>
            <span
              className={`text-xs font-mono font-semibold ${sectorData.performance - spPerformance >= 0 ? "text-chart-1" : "text-chart-2"}`}
            >
              {sectorData.performance - spPerformance >= 0 ? "+" : ""}
              {(sectorData.performance - spPerformance).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Market Overview</h2>
        <p className="text-muted-foreground">Comprehensive sector performance analysis and market statistics</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center gap-2 text-xs">
              <Activity className="h-3 w-3" />
              Market Average
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl font-bold">
              {avgPerformance >= 0 ? "+" : ""}
              {avgPerformance.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3 w-3" />
              Gainers
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl font-bold text-chart-1">{gainers}</div>
            <p className="text-xs text-muted-foreground mt-1">sectors up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center gap-2 text-xs">
              <TrendingDown className="h-3 w-3" />
              Losers
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl font-bold text-chart-2">{losers}</div>
            <p className="text-xs text-muted-foreground mt-1">sectors down</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center gap-2 text-xs">
              <BarChart3 className="h-3 w-3" />
              S&P 500
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className={`text-xl font-bold ${spPerformance >= 0 ? "text-chart-1" : "text-chart-2"}`}>
              {spPerformance >= 0 ? "+" : ""}
              {spPerformance.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Click to view sector details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedSectors.slice(0, 5).map((sector, index) => (
                <button
                  key={sector.sector}
                  onClick={() => router.push(`/sector/${encodeURIComponent(sector.sector)}`)}
                  className="w-full flex items-center gap-3 hover:bg-accent rounded-lg p-2 -mx-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-chart-1/20 text-chart-1 text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{sector.sector}</span>
                    <span className="text-sm font-mono font-semibold text-chart-1">
                      {sector.performance >= 0 ? "+" : ""}
                      {sector.performance.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottom Performers</CardTitle>
            <CardDescription>Click to view sector details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedSectors
                .slice(-5)
                .reverse()
                .map((sector, index) => (
                  <button
                    key={sector.sector}
                    onClick={() => router.push(`/sector/${encodeURIComponent(sector.sector)}`)}
                    className="w-full flex items-center gap-3 hover:bg-accent rounded-lg p-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-chart-2/20 text-chart-2 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{sector.sector}</span>
                      <span className="text-sm font-mono font-semibold text-chart-2">
                        {sector.performance >= 0 ? "+" : ""}
                        {sector.performance.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sector Performance vs S&P 500</CardTitle>
          <CardDescription>
            Daily performance comparison (S&P 500: {spPerformance >= 0 ? "+" : ""}
            {spPerformance.toFixed(2)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="sector"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                <Bar dataKey="performance" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => {
                    const isHovered = hoveredSector === null || hoveredSector === entry.fullSector
                    return <Cell key={`cell-${index}`} fill={entry.color} opacity={isHovered ? 1 : 0.3} />
                  })}
                </Bar>
                <Bar
                  dataKey="sp500"
                  fill="hsl(142, 71%, 45%)"
                  radius={[4, 4, 0, 0]}
                  opacity={hoveredSector === null || hoveredSector === "S&P 500" ? 0.7 : 0.2}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
