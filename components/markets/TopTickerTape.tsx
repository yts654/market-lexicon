'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Instrument,
  formatValue,
  formatChange,
  formatChangePct,
  getMarketStatus,
  PriceColorMode
} from '@/lib/market-data'

interface TopTickerTapeProps {
  instruments: Instrument[]
  colorMode: PriceColorMode
}

export function TopTickerTape({ instruments, colorMode }: TopTickerTapeProps) {
  const [marketStatus, setMarketStatus] = useState(getMarketStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const getPriceColor = (change: number) => {
    if (change === 0) return 'var(--price-flat)'
    if (colorMode === 'jp') {
      return change > 0 ? 'var(--price-up)' : 'var(--price-down)'
    }
    return change > 0 ? 'var(--price-up-western, #4A8B6E)' : 'var(--price-down-western, #A03A42)'
  }

  // Duplicate instruments for seamless loop
  const tickerItems = useMemo(() => [...instruments, ...instruments], [instruments])

  return (
    <div
      style={{
        height: '32px',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'stretch',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Market status - editorial style */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px',
          borderRight: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: marketStatus.isOpen ? 'var(--price-down)' : 'var(--text-tertiary)'
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}
        >
          {marketStatus.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Scrolling ticker */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          className="ticker-scroll"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: 'max-content'
          }}
        >
          {tickerItems.map((inst, idx) => (
            <div
              key={`${inst.symbol}-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 20px'
              }}
            >
              {/* Symbol */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em'
                }}
              >
                {inst.symbol}
              </span>

              {/* Value */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                  fontFeatureSettings: '"tnum" 1, "zero" 1'
                }}
              >
                {formatValue(inst.value, inst.decimals, inst.isYield)}
              </span>

              {/* Change */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: getPriceColor(inst.change),
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {formatChange(inst.change, inst.decimals)}
              </span>

              {/* % Change */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: getPriceColor(inst.change),
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {formatChangePct(inst.changePct)}
              </span>

              {/* Separator - middle dot */}
              {idx < tickerItems.length - 1 && (
                <span
                  style={{
                    color: 'var(--text-tertiary)',
                    marginLeft: '12px',
                    fontSize: '8px'
                  }}
                >
                  ·
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
