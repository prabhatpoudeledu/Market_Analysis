"use client"

import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface SectorData {
  sector: string
  performance: number
}

interface SectorHeatMapProps {
  sectors: SectorData[]
}

function getPerformanceColor(performance: number): string {
  if (performance >= 3) return "bg-emerald-600 hover:bg-emerald-700"
  if (performance >= 1) return "bg-emerald-500 hover:bg-emerald-600"
  if (performance >= 0) return "bg-emerald-400 hover:bg-emerald-500"
  if (performance >= -1) return "bg-red-400 hover:bg-red-500"
  if (performance >= -3) return "bg-red-500 hover:bg-red-600"
  return "bg-red-600 hover:bg-red-700"
}

function getTextColor(performance: number): string {
  return "text-white"
}

function getSectorSize(performance: number): number {
  // Placeholder function for determining sector size based on performance
  // You can implement this function as needed
  return 140 + Math.abs(performance) * 10
}

export function SectorHeatMap({ sectors }: SectorHeatMapProps) {
  const router = useRouter()

  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {sectors.map((sector) => {
          const size = getSectorSize(sector.performance)
          const colorClass = getPerformanceColor(sector.performance)

          return (
            <button
              key={sector.sector}
              onClick={() => router.push(`/sector/${encodeURIComponent(sector.sector)}`)}
              className={`${colorClass} rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-4 cursor-pointer`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                minWidth: "140px",
                minHeight: "140px",
              }}
              title={`${sector.sector}: ${sector.performance >= 0 ? "+" : ""}${sector.performance.toFixed(2)}%`}
            >
              <span className="font-bold text-base text-white text-center text-balance">{sector.sector}</span>
              <span className="text-sm text-white/90 mt-2">
                {sector.performance >= 0 ? "+" : ""}
                {sector.performance.toFixed(2)}%
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
