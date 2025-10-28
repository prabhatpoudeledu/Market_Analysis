import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_API_KEY
    const grokApiKey = process.env.GROK_XAI_API_KEY

    console.log("[v0] Grok API key present:", !!grokApiKey)
    console.log("[v0] Grok API key length:", grokApiKey?.length || 0)

    if (!grokApiKey) {
      console.error("[v0] Grok API key is missing")
      return NextResponse.json({
        sentiment: "Market sentiment analysis unavailable. Please configure Grok API key.",
        newsCount: 0,
        timestamp: new Date().toISOString(),
      })
    }

    // Get general market news
    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`)

    if (!newsRes.ok) {
      throw new Error("Failed to fetch news")
    }

    const news = await newsRes.json()
    const recentNews = news.slice(0, 10)

    // Prepare news summary for AI analysis
    const newsSummary = recentNews.map((item: any) => `${item.headline}: ${item.summary || ""}`).join("\n\n")

    console.log("[v0] About to call Grok AI with model grok-2-latest")

    const { text } = await generateText({
      model: xai("grok-2-latest", {
        apiKey: process.env.GROK_XAI_API_KEY,
      }),
      prompt: `Analyze the sentiment of these recent market news headlines and provide a brief market sentiment summary (2-3 sentences) with an overall sentiment score (bullish/neutral/bearish):\n\n${newsSummary}`,
      system: "You are a financial analyst AI. Provide concise, professional market sentiment analysis.",
    })

    console.log("[v0] Grok AI response received")

    return NextResponse.json({
      sentiment: text,
      newsCount: recentNews.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error analyzing news sentiment:", error)
    return NextResponse.json({
      sentiment: "Unable to analyze market sentiment at this time. Please try again later.",
      newsCount: 0,
      timestamp: new Date().toISOString(),
    })
  }
}
