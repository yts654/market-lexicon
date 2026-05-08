'use client'

import { useT } from '@/lib/i18n'

type AppGroup = 'MARKETS' | 'LEARNING' | 'SETTINGS'

interface StatusBarProps {
  sessionId: string
  group: AppGroup
  termCount: number
  isOnline?: boolean
}

export function StatusBar({
  sessionId,
  group,
  termCount,
  isOnline = true,
}: StatusBarProps) {
  const { t } = useT()
  const groupLabelKey =
    group === 'MARKETS'
      ? 'status.mode.markets'
      : group === 'LEARNING'
      ? 'status.mode.learning'
      : 'status.mode.settings'

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
          {isOnline ? t('status.connected') : t('status.offline')}
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
          {t('status.terminal')}
        </span>
      </div>

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
          {t('status.session')}{' '}
          <span style={{ color: 'var(--text-secondary)' }}>{sessionId}</span>
        </span>
        <span style={{ color: 'var(--border-medium)' }}>·</span>
        <span>{t(groupLabelKey as any)}</span>
        <span style={{ color: 'var(--border-medium)' }}>·</span>
        <span>
          {termCount} {t('status.terms')}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '10px',
            color: 'var(--text-muted)',
          }}
        >
          {t('status.dataVia')}
        </span>
      </div>
    </footer>
  )
}
