'use client'

import { useState } from 'react'
import { Star, FileText, MessageSquare, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Session, FilterType } from '@/lib/market-lexicon-data'

interface ArchiveSidebarProps {
  sessions: Session[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function ArchiveSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  collapsed,
  onToggleCollapse,
}: ArchiveSidebarProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('ALL')

  const filtered = sessions.filter((s) => {
    const matchSearch =
      search === '' ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.id.includes(search)
    const matchFilter =
      filter === 'ALL' ||
      (filter === 'TRANSCRIPTS' && s.type === 'transcript') ||
      (filter === 'CHATS' && s.type === 'chat') ||
      (filter === 'FAVORITES' && s.starred)
    return matchSearch && matchFilter
  })

  if (collapsed) {
    return (
      <div
        style={{
          width: '36px',
          background: '#141414',
          borderRight: '1px solid #2A2A2A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            width: '28px',
            height: '28px',
            background: 'transparent',
            border: '1px solid #2A2A2A',
            color: '#888888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 150ms, color 150ms',
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
          <ChevronRight size={12} />
        </button>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#58A6FF',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '8px',
            writingMode: 'vertical-rl',
          }}
        >
          ARCHIVE
        </div>
      </div>
    )
  }

  return (
    <aside
      style={{
        width: '240px',
        background: '#141414',
        borderRight: '1px solid #2A2A2A',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span className="label-caps">ARCHIVE</span>
        <button
          onClick={onToggleCollapse}
          style={{
            width: '22px',
            height: '22px',
            background: 'transparent',
            border: '1px solid #2A2A2A',
            color: '#555555',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#58A6FF'
            ;(e.currentTarget as HTMLElement).style.color = '#58A6FF'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
            ;(e.currentTarget as HTMLElement).style.color = '#555555'
          }}
        >
          <ChevronLeft size={10} />
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          padding: '8px 10px',
          borderBottom: '1px solid #2A2A2A',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#1F1F1F',
            border: '1px solid #2A2A2A',
            padding: '4px 8px',
            transition: 'border-color 150ms',
          }}
          onFocusCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#58A6FF')}
          onBlurCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A')}
        >
          <Search size={10} style={{ color: '#555555', flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH SESSIONS..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: '#E8E8E8',
              width: '100%',
              letterSpacing: '0.04em',
            }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div
        style={{
          padding: '6px 10px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        {(['ALL', 'TRANSCRIPTS', 'CHATS', 'FAVORITES'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.08em',
              padding: '2px 6px',
              border: '1px solid',
              borderColor: filter === f ? '#58A6FF' : '#2A2A2A',
              background: filter === f ? 'rgba(88,166,255,0.10)' : 'transparent',
              color: filter === f ? '#58A6FF' : '#555555',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              if (filter !== f) {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#888888'
                ;(e.currentTarget as HTMLElement).style.color = '#888888'
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== f) {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
                ;(e.currentTarget as HTMLElement).style.color = '#555555'
              }
            }}
          >
            {f === 'TRANSCRIPTS' ? 'TRANS' : f === 'FAVORITES' ? 'FAV' : f}
          </button>
        ))}
      </div>

      {/* Session count */}
      <div
        style={{
          padding: '5px 12px',
          borderBottom: '1px solid #2A2A2A',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#555555',
            letterSpacing: '0.08em',
          }}
        >
          {filtered.length} SESSION{filtered.length !== 1 ? 'S' : ''} FOUND
        </span>
      </div>

      {/* Session list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '24px 12px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: '#555555',
              lineHeight: 1.8,
            }}
          >
            ─────────────────
            <br />
            NO SESSIONS FOUND
            <br />─────────────────
          </div>
        ) : (
          filtered.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              active={session.id === activeSessionId}
              onClick={() => onSelectSession(session.id)}
            />
          ))
        )}
      </div>

      {/* New Session Button */}
      <div style={{ padding: '8px 10px', borderTop: '1px solid #2A2A2A', flexShrink: 0 }}>
        <button
          onClick={onNewSession}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 0',
            background: '#58A6FF',
            border: 'none',
            color: '#0A0A0A',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.10em',
            cursor: 'pointer',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#388BFD')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#58A6FF')}
        >
          <Plus size={10} />
          NEW SESSION
        </button>
      </div>
    </aside>
  )
}

function SessionCard({
  session,
  active,
  onClick,
}: {
  session: Session
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 12px',
        borderLeft: '2px solid',
        borderLeftColor: active ? '#58A6FF' : 'transparent',
        background: active ? 'rgba(88,166,255,0.06)' : hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 150ms',
        borderBottom: '1px solid #1A1A1A',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* ID + Type icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: '#58A6FF',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {session.id}
            </span>
            {session.type === 'transcript' ? (
              <FileText size={9} style={{ color: '#555555', flexShrink: 0 }} />
            ) : (
              <MessageSquare size={9} style={{ color: '#555555', flexShrink: 0 }} />
            )}
          </div>
          {/* Title */}
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              color: active ? '#E8E8E8' : '#888888',
              fontWeight: active ? 500 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '4px',
              lineHeight: 1.3,
            }}
          >
            {session.title}
          </div>
          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: '#555555',
                letterSpacing: '0.04em',
              }}
            >
              {session.date}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: '#555555',
                background: '#1F1F1F',
                padding: '1px 4px',
                border: '1px solid #2A2A2A',
              }}
            >
              {(session.wordCount / 1000).toFixed(1)}K
            </span>
          </div>
        </div>
        {/* Star */}
        {session.starred && (
          <Star
            size={10}
            style={{ color: '#58A6FF', fill: '#58A6FF', flexShrink: 0, marginTop: '2px' }}
          />
        )}
      </div>
    </div>
  )
}
