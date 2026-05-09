'use client'

import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import type { Instrument } from '@/lib/market-data'

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source?: string
}

interface HeadlinesResponse {
  symbol: string
  items: NewsItem[]
  fetchedAt: string
}

interface MoverExplanationProps {
  instrument: Instrument
}

type Status = 'loading' | 'ready' | 'empty' | 'error'

function formatPubDate(pubDate: string, lang: string): string {
  const d = new Date(pubDate)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(lang === 'jp' ? 'ja-JP' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MoverExplanation({ instrument }: MoverExplanationProps) {
  const { t, lang } = useT()
  const [status, setStatus] = useState<Status>('loading')
  const [data, setData] = useState<HeadlinesResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setStatus('loading')
      setData(null)
      setErrorMsg('')
      try {
        const res = await fetch('/api/market-explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: instrument.symbol, lang }),
        })
        if (cancelled) return
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          setErrorMsg(err.message || `HTTP ${res.status}`)
          setStatus('error')
          return
        }
        const json = (await res.json()) as HeadlinesResponse
        if (cancelled) return
        if (!json.items || json.items.length === 0) {
          setStatus('empty')
          return
        }
        setData(json)
        setStatus('ready')
      } catch (e) {
        if (cancelled) return
        setErrorMsg(e instanceof Error ? e.message : 'fetch failed')
        setStatus('error')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [instrument.symbol, lang])

  return (
    <section style={{ padding: '32px 24px' }}>
      {/* Chapter break */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }} />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-tertiary)',
            padding: '0 16px',
          }}
        >
          II
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }} />
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        {t('movers.title')}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        {t('movers.subtitle')}
      </p>

      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
        }}
      >
        {status === 'loading' && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              margin: 0,
            }}
          >
            {t('movers.loading')}
          </p>
        )}

        {status === 'empty' && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              margin: 0,
            }}
          >
            {t('movers.empty')}
          </p>
        )}

        {status === 'error' && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--price-down)',
              margin: 0,
            }}
          >
            {t('movers.error')}
            {errorMsg && (
              <span style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {errorMsg}
              </span>
            )}
          </p>
        )}

        {status === 'ready' && data && (
          <>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {data.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    paddingBottom: i === data.items.length - 1 ? 0 : '14px',
                    borderBottom:
                      i === data.items.length - 1
                        ? 'none'
                        : '1px solid var(--border-subtle)',
                  }}
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      const title = (e.currentTarget as HTMLElement).querySelector(
                        '[data-news-title]'
                      ) as HTMLElement | null
                      if (title) title.style.color = 'var(--accent-gold)'
                    }}
                    onMouseLeave={(e) => {
                      const title = (e.currentTarget as HTMLElement).querySelector(
                        '[data-news-title]'
                      ) as HTMLElement | null
                      if (title) title.style.color = 'var(--text-primary)'
                    }}
                  >
                    <div
                      data-news-title
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '15px',
                        fontWeight: 400,
                        color: 'var(--text-primary)',
                        lineHeight: 1.5,
                        marginBottom: '6px',
                        transition: 'color 150ms',
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-tertiary)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.source && (
                        <>
                          <span>{item.source}</span>
                          <span style={{ color: 'var(--border-medium)' }}>·</span>
                        </>
                      )}
                      <span>{formatPubDate(item.pubDate, lang)}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{t('movers.poweredBy')}</span>
              <span>
                {t('movers.fetchedAt')}{' '}
                {new Date(data.fetchedAt).toLocaleString(
                  lang === 'jp' ? 'ja-JP' : 'en-US'
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
