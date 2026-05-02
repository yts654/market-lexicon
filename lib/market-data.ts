// ─────────────────────────────────────────────────────────────────────────────
// Market Data Types & Mock Data for MARKET LEXICON Bloomberg Terminal
// ─────────────────────────────────────────────────────────────────────────────

export type AssetClass = 'EQ' | 'FX' | 'CMDTY' | 'RATES'
export type Region = 'JP' | 'US' | 'HK' | 'UK' | 'DE' | 'KR' | 'GLOBAL'
export type PriceColorMode = 'jp' | 'en'

export interface Candle {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Instrument {
  symbol: string
  name: string
  nameJa: string
  assetClass: AssetClass
  region: Region
  flag: string
  value: number
  change: number
  changePct: number
  open: number
  high: number
  low: number
  prevClose: number
  week52High: number
  week52Low: number
  volume: number
  avgVolume: number
  sparklineData: number[]
  candles: Candle[]
  asOf: string
  exchange: string
  delayMinutes: number
  decimals: number
  isYield: boolean
}

// Seeded pseudo-random for deterministic sparkline generation
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

// Generate deterministic sparkline data with directional bias
function generateSparkline(baseValue: number, changePct: number, seed: number): number[] {
  const random = seededRandom(seed)
  const points: number[] = []
  const direction = changePct >= 0 ? 1 : -1
  let current = baseValue * (1 - Math.abs(changePct) / 100 * 0.8)
  
  for (let i = 0; i < 24; i++) {
    const noise = (random() - 0.5) * baseValue * 0.002
    const trend = direction * (baseValue * Math.abs(changePct) / 100 / 24) * (0.8 + random() * 0.4)
    current += trend + noise
    points.push(current)
  }
  return points
}

// Generate deterministic OHLC candles
function generateCandles(baseValue: number, decimals: number, seed: number): Candle[] {
  const random = seededRandom(seed)
  const candles: Candle[] = []
  let current = baseValue * (0.97 + random() * 0.03)
  const atr = baseValue * 0.008 // Average true range ~0.8%
  
  // Use fixed base date for SSR consistency
  const baseDate = new Date('2026-05-02')
  for (let i = 99; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)
    
    const volatility = atr * (0.5 + random())
    const direction = random() > 0.5 ? 1 : -1
    const bodySize = volatility * (0.3 + random() * 0.5)
    
    const open = current
    const close = open + direction * bodySize
    const high = Math.max(open, close) + volatility * random() * 0.5
    const low = Math.min(open, close) - volatility * random() * 0.5
    
    candles.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(decimals)),
      high: parseFloat(high.toFixed(decimals)),
      low: parseFloat(low.toFixed(decimals)),
      close: parseFloat(close.toFixed(decimals)),
      volume: Math.floor(random() * 1000000000) + 100000000
    })
    
    current = close
  }
  return candles
}

