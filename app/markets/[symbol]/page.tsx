'use client'

import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines'
import {
  MOCK_INSTRUMENTS,
  Instrument,
  formatValue,
  formatChange,
  formatChangePct,
  PriceColorMode
} from '@/lib/market-data'
import { INSTRUMENT_EDUCATION, getRelatedInstruments } from '@/lib/instrument-education'

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function InstrumentDetailPage() {
  const params = useParams()
  const symbolParam = params.symbol as string
  
  // Normalize symbol (handle URL encoding, e.g., USDJPY vs USD/JPY)
  const normalizedSymbol = symbolParam.replace(/-/g, '/').toUpperCase()
  
  const instrument = MOCK_INSTRUMENTS.find(
    i => i.symbol.replace(/\//g, '').toUpperCase() === normalizedSymbol.replace(/\//g, '').toUpperCase() ||
         i.symbol.toUpperCase() === normalizedSymbol
  )

  const [colorMode, setColorMode] = useState<PriceColorMode>('jp')
  const [liveInstrument, setLiveInstrument] = useState<Instrument | null>(instrument || null)

  // Load color mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('marketLexicon_priceColorMode')
    if (saved === 'jp' || saved === 'en') {
      setColorMode(saved)
    }
  }, [])

  // Simulate live ticking
  useEffect(() => {
    if (!liveInstrument) return

    const interval = setInterval(() => {
      setLiveInstrument(prev => {
        if (!prev) return prev
        const tick = (Math.random() - 0.5) * 0.0006 * prev.value
        const newValue = prev.value + tick
        const newChange = prev.change + tick
        const newChangePct = (newChange / prev.prevClose) * 100

        return {
          ...prev,
          value: parseFloat(newValue.toFixed(prev.decimals)),
          change: parseFloat(newChange.toFixed(prev.decimals)),
          changePct: parseFloat(newChangePct.toFixed(2))
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [liveInstrument?.symbol])

  if (!instrument || !liveInstrument) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            color: 'var(--text-primary)'
          }}
        >
          Instrument not found
        </span>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--accent-gold)',
            textDecoration: 'none'
          }}
        >
          ‹ Return to Markets
        </Link>
      </div>
    )
  }

  const education = INSTRUMENT_EDUCATION[liveInstrument.symbol] || INSTRUMENT_EDUCATION['NKY']
  const relatedSymbols = getRelatedInstruments(liveInstrument.symbol)
  const relatedInstruments = relatedSymbols
    .map(s => MOCK_INSTRUMENTS.find(i => i.symbol === s))
    .filter(Boolean) as Instrument[]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Header - 88px */}
      <DetailHeader
        instrument={liveInstrument}
        colorMode={colorMode}
      />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}
      >
        {/* Chart + Stats Row */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Chart Region - 65% */}
          <div style={{ flex: '0 0 65%', borderRight: '1px solid var(--border-subtle)' }}>
            <Suspense fallback={<ChartSkeleton />}>
              <ChartRegion instrument={liveInstrument} colorMode={colorMode} />
            </Suspense>
          </div>

          {/* Stats Region - 35% */}
          <div style={{ flex: '0 0 35%' }}>
            <StatsRegion instrument={liveInstrument} colorMode={colorMode} />
          </div>
        </div>

        {/* Educational Content */}
        <EducationalContent
          instrument={liveInstrument}
          education={education}
        />

        {/* Related Instruments */}
        <RelatedInstruments
          instruments={relatedInstruments}
          colorMode={colorMode}
        />

        {/* Footer */}
        <footer
          style={{
            padding: '24px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '11px',
              color: 'var(--text-muted)'
            }}
          >
            MARKET LEXICON · Financial Markets Learning Terminal · Vol. I
          </span>
        </footer>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Header - 88px
