import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_API_KEY

    const trendingStocks = ["AAPL", "TSLA", "NVDA", "AMD", "META"]

    const socialBuzz = await Promise.all(
      trendingStocks.map(async (symbol) => {
        try {
          const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
          const quote = await quoteRes.json()

          const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`)
          const profile = await profileRes.json()

          return {
            symbol,
            name: profile.name || symbol,
            mentions: Math.floor(Math.random() * 5000) + 1000, // Simulated mentions
            sentiment: (quote.dp || 0) >= 0 ? "positive" : "negative",
            change: quote.dp || 0,
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error)
          return null
        }
      }),
    )

    const filtered = socialBuzz.filter((stock): stock is NonNullable<typeof stock> => stock !== null)

    return NextResponse.json(filtered)
  } catch (error) {
    console.error("Error fetching social buzz:", error)
    return NextResponse.json([])
  }
}
