'use client'

import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import type { Instrument } from '@/lib/market-data'

interface ExplainResponse {
  symbol: string
  changePct?: number
  explanation: string
  sources: { title: string; url: string }[]
  generatedAt: string
}

interface MoverExplanationProps {
  instrument: Instrument
}

type Status = 'idle' | 'loading' | 'ready' | 'missing_key' | 'error'

export function MoverExplanation({ instrument }: MoverExplanationProps) {
  const { t, lang } = useT()
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<ExplainResponse | null>(null)
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
          body: JSON.stringify({
            symbol: instrument.symbol,
            name: instrument.name,
            changePct: instrument.changePct,
            lang,
          }),
        })
        if (cancelled) return
        if (res.status === 503) {
          setStatus('missing_key')
          return
        }
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          setErrorMsg(err.message || `HTTP ${res.status}`)
          setStatus('error')
          return
        }
        const json = (await res.json()) as ExplainResponse
        if (cancelled) return
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
    // Re-fetch when the symbol or language changes; ignore live ticker
    // changePct fluctuations to avoid re-querying every second.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        {status === 'missing_key' && (
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: '0 0 8px' }}>{t('movers.missingKey.title')}</p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-gold-dim)',
              }}
            >
              ANTHROPIC_API_KEY
            </p>
          </div>
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
            {data.explanation
              .split(/\n\n+/)
              .filter((p) => p.trim())
              .map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.8,
                    margin: i === 0 ? '0 0 12px' : '0 0 12px',
                  }}
                >
                  {para}
                </p>
              ))}

            {data.sources.length > 0 && (
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    marginBottom: '8px',
                  }}
                >
                  {t('movers.sources')}
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {data.sources.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          lineHeight: 1.5,
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.color =
                            'var(--accent-gold)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.color =
                            'var(--text-secondary)'
                        }}
                      >
                        › {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              style={{
                marginTop: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
              }}
            >
              {t('movers.generatedAt')}{' '}
              {new Date(data.generatedAt).toLocaleString(
                lang === 'jp' ? 'ja-JP' : 'en-US'
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
