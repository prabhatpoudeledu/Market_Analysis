"use client"
import { Header } from "@/components/header"
import { NewsList } from "@/components/news-list"

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-foreground">Market News & Analysis</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">Real-time financial news and market insights</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <NewsList />
        </div>
      </main>
    </div>
  )
}
