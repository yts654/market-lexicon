'use client'

import { useCallback, useEffect, useState } from 'react'
import { TerminalHeader } from '@/components/market-lexicon/TerminalHeader'
import { StatusBar } from '@/components/market-lexicon/StatusBar'
import { ArchiveSidebar } from '@/components/market-lexicon/ArchiveSidebar'
import { TranscriptWorkspace } from '@/components/market-lexicon/TranscriptWorkspace'
import { ChatWorkspace } from '@/components/market-lexicon/ChatWorkspace'
import { GlossaryPanel } from '@/components/market-lexicon/GlossaryPanel'
import { CommandPalette } from '@/components/market-lexicon/CommandPalette'
import { TopTickerTape } from '@/components/markets/TopTickerTape'
import { MarketsWorkspace } from '@/components/markets/MarketsWorkspace'
import { RightSidebarMarkets } from '@/components/markets/RightSidebarMarkets'
import {
  MOCK_SESSIONS,
  MOCK_GLOSSARY,
  GlossaryTerm,
  Session,
} from '@/lib/market-lexicon-data'
import { MOCK_INSTRUMENTS, PriceColorMode } from '@/lib/market-data'

type WorkspaceMode = 'TRANSCRIPT' | 'CHAT' | 'MARKETS'
type SidebarTab = 'GLOSSARY' | 'MARKETS' | 'NOTES'

export default function Page() {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('MARKETS')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('MARKETS')
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS)
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(MOCK_GLOSSARY)
  const [activeSessionId, setActiveSessionId] = useState<string>('#0247')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [highlightedTermId, setHighlightedTermId] = useState<string | undefined>()
  const [dailyTerm] = useState(MOCK_GLOSSARY[Math.floor(Math.random() * MOCK_GLOSSARY.length)])
  const [priceColorMode, setPriceColorMode] = useState<PriceColorMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('marketLexicon.priceColorMode') as PriceColorMode) || 'jp'
    }
    return 'jp'
  })

  // Persist color mode
  useEffect(() => {
    localStorage.setItem('marketLexicon.priceColorMode', priceColorMode)
  }, [priceColorMode])

  const toggleColorMode = () => {
    setPriceColorMode(prev => prev === 'jp' ? 'en' : 'jp')
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((v) => !v)
      } else if (mod && e.key === 'n') {
        e.preventDefault()
        handleNewSession()
      } else if (mod && e.key === '1') {
        e.preventDefault()
        setWorkspaceMode('TRANSCRIPT')
      } else if (mod && e.key === '2') {
        e.preventDefault()
        setWorkspaceMode('CHAT')
      } else if (mod && e.key === '3') {
        e.preventDefault()
        setWorkspaceMode('MARKETS')
      } else if (mod && e.key === 'b') {
        e.preventDefault()
        setSidebarCollapsed((v) => !v)
      } else if (mod && e.key === 'g') {
        e.preventDefault()
        setRightPanelCollapsed((v) => !v)
      } else if (e.key === 'Escape') {
        setCommandOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleNewSession = () => {
    const newId = `#${String(sessions[0].idNum + 1).padStart(4, '0')}`
    const newSession: Session = {
      id: newId,
      idNum: sessions[0].idNum + 1,
      title: 'New Session',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      wordCount: 0,
      type: 'transcript',
      starred: false,
      tags: [],
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newId)
  }

  const handleTermClick = useCallback(
    (termEnglish: string) => {
      const found = glossary.find(
        (t) => t.english.toLowerCase() === termEnglish.toLowerCase()
      )
      if (found) {
        setHighlightedTermId(found.id)
        setRightPanelCollapsed(false)
        setSidebarTab('GLOSSARY')
      }
    },
    [glossary]
  )

  const handleTermUpdate = (id: string, mastered: boolean) => {
    setGlossary((prev) =>
      prev.map((t) => (t.id === id ? { ...t, mastered } : t))
    )
  }

  const handleFunctionKey = (key: string) => {
    switch (key) {
      case 'MKT':
        setWorkspaceMode('MARKETS')
        break
      case 'TXN':
        setWorkspaceMode('TRANSCRIPT')
        break
      case 'DEF':
        setSidebarTab('GLOSSARY')
        setRightPanelCollapsed(false)
        break
      case 'SET':
        break
    }
  }

  const totalTermsLearned = glossary.filter((t) => t.mastered).length

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
        }}
      >
        {/* Editorial Header */}
        <EditorialHeader />

        {/* Top Ticker Tape */}
        <TopTickerTape instruments={MOCK_INSTRUMENTS} colorMode={priceColorMode} />

        {/* Main layout: function rail + sidebar + center + right panel */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {/* Function Key Left Rail - Editorial Style */}
          <FunctionKeyRail 
            activeKey={workspaceMode === 'MARKETS' ? 'MKT' : workspaceMode === 'TRANSCRIPT' ? 'TXN' : 'TXN'} 
            onSelect={handleFunctionKey} 
          />

          {/* Left sidebar */}
          <ArchiveSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewSession={handleNewSession}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
          />

          {/* Center panel */}
          <main
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden',
              background: 'var(--bg-primary)',
            }}
          >
            {/* Section Marker */}
            <SectionMarker 
              numeral={workspaceMode === 'MARKETS' ? 'I' : workspaceMode === 'TRANSCRIPT' ? 'II' : 'III'}
              subtitle={workspaceMode === 'MARKETS' ? 'GLOBAL MARKETS' : workspaceMode === 'TRANSCRIPT' ? 'TRANSCRIPTS' : 'CHAT'}
              title={workspaceMode === 'MARKETS' ? 'Asia · United States · Europe' : workspaceMode === 'TRANSCRIPT' ? 'Financial English Learning' : 'Interactive Analysis'}
            />

            {/* Mode switcher tabs */}
            <ModeSwitcher mode={workspaceMode} onSwitch={setWorkspaceMode} />

            {/* Workspace */}
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex' }}>
              {workspaceMode === 'TRANSCRIPT' ? (
                <TranscriptWorkspace onTermClick={handleTermClick} />
              ) : workspaceMode === 'CHAT' ? (
                <ChatWorkspace onTermClick={handleTermClick} />
              ) : (
                <MarketsWorkspace
                  instruments={MOCK_INSTRUMENTS}
                  colorMode={priceColorMode}
                  onToggleColorMode={toggleColorMode}
                />
              )}
            </div>
          </main>

          {/* Right panel with tabs */}
          <RightPanel
            tab={sidebarTab}
            onTabChange={setSidebarTab}
            collapsed={rightPanelCollapsed}
            onToggleCollapse={() => setRightPanelCollapsed((v) => !v)}
            glossary={glossary}
            onTermUpdate={handleTermUpdate}
            activeTermId={highlightedTermId}
            instruments={MOCK_INSTRUMENTS}
            colorMode={priceColorMode}
            onToggleColorMode={toggleColorMode}
          />
        </div>

        {/* Bottom status bar */}
        <StatusBar
          sessionId={activeSessionId}
          mode={workspaceMode}
          termCount={glossary.length}
          isOnline
        />
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        sessions={sessions}
        terms={glossary}
        onSelectSession={(id) => {
          setActiveSessionId(id)
          setCommandOpen(false)
        }}
        onSelectTerm={(id) => {
          setHighlightedTermId(id)
          setRightPanelCollapsed(false)
          setSidebarTab('GLOSSARY')
          setCommandOpen(false)
        }}
        onNewSession={() => {
          handleNewSession()
          setCommandOpen(false)
        }}
        onSwitchMode={(m) => {
          setWorkspaceMode(m as WorkspaceMode)
          setCommandOpen(false)
        }}
      />
    </>
  )
}

