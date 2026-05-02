'use client'

type AppMode = 'TRANSCRIPT' | 'CHAT' | 'MARKETS'

interface StatusBarProps {
  sessionId: string
  mode: AppMode
  termCount: number
  isOnline?: boolean
}

export function StatusBar({ sessionId, mode, termCount, isOnline = true }: StatusBarProps) {
  return (
    <footer
      style={{
        height: '28px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Left: Connection Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: isOnline ? 'var(--price-down)' : 'var(--price-up)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
          }}
        >
          {isOnline ? 'Connected' : 'Offline'}
        </span>
        <span style={{ color: 'var(--border-medium)', margin: '0 4px' }}>·</span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
          }}
        >
          Market Lexicon Terminal
        </span>
      </div>

      {/* Center: Session Info */}
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>
          Session{' '}
          <span style={{ color: 'var(--text-secondary)' }}>{sessionId}</span>
        </span>
        <span style={{ color: 'var(--border-medium)' }}>·</span>
        <span>
          {mode === 'MARKETS' ? 'Markets' : mode === 'TRANSCRIPT' ? 'Transcripts' : 'Chat'}
        </span>
        <span style={{ color: 'var(--border-medium)' }}>·</span>
        <span>
          {termCount} terms
        </span>
      </div>

      {/* Right: Attribution */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '10px',
            color: 'var(--text-muted)',
          }}
        >
          Data via Twelve Data
        </span>
      </div>
    </footer>
  )
}
