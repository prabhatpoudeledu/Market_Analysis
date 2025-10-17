"use client"

import { useState } from "react"
import { TradingViewChart } from "./tradingview-chart"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Maximize2, Minimize2 } from "lucide-react"

interface ExpandableChartProps {
  symbol: string
  stockName: string
  height?: number
}

export function ExpandableChart({ symbol, stockName, height = 800 }: ExpandableChartProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Regular Chart View */}
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Maximize2 className="h-4 w-4" />
            Expand Chart
          </Button>
        </div>
        <TradingViewChart symbol={symbol} height={height} />
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-[100vw] h-[100vh] p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">
                {symbol} - {stockName}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="gap-2">
                <Minimize2 className="h-4 w-4" />
                Close
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 mt-4">
            <TradingViewChart symbol={symbol} height={typeof window !== "undefined" ? window.innerHeight - 150 : 800} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
