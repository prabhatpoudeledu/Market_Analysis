import { Suspense } from "react"
import { HistoricalAnalysis } from "@/components/historical-analysis"
import { Skeleton } from "@/components/ui/skeleton"

export default function HistoricalPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Historical Market Analysis</h1>
        <p className="text-sm text-muted-foreground">Analyze sector performance trends over custom time periods</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-[80px] w-full" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        }
      >
        <HistoricalAnalysis />
      </Suspense>
    </div>
  )
}