// ─────────────────────────────────────────────────────────────────────────────
function DetailHeader({
  instrument,
  colorMode
}: {
  instrument: Instrument
  colorMode: PriceColorMode
}) {
  const [timestamp, setTimestamp] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} JST`
      setTimestamp(timeStr)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const getPriceColor = (change: number) => {
    if (change === 0) return 'var(--price-flat)'
    if (colorMode === 'jp') {
      return change > 0 ? 'var(--price-up)' : 'var(--price-down)'
    }
    return change > 0 ? 'var(--price-up-western)' : 'var(--price-down-western)'
  }

  const arrow = instrument.change > 0 ? '▲' : instrument.change < 0 ? '▽' : ''

  return (
    <header
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0
      }}
    >
      {/* Top row: Back + Symbol info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 32px 8px',
          gap: '16px'
        }}
      >
        {/* Back button */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '18px',
              color: 'var(--accent-gold)'
            }}
          >
            ‹
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}
          >
            Markets
          </span>
        </Link>

        {/* Vertical divider */}
        <div
          style={{
            width: '1px',
            height: '32px',
            background: 'var(--border-subtle)'
          }}
        />

        {/* Symbol + name */}
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}
        >
          {instrument.symbol}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}
        >
          {instrument.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-jp)',
            fontSize: '12px',
            color: 'var(--text-tertiary)'
          }}
        >
          {instrument.nameJa}
        </span>
      </div>

      {/* Bottom row: Price block - left aligned, prominent */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '16px',
          padding: '0 32px 14px',
          flexWrap: 'wrap'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '40px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum" 1, "zero" 1',
            lineHeight: 1,
            letterSpacing: '-0.02em'
          }}
        >
          {formatValue(instrument.value, instrument.decimals, instrument.isYield)}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '16px',
            fontWeight: 400,
            color: getPriceColor(instrument.change),
            fontVariantNumeric: 'tabular-nums',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>{arrow}</span>
          <span>{formatChange(instrument.change, instrument.decimals)}</span>
          <span>{formatChangePct(instrument.changePct)}</span>
        </span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-tertiary)'
          }}
        >
          As of {timestamp ?? '\u00A0'} · {instrument.exchange} · Delayed {instrument.delayMinutes} min
        </span>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart Region
// ─────────────────────────────────────────────────────────────────────────────
type ChartType = 'candles' | 'line' | 'area'
type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL'
type Indicator = 'MA20' | 'MA50' | 'MA200' | 'Volume' | 'RSI' | 'MACD' | 'Bollinger'

const TIMEFRAME_OPTIONS: Timeframe[] = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL']
const CHART_TYPES: ChartType[] = ['candles', 'line', 'area']
const INDICATORS: Indicator[] = ['MA20', 'MA50', 'MA200', 'Volume', 'RSI', 'MACD', 'Bollinger']

function ChartSkeleton() {
  return (
    <div
      style={{
        height: '520px',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
        Loading chart...
      </span>
    </div>
  )
}

function ChartRegion({
  instrument,
  colorMode
}: {
  instrument: Instrument
  colorMode: PriceColorMode
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<ReturnType<typeof import('lightweight-charts').createChart> | null>(null)
  
  const [timeframe, setTimeframe] = useState<Timeframe>('1M')
  const [chartType, setChartType] = useState<ChartType>('candles')
  const [activeIndicators, setActiveIndicators] = useState<Set<Indicator>>(new Set(['MA20', 'Volume']))

  const toggleIndicator = (ind: Indicator) => {
    setActiveIndicators(prev => {
      const next = new Set(prev)
      if (next.has(ind)) {
        next.delete(ind)
      } else {
        next.add(ind)
      }
      return next
    })
  }

  const upColor = colorMode === 'jp' ? '#B43A42' : '#4A8B6E'
  const downColor = colorMode === 'jp' ? '#2D7A6E' : '#A03A42'

  // Calculate moving averages
  const candles = instrument.candles
  const calculateMA = (period: number) => {
    return candles.map((_, idx) => {
      if (idx < period - 1) return null
      const slice = candles.slice(idx - period + 1, idx + 1)
      const avg = slice.reduce((sum, c) => sum + c.close, 0) / period
      return { time: candles[idx].time, value: avg }
    }).filter(Boolean)
  }

  const ma20Data = useMemo(() => calculateMA(20), [candles])
  const ma50Data = useMemo(() => calculateMA(50), [candles])
  const ma200Data = useMemo(() => calculateMA(200), [candles])

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return

    let chart: ReturnType<typeof import('lightweight-charts').createChart> | null = null

    const initChart = async () => {
      const { createChart, CandlestickSeries, LineSeries, AreaSeries, HistogramSeries } = await import('lightweight-charts')
      
      if (!chartRef.current) return

      // Clear existing
      chartRef.current.innerHTML = ''

      const chartHeight = activeIndicators.has('Volume') ? 440 : 520
      const volumeHeight = activeIndicators.has('Volume') ? 80 : 0

      chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: chartHeight,
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
        },
        watermark: {
          visible: true,
          text: instrument.symbol,
          fontSize: 96,
          color: 'rgba(255, 255, 255, 0.04)',
          fontFamily: 'var(--font-serif)'
        }
      })

      // Main price series
      if (chartType === 'candles') {
        const candleSeries = chart.addSeries(CandlestickSeries, {
          upColor,
          downColor,
          borderUpColor: upColor,
          borderDownColor: downColor,
          wickUpColor: upColor,
          wickDownColor: downColor
        })
        candleSeries.setData(candles.map(c => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close
        })))
      } else if (chartType === 'line') {
        const lineSeries = chart.addSeries(LineSeries, {
          color: 'var(--accent-gold)',
          lineWidth: 2
        })
        lineSeries.setData(candles.map(c => ({
          time: c.time,
          value: c.close
        })))
      } else {
        const areaSeries = chart.addSeries(AreaSeries, {
          lineColor: 'var(--accent-gold)',
          topColor: 'rgba(201, 169, 97, 0.3)',
          bottomColor: 'rgba(201, 169, 97, 0.0)',
          lineWidth: 2
        })
        areaSeries.setData(candles.map(c => ({
          time: c.time,
          value: c.close
        })))
      }

      // Moving averages
      if (activeIndicators.has('MA20') && ma20Data.length > 0) {
        const ma20Series = chart.addSeries(LineSeries, {
          color: '#8B949E',
          lineWidth: 1
        })
        ma20Series.setData(ma20Data as { time: string; value: number }[])
      }

      if (activeIndicators.has('MA50') && ma50Data.length > 0) {
        const ma50Series = chart.addSeries(LineSeries, {
          color: '#C9A961',
          lineWidth: 1
        })
        ma50Series.setData(ma50Data as { time: string; value: number }[])
      }

      if (activeIndicators.has('MA200') && ma200Data.length > 0) {
        const ma200Series = chart.addSeries(LineSeries, {
          color: '#B43A42',
          lineWidth: 1
        })
        ma200Series.setData(ma200Data as { time: string; value: number }[])
      }

      // Volume histogram
      if (activeIndicators.has('Volume')) {
        const volumeSeries = chart.addSeries(HistogramSeries, {
          priceFormat: { type: 'volume' },
          priceScaleId: 'volume'
        })
        chart.priceScale('volume').applyOptions({
          scaleMargins: { top: 0.85, bottom: 0 }
        })
        volumeSeries.setData(candles.map(c => ({
          time: c.time,
          value: c.volume,
          color: c.close >= c.open
            ? (colorMode === 'jp' ? 'rgba(180, 58, 66, 0.4)' : 'rgba(74, 139, 110, 0.4)')
            : (colorMode === 'jp' ? 'rgba(45, 122, 110, 0.4)' : 'rgba(160, 58, 66, 0.4)')
        })))
      }

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
  }, [instrument.symbol, chartType, colorMode, activeIndicators, candles, ma20Data, ma50Data, ma200Data, upColor, downColor])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Control strip - 44px */}
      <div
        style={{
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '24px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {/* Timeframe selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {TIMEFRAME_OPTIONS.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: 'none',
                borderBottom: timeframe === tf ? '1px solid var(--accent-gold)' : '1px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 400,
                color: timeframe === tf ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                letterSpacing: '0.02em'
              }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div style={{ width: '1px', height: '20px', background: 'var(--border-medium)' }} />

        {/* Chart type toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {CHART_TYPES.map(ct => (
            <button
              key={ct}
              onClick={() => setChartType(ct)}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: 'none',
                borderBottom: chartType === ct ? '1px solid var(--accent-gold)' : '1px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                color: chartType === ct ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                letterSpacing: '0.04em',
                textTransform: 'capitalize'
              }}
            >
              {ct}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Indicator toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {INDICATORS.map(ind => (
            <button
              key={ind}
              onClick={() => toggleIndicator(ind)}
              style={{
                padding: '2px 6px',
                background: 'transparent',
                border: activeIndicators.has(ind) ? '1px solid var(--accent-gold)' : '1px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                color: activeIndicators.has(ind) ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div
        ref={chartRef}
        style={{ width: '100%', height: activeIndicators.has('Volume') ? '440px' : '520px' }}
        aria-label={`${instrument.symbol} ${chartType} chart`}
      />

      {/* Attribution */}
      <div
        style={{
          padding: '6px 16px',
          borderTop: '1px solid var(--border-subtle)',
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
          Powered by TradingView Lightweight Charts
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats Region
// ─────────────────────────────────────────────────────────────────────────────
function StatsRegion({
  instrument,
  colorMode
}: {
  instrument: Instrument
  colorMode: PriceColorMode
}) {
  const stats = [
    { label: 'Open', value: formatValue(instrument.open, instrument.decimals, instrument.isYield) },
    { label: 'High', value: formatValue(instrument.high, instrument.decimals, instrument.isYield) },
    { label: 'Low', value: formatValue(instrument.low, instrument.decimals, instrument.isYield) },
    { label: 'Prev Close', value: formatValue(instrument.prevClose, instrument.decimals, instrument.isYield) },
    { label: '52W High', value: formatValue(instrument.week52High, instrument.decimals, instrument.isYield) },
    { label: '52W Low', value: formatValue(instrument.week52Low, instrument.decimals, instrument.isYield) },
    { label: 'Volume', value: instrument.volume > 0 ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(instrument.volume) : 'N/A' },
    { label: 'Avg Vol (10D)', value: instrument.avgVolume > 0 ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(instrument.avgVolume) : 'N/A' }
  ]

  // Day's range calculation
  const dayRange = instrument.high - instrument.low
  const dayPosition = dayRange > 0 ? ((instrument.value - instrument.low) / dayRange) * 100 : 50

  // 52-week range calculation
  const weekRange = instrument.week52High - instrument.week52Low
  const weekPosition = weekRange > 0 ? ((instrument.value - instrument.week52Low) / weekRange) * 100 : 50

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        background: 'var(--bg-secondary)',
        height: '100%',
        overflow: 'auto'
      }}
    >
      {/* Card 1: Key Statistics */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}
        >
          KEY STATISTICS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0'
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                padding: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                borderRight: idx % 2 === 0 ? '1px solid var(--border-subtle)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)'
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Day's Range */}
      <RangeCard
        title="TODAY'S RANGE"
        low={instrument.low}
        high={instrument.high}
        current={instrument.value}
        position={dayPosition}
        decimals={instrument.decimals}
        isYield={instrument.isYield}
      />

      {/* Card 3: 52-Week Range */}
      <RangeCard
        title="52-WEEK RANGE"
        low={instrument.week52Low}
        high={instrument.week52High}
        current={instrument.value}
        position={weekPosition}
        decimals={instrument.decimals}
        isYield={instrument.isYield}
      />
    </div>
  )
}

function RangeCard({
  title,
  low,
  high,
  current,
  position,
  decimals,
  isYield
}: {
  title: string
  low: number
  high: number
  current: number
  position: number
  decimals: number
  isYield: boolean
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}
      >
        {title}
      </div>
      <div style={{ position: 'relative', padding: '24px 0 8px' }}>
        {/* Current value above bar */}
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(Math.max(position, 10), 90)}%`,
            transform: 'translateX(-50%)',
            top: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {formatValue(current, decimals, isYield)}
        </div>

        {/* Range bar */}
        <div
          style={{
            height: '8px',
            background: 'var(--bg-tertiary)',
            borderRadius: '2px',
            position: 'relative'
          }}
        >
          {/* Filled segment */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${position}%`,
              background: 'var(--accent-gold-dim)',
              borderRadius: '2px 0 0 2px'
            }}
          />
          {/* Current position marker */}
          <div
            style={{
              position: 'absolute',
              left: `${position}%`,
              top: '-4px',
              width: '2px',
              height: '16px',
              background: 'var(--accent-gold)',
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        {/* Low/High labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatValue(low, decimals, isYield)}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatValue(high, decimals, isYield)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Educational Content
// ─────────────────────────────────────────────────────────────────────────────
interface EducationData {
  definition: string
  calculation: string
  drivers: string
  interpretation: string
}

function EducationalContent({
  instrument,
  education
}: {
  instrument: Instrument
  education: EducationData
}) {
  const columns = [
    { numeral: 'I', title: 'Definition', content: education.definition },
    { numeral: 'II', title: 'How It\'s Calculated', content: education.calculation },
    { numeral: 'III', title: 'What Moves It', content: education.drivers },
    { numeral: 'IV', title: 'What It Tells You', content: education.interpretation }
  ]

  return (
    <section style={{ padding: '32px 24px' }}>
      {/* Chapter break divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px'
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }} />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-tertiary)',
            padding: '0 16px'
          }}
        >
          II
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }} />
      </div>

      {/* Section header */}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          textAlign: 'center'
        }}
      >
        Understanding {instrument.name}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '32px'
        }}
      >
        Definition · Calculation · Drivers · Interpretation
      </p>

      {/* Four columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }}
      >
        {columns.map(col => (
          <div key={col.numeral}>
            {/* Roman numeral marker */}
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '16px',
                color: 'var(--accent-gold-dim)',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {col.numeral}.
            </span>
            {/* Column title */}
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '18px',
                fontWeight: 400,
                color: 'var(--text-primary)',
                marginBottom: '12px'
              }}
            >
              {col.title}
            </h3>
            {/* Body text */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--text-primary)',
                lineHeight: 1.7
              }}
            >
              {col.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Related Instruments
// ─────────────────────────────────────────────────────────────────────────────
function RelatedInstruments({
  instruments,
  colorMode
}: {
  instruments: Instrument[]
  colorMode: PriceColorMode
}) {
  if (instruments.length === 0) return null

  const getPriceColor = (change: number) => {
    if (change === 0) return 'var(--price-flat)'
    if (colorMode === 'jp') {
      return change > 0 ? 'var(--price-up)' : 'var(--price-down)'
    }
    return change > 0 ? 'var(--price-up-western)' : 'var(--price-down-western)'
  }

  return (
    <section
      style={{
        padding: '24px',
        borderTop: '1px solid var(--border-subtle)'
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '18px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}
      >
        Related Instruments
      </h3>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}
      >
        {instruments.map(inst => {
          const arrow = inst.change > 0 ? '▵' : inst.change < 0 ? '▿' : ''
          const urlSymbol = inst.symbol.replace(/\//g, '')
          
          return (
            <Link
              key={inst.symbol}
              href={`/markets/${urlSymbol}`}
              style={{
                width: '180px',
                height: '100px',
                flexShrink: 0,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                transition: 'background 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)'
              }}
            >
              {/* Symbol */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em',
                  marginBottom: '6px'
                }}
              >
                {inst.symbol}
              </span>

              {/* Value */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom: '4px'
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
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom: '8px'
                }}
              >
                {arrow} {formatChangePct(inst.changePct)}
              </span>

              {/* Mini sparkline */}
              <div style={{ height: '18px', width: '100%' }}>
                <Sparklines data={inst.sparklineData} width={156} height={18} margin={0}>
                  <SparklinesLine
                    color={getPriceColor(inst.change)}
                    style={{ strokeWidth: 1.5, fill: 'none' }}
                  />
                </Sparklines>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
