import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] News sentiment API called")

    // Fetch Google News RSS feed for business/finance
    const rssUrl = "https://news.google.com/rss/search?q=stock+market+OR+finance+OR+economy&hl=en-US&gl=US&ceid=US:en"

    console.log("[v0] Fetching news from:", rssUrl)
    const response = await fetch(rssUrl)

    if (!response.ok) {
      console.error("[v0] Failed to fetch Google News, status:", response.status)
      throw new Error("Failed to fetch Google News")
    }

    const xmlText = await response.text()
    console.log("[v0] Received RSS feed, length:", xmlText.length)

    // Parse RSS XML to extract headlines
    const headlines: string[] = []
    const titleMatches = xmlText.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)

    for (const match of titleMatches) {
      if (match[1] && match[1] !== "Google News") {
        headlines.push(match[1])
        if (headlines.length >= 15) break
      }
    }

    // Basic sentiment analysis using keyword matching
    const positiveWords = [
      "surge",
      "gain",
      "rally",
      "rise",
      "jump",
      "soar",
      "climb",
      "advance",
      "boost",
      "growth",
      "profit",
      "strong",
      "bullish",
      "optimistic",
      "record",
      "high",
      "up",
      "positive",
      "beat",
      "exceed",
      "outperform",
      "recovery",
      "rebound",
    ]

    const negativeWords = [
      "fall",
      "drop",
      "plunge",
      "decline",
      "crash",
      "tumble",
      "sink",
      "loss",
      "weak",
      "bearish",
      "pessimistic",
      "low",
      "down",
      "negative",
      "miss",
      "underperform",
      "concern",
      "worry",
      "fear",
      "risk",
      "threat",
      "warning",
      "slump",
      "recession",
    ]

    let positiveCount = 0
    let negativeCount = 0

    headlines.forEach((headline) => {
      const lowerHeadline = headline.toLowerCase()
      positiveWords.forEach((word) => {
        if (lowerHeadline.includes(word)) positiveCount++
      })
      negativeWords.forEach((word) => {
        if (lowerHeadline.includes(word)) negativeCount++
      })
    })

    // Determine overall sentiment
    let sentimentLabel = "Neutral"
    let sentimentDescription = "Market sentiment appears balanced with mixed signals."

    const totalSentiment = positiveCount + negativeCount
    if (totalSentiment > 0) {
      const positiveRatio = positiveCount / totalSentiment

      if (positiveRatio > 0.6) {
        sentimentLabel = "Bullish"
        sentimentDescription = `Market sentiment is positive with ${positiveCount} bullish indicators across recent news. Investors appear optimistic about market conditions.`
      } else if (positiveRatio < 0.4) {
        sentimentLabel = "Bearish"
        sentimentDescription = `Market sentiment is cautious with ${negativeCount} bearish indicators in recent headlines. Investors showing concern about market direction.`
      } else {
        sentimentDescription = `Market sentiment is mixed with ${positiveCount} positive and ${negativeCount} negative signals. Investors remain cautious but watchful.`
      }
    }

    return NextResponse.json({
      sentiment: `${sentimentLabel}: ${sentimentDescription}`,
      newsCount: headlines.length,
      timestamp: new Date().toISOString(),
      details: {
        positiveSignals: positiveCount,
        negativeSignals: negativeCount,
        headlines: headlines.slice(0, 5), // Return top 5 headlines
      },
    })
  } catch (error) {
    console.error("Error analyzing news sentiment:", error)
    return NextResponse.json({
      sentiment: "Unable to analyze market sentiment at this time. Please try again later.",
      newsCount: 0,
      timestamp: new Date().toISOString(),
    })
  }
}
