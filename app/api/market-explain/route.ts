import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { fetchNewsForSymbol, NewsItem } from '@/lib/market-news'
import type { Language } from '@/lib/i18n'

export const runtime = 'nodejs'

interface ExplainResponse {
  symbol: string
  lang: Language
  changePct?: number
  explanation: string
  sources: { title: string; url: string }[]
  generatedAt: string
}

interface CacheEntry {
  expires: number
  payload: ExplainResponse
}

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const cache = new Map<string, CacheEntry>()

function cacheKey(symbol: string, lang: Language): string {
  return `${symbol}::${lang}`
}

const SYSTEM_PROMPT = `You are a financial-markets analyst. Your job is to explain why a particular instrument moved today, but you may only cite causes that are clearly evident in the news headlines provided to you. If the headlines do not clearly explain the move, say so honestly — never invent geopolitical, monetary-policy, or earnings catalysts that are not present in the input.

Output rules:
- Plain prose, 2-3 short paragraphs (max ~180 words total).
- Do not use markdown headers, bullets, or bold. Plain sentences only.
- When you reference a headline, refer to it naturally (e.g. "報道によると" / "according to reports") rather than citing numbers like "[1]".
- Match the requested output language exactly.
- Do not fabricate price levels or statistics that aren't in the user's input.`

function buildUserPrompt(args: {
  symbol: string
  name: string
  lang: Language
  changePct: number | undefined
  headlines: NewsItem[]
}): string {
  const { symbol, name, lang, changePct, headlines } = args
  const moveLine =
    changePct === undefined
      ? lang === 'jp'
        ? '本日の値動きは未確定です。'
        : "Today's move is unspecified."
      : lang === 'jp'
      ? `本日の値動き: ${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`
      : `Today's move: ${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`

  const headlineLines = headlines
    .slice(0, 10)
    .map((h, i) => {
      const src = h.source ? ` (${h.source})` : ''
      return `${i + 1}. ${h.title}${src}`
    })
    .join('\n')

  const langInstruction =
    lang === 'jp'
      ? '日本語（金融業界で使われる丁寧な解説調）で回答してください。'
      : 'Respond in clear professional English (analyst tone).'

  return `Instrument: ${symbol} (${name})
${moveLine}

Recent headlines:
${headlineLines || '(no headlines available)'}

Task: Explain in 2-3 paragraphs why this instrument moved as it did today, drawing only on the headlines above. If the headlines do not clearly explain the move, say so directly. ${langInstruction}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const symbol = String(body.symbol || '').trim()
    const name = String(body.name || symbol)
    const lang: Language = body.lang === 'en' ? 'en' : 'jp'
    const changePct =
      typeof body.changePct === 'number' ? body.changePct : undefined

    if (!symbol) {
      return NextResponse.json({ error: 'symbol required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'missing_api_key',
          message:
            'ANTHROPIC_API_KEY is not configured on the server. Add it to your Vercel project environment variables to enable market-move explanations.',
        },
        { status: 503 }
      )
    }

    const key = cacheKey(symbol, lang)
    const cached = cache.get(key)
    const now = Date.now()
    if (cached && cached.expires > now) {
      return NextResponse.json(cached.payload)
    }

    // Fetch headlines (server-side, free RSS).
    let headlines: NewsItem[] = []
    try {
      headlines = await fetchNewsForSymbol(symbol, lang, 10)
    } catch {
      headlines = []
    }

    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      // Cache the system prompt — it's identical for every request, so
      // letting the API cache it cuts cost on subsequent calls.
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: buildUserPrompt({ symbol, name, lang, changePct, headlines }),
        },
      ],
    })

    const explanation = message.content
      .filter((c): c is Anthropic.TextBlock => c.type === 'text')
      .map((c) => c.text)
      .join('\n')
      .trim()

    const payload: ExplainResponse = {
      symbol,
      lang,
      changePct,
      explanation,
      sources: headlines.slice(0, 5).map((h) => ({ title: h.title, url: h.link })),
      generatedAt: new Date().toISOString(),
    }

    cache.set(key, { expires: now + CACHE_TTL_MS, payload })

    return NextResponse.json(payload)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ error: 'server_error', message: msg }, { status: 500 })
  }
}
