// ─────────────────────────────────────────────────────────────────────────────
// Educational Content for Each Instrument (Bilingual: EN + JP)
// ─────────────────────────────────────────────────────────────────────────────

import type { Language } from './i18n'

export interface InstrumentEducation {
  definition: string
  calculation: string
  drivers: string
  interpretation: string
}

// ─── Section heading labels ───
export const EDUCATION_SECTION_LABELS = {
  definition: { en: 'Definition', jp: '定義' },
  calculation: { en: "How It's Calculated", jp: '計算方法' },
  drivers: { en: 'What Moves It', jp: '値動きの要因' },
  interpretation: { en: 'What It Tells You', jp: '読み解き方' },
} as const

const EN: Record<string, InstrumentEducation> = {
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

const JP: Record<string, InstrumentEducation> = {
  'NKY': {
    definition: '日経平均株価（日経225）は日本で最も参照される株価指数で、東京証券取引所プライム市場上場の代表的な225銘柄で構成されます。日本経済新聞社（日本における Financial Times に相当）が銘柄を選定しており、日本経済の代表的なバロメーターとして機能しています。',
    calculation: '近年の主流指数と異なり、日経平均は「株価平均型（プライスウエイト方式）」で算出されます。225銘柄の株価を合計し、株式分割や銘柄入替を調整する除数で割って算出します。このため、ファーストリテイリング（ユニクロ）や東京エレクトロンといった値嵩株が、企業規模に関わらず指数に大きな影響を与えます。',
    drivers: '短期的には少数の値嵩株の動きに支配されます。中期的には為替が極めて重要で、円安は輸出関連銘柄を押し上げます。マクロ要因としては日銀の金融政策、米国市場の方向性、半導体サイクル、中国経済、貿易に関わる地政学イベントなどが挙げられます。',
    interpretation: '日経平均の上昇は「日本経済の強さ」と解釈されがちですが、誤解を招くこともあります。一部の値嵩テック株主導の上昇は、必ずしも経済全体の好調を意味しません。それを判断するにはTOPIXとの比較が有効です。NTレシオ（日経 ÷ TOPIX）は、上昇が大型株偏重か全体に広がっているかを示します。',
  },
  'TPX': {
    definition: 'TOPIX（東証株価指数）は東京証券取引所プライム市場上場の約2,100銘柄を対象とする指数で、225銘柄の日経平均よりはるかに広範です。日本株式市場全体を最も包括的に捉える指標です。',
    calculation: 'TOPIXは「浮動株調整後の時価総額加重型」で、世界標準の方式です。各企業の構成比は実質的な時価総額（市場価値 × 浮動株比率）に応じて決まります。トヨタ自動車のような大企業の影響力は、規模に比例して中小型銘柄を圧倒的に上回ります。',
    drivers: 'TOPIXは日経平均と同じマクロ要因で動きますが、構成銘柄が異なるため感応度も変わります。銀行株（TOPIXでは比率が高く日経平均では低い）の存在により、TOPIXは日銀の金利決定により敏感に反応します。不動産、内需サービス、製造業セクターの影響もこちらの方が大きくなります。',
    interpretation: 'TOPIXは日経平均より日本経済の実態を素直に反映します。TOPIXが上昇しつつ日経平均がより大きく上昇する局面では、テック大型株への資金集中が起きています。一方、TOPIXが日経を上回る場合は、上昇の裾野が広がっており、経済全体としては健全なシグナルとなります。',
  },
  'HSI': {
    definition: 'ハンセン指数は香港証券取引所に上場する大型・流動性の高い約80銘柄で構成されます。テンセント、アリババといった中国大手テック、HSBCなどの銀行、AIAなどの保険会社を含むため、純粋な香港の指数というより「中国エクスポージャーを持つ多国籍企業の窓口」と捉えるのが適切です。',
    calculation: '浮動株調整後の時価総額加重に加え、個別銘柄の構成比上限を設けて1銘柄の影響が過大にならないよう調整しています。手法はTOPIXに近いですが、上限設定によりよりバランスの取れたエクスポージャーとなります。',
    drivers: 'ハンセン指数の最大の駆動要因は中国の経済政策とセンチメントです。北京の規制強化（特に2021〜2022年のテック規制）、不動産市場への介入、人民銀行（PBOC）の金融政策が指数を直接形成します。米中関係（特にテック制裁・貿易）も大きく影響します。',
    interpretation: 'ハンセン指数の下落は、中国経済の悪化や政策不確実性を示すことが多いです。上昇の場合は中国の景気刺激策への期待、規制圧力の緩和、または地政学的環境の改善を反映します。日本投資家にとっては、ハンセン上昇は「リスクオン心理」と相関し、日本の輸出株を押し上げる傾向があります。',
  },
  'SPX': {
    definition: 'S&P 500は米国の代表的な大型株500銘柄で構成され、流動性、収益性、米国経済の代表性を基準にインデックス委員会が選定します。世界で最も影響力のある株価指数で、金融用語として「株式市場」と言えば事実上S&P 500を指します。',
    calculation: '浮動株調整後の時価総額加重ですが、重要な留意点があります。アップル、マイクロソフト、エヌビディア、アマゾン、アルファベット、メタ、テスラといった上位7〜10銘柄の大型テックが、しばしば指数全体の30%以上を占め、その動きが指数を支配します。',
    drivers: 'あらゆる主要マクロ要因が影響します。FRB政策、企業決算、インフレ指標（CPI/PCE）、雇用統計、地政学リスク、原油価格、ドルの強さ、長期金利。近年ではAI関連の設備投資サイクルが、大型株のパフォーマンスを左右する主要要因となっています。',
    interpretation: 'S&P 500はリスク資産センチメントの世界的な代理指標です。S&Pの上昇は通常、世界的なリスクオン環境と一致し、新興国株、クレジット、コモディティ、暗号資産も追随します。日本株、特に輸出株は前夜のS&Pの動きに強く反応します。',
  },
  'IXIC': {
    definition: 'ナスダック総合指数はナスダック上場の全普通株（約3,000銘柄）を対象としますが、構成は技術系に大きく偏重しています。アップル、マイクロソフト、エヌビディアの3社だけで指数価値の25%以上を占めることもあります。',
    calculation: '純粋な時価総額加重で、セクター上限はありません。これにより、定義上は広範な指数であっても、実質的にはテック大型株指数として機能します。',
    drivers: 'ナスダックの最大の感応要因は長期金利です。テック企業のバリュエーションは遠い将来の利益に依拠しており、長期国債利回りで割り引かれます。金利上昇局面ではナスダックは不釣合いに下落します。その他の要因として、AI設備投資サイクル、半導体需要、規制変更、IPO市場の活況度などが挙げられます。',
    interpretation: 'ナスダックがS&P 500を上回るパフォーマンスを示す場合、グロース株主導と緩和的な金融環境を意味します。逆に劣後する場合は金利懸念、規制圧力、グロースからの資金回避を示します。日本の半導体関連銘柄（東京エレクトロン、アドバンテスト等）はナスダックとの相関が高い銘柄群です。',
  },
  'DJI': {
    definition: '1896年にチャールズ・ダウが創設した米国最古の株価指数。米国の主要セクターを代表する大型30銘柄で構成されます。ただし「工業株（Industrial）」という名称は今や形骸化しており、伝統的な工業に加えヘルスケア、金融、テックも幅広く含まれています。',
    calculation: '日経平均と同様の株価平均型です。30銘柄の株価を合計し、特殊な除数で割って算出します。このためユナイテッドヘルスのような高株価銘柄が、企業規模ではるかに大きいアップルよりも指数への影響が大きくなります。',
    drivers: 'S&Pと共通する要因が多いものの、ダウは工業株・生活必需品株への偏りから、伝統的な景気循環、ISM製造業指数、原油価格、設備投資動向により敏感です。一方、大型テックの影響はS&Pより小さくなります。',
    interpretation: 'ダウの「象徴的役割」は分析価値を上回ります。金融メディアが「株式市場が史上最高値」と報じる際、通常はダウを指しますが、プロはS&Pを好みます。ダウ下落とS&P上昇が同時に起きる場合、テック株の強さが伝統経済の弱さを覆い隠している可能性を示唆します。',
  },
  'UKX': {
    definition: 'FTSE 100はロンドン証券取引所に上場する大型100銘柄で構成されます。英国の代表的指数ですが、構成銘柄（HSBC、シェル、BP、アストラゼネカ、GSK、ユニリーバ）の70%以上の収益が英国外で発生しており、グローバル展開色が強い指数です。',
    calculation: '浮動株調整後の時価総額加重型 — 現代の標準的な手法です。',
    drivers: '直感に反しますが、FTSE 100はポンド安の局面で上昇することがよくあります。構成銘柄がドル・ユーロで稼ぐため、ポンド安は本国換算後の決算数値を押し上げます。その他の要因として、原油価格（エネルギー比率の高さ）、コモディティ全般（鉱業大手）、製薬規制、グローバル消費トレンドなどがあります。',
    interpretation: 'FTSE 100は「英国経済」より「ロンドン上場のグローバル多国籍企業群」と捉える方が正確です。ポンド安局面でのFTSE上昇はコモディティ高や為替差益を反映するケースが多く、日本との直接的相関は低いものの、世界的なリスクセンチメントには連動します。',
  },
  'DAX': {
    definition: 'DAXはフランクフルト証券取引所に上場する代表的40銘柄で構成され、ドイツおよびユーロ圏全体の株式市場の中心的指標です。構成銘柄にはシーメンス、SAP、アリアンツ、メルセデス・ベンツ、BMWなどがあります。',
    calculation: '時価総額加重型ですが、特殊性があります。DAXはデフォルトで「トータルリターン型」のため、配当再投資を前提とします。これにより時間経過とともに価格指数より高い値となるため、他指数と比較する際は注意が必要です。',
    drivers: 'DAXは世界の製造業の温度計です。中国経済の状況はドイツの自動車輸出に直撃し、ユーロ高は輸出競争力を損ないます。ECBの政策、ドイツのエネルギー価格（2022年以降特に重要）、EUの政治的安定性すべてが影響します。',
    interpretation: 'DAXがS&Pを上回るパフォーマンスを示す場合、世界の製造業と中国需要の改善を示唆することが多いです。DAX低迷は欧州の構造的問題、製造業減速、または中国経済の弱さを反映します。日本の資本財メーカーや自動車関連株はDAXの動きと相関する傾向があります。',
  },
  'USD/JPY': {
    definition: 'USD/JPYは1米ドルが何円になるかを示す為替レートです。日本経済にとって最も重要な通貨レートで、輸出競争力、輸入コスト、家計購買力、日銀政策のすべてに影響します。',
    calculation: '完全変動相場制のもと、東京・ロンドン・ニューヨーク市場における24時間グローバル取引で決定されます。単一の計算式は存在せず、無数の売買注文の均衡として刻々と動きます。',
    drivers: '最大の駆動要因は日米金利差です。米金利が日本金利より高ければドルへ資金が流入し、USD/JPYは上昇します。リスクセンチメントも重要で、市場パニック時には円が安全資産として買われ、キャリートレードが巻き戻されます。日本の構造的なエネルギー輸入赤字も円売り圧力を生み出します。',
    interpretation: 'USD/JPYの上昇（円安）は、トヨタ・ソニーといった日本の輸出企業を支援し、ドル建て売上の円換算額を膨らませます。しかし輸入コストを押し上げ、インフレを助長し、家計を圧迫します。急激な変動は日銀や財務省の介入を招くこともあります。',
  },
  'EUR/JPY': {
    definition: 'EUR/JPYはクロスレート — ユーロと円が直接取引されるのではなく、EUR/USDとUSD/JPYを介して間接的に算出されます。1ユーロが何円になるかを示します。',
    calculation: '数式上、EUR/JPY = EUR/USD × USD/JPY で計算されます。両方の構成ペアが値動きに影響するため、EUR/JPYを理解するには両方を観察する必要があります。',
    drivers: '駆動要因にはECB政策、ユーロ圏のインフレ・成長、日銀政策、日欧の利回り差が挙げられます。キャリートレード（低金利の円を借りて高利回りのユーロ資産に投資）はリスクオン局面で値動きを増幅させます。',
    interpretation: 'EUR/JPYは世界のリスクセンチメントの代理指標として機能します。EUR/JPY上昇はリスクオン（円売り、ユーロ買い）、下落はリスクオフ（安全通貨としての円買い）を示唆します。欧州向け輸出を行う日本の自動車・機械メーカーはEUR/JPY水準に特に敏感です。',
  },
  'EUR/USD': {
    definition: 'EUR/USDは世界で最も取引量の多い通貨ペアで、日次取引高は数兆ドル規模に達します。世界二大基軸通貨であるユーロとドルの相対価値を示します。',
    calculation: '24時間グローバル取引で決定されます。価格1.0726は、1ユーロが1.0726ドルと交換されることを意味します。',
    drivers: '主要な駆動要因はECBとFRBの政策差です。FRBがECBよりタカ派の場合、ドルが買われEUR/USDは下落します。その他、相対的なインフレ率、米欧の利回り差（特に独10年債と米10年債）、エネルギー価格（ユーロ圏はエネルギー輸入地域）、両地域の政治的安定性などが影響します。',
    interpretation: 'EUR/USDの動きはドルの基軸通貨の地位を通じて世界に伝播します。EUR/USDの下落は通常、広範なドル高を意味し、新興国市場、コモディティ、円に圧力をかけます。上昇は通常ドル安を意味し、世界のリスク資産にとって追い風となります。',
  },
  'GBP/JPY': {
    definition: 'GBP/JPYは1英ポンドが何円になるかを示します。トレーダー界隈では「殺人通貨（The Widow Maker）」の異名で知られ、過剰レバレッジをかけた個人投資家に大きな損失を与えてきた高ボラティリティ通貨ペアです。',
    calculation: '他のクロス円と同様、GBP/JPY = GBP/USD × USD/JPY で計算されます。ポンドの円に対する高いボラティリティが、このクロスを特に活発な値動きにさせています。',
    drivers: 'イングランド銀行の政策、英国のインフレ・GDP、北海原油価格、英国の政治イベント（ブレグジット、首相交代）、日銀-BOEの金利差などが影響します。ポンドはドルやユーロより短期的なスイングが激しい通貨です。',
    interpretation: 'GBP/JPYの上昇は強いリスクオン心理とポンド高の組合せを示します。急落は英国固有のショック、または安全通貨としての円買いを伴うグローバルなリスクオフを反映することがあります。統計上、GBP/JPYは日本の個人投資家にとって損失額が最大の通貨ペア — 学習材料としては有益ですが、経験なしでの取引は危険です。',
  },
  'WTI': {
    definition: 'WTI（ウェスト・テキサス・インターミディエート）は米国産原油で、NYMEX（ニューヨーク・マーカンタイル取引所）で先物取引されます。北海ブレント原油と並ぶ世界二大ベンチマーク銘柄で、価格は1バレル（42ガロン）あたりで表示されます。',
    calculation: '報じられる「WTI価格」は実は限月の先物価格 — 期近物（最も納会日に近い限月）を指します。物理的な受渡しはオクラホマ州クッシングで行われ、その貯蔵能力が地域固有の価格効果を生みます。',
    drivers: '供給要因: OPEC+の生産決定、米シェールオイル生産量、地政学イベント（中東、ロシア・ウクライナ、イラン制裁）、自然災害。需要要因: 世界経済成長（特に中国・インドの工業活動）、米夏季ドライブシーズン、欧州冬季暖房需要、EVへの移行ペース。マクロ要因: ドル強弱（原油はドル建て）、実質金利。',
    interpretation: 'WTIの上昇は強い需要、地政学的緊張、または供給制約を示し、世界経済にとってインフレ要因となります。下落は需要減退、供給過剰、景気後退懸念を示しディスインフレ要因です。日本にとって原油はほぼ完全な輸入品 — 高油価は貿易収支を悪化させ、企業利益を圧迫し、消費者インフレを煽り、円安をもたらします。',
  },
  'GOLD': {
    definition: '金価格はXAU/USD（1トロイオンス＝約31.1グラムのドル建て価値）として表示されます。工業用コモディティとは異なり、金は主に「価値の保管手段」として機能し、工業用途は需要全体の10%程度に過ぎません。',
    calculation: '金スポット価格は、ロンドン、ニューヨーク等を中心とする物理金のグローバル卸売市場の価格を反映し、24時間連続的に取引されます。金には利回り、配当、利益が無いため、その価値は純粋に市場のコンセンサスから生まれます。',
    drivers: '最大の駆動要因は米実質金利（名目利回り − 期待インフレ率）です。金を保有すると他で得られたはずの利息を放棄することになるため、実質金利が低い・マイナスの局面で金の魅力が増します。その他の要因: ドル強弱（逆相関）、地政学リスク、中央銀行の購入（中国・ロシア・インドが2020年以降大規模購入）、インフレ期待。',
    interpretation: '広範な市場パニック時の金上昇は、真にシステミックな懸念を示します。実質金利上昇と金上昇が同時に起きる場合は珍しく、中央銀行の購入や地政学的恐怖を反映していることが多いです。日本投資家にとって円安は金の円建てリターンを増幅させるため、円安局面ではダブルの追い風となります。',
  },
  'US10Y': {
    definition: '米10年国債利回りは世界の「リスクフリーレート」として、住宅ローンから社債、株式まで、ほぼすべての金融資産の価格付けの基礎となります。',
    calculation: '利回りと価格は逆相関 — 米国債が売られて価格が下落すると利回りは上昇します。利回りは現価格で購入し満期まで保有した場合の年率リターンを表し、市場は取引を通じて常時調整しています。',
    drivers: '短期: FRB政策の見通しが支配的。中期: インフレ期待が重要（投資家は予想インフレ率以下では資金を貸さないため）。長期: 米国の財政赤字、海外保有（特に日本・中国）、ドル基軸通貨制度への信認が影響します。',
    interpretation: '米10年金利の上昇は株式バリュエーション（特にテック）を圧迫し、金融環境を引き締め、住宅ローン金利を押し上げ、ドル高を促します。米2年-10年スプレッド（2年が10年を上回る逆イールド）は歴史的に景気後退の先行指標とされてきました。日本にとっては、米10年金利上昇が日米金利差を拡大させ、円安と日本輸出株の押上げ要因となります。',
  },
  'JP10Y': {
    definition: '日本の10年国債（JGB）利回りは日本の長期金利の基準となります。長年にわたり、この利回りは日銀の政策により人為的に抑制されてきました。',
    calculation: '債券価格との逆相関は米国債と同じです。2024年まで、日銀はイールドカーブ・コントロール（YCC）政策によって10年金利をゼロ近辺に抑え込んでいました。YCCは2024年3月に撤廃され、以降は金利が市場の力で自由に動くようになりました。',
    drivers: '駆動要因には日銀の政策見通し（特に短期金利の利上げ）、日本のインフレ（2%程度で推移）、日本の財政状況（公的債務はGDP比250%超）、世界の金利動向（特に米10年金利）、リスクセンチメントが含まれます。',
    interpretation: '日10年金利の上昇は、日本のデフレからインフレへ、ゼロ金利から正常金利環境への体制転換を示します。JGB利回り上昇は日本の借手（住宅ローン、企業融資）の条件を引き締める一方、銀行の収益性を改善（預貸利鞘の拡大）し、円高圧力となり、最終的には経済の構造変化を反映します。マクロ経済を学ぶ上で、JP10Yは日本の構造変化を最も明確に示す指標です。',
  },
}

export function getInstrumentEducation(
  symbol: string,
  lang: Language
): InstrumentEducation {
  const fallbackKey = 'NKY'
  if (lang === 'jp') {
    return JP[symbol] || JP[fallbackKey]
  }
  return EN[symbol] || EN[fallbackKey]
}

// Backwards-compatible export (English) — retained for any consumer that
// imports it directly without going through the language-aware helper.
export const INSTRUMENT_EDUCATION = EN

// Related instruments mapping (language-independent)
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
