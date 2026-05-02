// ─────────────────────────────────────────────
// MARKET LEXICON — Core Types & Mock Data
// ─────────────────────────────────────────────

export type SessionType = 'transcript' | 'chat'
export type FilterType = 'ALL' | 'TRANSCRIPTS' | 'CHATS' | 'FAVORITES'
export type GlossarySortType = 'ALPHABETICAL' | 'FREQUENCY' | 'RECENT' | 'NOT MASTERED'

export interface Session {
  id: string
  idNum: number
  title: string
  date: string
  wordCount: number
  type: SessionType
  starred: boolean
  tags: string[]
}

export interface GlossaryTerm {
  id: string
  english: string
  japanese: string
  reading: string
  definition: string
  definitionJP: string
  category: string
  seenCount: number
  mastered: boolean
  lastSeen: string
  etymology?: string
  example?: string
  exampleJP?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  translation?: string
  keyTerms?: Array<{ term: string; reading: string; definition: string }>
  marketContext?: string
}

// ─────────────────────────────────────────────
// MOCK SESSIONS
// ─────────────────────────────────────────────
export const MOCK_SESSIONS: Session[] = [
  {
    id: '#0247',
    idNum: 247,
    title: 'Goldman Sachs - Market Outlook Q2',
    date: '2025.05.02',
    wordCount: 4120,
    type: 'transcript',
    starred: true,
    tags: ['macro', 'equities'],
  },
  {
    id: '#0246',
    idNum: 246,
    title: 'JPMorgan Q1 Earnings Call',
    date: '2025.04.28',
    wordCount: 8340,
    type: 'transcript',
    starred: false,
    tags: ['earnings', 'banking'],
  },
  {
    id: '#0245',
    idNum: 245,
    title: 'Powell Fed Press Conference',
    date: '2025.04.25',
    wordCount: 3205,
    type: 'transcript',
    starred: true,
    tags: ['fed', 'rates'],
  },
  {
    id: '#0244',
    idNum: 244,
    title: 'Druckenmiller CNBC Interview',
    date: '2025.04.22',
    wordCount: 6180,
    type: 'transcript',
    starred: false,
    tags: ['macro', 'hedge fund'],
  },
  {
    id: '#0243',
    idNum: 243,
    title: 'Morgan Stanley Sector Note',
    date: '2025.04.20',
    wordCount: 2450,
    type: 'transcript',
    starred: false,
    tags: ['equity research'],
  },
  {
    id: '#0242',
    idNum: 242,
    title: 'Basis Point chat session',
    date: '2025.04.18',
    wordCount: 890,
    type: 'chat',
    starred: false,
    tags: ['vocabulary'],
  },
  {
    id: '#0241',
    idNum: 241,
    title: 'BlackRock Investment Outlook',
    date: '2025.04.15',
    wordCount: 5560,
    type: 'transcript',
    starred: true,
    tags: ['macro', 'fixed income'],
  },
  {
    id: '#0240',
    idNum: 240,
    title: 'Yield Curve vocabulary Q&A',
    date: '2025.04.12',
    wordCount: 1200,
    type: 'chat',
    starred: false,
    tags: ['vocabulary', 'rates'],
  },
  {
    id: '#0239',
    idNum: 239,
    title: 'Berkshire Annual Shareholder Letter',
    date: '2025.04.10',
    wordCount: 9800,
    type: 'transcript',
    starred: true,
    tags: ['value investing'],
  },
  {
    id: '#0238',
    idNum: 238,
    title: 'FOMC Minutes — March 2025',
    date: '2025.04.08',
    wordCount: 4670,
    type: 'transcript',
    starred: false,
    tags: ['fed', 'rates', 'policy'],
  },
]

