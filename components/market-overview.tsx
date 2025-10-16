"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react"

interface MarketOverviewProps {
  sectors: Array<{ sector: string; performance: number }>
  spPerformance: number
}

export function MarketOverview({ sectors, spPerformance }: MarketOverviewProps) {
  // Sort sectors by performance
  const sortedSectors = [...sectors].sort((a, b) => b.performance - a.performance)

  // Calculate market statistics
  const gainers = sectors.filter((s) => s.performance > 0).length
  const losers = sectors.filter((s) => s.performance < 0).length
  const unchanged = sectors.filter((s) => s.performance === 0).length
  const avgPerformance = sectors.reduce((sum, s) => sum + s.performance, 0) / sectors.length
  const bestPerformer = sortedSectors[0]
  const worstPerformer = sortedSectors[sortedSectors.length - 1]

  // Prepare data for comparison chart
  const comparisonData = sortedSectors.map((sector) => ({
    sector: sector.sector.length > 15 ? sector.sector.substring(0, 15) + "..." : sector.sector,
    fullSector: sector.sector,
    performance: sector.performance,
    sp500: spPerformance,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Market Overview</h2>
        <p className="text-muted-foreground">Comprehensive sector performance analysis and market statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Market Average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgPerformance >= 0 ? "+" : ""}
              {avgPerformance.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all sectors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Gainers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">{gainers}</div>
            <p className="text-xs text-muted-foreground mt-1">Sectors in the green</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Losers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{losers}</div>
            <p className="text-xs text-muted-foreground mt-1">Sectors in the red</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              S&P 500
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${spPerformance >= 0 ? "text-chart-1" : "text-chart-2"}`}>
              {spPerformance >= 0 ? "+" : ""}
              {spPerformance.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Benchmark index</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Sectors outperforming the market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedSectors.slice(0, 5).map((sector, index) => (
                <div key={sector.sector} className="flex items-center gap-3">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottom Performers</CardTitle>
            <CardDescription>Sectors underperforming the market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedSectors
                .slice(-5)
                .reverse()
                .map((sector, index) => (
                  <div key={sector.sector} className="flex items-center gap-3">
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
                  </div>
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
          <ChartContainer
            config={{
              performance: {
                label: "Sector",
                color: "hsl(var(--chart-3))",
              },
              sp500: {
                label: "S&P 500",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="sector"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const label = name === "performance" ? "Sector" : "S&P 500"
                        return [`${Number(value).toFixed(2)}%`, label]
                      }}
                    />
                  }
                />
                <Legend />
                <Bar
                  dataKey="performance"
                  fill="var(--color-performance)"
                  radius={[4, 4, 0, 0]}
                  name="Sector Performance"
                />
                <Bar dataKey="sp500" fill="var(--color-sp500)" radius={[4, 4, 0, 0]} name="S&P 500 Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>Visual representation of sector performance spread</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSectors.map((sector) => {
              const barWidth = Math.abs(sector.performance) * 10
              const isPositive = sector.performance >= 0

              return (
                <div key={sector.sector} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{sector.sector}</span>
                    <span className={`font-semibold ${isPositive ? "text-chart-1" : "text-chart-2"}`}>
                      {sector.performance >= 0 ? "+" : ""}
                      {sector.performance.toFixed(2)}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full ${isPositive ? "bg-chart-1" : "bg-chart-2"} rounded-full transition-all`}
                      style={{
                        width: `${Math.min(barWidth, 100)}%`,
                        left: isPositive ? "50%" : `${50 - Math.min(barWidth, 50)}%`,
                      }}
                    />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
