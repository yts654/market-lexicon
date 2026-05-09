import { NextRequest, NextResponse } from 'next/server'
import { fetchNewsForSymbol, NewsItem } from '@/lib/market-news'
import type { Language } from '@/lib/i18n'

export const runtime = 'nodejs'

interface HeadlinesResponse {
  symbol: string
  lang: Language
  items: NewsItem[]
  fetchedAt: string
}

interface CacheEntry {
  expires: number
  payload: HeadlinesResponse
}

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 min
const cache = new Map<string, CacheEntry>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const symbol = String(body.symbol || '').trim()
    const lang: Language = body.lang === 'en' ? 'en' : 'jp'

    if (!symbol) {
      return NextResponse.json({ error: 'symbol required' }, { status: 400 })
    }

    const key = `${symbol}::${lang}`
    const now = Date.now()
    const cached = cache.get(key)
    if (cached && cached.expires > now) {
      return NextResponse.json(cached.payload)
    }

    const items = await fetchNewsForSymbol(symbol, lang, 8)

    const payload: HeadlinesResponse = {
      symbol,
      lang,
      items,
      fetchedAt: new Date().toISOString(),
    }

    cache.set(key, { expires: now + CACHE_TTL_MS, payload })

    return NextResponse.json(payload)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ error: 'server_error', message: msg }, { status: 500 })
  }
}
