import Link from "next/link"
import { BarChart3 } from "lucide-react"
import { StockSearch } from "@/components/stock-search"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Market Analytics</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <StockSearch />
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Sectors
            </Link>
            <Link href="/stocks" className="text-sm font-medium hover:text-primary transition-colors">
              All Stocks
            </Link>
            <ThemeToggle />
          </nav>
        </div>

        <div className="md:hidden mt-4">
          <StockSearch />
        </div>
      </div>
    </header>
  )
}
