'use client'

import { useState } from 'react'
import {
  SAMPLE_TRANSCRIPT_EN,
  SAMPLE_TRANSCRIPT_JP_SUMMARY,
  SAMPLE_TRANSCRIPT_SEGMENTS,
  TranscriptSegment,
} from '@/lib/market-lexicon-data'
import { ChevronRight, Download, Copy, BookOpen } from 'lucide-react'

interface TranscriptWorkspaceProps {
  onTermClick: (term: string) => void
}

type WorkspaceState = 'input' | 'processing' | 'result'

export function TranscriptWorkspace({ onTermClick }: TranscriptWorkspaceProps) {
  const [text, setText] = useState('')
  const [state, setState] = useState<WorkspaceState>('input')
  const [charCount, setCharCount] = useState(0)
  const [processingDot, setProcessingDot] = useState(0)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 50000)
    setText(val)
    setCharCount(val.length)
  }

  const handleAnalyze = () => {
    if (text.trim().length < 10) return
    setState('processing')
    let dot = 0
    const iv = setInterval(() => {
      dot = (dot + 1) % 3
      setProcessingDot(dot)
    }, 400)
    setTimeout(() => {
      clearInterval(iv)
      setState('result')
    }, 2800)
  }

  const handleLoadSample = () => {
    setText(SAMPLE_TRANSCRIPT_EN)
    setCharCount(SAMPLE_TRANSCRIPT_EN.length)
  }

  const handleReset = () => {
    setState('input')
    setText('')
    setCharCount(0)
  }

  const dots = ['.  ', '.. ', '...']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {state === 'input' && (
        <InputView
          text={text}
          charCount={charCount}
          onTextChange={handleTextChange}
          onAnalyze={handleAnalyze}
          onLoadSample={handleLoadSample}
        />
      )}
      {state === 'processing' && <ProcessingView dots={dots[processingDot]} />}
      {state === 'result' && (
        <ResultView onTermClick={onTermClick} onReset={handleReset} />
      )}
    </div>
  )
}

