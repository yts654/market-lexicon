'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Instrument,
  formatValue,
  formatChangePct,
  ASSET_FILTERS,
  AssetFilter,
  PriceColorMode
} from '@/lib/market-data'

interface RightSidebarMarketsProps {
  instruments: Instrument[]
  colorMode: PriceColorMode
  onToggleColorMode: () => void
  onSelectInstrument?: (symbol: string) => void
}

export function RightSidebarMarkets({
  instruments,
  colorMode,
  onToggleColorMode,
  onSelectInstrument
}: RightSidebarMarketsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<AssetFilter>('ALL')
  const [liveInstruments, setLiveInstruments] = useState(instruments)

  // Simulate live ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveInstruments(prev => {
        return prev.map(inst => {
          const tick = (Math.random() - 0.5) * 0.0006 * inst.value
          const newValue = inst.value + tick
          const newChange = inst.change + tick
          const newChangePct = (newChange / inst.prevClose) * 100

          return {
            ...inst,
            value: parseFloat(newValue.toFixed(inst.decimals)),
            change: parseFloat(newChange.toFixed(inst.decimals)),
            changePct: parseFloat(newChangePct.toFixed(2))
          }
        })
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const filteredInstruments = useMemo(() => {
    let filtered = liveInstruments

    if (activeFilter !== 'ALL') {
      filtered = filtered.filter(i => i.assetClass === activeFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        i =>
          i.symbol.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.nameJa.includes(q)
      )
    }

    return filtered
  }, [liveInstruments, activeFilter, searchQuery])

  const getPriceColor = (change: number) => {
    if (change === 0) return 'var(--price-flat)'
    if (colorMode === 'jp') {
      return change > 0 ? 'var(--price-up)' : 'var(--price-down)'
    }
    return change > 0 ? 'var(--price-up-western, #4A8B6E)' : 'var(--price-down-western, #A03A42)'
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-secondary)',
        overflow: 'hidden'
      }}
    >
      {/* Sticky header with search and filters */}
      <div
        style={{
          height: '32px',
          flexShrink: 0,
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px'
        }}
      >
        {/* Search input - editorial serif italic */}
        <input
          type="text"
          placeholder="Search instruments…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-primary)',
            padding: 0
          }}
        />
      </div>

      {/* Filter chips - text separated by middle dots */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px 12px', 
          gap: '4px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        {ASSET_FILTERS.map((filter, idx) => (
          <span key={filter} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setActiveFilter(filter)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                color: activeFilter === filter ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                letterSpacing: '0.04em'
              }}
            >
              {filter}
            </button>
            {idx < ASSET_FILTERS.length - 1 && (
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '8px',
                  color: 'var(--text-muted)'
                }}
              >
                ·
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Instrument list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredInstruments.map(inst => {
          const urlSymbol = inst.symbol.replace(/\//g, '')
          return (
            <Link
            key={inst.symbol}
            href={`/markets/${urlSymbol}`}
            onClick={() => onSelectInstrument?.(inst.symbol)}
            style={{
              width: '100%',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              background: 'var(--bg-secondary)',
              border: 'none',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              textAlign: 'left',
              gap: '8px',
              transition: 'background 200ms ease',
              textDecoration: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-secondary)'
            }}
          >
            {/* Symbol */}
            <span
              style={{
                width: '60px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                flexShrink: 0
              }}
            >
              {inst.symbol}
            </span>

            {/* Value */}
            <span
              style={{
                flex: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 400,
                color: 'var(--text-primary)',
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontFeatureSettings: '"tnum" 1, "zero" 1'
              }}
            >
              {formatValue(inst.value, inst.decimals, inst.isYield)}
            </span>

            {/* %Change */}
            <span
              style={{
                width: '56px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 400,
                color: getPriceColor(inst.change),
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0
              }}
            >
              {formatChangePct(inst.changePct)}
            </span>
            </Link>
          )
        })}
      </div>

      {/* Color mode toggle footer - editorial style */}
      <div
        style={{
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        <span
          onClick={colorMode !== 'jp' ? onToggleColorMode : undefined}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '10px',
            color: colorMode === 'jp' ? 'var(--accent-gold)' : 'var(--text-tertiary)',
            cursor: 'pointer',
            borderBottom: colorMode === 'jp' ? '1px solid var(--accent-gold)' : 'none'
          }}
        >
          Japanese mode
        </span>
        <span style={{ width: '1px', height: '12px', background: 'var(--border-medium)' }} />
        <span
          onClick={colorMode !== 'en' ? onToggleColorMode : undefined}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '10px',
            color: colorMode === 'en' ? 'var(--accent-gold)' : 'var(--text-tertiary)',
            cursor: 'pointer',
            borderBottom: colorMode === 'en' ? '1px solid var(--accent-gold)' : 'none'
          }}
        >
          Western mode
        </span>
      </div>
    </div>
  )
}