export const MOCK_INSTRUMENTS: Instrument[] = [
  // Asia Equities (3)
  {
    symbol: 'NKY',
    name: 'Nikkei 225 Stock Average',
    nameJa: '日経平均株価',
    assetClass: 'EQ',
    region: 'JP',
    flag: '🇯🇵',
    value: 59652.81,
    change: 367.89,
    changePct: 0.62,
    open: 59284.92,
    high: 59812.45,
    low: 59142.33,
    prevClose: 59284.92,
    week52High: 62154.32,
    week52Low: 48291.66,
    volume: 1823456000,
    avgVolume: 1542000000,
    sparklineData: generateSparkline(59652.81, 0.62, 1001),
    candles: generateCandles(59652.81, 2, 2001),
    asOf: '16:30:42 JST',
    exchange: 'OSAKA EXCHANGE',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'TPX',
    name: 'TOPIX Index',
    nameJa: '東証株価指数',
    assetClass: 'EQ',
    region: 'JP',
    flag: '🇯🇵',
    value: 4123.55,
    change: -2.41,
    changePct: -0.06,
    open: 4125.96,
    high: 4142.18,
    low: 4112.89,
    prevClose: 4125.96,
    week52High: 4298.44,
    week52Low: 3345.12,
    volume: 892345000,
    avgVolume: 756000000,
    sparklineData: generateSparkline(4123.55, -0.06, 1002),
    candles: generateCandles(4123.55, 2, 2002),
    asOf: '16:30:42 JST',
    exchange: 'TOKYO STOCK EXCHANGE',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'HSI',
    name: 'Hang Seng Index',
    nameJa: 'ハンセン指数',
    assetClass: 'EQ',
    region: 'HK',
    flag: '🇭🇰',
    value: 25776.53,
    change: -334.20,
    changePct: -1.28,
    open: 26110.73,
    high: 26223.45,
    low: 25654.12,
    prevClose: 26110.73,
    week52High: 28945.67,
    week52Low: 22134.89,
    volume: 2145678000,
    avgVolume: 1890000000,
    sparklineData: generateSparkline(25776.53, -1.28, 1003),
    candles: generateCandles(25776.53, 2, 2003),
    asOf: '17:00:00 HKT',
    exchange: 'HONG KONG EXCHANGE',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  // US/EU Equities (5)
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    nameJa: 'S&P500種指数',
    assetClass: 'EQ',
    region: 'US',
    flag: '🇺🇸',
    value: 7209.01,
    change: 72.95,
    changePct: 1.02,
    open: 7136.06,
    high: 7234.88,
    low: 7112.45,
    prevClose: 7136.06,
    week52High: 7456.32,
    week52Low: 5678.91,
    volume: 3456789000,
    avgVolume: 2890000000,
    sparklineData: generateSparkline(7209.01, 1.02, 1004),
    candles: generateCandles(7209.01, 2, 2004),
    asOf: '16:00:00 EST',
    exchange: 'NYSE',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'IXIC',
    name: 'NASDAQ Composite',
    nameJa: 'ナスダック総合指数',
    assetClass: 'EQ',
    region: 'US',
    flag: '🇺🇸',
    value: 24892.31,
    change: 219.67,
    changePct: 0.89,
    open: 24672.64,
    high: 24989.45,
    low: 24598.12,
    prevClose: 24672.64,
    week52High: 25678.91,
    week52Low: 18234.56,
    volume: 4567890000,
    avgVolume: 3890000000,
    sparklineData: generateSparkline(24892.31, 0.89, 1005),
    candles: generateCandles(24892.31, 2, 2005),
    asOf: '16:00:00 EST',
    exchange: 'NASDAQ',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones Industrial Average',
    nameJa: 'ダウ工業株30種',
    assetClass: 'EQ',
    region: 'US',
    flag: '🇺🇸',
    value: 49652.14,
    change: 792.67,
    changePct: 1.62,
    open: 48859.47,
    high: 49823.89,
    low: 48712.34,
    prevClose: 48859.47,
    week52High: 51234.56,
    week52Low: 38976.21,
    volume: 567890000,
    avgVolume: 489000000,
    sparklineData: generateSparkline(49652.14, 1.62, 1006),
    candles: generateCandles(49652.14, 2, 2006),
    asOf: '16:00:00 EST',
    exchange: 'NYSE',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'UKX',
    name: 'FTSE 100 Index',
    nameJa: 'FTSE100種指数',
    assetClass: 'EQ',
    region: 'UK',
    flag: '🇬🇧',
    value: 8520.10,
    change: 17.85,
    changePct: 0.21,
    open: 8502.25,
    high: 8545.67,
    low: 8478.91,
    prevClose: 8502.25,
    week52High: 8876.43,
    week52Low: 7234.56,
    volume: 678901000,
    avgVolume: 589000000,
    sparklineData: generateSparkline(8520.10, 0.21, 1007),
    candles: generateCandles(8520.10, 2, 2007),
    asOf: '17:30:00 GMT',
    exchange: 'LONDON STOCK EXCHANGE',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'DAX',
    name: 'DAX Index',
    nameJa: 'ドイツDAX指数',
    assetClass: 'EQ',
    region: 'DE',
    flag: '🇩🇪',
    value: 24292.38,
    change: 337.67,
    changePct: 1.41,
    open: 23954.71,
    high: 24356.78,
    low: 23876.45,
    prevClose: 23954.71,
    week52High: 25123.45,
    week52Low: 18765.43,
    volume: 456789000,
    avgVolume: 389000000,
    sparklineData: generateSparkline(24292.38, 1.41, 1008),
    candles: generateCandles(24292.38, 2, 2008),
    asOf: '18:30:00 CET',
    exchange: 'XETRA',
    delayMinutes: 15,
    decimals: 2,
    isYield: false
  },
  // FX (4)
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    nameJa: '米ドル/円',
    assetClass: 'FX',
    region: 'GLOBAL',
    flag: '🌐',
    value: 156.84,
    change: -0.45,
    changePct: -0.29,
    open: 157.29,
    high: 157.56,
    low: 156.42,
    prevClose: 157.29,
    week52High: 161.95,
    week52Low: 140.25,
    volume: 0,
    avgVolume: 0,
    sparklineData: generateSparkline(156.84, -0.29, 1009),
    candles: generateCandles(156.84, 2, 2009),
    asOf: '05:00:00 UTC',
    exchange: 'INTERBANK',
    delayMinutes: 0,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'EUR/JPY',
    name: 'Euro / Japanese Yen',
    nameJa: 'ユーロ/円',
    assetClass: 'FX',
    region: 'GLOBAL',
    flag: '🌐',
    value: 168.22,
    change: -0.18,
    changePct: -0.11,
    open: 168.40,
    high: 168.89,
    low: 167.95,
    prevClose: 168.40,
    week52High: 175.42,
    week52Low: 154.78,
    volume: 0,
    avgVolume: 0,
    sparklineData: generateSparkline(168.22, -0.11, 1010),
    candles: generateCandles(168.22, 2, 2010),
    asOf: '05:00:00 UTC',
    exchange: 'INTERBANK',
    delayMinutes: 0,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    nameJa: 'ユーロ/ドル',
    assetClass: 'FX',
    region: 'GLOBAL',
    flag: '🌐',
    value: 1.0726,
    change: 0.0019,
    changePct: 0.18,
    open: 1.0707,
    high: 1.0742,
    low: 1.0689,
    prevClose: 1.0707,
    week52High: 1.1234,
    week52Low: 1.0234,
    volume: 0,
    avgVolume: 0,
    sparklineData: generateSparkline(1.0726, 0.18, 1011),
    candles: generateCandles(1.0726, 4, 2011),
    asOf: '05:00:00 UTC',
    exchange: 'INTERBANK',
    delayMinutes: 0,
    decimals: 4,
    isYield: false
  },
  {
    symbol: 'GBP/JPY',
    name: 'British Pound / Japanese Yen',
    nameJa: '英ポンド/円',
    assetClass: 'FX',
    region: 'GLOBAL',
    flag: '🌐',
    value: 196.55,
    change: 0.41,
    changePct: 0.21,
    open: 196.14,
    high: 197.12,
    low: 195.78,
    prevClose: 196.14,
    week52High: 204.56,
    week52Low: 178.34,
    volume: 0,
    avgVolume: 0,
    sparklineData: generateSparkline(196.55, 0.21, 1012),
    candles: generateCandles(196.55, 2, 2012),
    asOf: '05:00:00 UTC',
    exchange: 'INTERBANK',
    delayMinutes: 0,
    decimals: 2,
    isYield: false
  },
  // Commodities (2)
  {
    symbol: 'WTI',
    name: 'WTI Crude Oil',
    nameJa: 'WTI原油先物',
    assetClass: 'CMDTY',
    region: 'GLOBAL',
    flag: '🛢️',
    value: 105.45,
    change: 0.38,
    changePct: 0.36,
    open: 105.07,
    high: 106.23,
    low: 104.56,
    prevClose: 105.07,
    week52High: 123.45,
    week52Low: 67.89,
    volume: 456789,
    avgVolume: 389000,
    sparklineData: generateSparkline(105.45, 0.36, 1013),
    candles: generateCandles(105.45, 2, 2013),
    asOf: '14:30:00 EST',
    exchange: 'NYMEX',
    delayMinutes: 10,
    decimals: 2,
    isYield: false
  },
  {
    symbol: 'GOLD',
    name: 'Gold Spot',
    nameJa: '金スポット',
    assetClass: 'CMDTY',
    region: 'GLOBAL',
    flag: '🥇',
    value: 4626.64,
    change: 4.86,
    changePct: 0.11,
    open: 4621.78,
    high: 4645.32,
    low: 4612.45,
    prevClose: 4621.78,
    week52High: 4892.34,
    week52Low: 3234.56,
    volume: 234567,
    avgVolume: 198000,
    sparklineData: generateSparkline(4626.64, 0.11, 1014),
    candles: generateCandles(4626.64, 2, 2014),
    asOf: '14:30:00 EST',
    exchange: 'COMEX',
    delayMinutes: 10,
    decimals: 2,
    isYield: false
  },
  // Rates (2)
  {
    symbol: 'US10Y',
    name: 'US 10-Year Treasury Yield',
    nameJa: '米国10年債利回り',
    assetClass: 'RATES',
    region: 'US',
    flag: '🇺🇸',
    value: 4.412,
    change: 0.018,
    changePct: 0.41,
    open: 4.394,
    high: 4.425,
    low: 4.378,
    prevClose: 4.394,
    week52High: 5.012,
    week52Low: 3.456,
    volume: 0,
    avgVolume: 0,
    sparklineData: generateSparkline(4.412, 0.41, 1015),
    candles: generateCandles(4.412, 3, 2015),
    asOf: '16:00:00 EST',
    exchange: 'US TREASURY',
    delayMinutes: 0,
    decimals: 3,
    isYield: true
  },
  {
    symbol: 'JP10Y',
    name: 'Japan 10-Year Government Bond Yield',
    nameJa: '日本10年国債利回り',
    assetClass: 'RATES',
    region: 'JP',
    flag: '🇯🇵',
    value: 1.512,
    change: -0.022,
    changePct: -1.43,
    open: 1.534,
    high: 1.542,
    low: 1.498,
    prevClose: 1.534,
    week52High: 1.856,
    week52Low: 0.845,
    volume: 0,
    avgVolume: 0,
    sparklineData: generateSparkline(1.512, -1.43, 1016),
    candles: generateCandles(1.512, 3, 2016),
    asOf: '16:30:00 JST',
    exchange: 'JAPAN BOND MARKET',
    delayMinutes: 0,
    decimals: 3,
    isYield: true
  }
]