// ─────────────────────────────────────────────
// MOCK GLOSSARY TERMS
// ─────────────────────────────────────────────
export const MOCK_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'g001',
    english: 'BASIS POINT',
    japanese: 'ベーシスポイント',
    reading: 'べーしすぽいんと',
    definition: '1bp = 0.01%. The smallest unit of interest rate measurement.',
    definitionJP: '1bp = 0.01%。金利の最小単位。「利上げ50bp」= 0.5%引き上げ。',
    category: 'Rates',
    seenCount: 23,
    mastered: true,
    lastSeen: '2025.05.02',
    etymology: 'From "base" + "point" — refers to 1/100th of a percentage point.',
    example: '"The Fed raised rates by 50 basis points to a target range of 5.25–5.50%."',
    exampleJP: '「FRBは政策金利を50ベーシスポイント引き上げ、誘導目標レンジを5.25〜5.50%とした。」',
  },
  {
    id: 'g002',
    english: 'HEDGE',
    japanese: 'ヘッジ',
    reading: 'へっじ',
    definition: 'A risk-offsetting position taken to reduce exposure to adverse price moves.',
    definitionJP: '損失リスクを相殺するための保険的取引。ポートフォリオの下値リスクを制限する。',
    category: 'Risk Management',
    seenCount: 18,
    mastered: true,
    lastSeen: '2025.04.28',
    example: '"We hedge our equity exposure with put options on the S&P 500."',
    exampleJP: '「S&P500のプットオプションを購入してエクイティエクスポージャーをヘッジしている。」',
  },
  {
    id: 'g003',
    english: 'TIGHTENING',
    japanese: '引き締め',
    reading: 'ひきしめ',
    definition: 'Monetary policy action reducing liquidity and raising borrowing costs.',
    definitionJP: '金融政策で市場の流動性を絞り、借り入れコストを上昇させること。利上げや量的引き締め(QT)が含まれる。',
    category: 'Monetary Policy',
    seenCount: 14,
    mastered: false,
    lastSeen: '2025.04.25',
    example: '"The Fed\'s aggressive tightening cycle suppressed risk appetite across asset classes."',
    exampleJP: '「FRBの積極的な引き締めサイクルが全アセットクラスのリスク選好を抑制した。」',
  },
  {
    id: 'g004',
    english: 'CAPEX',
    japanese: '設備投資',
    reading: 'せつびとうし',
    definition: 'Capital Expenditure. Funds used to acquire, upgrade, or maintain long-term assets.',
    definitionJP: 'Capital Expenditure（資本的支出）。工場・設備・技術など長期資産への投資。将来の利益創出能力に直結する。',
    category: 'Corporate Finance',
    seenCount: 12,
    mastered: false,
    lastSeen: '2025.04.20',
    example: '"Hyperscalers are accelerating CAPEX on AI infrastructure through 2026."',
    exampleJP: '「大手クラウド企業はAIインフラへの設備投資を2026年まで加速させている。」',
  },
  {
    id: 'g005',
    english: 'FCI',
    japanese: '金融環境指数',
    reading: 'きんゆうかんきょうしすう',
    definition: 'Financial Conditions Index. A composite measure of market tightness or ease.',
    definitionJP: '金利・クレジットスプレッド・株価・為替などを合成した金融環境の緩和・引き締まり度合いを示す指標。',
    category: 'Macro',
    seenCount: 9,
    mastered: false,
    lastSeen: '2025.04.22',
  },
  {
    id: 'g006',
    english: 'SPREAD',
    japanese: 'スプレッド',
    reading: 'すぷれっど',
    definition: 'The yield differential between two fixed-income instruments, often used as a risk gauge.',
    definitionJP: '二つの金融商品の利回り差。クレジットスプレッドはリスク度合いの指標として広く使われる。',
    category: 'Fixed Income',
    seenCount: 21,
    mastered: true,
    lastSeen: '2025.04.28',
  },
  {
    id: 'g007',
    english: 'YIELD CURVE',
    japanese: 'イールドカーブ',
    reading: 'いーるどかーぶ',
    definition: 'A graph plotting bond yields across different maturities; its shape signals economic expectations.',
    definitionJP: '国債の残存期間別利回りを繋いだ曲線。逆イールドは景気後退のシグナルとして注目される。',
    category: 'Rates',
    seenCount: 17,
    mastered: true,
    lastSeen: '2025.04.25',
  },
  {
    id: 'g008',
    english: 'LIQUIDITY',
    japanese: '流動性',
    reading: 'りゅうどうせい',
    definition: 'The ease with which an asset can be converted to cash without significant price impact.',
    definitionJP: '資産を価格への影響を最小限に抑えて現金化できる容易さ。市場流動性と資金流動性の二種類がある。',
    category: 'Markets',
    seenCount: 28,
    mastered: true,
    lastSeen: '2025.05.02',
  },
  {
    id: 'g009',
    english: 'EBITDA',
    japanese: '利払前税引前償却前利益',
    reading: 'りばらいぜんぜいびきぜんしょうきゃくぜんりえき',
    definition: 'Earnings Before Interest, Taxes, Depreciation & Amortization. A proxy for operating cash flow.',
    definitionJP: '利息・税・減価償却前の利益。企業の事業収益力を純粋に示す指標。バリュエーション倍率(EV/EBITDA)に多用される。',
    category: 'Corporate Finance',
    seenCount: 11,
    mastered: false,
    lastSeen: '2025.04.28',
  },
  {
    id: 'g010',
    english: 'RISK-OFF',
    japanese: 'リスクオフ',
    reading: 'りすくおふ',
    definition: 'Market sentiment shift toward safe-haven assets during uncertainty.',
    definitionJP: '不確実性の高まり時に投資家が株・ハイイールド債などリスク資産を売り、国債・円・金などに資金を避難させる動き。',
    category: 'Sentiment',
    seenCount: 15,
    mastered: false,
    lastSeen: '2025.05.02',
  },
  {
    id: 'g011',
    english: 'DURATION',
    japanese: 'デュレーション',
    reading: 'でゅれーしょん',
    definition: 'A measure of a bond\'s price sensitivity to interest rate changes.',
    definitionJP: '金利変動に対する債券価格の感応度。デュレーション10年の債券は金利1%上昇で約10%価格下落。',
    category: 'Fixed Income',
    seenCount: 10,
    mastered: false,
    lastSeen: '2025.04.25',
  },
  {
    id: 'g012',
    english: 'CARRY TRADE',
    japanese: 'キャリートレード',
    reading: 'きゃりーとれーど',
    definition: 'Borrowing in a low-yield currency to invest in a higher-yield asset.',
    definitionJP: '低金利通貨(円など)で資金調達し、高金利通貨や資産に投資する戦略。リスクオフ時の急激な巻き戻しに注意が必要。',
    category: 'FX',
    seenCount: 8,
    mastered: false,
    lastSeen: '2025.04.22',
  },
  {
    id: 'g013',
    english: 'MULTIPLE EXPANSION',
    japanese: 'マルチプル拡大',
    reading: 'まるちぷるかくだい',
    definition: 'An increase in valuation multiples (P/E, EV/EBITDA) independent of earnings growth.',
    definitionJP: 'P/Eなど株価評価倍率が企業業績とは独立して上昇すること。金利低下局面や楽観的センチメント時に発生しやすい。',
    category: 'Equities',
    seenCount: 7,
    mastered: false,
    lastSeen: '2025.04.20',
  },
  {
    id: 'g014',
    english: 'QT',
    japanese: '量的引き締め',
    reading: 'りょうてきひきしめ',
    definition: 'Quantitative Tightening. Central bank reducing its balance sheet by not reinvesting maturing bonds.',
    definitionJP: '量的引き締め(Quantitative Tightening)。中央銀行が満期迎えた債券の再投資を行わず、バランスシートを縮小する政策。',
    category: 'Monetary Policy',
    seenCount: 13,
    mastered: false,
    lastSeen: '2025.04.25',
  },
  {
    id: 'g015',
    english: 'ALPHA',
    japanese: 'アルファ',
    reading: 'あるふぁ',
    definition: 'Excess return generated above a benchmark index, attributable to manager skill.',
    definitionJP: 'ベンチマーク(市場平均)を上回る超過リターン。運用者の実力・情報優位性によって生み出されるリターン。',
    category: 'Portfolio Management',
    seenCount: 19,
    mastered: true,
    lastSeen: '2025.04.28',
  },
]

