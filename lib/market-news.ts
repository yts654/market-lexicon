// ─────────────────────────────────────────────────────────────────────────────
// Market news fetcher — Google News RSS based, no API key required.
// ─────────────────────────────────────────────────────────────────────────────

import type { Language } from './i18n'

export interface NewsItem {
  title: string
  link: string
  pubDate: string
  source?: string
}

// Symbol → search query (English / Japanese)
// Google News RSS narrows by `hl` param so JP gets Japanese-language coverage.
const SYMBOL_QUERIES: Record<string, { en: string; jp: string }> = {
  NKY: { en: 'Nikkei 225 stock', jp: '日経平均株価' },
  TPX: { en: 'TOPIX index Japan', jp: 'TOPIX' },
  HSI: { en: 'Hang Seng index', jp: '香港 ハンセン指数' },
  SPX: { en: 'S&P 500 index', jp: 'S&P 500' },
  IXIC: { en: 'Nasdaq Composite', jp: 'ナスダック総合指数' },
  DJI: { en: 'Dow Jones Industrial', jp: 'ダウ平均' },
  UKX: { en: 'FTSE 100 index', jp: 'FTSE 100' },
  DAX: { en: 'DAX index Germany', jp: 'DAX指数' },
  'USD/JPY': { en: 'USDJPY exchange rate yen', jp: 'ドル円' },
  'EUR/JPY': { en: 'EURJPY exchange rate', jp: 'ユーロ円' },
  'EUR/USD': { en: 'EURUSD exchange rate', jp: 'ユーロドル' },
  'GBP/JPY': { en: 'GBPJPY exchange rate', jp: 'ポンド円' },
  WTI: { en: 'WTI crude oil price', jp: 'WTI原油' },
  GOLD: { en: 'gold price spot XAU', jp: '金価格 ゴールド' },
  US10Y: { en: 'US 10-year Treasury yield', jp: '米国10年債利回り' },
  JP10Y: { en: 'Japan 10-year JGB yield', jp: '日本10年国債利回り' },
}

function buildQuery(symbol: string, lang: Language): { q: string; hl: string; gl: string } {
  const entry =
    SYMBOL_QUERIES[symbol] || { en: symbol, jp: symbol }
  if (lang === 'jp') {
    return { q: entry.jp, hl: 'ja', gl: 'JP' }
  }
  return { q: entry.en, hl: 'en-US', gl: 'US' }
}

// Decode the most common HTML entities that appear in RSS titles.
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
}

function stripCdata(s: string): string {
  return s
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim()
}

// Lightweight RSS parser — extracts <item> blocks via regex.
// Avoids pulling in a full XML parser for a single, well-known feed shape.
function parseRss(xml: string, max: number): NewsItem[] {
  const items: NewsItem[] = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null
  while ((match = itemRe.exec(xml)) !== null && items.length < max) {
    const block = match[1]
    const title = stripCdata(/<title>([\s\S]*?)<\/title>/.exec(block)?.[1] ?? '')
    const link = stripCdata(/<link>([\s\S]*?)<\/link>/.exec(block)?.[1] ?? '')
    const pubDate = stripCdata(/<pubDate>([\s\S]*?)<\/pubDate>/.exec(block)?.[1] ?? '')
    const source = stripCdata(/<source[^>]*>([\s\S]*?)<\/source>/.exec(block)?.[1] ?? '')
    if (title && link) {
      items.push({
        title: decodeEntities(title),
        link,
        pubDate,
        source: source ? decodeEntities(source) : undefined,
      })
    }
  }
  return items
}

export async function fetchNewsForSymbol(
  symbol: string,
  lang: Language,
  max = 10
): Promise<NewsItem[]> {
  const { q, hl, gl } = buildQuery(symbol, lang)
  // Google News RSS — public endpoint, no key required.
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    q
  )}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl.split('-')[0]}`

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; MarketLexiconBot/1.0; +https://github.com/yts654/market-lexicon)',
    },
    next: { revalidate: 1800 }, // 30-min ISR cache for RSS
  })

  if (!res.ok) {
    throw new Error(`News fetch failed (${res.status}) for ${symbol}`)
  }

  const xml = await res.text()
  return parseRss(xml, max)
}