// Helper to format numbers with proper decimals and grouping
export function formatValue(value: number, decimals: number, isYield: boolean = false): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
  return isYield ? `${formatted}%` : formatted
}

// Helper to format change with sign
export function formatChange(change: number, decimals: number, isYield: boolean = false): string {
  const sign = change >= 0 ? '+' : ''
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(Math.abs(change))
  return isYield ? `${sign}${change >= 0 ? '' : '-'}${formatted}` : `${sign}${formatted}`
}

// Helper to format percent change
export function formatChangePct(changePct: number): string {
  const sign = changePct >= 0 ? '+' : ''
  return `(${sign}${changePct.toFixed(2)}%)`
}

// Get arrow symbol
export function getArrow(change: number): string {
  if (change > 0) return '▲'
  if (change < 0) return '▼'
  return '–'
}

// Market status
export function getMarketStatus(): { isOpen: boolean; label: string } {
  const now = new Date()
  const jstHour = (now.getUTCHours() + 9) % 24
  const isWeekday = now.getDay() > 0 && now.getDay() < 6
  const isOpen = isWeekday && jstHour >= 9 && jstHour < 15
  return {
    isOpen,
    label: isOpen ? 'MKT OPEN' : 'MKT CLOSED'
  }
}

// Timeframe labels
export const TIMEFRAMES = [
  { en: '1D', ja: '1日' },
  { en: '1W', ja: '1週間' },
  { en: '1M', ja: '1ヵ月' },
  { en: '3M', ja: '3ヵ月' },
  { en: '6M', ja: '6ヵ月' },
  { en: '1Y', ja: '1年' },
  { en: '5Y', ja: '5年' }
] as const

// Asset class filter options
export const ASSET_FILTERS = ['ALL', 'EQ', 'FX', 'CMDTY', 'RATES'] as const
export type AssetFilter = typeof ASSET_FILTERS[number]