// ─────────────────────────────────────────────
// MOCK CHAT CONVERSATION
// ─────────────────────────────────────────────
export const MOCK_CHAT: ChatMessage[] = [
  {
    id: 'c001',
    role: 'user',
    content: 'What does "tightening of 50 basis points" mean?',
    timestamp: '14:23:11',
  },
  {
    id: 'c002',
    role: 'assistant',
    content: '"Tightening of 50 basis points" refers to a central bank raising its benchmark interest rate by 0.50 percentage points.',
    timestamp: '14:23:14',
    translation: '「50ベーシスポイントの引き締め」とは、中央銀行がその基準金利を0.50パーセントポイント引き上げることを指します。例えば、政策金利が5.00%から5.50%に引き上げられた場合がこれに該当します。',
    keyTerms: [
      {
        term: 'TIGHTENING',
        reading: '引き締め (ひきしめ)',
        definition: '金融政策上の「引き締め」。市場の流動性を絞り、借り入れコストを上昇させる政策行動。',
      },
      {
        term: 'BASIS POINT',
        reading: 'ベーシスポイント (bp)',
        definition: '1bp = 0.01%。「50bp」= 0.50%の変化。金利・スプレッドの変化を正確に表現するための業界標準単位。',
      },
      {
        term: 'BENCHMARK RATE',
        reading: '政策金利 (せいさくきんり)',
        definition: '中央銀行が設定する誘導目標金利。FRBのフェデラルファンズレートがその代表例。',
      },
    ],
    marketContext:
      '50bpの利上げは通常より大きな動き（通常は25bp）であり、市場は「タカ派サプライズ」と受け取ります。2022〜2023年のFRBはインフレ対応として連続75bpという異例の引き締めを実施しました。このような大幅利上げはグロース株・ハイイールド債に特に売り圧力をかけ、ドル高・円安をもたらします。プロは発表前にFF先物でマーケットが織り込む確率を確認し、「サプライズ度合い」を測定します。',
  },
  {
    id: 'c003',
    role: 'user',
    content: 'How does this relate to the yield curve?',
    timestamp: '14:24:02',
  },
  {
    id: 'c004',
    role: 'assistant',
    content:
      'Rate hikes (tightening) directly push up short-term yields. If the market believes this tightening will eventually slow growth, long-term yields may fall or rise less — this flattens or inverts the yield curve, a classic recession signal.',
    timestamp: '14:24:06',
    translation:
      '利上げ（引き締め）は短期金利を直接押し上げます。市場がこの引き締めが最終的に景気を減速させると判断すると、長期金利は下落するか上昇幅が小さくなります。この結果、イールドカーブはフラット化または逆転（逆イールド）し、これは典型的な景気後退シグナルとなります。',
    keyTerms: [
      {
        term: 'YIELD CURVE INVERSION',
        reading: '逆イールド (ぎゃくいーるど)',
        definition: '短期金利が長期金利を上回る状態。過去12回の景気後退のうち10回で事前に観測されたとされる。',
      },
      {
        term: 'FLATTENING',
        reading: 'フラット化',
        definition: 'イールドカーブの傾きが小さくなること。短期・長期金利の差(スプレッド)が縮小する状態。',
      },
    ],
    marketContext:
      '2022〜2023年の米国では2年-10年スプレッドが過去最大級の逆転を記録。これが景気後退懸念を高め、2023年の地銀危機(SVBなど)にも連鎖しました。逆イールドは「今引き締めすぎている」という市場のメッセージです。',
  },
]

