"use client"

import { Header } from "@/components/header"
import { AIMarketIntelligence } from "@/components/ai-market-intelligence"

export default function AIIntelligencePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">AI Market Intelligence</h1>
            <p className="text-lg text-muted-foreground mt-2">
              AI-powered market insights including volume spikes, news sentiment, and trending stocks
            </p>
          </div>

          <AIMarketIntelligence />
        </div>
      </main>
    </div>
  )
}
