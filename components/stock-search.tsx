"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

interface SearchResult {
  description: string
  displaySymbol: string
  symbol: string
  type: string
}

export function StockSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchStocks = async () => {
      if (query.length < 1) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
        setShowResults(true)
      } catch (error) {
        console.error("Error searching stocks:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchStocks, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelectStock = (symbol: string) => {
    setQuery("")
    setShowResults(false)
    router.push(`/stock/${symbol}`)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, Tesla)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setShowResults(true)}
          className="pl-9 pr-9"
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <button
                key={result.symbol}
                onClick={() => handleSelectStock(result.symbol)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <div className="font-semibold">{result.displaySymbol}</div>
                <div className="text-sm text-muted-foreground truncate">{result.description}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {showResults && query.length > 0 && results.length === 0 && !isLoading && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <div className="p-4 text-center text-sm text-muted-foreground">No stocks found</div>
        </Card>
      )}
    </div>
  )
}
