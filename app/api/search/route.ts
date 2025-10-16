import { searchSymbols } from "@/lib/fmp-api"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchSymbols(query)
  return NextResponse.json({ results })
}
