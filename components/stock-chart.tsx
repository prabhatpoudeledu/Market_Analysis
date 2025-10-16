"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { HistoricalPrice } from "@/lib/fmp-api"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface StockChartProps {
  data: HistoricalPrice[]
}

export function StockChart({ data }: StockChartProps) {
  const [chartType, setChartType] = useState<"price" | "volume">("price")

  // Format data for the chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: item.close,
    volume: item.volume / 1e6, // Convert to millions
  }))

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex gap-2">
        <Button variant={chartType === "price" ? "default" : "outline"} size="sm" onClick={() => setChartType("price")}>
          Price
        </Button>
        <Button
          variant={chartType === "volume" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("volume")}
        >
          Volume
        </Button>
      </div>

      {/* Price Chart */}
      {chartType === "price" && (
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
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
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${Number(value).toFixed(2)}`} />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
                name="Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {/* Volume Chart */}
      {chartType === "volume" && (
        <ChartContainer
          config={{
            volume: {
              label: "Volume (M)",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
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
                tickFormatter={(value) => `${value}M`}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${Number(value).toFixed(2)}M`} />} />
              <Bar dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}