function InputView({
  text,
  charCount,
  onTextChange,
  onAnalyze,
  onLoadSample,
}: {
  text: string
  charCount: number
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onAnalyze: () => void
  onLoadSample: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Panel header */}
      <div
        style={{
          padding: '8px 14px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          background: '#141414',
        }}
      >
        <span className="label-caps">TRANSCRIPT INPUT</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={onLoadSample}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#888888',
            background: 'transparent',
            border: '1px solid #2A2A2A',
            padding: '3px 8px',
            cursor: 'pointer',
            letterSpacing: '0.08em',
            transition: 'all 150ms',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#58A6FF'
            ;(e.currentTarget as HTMLElement).style.color = '#58A6FF'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
            ;(e.currentTarget as HTMLElement).style.color = '#888888'
          }}
        >
          <BookOpen size={10} />
          LOAD SAMPLE
        </button>
      </div>

      {/* Textarea */}
      <div style={{ flex: 1, padding: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={text}
          onChange={onTextChange}
          placeholder={
            '─────────────────────────────────────────────────────────────────────\n' +
            'PASTE ENGLISH TRANSCRIPT HERE...\n\n' +
            'Accepted sources:\n' +
            '  › Goldman Sachs / JPMorgan earnings calls\n' +
            '  › Fed FOMC press conferences\n' +
            '  › CNBC / Bloomberg TV interviews\n' +
            '  › Buy-side research notes\n\n' +
            'Max 50,000 characters  |  All financial dialects supported\n' +
            '─────────────────────────────────────────────────────────────────────'
          }
          className="terminal-textarea"
          style={{
            flex: 1,
            width: '100%',
            padding: '12px',
            lineHeight: '1.7',
            fontSize: '0.78rem',
          }}
        />
      </div>

      {/* Action Bar */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
          background: '#141414',
        }}
      >
        {/* Char count */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: charCount > 45000 ? '#FF3B3B' : '#555555',
            letterSpacing: '0.06em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {charCount.toLocaleString()} / 50,000
        </span>
        <div
          style={{
            flex: 1,
            height: '2px',
            background: '#1F1F1F',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${(charCount / 50000) * 100}%`,
              background: charCount > 45000 ? '#FF3B3B' : '#58A6FF',
              transition: 'width 150ms',
            }}
          />
        </div>
        <button
          onClick={onAnalyze}
          disabled={!text.trim() || text.trim().length < 10}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 20px',
            background: text.trim().length >= 10 ? '#58A6FF' : '#2A2A2A',
            border: 'none',
            color: text.trim().length >= 10 ? '#0A0A0A' : '#555555',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.10em',
            cursor: text.trim().length >= 10 ? 'pointer' : 'not-allowed',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => {
            if (text.trim().length >= 10)
              (e.currentTarget as HTMLElement).style.background = '#388BFD'
          }}
          onMouseLeave={(e) => {
            if (text.trim().length >= 10)
              (e.currentTarget as HTMLElement).style.background = '#58A6FF'
          }}
        >
          ANALYZE
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

function ProcessingView({ dots }: { dots: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          color: '#58A6FF',
          letterSpacing: '0.12em',
          fontWeight: 600,
        }}
      >
        PROCESSING{dots}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: '320px',
        }}
      >
        {['TOKENIZING INPUT...', 'EXTRACTING TERMS...', 'GENERATING TRANSLATION...', 'BUILDING GLOSSARY...'].map(
          (label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: '#555555',
                  letterSpacing: '0.08em',
                  width: '220px',
                }}
              >
                {label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: '#1F1F1F',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '0%',
                    background: '#58A6FF',
                    animation: `fillBar ${0.6 + i * 0.5}s ${i * 0.3}s ease-out forwards`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
      <style>{`
        @keyframes fillBar {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  )
}

function ResultView({
  onTermClick,
  onReset,
}: {
  onTermClick: (term: string) => void
  onReset: () => void
}) {
  const allTerms = Array.from(new Set(SAMPLE_TRANSCRIPT_SEGMENTS.flatMap((s) => s.terms)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Result header */}
      <div
        style={{
          padding: '8px 14px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          background: '#141414',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00D964',
            boxShadow: '0 0 4px #00D964',
            flexShrink: 0,
            display: 'inline-block',
          }}
        />
        <span className="label-caps" style={{ color: '#00D964' }}>
          ANALYSIS COMPLETE
        </span>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#555555',
            letterSpacing: '0.08em',
          }}
        >
          {allTerms.length} TERMS EXTRACTED
        </span>
        <div style={{ width: '1px', height: '14px', background: '#2A2A2A' }} />
        <ActionButton icon={<Copy size={10} />} label="COPY" onClick={() => {}} />
        <ActionButton icon={<Download size={10} />} label="EXPORT" onClick={() => {}} />
        <button
          onClick={onReset}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#888888',
            background: 'transparent',
            border: '1px solid #2A2A2A',
            padding: '3px 8px',
            cursor: 'pointer',
            letterSpacing: '0.08em',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#58A6FF'
            ;(e.currentTarget as HTMLElement).style.color = '#58A6FF'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
            ;(e.currentTarget as HTMLElement).style.color = '#888888'
          }}
        >
          NEW INPUT
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        {/* Summary Box */}
        <div
          style={{
            margin: '12px',
            padding: '12px 14px',
            background: '#141414',
            border: '1px solid #2A2A2A',
            borderLeft: '3px solid #58A6FF',
          }}
        >
          <div className="label-caps" style={{ marginBottom: '8px' }}>
            SUMMARY — POWELL FED PRESS CONFERENCE
          </div>
          <p
            className="font-jp"
            style={{
              fontSize: '0.78rem',
              color: '#E8E8E8',
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {SAMPLE_TRANSCRIPT_JP_SUMMARY}
          </p>
        </div>

        {/* ASCII separator */}
        <div className="ascii-sep" style={{ padding: '4px 12px', marginBottom: '4px' }}>
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>

        {/* Side-by-side translation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
            margin: '0 12px 12px',
          }}
        >
          {/* EN header */}
          <div
            style={{
              padding: '6px 10px',
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderBottom: 'none',
            }}
          >
            <span className="label-caps-muted">ENGLISH ORIGINAL</span>
          </div>
          {/* JP header */}
          <div
            style={{
              padding: '6px 10px',
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderLeft: 'none',
              borderBottom: 'none',
            }}
          >
            <span className="label-caps">JAPANESE TRANSLATION</span>
          </div>

          {/* Segments */}
          {SAMPLE_TRANSCRIPT_SEGMENTS.map((seg, i) => (
            <SegmentPair key={i} segment={seg} index={i} onTermClick={onTermClick} />
          ))}
        </div>

        {/* Key Terms section */}
        <div style={{ margin: '0 12px 12px' }}>
          <div className="ascii-sep" style={{ marginBottom: '10px' }}>
            ━━━ KEY TERMS DECODED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '8px',
            }}
          >
            {allTerms.slice(0, 12).map((term) => (
              <ExtractedTermCard key={term} term={term} onTermClick={onTermClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SegmentPair({
  segment,
  index,
  onTermClick,
}: {
  segment: TranscriptSegment
  index: number
  onTermClick: (term: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  // Tokenize English text with term highlighting
  const tokenize = (text: string, terms: string[]) => {
    const parts: Array<{ text: string; isTerm: boolean }> = []
    let remaining = text
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length)

    while (remaining.length > 0) {
      let found = false
      for (const term of sortedTerms) {
        const idx = remaining.toUpperCase().indexOf(term.toUpperCase())
        if (idx === 0) {
          parts.push({ text: remaining.slice(0, term.length), isTerm: true })
          remaining = remaining.slice(term.length)
          found = true
          break
        }
        if (idx > 0) {
          parts.push({ text: remaining.slice(0, idx), isTerm: false })
          parts.push({ text: remaining.slice(idx, idx + term.length), isTerm: true })
          remaining = remaining.slice(idx + term.length)
          found = true
          break
        }
      }
      if (!found) {
        parts.push({ text: remaining, isTerm: false })
        break
      }
    }
    return parts
  }

  const tokens = tokenize(segment.en, segment.terms)
  const isEven = index % 2 === 0

  const cellStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #2A2A2A',
    borderTop: 'none',
    background: hovered ? 'rgba(255,255,255,0.015)' : isEven ? '#0E0E0E' : '#111111',
    transition: 'background 150ms',
    lineHeight: 1.7,
  }

  return (
    <>
      <div
        style={{ ...cellStyle }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#C8C8C8' }}>
          {tokens.map((t, i) =>
            t.isTerm ? (
              <span
                key={i}
                className="term-highlight"
                onClick={() => onTermClick(t.text.toUpperCase())}
              >
                {t.text}
              </span>
            ) : (
              <span key={i}>{t.text}</span>
            )
          )}
        </p>
      </div>
      <div
        style={{ ...cellStyle, borderLeft: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p
          className="font-jp"
          style={{ margin: 0, fontSize: '0.75rem', color: '#E8E8E8', lineHeight: 1.8 }}
        >
          {segment.jp}
        </p>
      </div>
    </>
  )
}

function ExtractedTermCard({
  term,
  onTermClick,
}: {
  term: string
  onTermClick: (term: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const jpMap: Record<string, string> = {
    'FOMC': '連邦公開市場委員会',
    'FEDERAL OPEN MARKET COMMITTEE': '連邦公開市場委員会',
    'FEDERAL FUNDS RATE': 'フェデラルファンズ金利',
    'DATA-DEPENDENT': 'データ依存型',
    'INFLATION': 'インフレーション',
    'DUAL MANDATE': '二重責務',
    'PRICE STABILITY': '物価安定',
    'MAXIMUM EMPLOYMENT': '最大雇用',
    'NONFARM PAYROLLS': '非農業部門雇用者数',
    'CONSENSUS': 'コンセンサス',
    'FINANCIAL CONDITIONS': '金融環境',
    'RATE HIKES': '利上げ',
    'TREASURY YIELDS': '米国債利回り',
    'DURATION': 'デュレーション',
    'QUANTITATIVE TIGHTENING': '量的引き締め',
    'QT': '量的引き締め',
    'BALANCE SHEET': 'バランスシート',
  }

  return (
    <div
      onClick={() => onTermClick(term)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 10px',
        background: hovered ? 'rgba(88,166,255,0.06)' : '#141414',
        border: '1px solid',
        borderColor: hovered ? '#58A6FF' : '#2A2A2A',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: '#58A6FF',
          fontWeight: 600,
          letterSpacing: '0.04em',
          marginBottom: '2px',
        }}
      >
        {term}
      </div>
      <div
        className="font-jp"
        style={{ fontSize: '0.65rem', color: '#888888' }}
      >
        {jpMap[term] || '─'}
      </div>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: '#888888',
        background: 'transparent',
        border: '1px solid #2A2A2A',
        padding: '3px 8px',
        cursor: 'pointer',
        letterSpacing: '0.08em',
        transition: 'all 150ms',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = '#58A6FF'
        ;(e.currentTarget as HTMLElement).style.color = '#58A6FF'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
        ;(e.currentTarget as HTMLElement).style.color = '#888888'
      }}
    >
      {icon}
      {label}
    </button>
  )
}
