"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function FinvizMap() {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Market Map</h2>
        <p className="text-muted-foreground">Interactive market heat map powered by Finviz</p>
      </div>
      <Link href="https://finviz.com/map.ashx" target="_blank" rel="noopener noreferrer">
        <Card
          className="relative w-full overflow-hidden hover:border-primary transition-colors cursor-pointer group"
          style={{ height: "600px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 flex flex-col items-center justify-center gap-6 p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ExternalLink className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">Finviz Market Map</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Click to view the interactive market heat map showing real-time performance of stocks grouped by
                  sector and industry
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Gainers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Losers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <span>Neutral</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
              <span>Open in new tab</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  )
}
