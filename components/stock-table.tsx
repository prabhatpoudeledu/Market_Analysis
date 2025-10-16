"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import type { StockQuote } from "@/lib/fmp-api"

interface StockWithSector extends StockQuote {
  sector: string
}

interface StockTableProps {
  stocks: StockWithSector[]
}

type SortField = "symbol" | "name" | "price" | "changesPercentage" | "marketCap" | "sector"
type SortDirection = "asc" | "desc"

export function StockTable({ stocks }: StockTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("marketCap")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Sort stocks
    filtered.sort((a, b) => {
      const aValue: number | string = a[sortField]
      const bValue: number | string = b[sortField]

      // Handle string comparisons
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Handle number comparisons
      const aNum = Number(aValue) || 0
      const bNum = Number(bValue) || 0
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum
    })

    return filtered
  }, [stocks, searchQuery, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by symbol, name, or sector..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedStocks.length} of {stocks.length} stocks
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("symbol")}
                    className="gap-2 font-semibold"
                  >
                    Symbol
                    <SortIcon field="symbol" />
                  </Button>
                </th>
                <th className="text-left p-4">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("name")} className="gap-2 font-semibold">
                    Name
                    <SortIcon field="name" />
                  </Button>
                </th>
                <th className="text-left p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("sector")}
                    className="gap-2 font-semibold"
                  >
                    Sector
                    <SortIcon field="sector" />
                  </Button>
                </th>
                <th className="text-right p-4">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("price")} className="gap-2 font-semibold">
                    Price
                    <SortIcon field="price" />
                  </Button>
                </th>
                <th className="text-right p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("changesPercentage")}
                    className="gap-2 font-semibold"
                  >
                    Change
                    <SortIcon field="changesPercentage" />
                  </Button>
                </th>
                <th className="text-right p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("marketCap")}
                    className="gap-2 font-semibold"
                  >
                    Market Cap
                    <SortIcon field="marketCap" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStocks.map((stock) => (
                <tr key={stock.symbol} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <Link href={`/stock/${stock.symbol}`} className="font-semibold hover:text-primary">
                      {stock.symbol}
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/stock/${stock.symbol}`} className="hover:text-primary">
                      {stock.name}
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/sector/${encodeURIComponent(stock.sector)}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {stock.sector}
                    </Link>
                  </td>
                  <td className="p-4 text-right font-medium">${stock.price.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <span className={`font-semibold ${stock.changesPercentage >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                      {stock.changesPercentage >= 0 ? "+" : ""}
                      {stock.changesPercentage.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium">${(stock.marketCap / 1e9).toFixed(2)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
