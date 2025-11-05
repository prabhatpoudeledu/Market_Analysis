import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_API_KEY
    console.log("[v0] Volume spikes API - API key present:", !!apiKey)

    const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "AMD", "NFLX", "INTC"]

    console.log("[v0] Fetching volume data for:", popularStocks)

    // Get volume data for popular stocks
    const volumeSpikes = await Promise.all(
      popularStocks.map(async (symbol) => {
        try {
          const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
          const quote = await quoteRes.json()
          console.log(`[v0] ${symbol} quote:`, quote)

          // Get company profile for name
          const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`)
          const profile = await profileRes.json()

          return {
            symbol,
            name: profile.name || symbol,
            volume: quote.v || 0,
            change: quote.dp || 0,
            price: quote.c || 0,
          }
        } catch (error) {
          console.error(`[v0] Error fetching data for ${symbol}:`, error)
          return null
        }
      }),
    )

    const filtered = volumeSpikes
      .filter((stock): stock is NonNullable<typeof stock> => stock !== null && stock.volume > 0)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5)

    console.log("[v0] Filtered volume spikes:", filtered)
    return NextResponse.json(filtered)
  } catch (error) {
    console.error("[v0] Error fetching volume spikes:", error)
    return NextResponse.json([])
  }
}
