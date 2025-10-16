"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { SectorHeatMap } from "@/components/sector-heat-map"

type TimeRange = "5D" | "10D" | "15D" | "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y" | "ALL"

const TIME_RANGES: { value: TimeRange; label: string; days: number }[] = [
  { value: "5D", label: "5 Days", days: 5 },
  { value: "10D", label: "10 Days", days: 10 },
  { value: "15D", label: "15 Days", days: 15 },
  { value: "1M", label: "1 Month", days: 30 },
  { value: "3M", label: "3 Months", days: 90 },
  { value: "6M", label: "6 Months", days: 180 },
  { value: "1Y", label: "1 Year", days: 365 },
  { value: "3Y", label: "3 Years", days: 1095 },
  { value: "5Y", label: "5 Years", days: 1825 },
  { value: "ALL", label: "All Time", days: 3650 },
]

const SECTOR_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(346, 77%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(38, 92%, 50%)",
  "hsl(199, 89%, 48%)",
  "hsl(48, 96%, 53%)",
  "hsl(280, 67%, 55%)",
  "hsl(162, 63%, 41%)",
  "hsl(24, 100%, 50%)",
  "hsl(291, 64%, 42%)",
  "hsl(340, 82%, 52%)",
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

export function HistoricalAnalysis() {
  const [timeRange, setTimeRange] = useState<TimeRange>("3M")
  const [loading, setLoading] = useState(false)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [sectorData, setSectorData] = useState<any[]>([])
  const [hoveredSector, setHoveredSector] = useState<string | null>(null)
  const [stats, setStats] = useState({
    avgReturn: 0,
    gainers: 0,
    losers: 0,
    sp500Return: 0,
  })

  useEffect(() => {
    fetchHistoricalData()
  }, [timeRange])

  const fetchHistoricalData = async () => {
    setLoading(true)
    try {
      const days = TIME_RANGES.find((r) => r.value === timeRange)?.days || 90
      const mockData = generateMockHistoricalData(days)
      setHistoricalData(mockData)
      calculateStats(mockData)
    } catch (error) {
      console.error("[v0] Error fetching historical data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockHistoricalData = (days: number) => {
    const data = []
    const sectors = [
      "Technology",
      "Financial Services",
      "Healthcare",
      "Energy",
      "Consumer Cyclical",
      "Consumer Defensive",
      "Industrials",
      "Basic Materials",
      "Real Estate",
      "Utilities",
      "Communication Services",
    ]

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      const dataPoint: any = {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date.toISOString(),
        "S&P 500": Math.sin(i / 10) * 5 + Math.random() * 2,
      }

      sectors.forEach((sector, index) => {
        const trend = Math.sin(i / 10 + index) * 8
        const noise = Math.random() * 3 - 1.5
        dataPoint[sector] = trend + noise
      })

      data.push(dataPoint)
    }

    return data
  }

  const calculateStats = (data: any[]) => {
    if (data.length === 0) return

    const sectors = Object.keys(data[0]).filter((key) => key !== "date" && key !== "fullDate" && key !== "S&P 500")

    const returns = sectors.map((sector) => {
      const firstValue = data[0][sector]
      const lastValue = data[data.length - 1][sector]
      return {
        sector,
        performance: ((lastValue - firstValue) / Math.abs(firstValue)) * 100,
      }
    })

    const gainers = returns.filter((r) => r.performance > 0).length
    const losers = returns.filter((r) => r.performance < 0).length
    const avgReturn = returns.reduce((sum, r) => sum + r.performance, 0) / returns.length

    const sp500First = data[0]["S&P 500"]
    const sp500Last = data[data.length - 1]["S&P 500"]
    const sp500Return = ((sp500Last - sp500First) / Math.abs(sp500First)) * 100

    setSectorData(returns)
    setStats({
      avgReturn,
      gainers,
      losers,
      sp500Return,
    })
  }

  const chartConfig: Record<string, { label: string; color: string }> = {
    "S&P 500": {
      label: "S&P 500",
      color: "hsl(142, 71%, 45%)",
    },
  }

  if (historicalData.length > 0) {
    const sectors = Object.keys(historicalData[0]).filter(
      (key) => key !== "date" && key !== "fullDate" && key !== "S&P 500",
    )
    sectors.forEach((sector, index) => {
      chartConfig[sector] = {
        label: sector,
        color: SECTOR_COLORS[index % SECTOR_COLORS.length],
      }
    })
  }

  const comparisonData = sectorData.map((sector, index) => ({
    sector: SECTOR_ABBR[sector.sector] || sector.sector,
    fullName: sector.sector,
    performance: sector.performance,
    sp500: stats.sp500Return,
    difference: sector.performance - stats.sp500Return,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length],
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {TIME_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.value)}
                className="min-w-[80px]"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center gap-2 text-xs">
              <Activity className="h-3 w-3" />
              Market Avg
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className={`text-2xl font-bold ${stats.avgReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {stats.avgReturn >= 0 ? "+" : ""}
              {stats.avgReturn.toFixed(2)}%
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
            <div className="text-2xl font-bold text-emerald-500">{stats.gainers}</div>
            <div className="text-xs text-muted-foreground">sectors</div>
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
            <div className="text-2xl font-bold text-red-500">{stats.losers}</div>
            <div className="text-xs text-muted-foreground">sectors</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center gap-2 text-xs">
              <Activity className="h-3 w-3" />
              S&P 500
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className={`text-2xl font-bold ${stats.sp500Return >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {stats.sp500Return >= 0 ? "+" : ""}
              {stats.sp500Return.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {sectorData.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Sector Performance Heat Map</h2>
          <SectorHeatMap sectors={sectorData} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sector Performance vs S&P 500</CardTitle>
          <CardDescription>Compare sector returns against the S&P 500 benchmark</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground">Loading data...</div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="sector"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm mb-2">{data.fullName}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Sector:</span>
                                <span className={data.performance >= 0 ? "text-emerald-500" : "text-red-500"}>
                                  {data.performance >= 0 ? "+" : ""}
                                  {data.performance.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">S&P 500:</span>
                                <span className="text-emerald-500">
                                  {data.sp500 >= 0 ? "+" : ""}
                                  {data.sp500.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between gap-4 pt-1 border-t border-border">
                                <span className="text-muted-foreground">Difference:</span>
                                <span className={data.difference >= 0 ? "text-emerald-500" : "text-red-500"}>
                                  {data.difference >= 0 ? "+" : ""}
                                  {data.difference.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    onMouseEnter={(e) => setHoveredSector(e.dataKey)}
                    onMouseLeave={() => setHoveredSector(null)}
                  />
                  <Bar dataKey="performance" name="Sector Performance" radius={[4, 4, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={hoveredSector === null || hoveredSector === entry.fullName ? 1 : 0.3}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="sp500" name="S&P 500" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Historical trend line chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Performance Trends</CardTitle>
          <CardDescription>Historical performance comparison over the selected time period</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-muted-foreground">Loading historical data...</div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
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
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    onMouseEnter={(e) => setHoveredSector(e.dataKey)}
                    onMouseLeave={() => setHoveredSector(null)}
                  />
                  <Line
                    type="monotone"
                    dataKey="S&P 500"
                    stroke="hsl(142, 71%, 45%)"
                    strokeWidth={3}
                    dot={false}
                    opacity={hoveredSector === null || hoveredSector === "S&P 500" ? 1 : 0.2}
                  />
                  {Object.keys(chartConfig)
                    .filter((key) => key !== "S&P 500")
                    .map((sector, index) => (
                      <Line
                        key={sector}
                        type="monotone"
                        dataKey={sector}
                        stroke={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        opacity={hoveredSector === null || hoveredSector === sector ? 1 : 0.2}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
