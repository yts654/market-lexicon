// ─────────────────────────────────────────────────────────────────────────────
// Educational Content for Each Instrument
// ─────────────────────────────────────────────────────────────────────────────

export interface InstrumentEducation {
  definition: string
  calculation: string
  drivers: string
  interpretation: string
}

export const INSTRUMENT_EDUCATION: Record<string, InstrumentEducation> = {
  'NKY': {
    definition: "The Nikkei 225 is Japan's most-cited stock index, representing 225 leading companies on the Tokyo Stock Exchange Prime Market. Selected by Nihon Keizai Shimbun (Japan's Financial Times equivalent), it serves as the country's most visible economic barometer.",
    calculation: "Unlike most modern indexes, the Nikkei uses a price-weighted average — it sums the prices of all 225 stocks and divides by a special divisor that adjusts for stock splits and constituent changes. This means high-priced stocks like Fast Retailing (Uniqlo) and Tokyo Electron exert outsized influence, regardless of their actual company size.",
    drivers: "Short-term moves are dominated by the handful of high-priced stocks. Medium-term, currency matters enormously: a weaker yen lifts export-heavy constituents. Macro-level drivers include Bank of Japan policy, US market direction, semiconductor cycles, China's economic health, and geopolitical events affecting trade.",
    interpretation: "A rising Nikkei is often interpreted as Japanese economic strength, but this can mislead. A surge driven by a few price-heavy tech stocks doesn't necessarily mean broad economic health — for that, compare with TOPIX. The NT Ratio (Nikkei ÷ TOPIX) reveals whether gains are concentrated in mega-caps or broadly distributed."
  },
  'TPX': {
    definition: "TOPIX, the Tokyo Stock Price Index, tracks roughly 2,100 stocks on the Tokyo Stock Exchange Prime Market — far broader than the Nikkei 225's 225 names. It represents the most comprehensive view of Japanese equities available.",
    calculation: "TOPIX uses float-adjusted market capitalization weighting — the global standard. Each company's weight reflects its actual market value times the proportion of shares freely traded. Toyota Motor's influence dwarfs that of smaller constituents in proportion to its size.",
    drivers: "TOPIX moves with the same broad factors as the Nikkei, but its composition gives it different sensitivities. Banking stocks (heavily weighted in TOPIX, lightly in Nikkei) make TOPIX more responsive to BOJ rate decisions. Real estate, internal services, and industrial sectors also have larger voices here.",
    interpretation: "TOPIX is a more honest reflection of Japan's actual economy than the Nikkei. When TOPIX rises but the Nikkei rises more, capital is concentrating in tech mega-caps. When TOPIX outperforms the Nikkei, gains are broader-based — typically a healthier signal for the underlying economy."
  },
  'HSI': {
    definition: "The Hang Seng Index tracks roughly 80 of the largest, most liquid stocks listed on the Hong Kong Stock Exchange. It includes major Chinese tech (Tencent, Alibaba), banks (HSBC), and insurers (AIA) — making it less a pure Hong Kong index and more a window into China-exposed multinationals.",
    calculation: "Float-adjusted market-cap weighted with individual stock caps to prevent any one name from dominating. The methodology is similar to TOPIX, but with caps that give a more balanced exposure.",
    drivers: "Hang Seng's primary driver is Chinese economic policy and sentiment. Beijing's regulatory crackdowns (especially on tech in 2021-2022), property market interventions, and PBOC monetary policy directly shape the index. US-China relations, especially around tech sanctions and trade, also weigh heavily.",
    interpretation: "A weakening Hang Seng often signals stress in China's economy or policy uncertainty. A rising Hang Seng can mean China stimulus expectations, easing regulatory pressure, or improving cross-strait political conditions. For Japan-focused investors, Hang Seng strength often correlates with risk-on sentiment that lifts Japanese exporters."
  },
  'SPX': {
    definition: "The Standard & Poor's 500 represents 500 of the largest US companies, selected by an index committee for liquidity, profitability, and US-economy representativeness. It's the world's most influential equity index — the de facto \"stock market\" in financial discourse.",
    calculation: "Float-adjusted market-cap weighted, but with a critical caveat: the top 7-10 mega-cap technology stocks (Apple, Microsoft, Nvidia, Amazon, Alphabet, Meta, Tesla) often constitute 30%+ of the index. Their movements dominate.",
    drivers: "Every major macro variable matters: Fed policy, corporate earnings, inflation data (CPI/PCE), employment reports, geopolitical risk, oil prices, dollar strength, long-term yields. In recent years, AI-related capital expenditure cycles have become a primary driver of mega-cap performance.",
    interpretation: "The S&P 500 is the global proxy for risk-asset sentiment. A rising S&P typically coincides with risk-on conditions worldwide — emerging markets, credit, commodities, and crypto all tend to follow. Japanese equities, especially exporters, react strongly to overnight S&P moves."
  },
  'IXIC': {
    definition: "The NASDAQ Composite includes all common stocks listed on the NASDAQ exchange — about 3,000 names, but heavily concentrated in technology. Apple, Microsoft, and Nvidia alone can constitute 25%+ of the index value.",
    calculation: "Pure market-cap weighted, with no sector cap. This makes the NASDAQ effectively a tech mega-cap index in practice, even though its formal definition is broader.",
    drivers: "The NASDAQ's defining sensitivity is to long-term interest rates. Tech valuations rest on distant future earnings, which get discounted by the long bond yield. When yields rise, NASDAQ falls disproportionately. Other drivers: AI capex cycles, semiconductor demand, regulatory changes, IPO market health.",
    interpretation: "NASDAQ outperforming the S&P 500 signals growth-stock leadership and easy financial conditions. NASDAQ underperforming signals rate concerns, regulatory headwinds, or rotation away from growth. For Japanese semiconductor names (Tokyo Electron, Advantest), NASDAQ correlation is high."
  },
  'DJI': {
    definition: "The oldest US stock index, created in 1896 by Charles Dow. Just 30 large American companies representing major sectors — though these days, \"industrial\" is a misnomer, with healthcare, finance, and tech now well represented alongside traditional industry.",
    calculation: "Price-weighted, like the Nikkei. The 30 stock prices are summed and divided by a special divisor. This means a higher-priced stock like UnitedHealth has more index influence than Apple, despite Apple having a vastly larger company size.",
    drivers: "Drivers overlap with the S&P, but DJI's industrial and consumer staples tilt makes it more sensitive to traditional economic cycles, ISM manufacturing data, oil prices, and capital expenditure trends. Mega-cap tech has less voice here.",
    interpretation: "The Dow's symbolic role exceeds its analytical value. When financial media reports \"the stock market hit a record,\" they usually mean the Dow — but professionals prefer the S&P. A diverging Dow (down) and S&P (up) suggests legacy economy weakness masked by tech strength."
  },
  'UKX': {
    definition: "The FTSE 100 tracks the 100 largest companies listed on the London Stock Exchange. Despite being the UK's flagship index, its constituents (HSBC, Shell, BP, AstraZeneca, GSK, Unilever) earn 70%+ of revenue outside the UK. It's globally exposed.",
    calculation: "Float-adjusted market-cap weighted — the modern standard methodology.",
    drivers: "Counter-intuitively, FTSE 100 often rises when the pound falls. Because constituents earn in dollars and euros, sterling weakness inflates their reported earnings. Other drivers: oil prices (large energy exposure), commodities broadly (mining giants), pharmaceutical regulation, and global consumer trends.",
    interpretation: "FTSE 100 is best read as \"London-listed global multinationals\" rather than \"UK economy.\" A strong FTSE during a weak pound period typically reflects commodity strength or weak GBP boosting earnings. Less direct correlation with Japan, but moves with global risk sentiment."
  },
  'DAX': {
    definition: "The DAX tracks 40 leading companies on the Frankfurt Stock Exchange, anchoring German and broader Eurozone equity markets. Constituents include Siemens, SAP, Allianz, Mercedes-Benz, and BMW.",
    calculation: "Market-cap weighted, but with a unique twist: the DAX is a total-return index by default, meaning it assumes dividend reinvestment. This causes the DAX to appear higher than price-only indexes over time — important context when comparing.",
    drivers: "DAX is a global manufacturing barometer. China's economic conditions hit Germany's auto exports directly. Euro strength erodes export competitiveness. ECB policy, German energy prices (heightened post-2022), and EU political stability all matter.",
    interpretation: "DAX outperforming S&P often signals improving global manufacturing and Chinese demand. A weak DAX suggests European structural problems, manufacturing slowdown, or Chinese economic weakness. Japanese capital goods makers and auto-related stocks correlate with DAX moves."
  },
  'USD/JPY': {
    definition: "USD/JPY shows how many yen one US dollar buys. It's the most important currency rate for Japan's economy, affecting export competitiveness, import costs, household purchasing power, and Bank of Japan policy.",
    calculation: "As a free-floating exchange rate, USD/JPY is determined by 24-hour global trading across Tokyo, London, and New York markets. There's no single calculation — it's the live equilibrium of millions of buy/sell orders.",
    drivers: "The dominant driver is the US-Japan interest rate differential. Higher US rates relative to Japanese rates attract capital to dollars, pushing USD/JPY up. Risk sentiment matters too: in market panics, yen tends to strengthen as a safe haven, reversing carry trades. Japan's chronic energy import deficit also creates structural yen-selling pressure.",
    interpretation: "A rising USD/JPY (yen weakening) generally helps Japanese exporters (Toyota, Sony) by inflating their dollar-earned revenue when converted back. But it raises import costs, fuels inflation, and pressures household budgets. Sharp moves can trigger Bank of Japan or Ministry of Finance intervention."
  },
  'EUR/JPY': {
    definition: "EUR/JPY is a cross rate — calculated indirectly through EUR/USD and USD/JPY rather than traded directly between euros and yen. It shows how many yen one euro buys.",
    calculation: "Mathematically, EUR/JPY = EUR/USD × USD/JPY. Both component pairs contribute to its movement; understanding EUR/JPY requires watching both.",
    drivers: "Drivers include ECB policy, Eurozone inflation and growth, Bank of Japan policy, and Japan-Eurozone yield differentials. Carry trades — borrowing yen to invest in higher-yielding euro assets — amplify movements during risk-on periods.",
    interpretation: "EUR/JPY often serves as a global risk sentiment proxy. Rising EUR/JPY suggests risk-on (yen sold for higher-yielding euro). Falling EUR/JPY signals risk-off, with yen safe-haven buying. Japanese exporters to Europe (auto, machinery) are particularly sensitive to EUR/JPY levels."
  },
  'EUR/USD': {
    definition: "EUR/USD is the world's most-traded currency pair, with daily volume in the trillions of dollars. It represents the relative value of the euro versus the dollar — the two most important reserve currencies.",
    calculation: "Determined by 24-hour global trading. The price 1.0726 means one euro buys 1.0726 dollars.",
    drivers: "The primary driver is the ECB-Fed policy differential. When the Fed is more hawkish than the ECB, dollars strengthen (EUR/USD falls). Other drivers: relative inflation rates, US-Eurozone yield differentials (especially 10Y Bund vs. 10Y Treasury), energy prices (Eurozone is energy-importing), and political stability in either bloc.",
    interpretation: "EUR/USD movements transmit globally through the dollar's reserve status. A falling EUR/USD typically means broad dollar strength, which pressures emerging markets, commodities, and the yen. Rising EUR/USD usually means dollar weakness benefiting risk assets globally."
  },
  'GBP/JPY': {
    definition: "GBP/JPY shows how many yen one British pound buys. Among traders, it's notorious — nicknamed \"The Widow Maker\" for its high volatility that has caused significant losses to over-leveraged retail traders.",
    calculation: "Like other JPY crosses, GBP/JPY = GBP/USD × USD/JPY. The pound's high volatility relative to the yen makes this cross particularly active.",
    drivers: "Drivers include Bank of England policy, UK inflation and GDP, North Sea oil prices, UK political events (Brexit, leadership changes), and BOJ-BOE rate differentials. The pound has sharper short-term swings than the dollar or euro.",
    interpretation: "GBP/JPY rallies signal strong risk-on sentiment combined with sterling strength. Sharp drops can reflect UK-specific shocks or global risk-off events with safe-haven yen buying. Statistics show GBP/JPY is the highest-loss currency pair for Japanese retail traders — informative for study, dangerous for trading without experience."
  },
  'WTI': {
    definition: "WTI is American crude oil, futures-traded on NYMEX (New York Mercantile Exchange). Along with Brent (North Sea), it's one of two global benchmark grades. The price quoted is per 42-gallon barrel.",
    calculation: "Reported \"WTI price\" is actually the front-month futures contract price — the contract closest to delivery. Physical delivery happens at Cushing, Oklahoma, whose storage capacity creates region-specific price effects.",
    drivers: "Supply drivers: OPEC+ production decisions, US shale output, geopolitical events (Middle East, Russia/Ukraine, Iran sanctions), natural disasters. Demand drivers: global growth (especially China and India industrial activity), US summer driving season, European winter heating, EV transition pace. Macro: dollar strength (oil priced in dollars), real interest rates.",
    interpretation: "Rising WTI signals strong demand, geopolitical tension, or supply constraints — all inflationary for the global economy. Falling WTI signals demand weakness, oversupply, or recession fears — disinflationary. For Japan, oil is a near-total import — high oil prices worsen the trade balance, pressure corporate margins, fuel consumer inflation, and weaken the yen."
  },
  'GOLD': {
    definition: "Gold price is shown as XAU/USD — the dollar value of one troy ounce (about 31.1 grams). Unlike industrial commodities, gold serves primarily as a store of value, with industrial use representing only about 10% of demand.",
    calculation: "Spot gold price reflects the global wholesale market for physical gold, traded continuously across London, New York, and other centers. Gold has no yield, dividend, or earnings — its value derives purely from market consensus.",
    drivers: "The single most important driver is real US interest rates (nominal yield minus inflation expectations). Holding gold means foregoing the interest you could earn elsewhere — when real rates are low or negative, gold becomes more attractive. Other drivers: dollar strength (inverse), geopolitical risk, central bank purchases (China, Russia, India have been heavy buyers since 2020), inflation expectations.",
    interpretation: "Rising gold during broad market panic signals genuine systemic concern. Gold rising while real yields rise is unusual and often reflects central bank buying or geopolitical fear. For Japanese investors, yen weakness amplifies gold's yen-denominated returns — a double tailwind during yen-weakening cycles."
  },
  'US10Y': {
    definition: "The yield on the US Treasury's 10-year benchmark bond serves as the global \"risk-free rate\" — the foundation for pricing nearly every other financial asset, from mortgages to corporate bonds to equities.",
    calculation: "Yield and price move inversely. When US Treasuries are sold (price falls), yields rise. The yield represents the annualized return an investor earns by buying the bond at current price and holding to maturity. The market constantly recalibrates this through trading.",
    drivers: "Short-term: Federal Reserve policy expectations dominate. Medium-term: inflation expectations are critical (since investors won't lend below expected inflation rates). Long-term: US fiscal deficit, foreign holdings (especially Japan and China), and confidence in the dollar reserve system matter.",
    interpretation: "Rising US10Y pressures equity valuations (especially tech), tightens financial conditions, raises mortgage rates, and strengthens the dollar. The 2Y-10Y yield curve spread (when 2Y exceeds 10Y) has historically preceded recessions. For Japan: rising US10Y widens the US-Japan rate gap, weakening yen and lifting Japanese exporter stocks."
  },
  'JP10Y': {
    definition: "The yield on Japan's 10-year JGB (Japanese Government Bond) serves as Japan's long-term interest rate benchmark. For decades, this yield was artificially suppressed by Bank of Japan policy.",
    calculation: "Same inverse relationship with bond price as US Treasuries. Until 2024, the BOJ controlled this yield through Yield Curve Control (YCC), a policy that capped the 10Y rate near zero. YCC was abandoned in March 2024, and yields have since moved freely with market forces.",
    drivers: "Drivers now include BOJ policy expectations (especially short-rate hikes), Japanese inflation (running near 2%), Japan's fiscal position (public debt over 250% of GDP), global yield trends (especially US10Y), and risk sentiment.",
    interpretation: "Rising JP10Y signals Japan's regime shift from deflation to inflation, from zero-rates to normal-rate environment. Rising JGB yields tighten conditions for Japanese borrowers (mortgages, corporate loans), boost bank profitability (wider deposit-loan spreads), pressure the yen higher, and ultimately reflect economic transformation. For students of macro: JP10Y is the cleanest indicator of Japan's structural change."
  }
}