// ─────────────────────────────────────────────
// Editorial Header - Top of page
// ─────────────────────────────────────────────
function EditorialHeader() {
  const [dateTimeStr, setDateTimeStr] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const daysJa = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
      const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${daysJa[now.getDay()]}）`
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} JST`
      setDateTimeStr(`${dateStr} · 東京 · ${timeStr}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header
      style={{
        height: '40px',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--accent-gold)'
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            letterSpacing: '-0.01em'
          }}
        >
          Market Lexicon
        </span>
      </div>

      {/* Center: Date/Time */}
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          letterSpacing: '0'
        }}
      >
        {dateTimeStr ?? '\u00A0'}
      </span>

      {/* Right: Sign In */}
      <button
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}
      >
        ログイン
      </button>
    </header>
  )
}

// ─────────────────────────────────────────────
// Section Marker - Editorial chapter heading
// ─────────────────────────────────────────────
function SectionMarker({ numeral, subtitle, title }: { numeral: string; subtitle: string; title: string }) {
  return (
    <div
      style={{
        padding: '16px 20px 12px',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Roman numeral */}
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '14px',
            fontWeight: 400,
            color: 'var(--accent-gold-dim)',
            marginTop: '2px'
          }}
        >
          {numeral}
        </span>
        <div>
          {/* Subtitle */}
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: '4px'
            }}
          >
            {subtitle}
          </div>
          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: 0
            }}
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Function Key Left Rail - Editorial Style
// ─────────────────────────────────────────────
function FunctionKeyRail({ activeKey, onSelect }: { activeKey: string; onSelect: (key: string) => void }) {
  const keys = [
    { key: 'MKT', label: 'マーケット', numeral: 'I' },
    { key: 'TXN', label: 'トランスクリプト', numeral: 'II' },
    { key: 'DEF', label: '用語集', numeral: 'III' },
    { key: 'SET', label: '設定', numeral: 'IV' }
  ]

  return (
    <div
      style={{
        width: '80px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '16px',
        flexShrink: 0
      }}
    >
      {keys.map(({ key, label, numeral }) => {
        const isActive = activeKey === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              height: '64px',
              background: 'transparent',
              border: 'none',
              borderLeft: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '11px',
                fontWeight: 400,
                color: isActive ? 'var(--text-primary)' : 'var(--accent-gold-dim)',
                fontStyle: isActive ? 'normal' : 'normal'
              }}
            >
              {numeral}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '9px',
                fontWeight: 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              {label}
            </span>
          </button>
        )
      })}

      <div style={{ flex: 1 }} />

      {/* Help link */}
      <div
        style={{
          padding: '16px 8px',
          textAlign: 'center'
        }}
      >
        <button
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ヘルプ
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Right Panel with Tabs - Editorial Style
// ─────────────────────────────────────────────
function RightPanel({
  tab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  glossary,
  onTermUpdate,
  activeTermId,
  instruments,
  colorMode,
  onToggleColorMode
}: {
  tab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  collapsed: boolean
  onToggleCollapse: () => void
  glossary: GlossaryTerm[]
  onTermUpdate: (id: string, mastered: boolean) => void
  activeTermId?: string
  instruments: typeof MOCK_INSTRUMENTS
  colorMode: PriceColorMode
  onToggleColorMode: () => void
}) {
  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        style={{
          width: '36px',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          flexShrink: 0
        }}
      >
        <span
          style={{
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.02em'
          }}
        >
          {tab === 'MARKETS' ? 'Markets' : tab === 'GLOSSARY' ? 'Glossary' : 'Notes'}
        </span>
      </button>
    )
  }

  return (
    <div
      style={{
        width: '320px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      {/* Tab strip */}
      <div
        role="tablist"
        style={{
          height: '44px',
          display: 'flex',
          alignItems: 'stretch',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-medium)',
          flexShrink: 0
        }}
      >
        {(['MARKETS', 'GLOSSARY', 'NOTES'] as SidebarTab[]).map((t) => {
          const active = tab === t
          const label = t === 'MARKETS' ? 'Markets' : t === 'GLOSSARY' ? 'Glossary' : 'Notes'
          return (
            <button
              key={t}
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(t)}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '1px solid var(--accent-gold)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 150ms'
              }}
            >
              {label}
            </button>
          )
        })}
        <button
          onClick={onToggleCollapse}
          style={{
            padding: '0 12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-serif)',
            fontSize: '14px'
          }}
          aria-label="Collapse panel"
        >
          ›
        </button>
      </div>

      {/* Tab content */}
      <div role="tabpanel" style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'GLOSSARY' && (
          <GlossaryPanel
            terms={glossary}
            onTermUpdate={onTermUpdate}
            activeTermId={activeTermId}
            collapsed={false}
            onToggleCollapse={onToggleCollapse}
          />
        )}
        {tab === 'MARKETS' && (
          <RightSidebarMarkets
            instruments={instruments}
            colorMode={colorMode}
            onToggleColorMode={onToggleColorMode}
          />
        )}
        {tab === 'NOTES' && (
          <div
            style={{
              padding: '24px 20px',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--text-tertiary)'
            }}
          >
            Notes feature coming soon.
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Mode Switcher - Editorial Style Tabs
// ─────────────────────────────────────────────
function ModeSwitcher({ mode, onSwitch }: { mode: WorkspaceMode; onSwitch: (m: WorkspaceMode) => void }) {
  const tabs: { key: WorkspaceMode; label: string }[] = [
    { key: 'MARKETS', label: 'Markets' },
    { key: 'TRANSCRIPT', label: 'Transcripts' },
    { key: 'CHAT', label: 'Chat' }
  ]

  return (
    <div
      role="tablist"
      style={{
        height: '44px',
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-medium)',
        padding: '0 20px',
        flexShrink: 0
      }}
    >
      {tabs.map(({ key, label }) => {
        const active = mode === key
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onSwitch(key)}
            style={{
              padding: '0 16px',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: 'transparent',
              border: 'none',
              borderBottom: active ? '1px solid var(--accent-gold)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 150ms',
              marginBottom: '-1px'
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
