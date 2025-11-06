"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  timestamp: string
  url: string
  category: string
}

export function NewsList() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        const text = await response.text()

        // Parse XML
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")

        const items = xmlDoc.getElementsByTagName("item")
        const parsedNews: NewsItem[] = []

        for (let i = 0; i < Math.min(items.length, 20); i++) {
          const item = items[i]
          const title = item.getElementsByTagName("title")[0]?.textContent || "No title"
          const description = item.getElementsByTagName("description")[0]?.textContent || "No description"
          const link = item.getElementsByTagName("link")[0]?.textContent || "#"
          const pubDate = item.getElementsByTagName("pubDate")[0]?.textContent || "Unknown"

          // Format timestamp
          const date = new Date(pubDate)
          const now = new Date()
          const diffMs = now.getTime() - date.getTime()
          const diffMins = Math.floor(diffMs / 60000)
          const diffHours = Math.floor(diffMs / 3600000)
          const diffDays = Math.floor(diffMs / 86400000)

          let timeAgo = "Just now"
          if (diffMins > 0) timeAgo = `${diffMins}m ago`
          if (diffHours > 0) timeAgo = `${diffHours}h ago`
          if (diffDays > 0) timeAgo = `${diffDays}d ago`

          // Extract category from description or use generic
          const descriptionText = description.replace(/<[^>]*>/g, "")
          let category = "Markets"
          if (descriptionText.toLowerCase().includes("crypto")) category = "Crypto"
          if (descriptionText.toLowerCase().includes("stock")) category = "Stocks"
          if (descriptionText.toLowerCase().includes("bond")) category = "Bonds"
          if (descriptionText.toLowerCase().includes("forex")) category = "Forex"
          if (descriptionText.toLowerCase().includes("commodity")) category = "Commodities"

          parsedNews.push({
            id: `investing-${i}`,
            title: title.substring(0, 100),
            summary: descriptionText.substring(0, 150),
            source: "Investing.com",
            timestamp: timeAgo,
            url: link,
            category,
          })
        }

        setNewsData(parsedNews)
        if (parsedNews.length > 0) {
          setSelectedNews(parsedNews[0])
        }
      } catch (error) {
        console.error("[v0] Error fetching news:", error)
        setNewsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* News List - Left Side */}
      <div className="flex-1 min-w-0">
        <Card className="overflow-hidden border-0 shadow-lg h-full flex flex-col">
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold text-foreground sticky top-0 bg-card pb-4 border-b">
              Latest Financial News
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading news...</p>
              </div>
            ) : newsData.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No news available at the moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {newsData.map((news) => (
                  <button
                    key={news.id}
                    onClick={() => setSelectedNews(news)}
                    className={`w-full text-left p-4 rounded-lg transition-colors border ${
                      selectedNews?.id === news.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50 border-border/50 hover:border-border"
                    } group cursor-pointer`}
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
            )}
          </div>
        </Card>
      </div>

      {/* News Detail View - Right Side */}
      <div className="w-96 flex-shrink-0">
        {selectedNews ? (
          <Card className="overflow-hidden border-0 shadow-lg h-full flex flex-col">
            <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-muted/30">
              <div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {selectedNews.category}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedNews.title}</h2>
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
          </Card>
        ) : (
          <Card className="overflow-hidden border-0 shadow-lg h-full bg-muted/30">
            <div className="p-6 flex items-center justify-center text-center text-muted-foreground h-full">
              <p>Click on a news item to view details</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
