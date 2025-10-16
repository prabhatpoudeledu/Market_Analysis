const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || ""
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  console.log("[v0] Fetching:", url.replace(FINNHUB_API_KEY, "***"))
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    console.log("[v0] Fetch completed, Status:", response.status)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    console.error("[v0] Fetch error:", error)
    throw error
  }
}

export interface SectorPerformance {
  sector: string
  changesPercentage: string
}

export async function getSectorPerformance(): Promise<SectorPerformance[]> {
  try {
    console.log("[v0] Getting sector performance, API key present:", !!FINNHUB_API_KEY)

    // Map of sector ETFs to track sector performance
    const sectorETFs = [
      { symbol: "XLK", sector: "Technology" },
      { symbol: "XLF", sector: "Financial Services" },
      { symbol: "XLV", sector: "Healthcare" },
      { symbol: "XLE", sector: "Energy" },
      { symbol: "XLY", sector: "Consumer Cyclical" },
      { symbol: "XLP", sector: "Consumer Defensive" },
      { symbol: "XLI", sector: "Industrials" },
      { symbol: "XLB", sector: "Basic Materials" },
      { symbol: "XLRE", sector: "Real Estate" },
      { symbol: "XLU", sector: "Utilities" },
      { symbol: "XLC", sector: "Communication Services" },
    ]

    const sectorData = await Promise.all(
      sectorETFs.map(async ({ symbol, sector }) => {
        try {
          const response = await fetchWithTimeout(
            `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
            { next: { revalidate: 300 } },
            10000,
          )

          if (!response.ok) {
            console.error("[v0] Failed to fetch sector ETF:", symbol)
            return null
          }

          const data = await response.json()
          return {
            sector,
            changesPercentage: data.dp?.toFixed(2) + "%" || "0%",
          }
        } catch (error) {
          console.error("[v0] Error fetching sector ETF:", symbol, error)
          return null
        }
      }),
    )

    const validSectors = sectorData.filter((s): s is SectorPerformance => s !== null)
    console.log("[v0] Sector data received:", validSectors.length, "sectors")
    return validSectors
  } catch (error) {
    console.error("[v0] Error fetching sector performance:", error)
    return []
  }
}

export interface StockQuote {
  symbol: string
  name: string
  price: number
  changesPercentage: number
  change: number
  dayLow: number
  dayHigh: number
  yearHigh: number
  yearLow: number
  marketCap: number
  priceAvg50: number
  priceAvg200: number
  volume: number
  avgVolume: number
  exchange: string
  open: number
  previousClose: number
  eps: number
  pe: number
  earningsAnnouncement: string
  sharesOutstanding: number
  timestamp: number
}

export async function getStocksBySymbols(symbols: string[]): Promise<StockQuote[]> {
  try {
    console.log("[v0] Fetching stocks:", symbols.length, "symbols")

    // Finnhub doesn't support batch quotes, so we need to fetch individually
    // Limit to first 20 to avoid rate limits
    const limitedSymbols = symbols.slice(0, 20)

    const stockData = await Promise.all(
      limitedSymbols.map(async (symbol) => {
        try {
          const [quoteResponse, profileResponse] = await Promise.all([
            fetchWithTimeout(
              `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
              { next: { revalidate: 60 } },
              5000,
            ),
            fetchWithTimeout(
              `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
              { next: { revalidate: 3600 } },
              5000,
            ),
          ])

          if (!quoteResponse.ok) {
            return null
          }

          const quote = await quoteResponse.json()
          const profile = profileResponse.ok ? await profileResponse.json() : {}

          return {
            symbol,
            name: profile.name || symbol,
            price: quote.c || 0,
            changesPercentage: quote.dp || 0,
            change: quote.d || 0,
            dayLow: quote.l || 0,
            dayHigh: quote.h || 0,
            yearHigh: quote.h || 0,
            yearLow: quote.l || 0,
            marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : 0,
            priceAvg50: 0,
            priceAvg200: 0,
            volume: 0,
            avgVolume: 0,
            exchange: profile.exchange || "",
            open: quote.o || 0,
            previousClose: quote.pc || 0,
            eps: 0,
            pe: 0,
            earningsAnnouncement: "",
            sharesOutstanding: profile.shareOutstanding || 0,
            timestamp: Date.now(),
          }
        } catch (error) {
          console.error("[v0] Error fetching stock:", symbol, error)
          return null
        }
      }),
    )

    const validStocks = stockData.filter((s): s is StockQuote => s !== null)
    console.log("[v0] Stock data received:", validStocks.length, "stocks")
    return validStocks
  } catch (error) {
    console.error("[v0] Error fetching stock quotes:", error)
    return []
  }
}

export interface HistoricalPrice {
  date: string
  open: number
  high: number
  low: number
  close: number
  adjClose: number
  volume: number
  unadjustedVolume: number
  change: number
  changePercent: number
  vwap: number
  label: string
  changeOverTime: number
}

export async function getHistoricalPrices(symbol: string, from?: string, to?: string): Promise<HistoricalPrice[]> {
  try {
    const toDate = to ? new Date(to) : new Date()
    const fromDate = from ? new Date(from) : new Date(toDate.getTime() - 90 * 24 * 60 * 60 * 1000)

    const fromTimestamp = Math.floor(fromDate.getTime() / 1000)
    const toTimestamp = Math.floor(toDate.getTime() / 1000)

    console.log("[v0] Fetching historical prices for:", symbol)
    const response = await fetchWithTimeout(
      `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=D&from=${fromTimestamp}&to=${toTimestamp}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 300 } },
      15000,
    )

    if (response.status === 403) {
      console.log("[v0] Historical data requires premium Finnhub subscription")
      return []
    }

    if (!response.ok) {
      console.error("[v0] Failed to fetch historical prices, status:", response.status)
      return []
    }

    const data = await response.json()

    if (data.s !== "ok" || !data.t) {
      console.log("[v0] No historical data available for:", symbol)
      return []
    }

    // Convert Finnhub format to our format
    const historical: HistoricalPrice[] = data.t.map((timestamp: number, index: number) => {
      const date = new Date(timestamp * 1000).toISOString().split("T")[0]
      const open = data.o[index]
      const close = data.c[index]
      const change = close - open
      const changePercent = (change / open) * 100

      return {
        date,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        adjClose: data.c[index],
        volume: data.v[index],
        unadjustedVolume: data.v[index],
        change,
        changePercent,
        vwap: 0,
        label: date,
        changeOverTime: 0,
      }
    })

    console.log("[v0] Historical data received for:", symbol, historical.length, "records")
    return historical.reverse() // Reverse to get newest first
  } catch (error) {
    console.error("[v0] Error fetching historical prices:", error)
    return []
  }
}

export async function getHistoricalSectorPerformance(days = 90): Promise<Record<string, HistoricalPrice[]>> {
  try {
    console.log("[v0] Getting historical sector performance for", days, "days")

    const sectorETFs = [
      { symbol: "XLK", sector: "Technology" },
      { symbol: "XLF", sector: "Financial Services" },
      { symbol: "XLV", sector: "Healthcare" },
      { symbol: "XLE", sector: "Energy" },
      { symbol: "XLY", sector: "Consumer Cyclical" },
      { symbol: "XLP", sector: "Consumer Defensive" },
      { symbol: "XLI", sector: "Industrials" },
      { symbol: "XLB", sector: "Basic Materials" },
      { symbol: "XLRE", sector: "Real Estate" },
      { symbol: "XLU", sector: "Utilities" },
      { symbol: "XLC", sector: "Communication Services" },
    ]

    const toDate = new Date()
    const fromDate = new Date(toDate.getTime() - days * 24 * 60 * 60 * 1000)

    const historicalData: Record<string, HistoricalPrice[]> = {}

    await Promise.all(
      sectorETFs.map(async ({ symbol, sector }) => {
        try {
          const data = await getHistoricalPrices(
            symbol,
            fromDate.toISOString().split("T")[0],
            toDate.toISOString().split("T")[0],
          )
          historicalData[sector] = data
        } catch (error) {
          console.error("[v0] Error fetching historical data for sector:", sector, error)
          historicalData[sector] = []
        }
      }),
    )

    console.log("[v0] Historical sector data received for", Object.keys(historicalData).length, "sectors")
    return historicalData
  } catch (error) {
    console.error("[v0] Error fetching historical sector performance:", error)
    return {}
  }
}

export interface CompanyProfile {
  symbol: string
  price: number
  beta: number
  volAvg: number
  mktCap: number
  lastDiv: number
  range: string
  changes: number
  companyName: string
  currency: string
  cik: string
  isin: string
  cusip: string
  exchange: string
  exchangeShortName: string
  industry: string
  website: string
  description: string
  ceo: string
  sector: string
  country: string
  fullTimeEmployees: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  dcfDiff: number
  dcf: number
  image: string
  ipoDate: string
  defaultImage: boolean
  isEtf: boolean
  isActivelyTrading: boolean
  isAdr: boolean
  isFund: boolean
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  try {
    console.log("[v0] Fetching company profile for:", symbol)
    const response = await fetchWithTimeout(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } },
      10000,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch company profile")
    }

    const data = await response.json()

    if (!data || Object.keys(data).length === 0) {
      console.log("[v0] No profile data available for:", symbol)
      return null
    }

    console.log("[v0] Company profile received for:", symbol)

    // Map Finnhub profile to our format
    return {
      symbol,
      price: 0,
      beta: 0,
      volAvg: 0,
      mktCap: data.marketCapitalization ? data.marketCapitalization * 1000000 : 0,
      lastDiv: 0,
      range: "",
      changes: 0,
      companyName: data.name || symbol,
      currency: data.currency || "USD",
      cik: "",
      isin: data.isin || "",
      cusip: data.cusip || "",
      exchange: data.exchange || "",
      exchangeShortName: data.exchange || "",
      industry: data.finnhubIndustry || "",
      website: data.weburl || "",
      description: "",
      ceo: "",
      sector: data.finnhubIndustry || "",
      country: data.country || "",
      fullTimeEmployees: "",
      phone: data.phone || "",
      address: "",
      city: "",
      state: "",
      zip: "",
      dcfDiff: 0,
      dcf: 0,
      image: data.logo || "",
      ipoDate: data.ipo || "",
      defaultImage: false,
      isEtf: false,
      isActivelyTrading: true,
      isAdr: false,
      isFund: false,
    }
  } catch (error) {
    console.error("[v0] Error fetching company profile:", error)
    return null
  }
}

export interface SymbolSearchResult {
  description: string
  displaySymbol: string
  symbol: string
  type: string
}

export async function searchSymbols(query: string): Promise<SymbolSearchResult[]> {
  try {
    if (!query || query.length < 1) {
      return []
    }

    console.log("[v0] Searching symbols for:", query)
    const response = await fetchWithTimeout(
      `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } },
      5000,
    )

    if (!response.ok) {
      console.error("[v0] Failed to search symbols")
      return []
    }

    const data = await response.json()
    console.log("[v0] Symbol search results:", data.result?.length || 0)

    // Filter to only US stocks and limit results
    return (data.result || [])
      .filter((item: SymbolSearchResult) => item.type === "Common Stock" && !item.symbol.includes("."))
      .slice(0, 10)
  } catch (error) {
    console.error("[v0] Error searching symbols:", error)
    return []
  }
}
