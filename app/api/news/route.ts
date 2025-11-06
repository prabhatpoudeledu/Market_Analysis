export async function GET() {
  try {
    console.log("[v0] Fetching news from Investing.com RSS")
    const response = await fetch("https://www.investing.com/rss/news.rss", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    console.log("[v0] RSS feed fetched successfully")

    return new Response(text, {
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching RSS:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