// ─────────────────────────────────────────────
// SAMPLE TRANSCRIPT ANALYSIS
// ─────────────────────────────────────────────
export const SAMPLE_TRANSCRIPT_EN = `Good morning. We're convening today's press conference following the Federal Open Market Committee's two-day policy meeting. The committee has decided to maintain the target range for the federal funds rate at its current level, while signaling a more data-dependent posture heading into the second half of the year.

Inflation has continued to moderate, though it remains above our two percent longer-run objective. We are attentive to the risks on both sides of our dual mandate — price stability and maximum employment. Recent labor market data has shown some softening, with nonfarm payrolls coming in below consensus expectations for the second consecutive month.

Financial conditions have tightened somewhat, reflecting the lagged effects of our prior rate hikes and the recent repricing in longer-duration Treasury yields. The committee remains resolute that we will not prematurely declare victory over inflation. We will use all the tools at our disposal to return inflation to target in a timely manner, without unnecessarily restricting economic activity.

On the balance sheet, quantitative tightening proceeds at the current pace. We continue to monitor reserve adequacy and will adjust the pace of runoff as appropriate to maintain ample reserves in the banking system.`

export const SAMPLE_TRANSCRIPT_JP_SUMMARY = `本日のFOMC記者会見では、フェデラルファンズ金利の目標レンジを維持することが決定されました。インフレは引き続き緩和傾向にあるものの、2%目標を依然上回っています。雇用市場は若干の軟化を示しており、非農業部門雇用者数が2ヶ月連続でコンセンサス予想を下回りました。委員会はインフレへの早期勝利宣言を避け、データ次第のアプローチを継続することを明言しました。`

