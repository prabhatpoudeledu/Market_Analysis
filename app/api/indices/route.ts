import { type NextRequest, NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || ""
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const symbolsParam = searchParams.get("symbols")

    if (!symbolsParam) {
      return NextResponse.json({ error: "Symbols parameter required" }, { status: 400 })
    }

    const symbols = symbolsParam.split(",")

    const data = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
            next: { revalidate: 60 },
          })

          if (!response.ok) {
            console.error("[v0] Failed to fetch index:", symbol)
            return {
              price: 0,
              change: 0,
              changePercent: 0,
            }
          }

          const quote = await response.json()

          return {
            price: quote.c || 0,
            change: quote.d || 0,
            changePercent: quote.dp || 0,
          }
        } catch (error) {
          console.error("[v0] Error fetching index:", symbol, error)
          return {
            price: 0,
            change: 0,
            changePercent: 0,
          }
        }
      }),
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in indices API:", error)
    return NextResponse.json({ error: "Failed to fetch indices" }, { status: 500 })
  }
}
