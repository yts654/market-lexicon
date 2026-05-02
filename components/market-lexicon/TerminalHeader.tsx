'use client'

import { useEffect, useState } from 'react'

interface TerminalHeaderProps {
  sessions: number
  termsLearned: number
  streak: number
}

export function TerminalHeader({ sessions, termsLearned, streak }: TerminalHeaderProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const y = now.getFullYear()
      const mo = String(now.getMonth() + 1).padStart(2, '0')
      const d = String(now.getDate()).padStart(2, '0')
      const h = String(now.getHours()).padStart(2, '0')
      const mi = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      setTime(`${y}.${mo}.${d}  ${h}:${mi}:${s}  JST`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      style={{
        height: '32px',
        background: '#0A0A0A',
        borderBottom: '1px solid #2A2A2A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#58A6FF',
            letterSpacing: '0.08em',
            userSelect: 'none',
          }}
        >
          ▲ MARKET LEXICON
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#555555',
            letterSpacing: '0.12em',
            borderLeft: '1px solid #2A2A2A',
            paddingLeft: '12px',
          }}
        >
          FINANCIAL MARKETS LEARNING TERMINAL v2.4.1
        </span>
        {/* REC indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '4px' }}>
          <span
            className="rec-dot"
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FF3B3B',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: '#FF3B3B',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            REC
          </span>
        </div>
      </div>

      {/* Center: Clock */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: '#888888',
          letterSpacing: '0.06em',
          fontVariantNumeric: 'tabular-nums',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {time}
      </div>

      {/* Right: Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <StatBadge label="SESSIONS" value={String(sessions).padStart(3, '0')} />
        <div style={{ width: '1px', height: '14px', background: '#2A2A2A' }} />
        <StatBadge label="TERMS" value={String(termsLearned)} />
        <div style={{ width: '1px', height: '14px', background: '#2A2A2A' }} />
        <StatBadge label="STREAK" value={`${streak}D`} highlight />
      </div>
    </header>
  )
}

function StatBadge({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: '#555555',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label}:
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: highlight ? '#58A6FF' : '#E8E8E8',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
    </div>
  )
}
