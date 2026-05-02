'use client'

import { useEffect, useRef, useState } from 'react'
import { Session, GlossaryTerm } from '@/lib/market-lexicon-data'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  sessions: Session[]
  terms: GlossaryTerm[]
  onSelectSession: (id: string) => void
  onSelectTerm: (id: string) => void
  onNewSession: () => void
  onSwitchMode: (mode: 'TRANSCRIPT' | 'CHAT') => void
}

type ResultType = 'session' | 'term' | 'action'

interface Result {
  id: string
  type: ResultType
  title: string
  subtitle?: string
  shortcut?: string
}

export function CommandPalette({
  open,
  onClose,
  sessions,
  terms,
  onSelectSession,
  onSelectTerm,
  onNewSession,
  onSwitchMode,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const actions: Result[] = [
    { id: 'new-session', type: 'action', title: 'NEW SESSION', subtitle: 'Start a fresh analysis session', shortcut: '⌘N' },
    { id: 'transcript-mode', type: 'action', title: 'TRANSCRIPT MODE', subtitle: 'Switch to long-form transcript analysis', shortcut: '⌘1' },
    { id: 'chat-mode', type: 'action', title: 'CHAT MODE', subtitle: 'Switch to interactive Q&A', shortcut: '⌘2' },
  ]

  const filteredSessions: Result[] = sessions
    .filter(
      (s) =>
        query === '' ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.id.includes(query)
    )
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      type: 'session' as ResultType,
      title: s.title,
      subtitle: `${s.id}  ·  ${s.date}  ·  ${s.wordCount.toLocaleString()} words`,
    }))

  const filteredTerms: Result[] = terms
    .filter(
      (t) =>
        query !== '' &&
        (t.english.toLowerCase().includes(query.toLowerCase()) ||
          t.japanese.includes(query))
    )
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      type: 'term' as ResultType,
      title: t.english,
      subtitle: t.japanese + '  ·  ' + t.definitionJP.slice(0, 40) + '…',
    }))

  const filteredActions: Result[] = actions.filter(
    (a) =>
      query === '' ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      (a.subtitle ?? '').toLowerCase().includes(query.toLowerCase())
  )

  const all: Array<{ label: string; items: Result[] }> = []
  if (filteredActions.length) all.push({ label: 'ACTIONS', items: filteredActions })
  if (filteredSessions.length) all.push({ label: 'SESSIONS', items: filteredSessions })
  if (filteredTerms.length) all.push({ label: 'GLOSSARY', items: filteredTerms })

  const flat = all.flatMap((g) => g.items)

  useEffect(() => {
    setCursor(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[cursor]) handleSelect(flat[cursor])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleSelect = (result: Result) => {
    if (result.type === 'session') onSelectSession(result.id)
    else if (result.type === 'term') onSelectTerm(result.id)
    else if (result.id === 'new-session') onNewSession()
    else if (result.id === 'transcript-mode') onSwitchMode('TRANSCRIPT')
    else if (result.id === 'chat-mode') onSwitchMode('CHAT')
    onClose()
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '120px',
        background: 'rgba(0,0,0,0.75)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '560px',
          maxHeight: '440px',
          background: '#141414',
          border: '1px solid #58A6FF',
          boxShadow: '0 0 0 1px rgba(88,166,255,0.3), 0 20px 60px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #2A2A2A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1A1A1A',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: '#58A6FF',
              letterSpacing: '0.10em',
            }}
          >
            COMMAND PALETTE
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', letterSpacing: '0.06em' }}>
            ─ SEARCH EVERYTHING
          </span>
        </div>

        {/* Search input */}
        <div
          style={{
            padding: '10px 12px',
            borderBottom: '1px solid #2A2A2A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#58A6FF', fontWeight: 600 }}>
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search sessions, terms, actions..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#E8E8E8',
              letterSpacing: '0.02em',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', background: '#1F1F1F', border: '1px solid #2A2A2A', padding: '2px 5px' }}>
            ESC
          </span>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto' }}>
          {all.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#555555', letterSpacing: '0.08em' }}>
              NO RESULTS FOUND
            </div>
          ) : (
            all.map((group) => {
              let cursorOffset = flat.indexOf(group.items[0])
              return (
                <div key={group.label}>
                  <div
                    style={{
                      padding: '6px 12px 4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      color: '#555555',
                      letterSpacing: '0.12em',
                      background: '#0E0E0E',
                    }}
                  >
                    {group.label}
                  </div>
                  {group.items.map((item, i) => {
                    const globalIdx = flat.indexOf(item)
                    const isActive = globalIdx === cursor
                    return (
                      <ResultRow
                        key={item.id}
                        result={item}
                        active={isActive}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setCursor(globalIdx)}
                      />
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '6px 12px',
            borderTop: '1px solid #2A2A2A',
            display: 'flex',
            gap: '16px',
            background: '#0E0E0E',
          }}
        >
          {[['↵', 'SELECT'], ['↑↓', 'NAVIGATE'], ['ESC', 'CLOSE']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#888888', background: '#1F1F1F', border: '1px solid #2A2A2A', padding: '1px 5px' }}>
                {key}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', letterSpacing: '0.08em' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResultRow({
  result,
  active,
  onClick,
  onMouseEnter,
}: {
  result: Result
  active: boolean
  onClick: () => void
  onMouseEnter: () => void
}) {
  const typeColor: Record<ResultType, string> = {
    session: '#888888',
    term: '#00D964',
    action: '#58A6FF',
  }
  const typeLabel: Record<ResultType, string> = {
    session: 'SESSION',
    term: 'TERM',
    action: 'ACTION',
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: active ? 'rgba(88,166,255,0.08)' : 'transparent',
        borderLeft: '2px solid',
        borderLeftColor: active ? '#58A6FF' : 'transparent',
        cursor: 'pointer',
        transition: 'background 100ms',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          color: typeColor[result.type],
          letterSpacing: '0.10em',
          padding: '1px 4px',
          border: `1px solid ${typeColor[result.type]}`,
          background: `${typeColor[result.type]}15`,
          flexShrink: 0,
        }}
      >
        {typeLabel[result.type]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: active ? '#58A6FF' : '#E8E8E8', fontWeight: 600, letterSpacing: '0.04em' }}>
          {result.title}
        </div>
        {result.subtitle && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {result.subtitle}
          </div>
        )}
      </div>
      {result.shortcut && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', background: '#1F1F1F', border: '1px solid #2A2A2A', padding: '2px 5px', flexShrink: 0 }}>
          {result.shortcut}
        </span>
      )}
    </div>
  )
}
