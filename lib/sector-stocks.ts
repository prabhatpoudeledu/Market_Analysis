// Mapping of sectors to representative stock symbols
export const SECTOR_STOCKS: Record<string, string[]> = {
  Technology: ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "AVGO", "ORCL", "ADBE", "CRM", "INTC", "AMD", "CSCO"],
  Healthcare: ["JNJ", "UNH", "LLY", "ABBV", "MRK", "TMO", "ABT", "PFE", "DHR", "BMY", "AMGN", "CVS"],
  "Financial Services": ["JPM", "BAC", "WFC", "GS", "MS", "C", "BLK", "SCHW", "AXP", "USB", "PNC", "TFC"],
  "Consumer Cyclical": ["AMZN", "TSLA", "HD", "MCD", "NKE", "SBUX", "LOW", "TJX", "BKNG", "CMG", "MAR", "ABNB"],
  "Communication Services": ["GOOGL", "META", "DIS", "NFLX", "CMCSA", "T", "VZ", "TMUS", "EA", "TTWO", "WBD", "PARA"],
  Industrials: ["BA", "HON", "UNP", "RTX", "UPS", "CAT", "GE", "LMT", "DE", "MMM", "FDX", "NSC"],
  "Consumer Defensive": ["PG", "KO", "PEP", "WMT", "COST", "PM", "MO", "CL", "MDLZ", "KMB", "GIS", "KHC"],
  Energy: ["XOM", "CVX", "COP", "SLB", "EOG", "MPC", "PSX", "VLO", "OXY", "HAL", "WMB", "KMI"],
  Utilities: ["NEE", "DUK", "SO", "D", "AEP", "EXC", "SRE", "PEG", "XEL", "ED", "ES", "FE"],
  "Real Estate": ["PLD", "AMT", "CCI", "EQIX", "PSA", "SPG", "O", "WELL", "DLR", "AVB", "EQR", "VTR"],
  "Basic Materials": ["LIN", "APD", "SHW", "ECL", "DD", "NEM", "FCX", "NUE", "DOW", "PPG", "ALB", "VMC"],
  Financial: ["JPM", "BAC", "WFC", "GS", "MS", "C", "BLK", "SCHW", "AXP", "USB", "PNC", "TFC"],
}

export function getSectorStocks(sector: string): string[] {
  return SECTOR_STOCKS[sector] || []
}

export function normalizeSectorName(sector: string): string {
  // FMP API returns sectors with different naming conventions
  const sectorMap: Record<string, string> = {
    Technology: "Technology",
    "Health Care": "Healthcare",
    Healthcare: "Healthcare",
    Financials: "Financial Services",
    "Financial Services": "Financial Services",
    "Consumer Discretionary": "Consumer Cyclical",
    "Consumer Cyclical": "Consumer Cyclical",
    "Communication Services": "Communication Services",
    Industrials: "Industrials",
    "Consumer Staples": "Consumer Defensive",
    "Consumer Defensive": "Consumer Defensive",
    Energy: "Energy",
    Utilities: "Utilities",
    "Real Estate": "Real Estate",
    Materials: "Basic Materials",
    "Basic Materials": "Basic Materials",
    Financial: "Financial Services",
  }

  return sectorMap[sector] || sector
}
