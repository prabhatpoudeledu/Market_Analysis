"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  timestamp: string
  image?: string
  url: string
  category: string
}

export function NewsList() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [newsData] = useState<NewsItem[]>([
    {
      id: "1",
      title: "S&P 500 Reaches Record High on Tech Rally",
      summary:
        "Technology stocks lead broader market gains as investors show renewed confidence in the sector following positive earnings reports.",
      source: "Bloomberg",
      timestamp: "2 hours ago",
      url: "https://example.com/sp500-rally",
      category: "Markets",
    },
    {
      id: "2",
      title: "Federal Reserve Signals Potential Rate Cuts in 2025",
      summary:
        "Fed officials indicate potential interest rate reductions could begin in early 2025 as inflation pressures ease.",
      source: "Reuters",
      timestamp: "4 hours ago",
      url: "https://example.com/fed-rates",
      category: "Economy",
    },
    {
      id: "3",
      title: "Tesla Stock Surges After Announcing New AI Initiatives",
      summary:
        "Tesla shares jump 5% following announcement of major artificial intelligence developments in autonomous driving.",
      source: "MarketWatch",
      timestamp: "6 hours ago",
      url: "https://example.com/tesla-ai",
      category: "Stocks",
    },
    {
      id: "4",
      title: "Crypto Market Volatility Increases Amid Regulatory Concerns",
      summary:
        "Bitcoin and Ethereum experience significant price swings as new regulatory proposals emerge from multiple governments.",
      source: "CoinDesk",
      timestamp: "8 hours ago",
      url: "https://example.com/crypto-volatility",
      category: "Crypto",
    },
    {
      id: "5",
      title: "Goldman Sachs Upgrades Energy Sector Outlook",
      summary:
        "Investment bank raises price targets for oil and gas companies citing strong geopolitical factors and demand recovery.",
      source: "Financial Times",
      timestamp: "10 hours ago",
      url: "https://example.com/goldman-energy",
      category: "Sectors",
    },
  ])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* News List - Wider */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden border-0 shadow-lg h-full">
          <div className="p-6 space-y-4 max-h-[800px] overflow-y-auto">
            <h2 className="text-2xl font-bold text-foreground sticky top-0 bg-card pb-4 border-b">
              Latest Financial News
            </h2>
            <div className="space-y-3">
              {newsData.map((news) => (
                <button
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className="w-full text-left p-4 hover:bg-muted/50 rounded-lg transition-colors border border-border/50 hover:border-border group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {news.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{news.timestamp}</span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
                      <p className="text-xs text-muted-foreground mt-2">{news.source}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* News Detail View - Right Side */}
      <div className="lg:col-span-1">
        {selectedNews ? (
          <Card className="overflow-hidden border-0 shadow-lg sticky top-6 max-h-[600px]">
            <div className="p-6 space-y-4 overflow-y-auto max-h-[600px] bg-muted/30">
              <button
                onClick={() => setSelectedNews(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to News
              </button>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {selectedNews.category}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedNews.title}</h2>
                  <p className="text-xs text-muted-foreground mt-2">{selectedNews.source}</p>
                  <p className="text-xs text-muted-foreground">{selectedNews.timestamp}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-foreground leading-relaxed">{selectedNews.summary}</p>
                </div>

                <a
                  href={selectedNews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium w-full justify-center"
                >
                  Read Full Article
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden border-0 shadow-lg h-full sticky top-6 bg-muted/30">
            <div className="p-6 flex items-center justify-center text-center text-muted-foreground">
              <p>Click on a news item to view details</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
