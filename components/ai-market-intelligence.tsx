"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, Newspaper, MessageCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface VolumeSpike {
  symbol: string
  name: string
  volume: number
  change: number
  price: number
}

interface NewsSentiment {
  sentiment: string
  newsCount: number
  timestamp: string
}

interface SocialBuzz {
  symbol: string
  name: string
  mentions: number
  sentiment: string
  change: number
}

export function AIMarketIntelligence() {
  const [volumeSpikes, setVolumeSpikes] = useState<VolumeSpike[]>([])
  const [newsSentiment, setNewsSentiment] = useState<NewsSentiment | null>(null)
  const [socialBuzz, setSocialBuzz] = useState<SocialBuzz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volumeRes, sentimentRes, buzzRes] = await Promise.all([
          fetch("/api/ai-intelligence/volume-spikes"),
          fetch("/api/ai-intelligence/news-sentiment"),
          fetch("/api/ai-intelligence/social-buzz"),
        ])

        const [volume, sentiment, buzz] = await Promise.all([volumeRes.json(), sentimentRes.json(), buzzRes.json()])

        setVolumeSpikes(Array.isArray(volume) ? volume : [])
        setNewsSentiment(sentiment)
        setSocialBuzz(Array.isArray(buzz) ? buzz : [])
      } catch (error) {
        console.error("Error fetching AI intelligence:", error)
        setVolumeSpikes([])
        setSocialBuzz([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">AI Market Intelligence</h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Powered by Grok AI</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Volume Spikes */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Volume Spikes</h3>
          </div>
          <div className="space-y-2">
            {volumeSpikes.length > 0 ? (
              volumeSpikes.map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/stock/${stock.symbol}`}
                  className="block p-2 rounded hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">Vol: {(stock.volume / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className={`text-sm font-medium ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">No volume spikes detected</div>
            )}
          </div>
        </Card>

        {/* News Sentiment */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">News Sentiment</h3>
          </div>
          <div className="space-y-2">
            {newsSentiment && (
              <div className="text-sm text-muted-foreground leading-relaxed">{newsSentiment.sentiment}</div>
            )}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Analyzed {newsSentiment?.newsCount || 0} recent articles
            </div>
          </div>
        </Card>

        {/* Social Buzz */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Trending Stocks</h3>
          </div>
          <div className="space-y-2">
            {socialBuzz.length > 0 ? (
              socialBuzz.map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/stock/${stock.symbol}`}
                  className="block p-2 rounded hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.mentions.toLocaleString()} mentions</div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        stock.sentiment === "positive" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {stock.sentiment}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">No trending stocks available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
