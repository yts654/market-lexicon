'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Instrument,
  formatValue,
  formatChange,
  formatChangePct,
  TIMEFRAMES,
  PriceColorMode,
  getPriceColor
} from '@/lib/market-data'

// Dynamically import Sparklines with SSR disabled to avoid hydration mismatch
const Sparklines = dynamic(
  () => import('react-sparklines').then(mod => mod.Sparklines),
  { ssr: false }
)
const SparklinesLine = dynamic(
  () => import('react-sparklines').then(mod => mod.SparklinesLine),
  { ssr: false }
)
const SparklinesReferenceLine = dynamic(
  () => import('react-sparklines').then(mod => mod.SparklinesReferenceLine),
  { ssr: false }
)

// ─────────────────────────────────────────────────────────────────────────────
// InstrumentTile - Editorial style
// ─────────────────────────────────────────────────────────────────────────────
interface InstrumentTileProps {
  instrument: Instrument
  selected: boolean
  onSelect: () => void
  colorMode: PriceColorMode
  isUpdating: boolean
}

function InstrumentTile({ instrument, selected, onSelect, colorMode, isUpdating }: InstrumentTileProps) {
  const sparkColor = getPriceColor(instrument.change, colorMode)
  const arrow = instrument.change > 0 ? '▵' : instrument.change < 0 ? '▿' : ''
  const urlSymbol = instrument.symbol.replace(/\//g, '')

  return (
    <Link
      href={`/markets/${urlSymbol}`}
      onClick={(e) => {
        e.preventDefault()
        onSelect()
        // Navigate after a brief delay to show selection
        setTimeout(() => {
          window.location.href = `/markets/${urlSymbol}`
        }, 150)
      }}
      className={isUpdating ? 'value-updating' : ''}
      style={{
        width: '152px',
        height: '92px',
        background: selected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        border: 'none',
        borderLeft: selected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
        borderTop: '1px solid var(--border-subtle)',
        borderRight: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'background 200ms ease',
        textAlign: 'left',
        outline: 'none',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.background = 'var(--bg-tertiary)'
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.background = 'var(--bg-secondary)'
      }}
    >
      {/* Row 1: Symbol + Long name + Flag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '0.02em'
          }}
        >
          {instrument.symbol}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '9px',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}
        >
          {instrument.name}
        </span>
        <span style={{ fontSize: '12px', flexShrink: 0 }}>{instrument.flag}</span>
      </div>

      {/* Row 2: Value - right aligned */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '18px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1, "zero" 1',
          marginBottom: '2px'
        }}
      >
        {formatValue(instrument.value, instrument.decimals, instrument.isYield)}
      </div>

      {/* Row 3: Change + %Change with outline arrow */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 400,
          color: getPriceColor(instrument.change, colorMode),
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: '6px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>{arrow}</span>
        <span>{formatChange(instrument.change, instrument.decimals)}</span>
        <span>{formatChangePct(instrument.changePct)}</span>
      </div>

      {/* Row 4: Sparkline with baseline */}
      <div style={{ height: '22px', width: '100%', position: 'relative' }}>
        <Sparklines data={instrument.sparklineData} width={128} height={22} margin={0}>
          <SparklinesLine color={sparkColor} style={{ strokeWidth: 1.5, fill: 'none' }} curveType="monotone" />
          <SparklinesReferenceLine type="mean" style={{ stroke: 'var(--border-medium)', strokeWidth: 0.5, strokeDasharray: '2,2' }} />
        </Sparklines>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// InstrumentDetail - Editorial style with refined typography
// ─────────────────────────────────────────────────────────────────────────────
interface InstrumentDetailProps {
  instrument: Instrument
  colorMode: PriceColorMode
}

function InstrumentDetail({ instrument, colorMode }: InstrumentDetailProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<ReturnType<typeof import('lightweight-charts').createChart> | null>(null)
  const [activeTimeframe, setActiveTimeframe] = useState('1D')

  const upColor = colorMode === 'jp' ? '#B43A42' : '#4A8B6E'
  const downColor = colorMode === 'jp' ? '#2D7A6E' : '#A03A42'
  const arrow = instrument.change > 0 ? '▵' : instrument.change < 0 ? '▿' : ''

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return

    let chart: ReturnType<typeof import('lightweight-charts').createChart> | null = null

    const initChart = async () => {
      const { createChart, CandlestickSeries } = await import('lightweight-charts')
      
      if (!chartRef.current) return

      // Clear any existing chart
      chartRef.current.innerHTML = ''

      chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 320,
        layout: {
          background: { color: '#161B22' },
          textColor: '#7A7368'
        },
        grid: {
          vertLines: { color: '#232B36' },
          horzLines: { color: '#232B36' }
        },
        crosshair: {
          mode: 1,
          vertLine: { color: '#4A453E', width: 1, style: 2 },
          horzLine: { color: '#4A453E', width: 1, style: 2 }
        },
        rightPriceScale: {
          borderColor: '#232B36'
        },
        timeScale: {
          borderColor: '#232B36',
          timeVisible: true
        }
      })

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: upColor,
        downColor: downColor,
        borderUpColor: upColor,
        borderDownColor: downColor,
        wickUpColor: upColor,
        wickDownColor: downColor
      })

      const candleData = instrument.candles.map(c => ({
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close
      }))

      candleSeries.setData(candleData)
      chart.timeScale().fitContent()
      chartInstanceRef.current = chart
    }

    initChart()

    const handleResize = () => {
      if (chart && chartRef.current) {
        chart.applyOptions({ width: chartRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart) {
        chart.remove()
      }
    }
  }, [instrument.symbol, upColor, downColor, instrument.candles])

  // Stats data
  const stats = [
    { label: 'OPEN', value: formatValue(instrument.open, instrument.decimals, instrument.isYield) },
    { label: 'HIGH', value: formatValue(instrument.high, instrument.decimals, instrument.isYield) },
    { label: 'LOW', value: formatValue(instrument.low, instrument.decimals, instrument.isYield) },
    { label: 'PREV CLOSE', value: formatValue(instrument.prevClose, instrument.decimals, instrument.isYield) },
    { label: '52W HIGH', value: formatValue(instrument.week52High, instrument.decimals, instrument.isYield) },
    { label: '52W LOW', value: formatValue(instrument.week52Low, instrument.decimals, instrument.isYield) },
    { label: 'VOL', value: instrument.volume > 0 ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(instrument.volume) : 'N/A' },
    { label: 'AVG VOL', value: instrument.avgVolume > 0 ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(instrument.avgVolume) : 'N/A' }
  ]

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-subtle)',
        overflow: 'auto'
      }}
    >
      {/* Header strip - increased height */}
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em'
            }}
          >
            {instrument.symbol}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontWeight: 400,
              color: 'var(--text-primary)'
            }}
          >
            {instrument.name}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}
          >
            {instrument.nameJa}
          </span>
        </div>

        {/* Timeframe selector - editorial style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.en}
              onClick={() => setActiveTimeframe(tf.en)}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTimeframe === tf.en ? '1px solid var(--accent-gold)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0px'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 400,
                  color: activeTimeframe === tf.en ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  letterSpacing: '0.02em'
                }}
              >
                {tf.en}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '9px',
                  color: 'var(--text-tertiary)'
                }}
              >
                {tf.ja}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Big number block */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '48px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum" 1, "zero" 1',
            lineHeight: 1
          }}
        >
          {formatValue(instrument.value, instrument.decimals, instrument.isYield)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            fontWeight: 400,
            color: getPriceColor(instrument.change, colorMode),
            fontVariantNumeric: 'tabular-nums',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>{arrow}</span>
          <span>{formatChange(instrument.change, instrument.decimals)}</span>
          <span>{formatChangePct(instrument.changePct)}</span>
        </div>
        {/* Footnote-style timestamp */}
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            marginTop: '12px'
          }}
        >
          As of {instrument.asOf} JST · {instrument.exchange} · Delayed {instrument.delayMinutes} min
        </div>
      </div>

      {/* Chart area */}
      <div
        ref={chartRef}
        style={{ width: '100%', height: '320px', flexShrink: 0 }}
        aria-label={`${instrument.symbol} candlestick chart showing ${activeTimeframe} timeframe`}
      />

      {/* TradingView attribution - editorial footnote */}
      <div
        style={{
          padding: '6px 16px',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          textAlign: 'right'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '9px',
            color: 'var(--text-tertiary)'
          }}
        >
          Powered by TradingView
        </span>
      </div>

      {/* Stats grid with corner ornaments */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          flex: 1,
          overflow: 'auto'
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            style={{
              padding: '12px',
              borderRight: (idx + 1) % 4 !== 0 ? '1px solid var(--border-subtle)' : 'none',
              borderBottom: idx < 4 ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              position: 'relative'
            }}
          >
            {/* Corner ornament */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '2px',
                height: '2px',
                background: 'var(--accent-gold-dim)'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '9px',
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              {stat.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                fontWeight: 400,
                color: 'var(--text-primary)',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Colophon */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'right'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '9px',
            color: 'var(--text-muted)'
          }}
        >
          MARKET LEXICON · Vol. I · Issue 47
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MarketsWorkspace - Main component with grid + detail
// ─────────────────────────────────────────────────────────────────────────────
interface MarketsWorkspaceProps {
  instruments: Instrument[]
  colorMode: PriceColorMode
  onToggleColorMode: () => void
}

export function MarketsWorkspace({ instruments, colorMode, onToggleColorMode }: MarketsWorkspaceProps) {
  const [selectedSymbol, setSelectedSymbol] = useState(instruments[0]?.symbol || 'NKY')
  const [liveInstruments, setLiveInstruments] = useState(instruments)
  const [updatingSymbols, setUpdatingSymbols] = useState<Set<string>>(new Set())

  const selectedInstrument = liveInstruments.find(i => i.symbol === selectedSymbol) || liveInstruments[0]

  // Simulate live ticking with opacity transition instead of flash
  useEffect(() => {
    let clearTimeout_: ReturnType<typeof setTimeout> | undefined

    const interval = setInterval(() => {
      const updating = new Set<string>()

      setLiveInstruments(prev => {
        const newInstruments = prev.map(inst => {
          const tick = (Math.random() - 0.5) * 0.0006 * inst.value
          const newValue = inst.value + tick
          const newChange = inst.change + tick
          const newChangePct = (newChange / inst.prevClose) * 100

          if (Math.abs(tick) > 0.0001 * inst.value) {
            updating.add(inst.symbol)
          }

          return {
            ...inst,
            value: parseFloat(newValue.toFixed(inst.decimals)),
            change: parseFloat(newChange.toFixed(inst.decimals)),
            changePct: parseFloat(newChangePct.toFixed(2))
          }
        })
        return newInstruments
      })

      setUpdatingSymbols(updating)

      if (clearTimeout_) clearTimeout(clearTimeout_)
      clearTimeout_ = setTimeout(() => {
        setUpdatingSymbols(new Set())
      }, 600)
    }, 1000)

    return () => {
      clearInterval(interval)
      if (clearTimeout_) clearTimeout(clearTimeout_)
    }
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* Panel header - editorial style */}
      <div
        style={{
          height: '28px',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            fontWeight: 500,
            color: 'var(--text-tertiary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          GLOBAL MARKETS · 16 INSTRUMENTS
        </span>
        <div style={{ flex: 1 }} />

        {/* Color mode toggle - text style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '10px',
              color: colorMode === 'jp' ? 'var(--accent-gold)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              borderBottom: colorMode === 'jp' ? '1px solid var(--accent-gold)' : 'none'
            }}
            onClick={colorMode !== 'jp' ? onToggleColorMode : undefined}
          >
            Japanese mode
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '10px',
              color: colorMode === 'en' ? 'var(--accent-gold)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              borderBottom: colorMode === 'en' ? '1px solid var(--accent-gold)' : 'none'
            }}
            onClick={colorMode !== 'en' ? onToggleColorMode : undefined}
          >
            Western mode
          </span>
        </div>

        {/* Footnote-style attribution */}
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '10px',
            color: 'var(--text-tertiary)'
          }}
        >
          *Quotes delayed by 15 minutes. Source: Twelve Data.
        </span>
      </div>

      {/* Main content: Grid + Detail */}
      <div style={{ flex: 1, display: 'flex', overflow: 'auto' }}>
        {/* Left Grid (60%) */}
        <div
          style={{
            width: '60%',
            minWidth: '608px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 152px)',
            gridTemplateRows: 'repeat(4, 92px)',
            gap: '1px',
            padding: '16px',
            background: 'var(--bg-primary)',
            overflow: 'auto',
            flexShrink: 0,
            alignContent: 'start',
            justifyContent: 'center'
          }}
        >
          {liveInstruments.map(inst => (
            <InstrumentTile
              key={inst.symbol}
              instrument={inst}
              selected={inst.symbol === selectedSymbol}
              onSelect={() => setSelectedSymbol(inst.symbol)}
              colorMode={colorMode}
              isUpdating={updatingSymbols.has(inst.symbol)}
            />
          ))}
        </div>

        {/* Right Detail (40%) */}
        <InstrumentDetail instrument={selectedInstrument} colorMode={colorMode} />
      </div>
    </div>
  )
}