// Related instruments mapping
export const RELATED_INSTRUMENTS: Record<string, string[]> = {
  'NKY': ['TPX', 'USD/JPY', 'SPX'],
  'TPX': ['NKY', 'USD/JPY', 'JP10Y'],
  'HSI': ['NKY', 'SPX', 'EUR/JPY'],
  'SPX': ['IXIC', 'DJI', 'US10Y'],
  'IXIC': ['SPX', 'DJI', 'US10Y'],
  'DJI': ['SPX', 'IXIC', 'WTI'],
  'UKX': ['DAX', 'GBP/JPY', 'WTI'],
  'DAX': ['UKX', 'EUR/USD', 'SPX'],
  'USD/JPY': ['NKY', 'US10Y', 'JP10Y'],
  'EUR/JPY': ['USD/JPY', 'EUR/USD', 'NKY'],
  'EUR/USD': ['USD/JPY', 'GBP/JPY', 'GOLD'],
  'GBP/JPY': ['USD/JPY', 'EUR/JPY', 'UKX'],
  'WTI': ['GOLD', 'USD/JPY', 'SPX'],
  'GOLD': ['US10Y', 'USD/JPY', 'WTI'],
  'US10Y': ['JP10Y', 'USD/JPY', 'SPX'],
  'JP10Y': ['US10Y', 'USD/JPY', 'NKY']
}

export function getRelatedInstruments(symbol: string): string[] {
  return RELATED_INSTRUMENTS[symbol] || ['NKY', 'SPX', 'USD/JPY']
}