export interface TranscriptSegment {
  en: string
  jp: string
  terms: string[]
}

export const SAMPLE_TRANSCRIPT_SEGMENTS: TranscriptSegment[] = [
  {
    en: 'Good morning. We\'re convening today\'s press conference following the Federal Open Market Committee\'s two-day policy meeting.',
    jp: 'おはようございます。本日の記者会見は、連邦公開市場委員会（FOMC）の2日間の政策会合を受けて開催しております。',
    terms: ['FOMC', 'FEDERAL OPEN MARKET COMMITTEE'],
  },
  {
    en: 'The committee has decided to maintain the target range for the federal funds rate at its current level, while signaling a more data-dependent posture heading into the second half of the year.',
    jp: '委員会はフェデラルファンズ金利の目標レンジを現状水準に据え置くことを決定し、年後半に向けてよりデータ重視の姿勢を示しました。',
    terms: ['FEDERAL FUNDS RATE', 'DATA-DEPENDENT'],
  },
  {
    en: 'Inflation has continued to moderate, though it remains above our two percent longer-run objective.',
    jp: 'インフレは引き続き緩和傾向にありますが、長期目標である2%を依然として上回っています。',
    terms: ['INFLATION'],
  },
  {
    en: 'We are attentive to the risks on both sides of our dual mandate — price stability and maximum employment.',
    jp: '物価安定と最大雇用という二重責務の両方向のリスクに注意を払っています。',
    terms: ['DUAL MANDATE', 'PRICE STABILITY', 'MAXIMUM EMPLOYMENT'],
  },
  {
    en: 'Recent labor market data has shown some softening, with nonfarm payrolls coming in below consensus expectations for the second consecutive month.',
    jp: '最近の労働市場データには若干の軟化が見られ、非農業部門雇用者数が2ヶ月連続でコンセンサス予想を下回りました。',
    terms: ['NONFARM PAYROLLS', 'CONSENSUS'],
  },
  {
    en: 'Financial conditions have tightened somewhat, reflecting the lagged effects of our prior rate hikes and the recent repricing in longer-duration Treasury yields.',
    jp: '金融環境はある程度引き締まっており、これは過去の利上げの遅延効果と、長期国債利回りの最近の再評価を反映しています。',
    terms: ['FINANCIAL CONDITIONS', 'RATE HIKES', 'TREASURY YIELDS', 'DURATION'],
  },
  {
    en: 'On the balance sheet, quantitative tightening proceeds at the current pace.',
    jp: 'バランスシートについては、量的引き締め（QT）は現在のペースで継続しています。',
    terms: ['QUANTITATIVE TIGHTENING', 'QT', 'BALANCE SHEET'],
  },
]
