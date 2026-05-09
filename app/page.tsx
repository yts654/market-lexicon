'use client'

import { useCallback, useEffect, useState } from 'react'
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
import { MOCK_INSTRUMENTS, PriceColorMode, PRICE_COLOR_MODE_KEY } from '@/lib/market-data'
import { useT, Language } from '@/lib/i18n'

// ─── Top-level groups ───
type AppGroup = 'MARKETS' | 'LEARNING' | 'SETTINGS'
// ─── Learning sub-mode (transcript / chat) ───
type LearningSub = 'TRANSCRIPT' | 'CHAT'
// ─── Right panel tab in learning mode ───
type LearningRightTab = 'GLOSSARY' | 'NOTES'

export default function Page() {
  const { t, lang, toggleLang, setLang } = useT()
  const [group, setGroup] = useState<AppGroup>('MARKETS')
  const [learningSub, setLearningSub] = useState<LearningSub>('TRANSCRIPT')
  const [learningRightTab, setLearningRightTab] =
    useState<LearningRightTab>('GLOSSARY')
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS)
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(MOCK_GLOSSARY)
  const [activeSessionId, setActiveSessionId] = useState<string>('#0247')
  const [archiveCollapsed, setArchiveCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [highlightedTermId, setHighlightedTermId] = useState<string | undefined>()
  const [priceColorMode, setPriceColorMode] = useState<PriceColorMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(PRICE_COLOR_MODE_KEY) as PriceColorMode) || 'jp'
    }
    return 'jp'
  })

  useEffect(() => {
    localStorage.setItem(PRICE_COLOR_MODE_KEY, priceColorMode)
  }, [priceColorMode])

  const toggleColorMode = () =>
    setPriceColorMode((prev) => (prev === 'jp' ? 'en' : 'jp'))

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
        setGroup('MARKETS')
      } else if (mod && e.key === '2') {
        e.preventDefault()
        setGroup('LEARNING')
      } else if (mod && e.key === '3') {
        e.preventDefault()
        setGroup('SETTINGS')
      } else if (mod && e.key === 'b') {
        e.preventDefault()
        setArchiveCollapsed((v) => !v)
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

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id)
      if (activeSessionId === id) {
        setActiveSessionId(next[0]?.id ?? '')
      }
      return next
    })
  }

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
    setGroup('LEARNING')
  }

  const handleTermClick = useCallback(
    (termEnglish: string) => {
      const found = glossary.find(
        (term) => term.english.toLowerCase() === termEnglish.toLowerCase()
      )
      if (found) {
        setHighlightedTermId(found.id)
        setRightPanelCollapsed(false)
        setLearningRightTab('GLOSSARY')
      }
    },
    [glossary]
  )

  const handleTermUpdate = (id: string, mastered: boolean) => {
    setGlossary((prev) =>
      prev.map((term) => (term.id === id ? { ...term, mastered } : term))
    )
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100vw',
          overflow: 'auto',
          background: 'var(--bg-primary)',
        }}
      >
        <EditorialHeader />
        <TopTickerTape instruments={MOCK_INSTRUMENTS} colorMode={priceColorMode} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          {/* Left function rail (3 groups) */}
          <FunctionKeyRail group={group} onSelect={setGroup} />

          {/* Archive sidebar — only visible in LEARNING group */}
          {group === 'LEARNING' && (
            <ArchiveSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              collapsed={archiveCollapsed}
              onToggleCollapse={() => setArchiveCollapsed((v) => !v)}
            />
          )}

          {/* Center workspace */}
          <main
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'auto',
              background: 'var(--bg-primary)',
            }}
          >
            <SectionMarker group={group} />

            {group === 'LEARNING' && (
              <LearningSubSwitcher
                sub={learningSub}
                onSwitch={setLearningSub}
              />
            )}

            <div
              style={{
                flex: 1,
                overflow: 'auto',
                minHeight: 0,
                display: 'flex',
              }}
            >
              {group === 'MARKETS' && (
                <MarketsWorkspace
                  instruments={MOCK_INSTRUMENTS}
                  colorMode={priceColorMode}
                  onToggleColorMode={toggleColorMode}
                />
              )}
              {group === 'LEARNING' && learningSub === 'TRANSCRIPT' && (
                <TranscriptWorkspace onTermClick={handleTermClick} />
              )}
              {group === 'LEARNING' && learningSub === 'CHAT' && (
                <ChatWorkspace onTermClick={handleTermClick} />
              )}
              {group === 'SETTINGS' && (
                <SettingsCenterPanel
                  colorMode={priceColorMode}
                  onSetColorMode={setPriceColorMode}
                  lang={lang}
                  onSetLang={setLang}
                />
              )}
            </div>
          </main>

          {/* Right panel — depends on group */}
          {group === 'MARKETS' && !rightPanelCollapsed && (
            <RightPanelWrapper
              title={t('tab.markets')}
              onCollapse={() => setRightPanelCollapsed(true)}
            >
              <RightSidebarMarkets
                instruments={MOCK_INSTRUMENTS}
                colorMode={priceColorMode}
                onToggleColorMode={toggleColorMode}
              />
            </RightPanelWrapper>
          )}
          {group === 'LEARNING' && !rightPanelCollapsed && (
            <LearningRightPanel
              tab={learningRightTab}
              onTabChange={setLearningRightTab}
              onCollapse={() => setRightPanelCollapsed(true)}
              glossary={glossary}
              onTermUpdate={handleTermUpdate}
              activeTermId={highlightedTermId}
            />
          )}
          {(group === 'MARKETS' || group === 'LEARNING') && rightPanelCollapsed && (
            <CollapsedTab
              label={
                group === 'MARKETS'
                  ? t('tab.markets')
                  : learningRightTab === 'GLOSSARY'
                  ? t('tab.glossary')
                  : t('tab.notes')
              }
              onExpand={() => setRightPanelCollapsed(false)}
            />
          )}
        </div>

        <StatusBar
          sessionId={activeSessionId}
          group={group}
          termCount={glossary.length}
          isOnline
        />
      </div>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        sessions={sessions}
        terms={glossary}
        onSelectSession={(id) => {
          setActiveSessionId(id)
          setGroup('LEARNING')
          setCommandOpen(false)
        }}
        onSelectTerm={(id) => {
          setHighlightedTermId(id)
          setRightPanelCollapsed(false)
          setGroup('LEARNING')
          setLearningRightTab('GLOSSARY')
          setCommandOpen(false)
        }}
        onNewSession={() => {
          handleNewSession()
          setCommandOpen(false)
        }}
        onSwitchMode={(m) => {
          if (m === 'TRANSCRIPT') {
            setGroup('LEARNING')
            setLearningSub('TRANSCRIPT')
          } else if (m === 'CHAT') {
            setGroup('LEARNING')
            setLearningSub('CHAT')
          }
          setCommandOpen(false)
        }}
      />
    </>
  )
}

// ─────────────────────────────────────────────
// Editorial Header
// ─────────────────────────────────────────────
function EditorialHeader() {
  const { t, lang, toggleLang } = useT()
  const [dateTimeStr, setDateTimeStr] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      if (lang === 'jp') {
        const daysJa = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
        const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${daysJa[now.getDay()]}）`
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} JST`
        setDateTimeStr(`${dateStr} · 東京 · ${timeStr}`)
      } else {
        const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const monthsEn = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ]
        const dateStr = `${daysEn[now.getDay()]}, ${monthsEn[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} JST`
        setDateTimeStr(`${dateStr} · Tokyo · ${timeStr}`)
      }
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [lang])

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
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--accent-gold)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            letterSpacing: '-0.01em',
          }}
        >
          Market Lexicon
        </span>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          letterSpacing: '0',
        }}
      >
        {dateTimeStr ?? ' '}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          aria-label="Toggle language"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.10em',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            padding: '3px 8px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor =
              'var(--accent-gold)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor =
              'var(--border-subtle)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
          }}
        >
          <span
            style={{
              color: lang === 'jp' ? 'var(--accent-gold)' : 'var(--text-tertiary)',
            }}
          >
            JP
          </span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span
            style={{
              color: lang === 'en' ? 'var(--accent-gold)' : 'var(--text-tertiary)',
            }}
          >
            EN
          </span>
        </button>
        <button
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {t('header.signIn')}
        </button>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────
// Section Marker
// ─────────────────────────────────────────────
function SectionMarker({ group }: { group: AppGroup }) {
  const { t } = useT()
  const meta: Record<AppGroup, { numeral: string; subtitleKey: string; titleKey: string }> = {
    MARKETS: {
      numeral: 'I',
      subtitleKey: 'section.markets.subtitle',
      titleKey: 'section.markets.title',
    },
    LEARNING: {
      numeral: 'II',
      subtitleKey: 'section.learning.subtitle',
      titleKey: 'section.learning.title',
    },
    SETTINGS: {
      numeral: 'III',
      subtitleKey: 'section.settings.subtitle',
      titleKey: 'section.settings.title',
    },
  }
  const m = meta[group]
  return (
    <div
      style={{
        padding: '16px 20px 12px',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '14px',
            fontWeight: 400,
            color: 'var(--accent-gold-dim)',
            marginTop: '2px',
          }}
        >
          {m.numeral}
        </span>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: '4px',
            }}
          >
            {t(m.subtitleKey as any)}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {t(m.titleKey as any)}
          </h1>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Function Key Left Rail
// ─────────────────────────────────────────────
function FunctionKeyRail({
  group,
  onSelect,
}: {
  group: AppGroup
  onSelect: (g: AppGroup) => void
}) {
  const { t } = useT()
  const keys: { key: AppGroup; labelKey: string; numeral: string }[] = [
    { key: 'MARKETS', labelKey: 'rail.markets', numeral: 'I' },
    { key: 'LEARNING', labelKey: 'rail.learning', numeral: 'II' },
    { key: 'SETTINGS', labelKey: 'rail.settings', numeral: 'III' },
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
        flexShrink: 0,
      }}
    >
      {keys.map(({ key, labelKey, numeral }) => {
        const isActive = group === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              height: '64px',
              background: 'transparent',
              border: 'none',
              borderLeft: isActive
                ? '2px solid var(--accent-gold)'
                : '2px solid transparent',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '11px',
                fontWeight: 400,
                color: isActive ? 'var(--text-primary)' : 'var(--accent-gold-dim)',
                fontStyle: 'normal',
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
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {t(labelKey as any)}
            </span>
          </button>
        )
      })}

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: '16px 8px',
          textAlign: 'center',
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
            padding: 0,
          }}
        >
          {t('rail.help')}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Learning Sub-Switcher (transcript / chat)
// ─────────────────────────────────────────────
function LearningSubSwitcher({
  sub,
  onSwitch,
}: {
  sub: LearningSub
  onSwitch: (s: LearningSub) => void
}) {
  const { t } = useT()
  const tabs: { key: LearningSub; labelKey: string }[] = [
    { key: 'TRANSCRIPT', labelKey: 'mode.transcript' },
    { key: 'CHAT', labelKey: 'mode.chat' },
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
        flexShrink: 0,
      }}
    >
      {tabs.map(({ key, labelKey }) => {
        const active = sub === key
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
              borderBottom: active
                ? '1px solid var(--accent-gold)'
                : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 150ms',
              marginBottom: '-1px',
            }}
          >
            {t(labelKey as any)}
          </button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// Right Panel Wrapper (used for Markets group)
// ─────────────────────────────────────────────
function RightPanelWrapper({
  title,
  onCollapse,
  children,
}: {
  title: string
  onCollapse: () => void
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        width: '320px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-medium)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </span>
        <button
          onClick={onCollapse}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-serif)',
            fontSize: '14px',
          }}
        >
          ›
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Learning Right Panel (Glossary / Notes)
// ─────────────────────────────────────────────
function LearningRightPanel({
  tab,
  onTabChange,
  onCollapse,
  glossary,
  onTermUpdate,
  activeTermId,
}: {
  tab: LearningRightTab
  onTabChange: (tab: LearningRightTab) => void
  onCollapse: () => void
  glossary: GlossaryTerm[]
  onTermUpdate: (id: string, mastered: boolean) => void
  activeTermId?: string
}) {
  const { t } = useT()
  return (
    <div
      style={{
        width: '320px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        role="tablist"
        style={{
          height: '44px',
          display: 'flex',
          alignItems: 'stretch',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-medium)',
          flexShrink: 0,
        }}
      >
        {(['GLOSSARY', 'NOTES'] as LearningRightTab[]).map((key) => {
          const active = tab === key
          const labelKey = key === 'GLOSSARY' ? 'tab.glossary' : 'tab.notes'
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(key)}
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
                borderBottom: active
                  ? '1px solid var(--accent-gold)'
                  : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              {t(labelKey as any)}
            </button>
          )
        })}
        <button
          onClick={onCollapse}
          style={{
            padding: '0 12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-serif)',
            fontSize: '14px',
          }}
          aria-label="Collapse panel"
        >
          ›
        </button>
      </div>

      <div role="tabpanel" style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'GLOSSARY' && (
          <GlossaryPanel
            terms={glossary}
            onTermUpdate={onTermUpdate}
            activeTermId={activeTermId}
            collapsed={false}
            onToggleCollapse={onCollapse}
          />
        )}
        {tab === 'NOTES' && (
          <div
            style={{
              padding: '24px 20px',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--text-tertiary)',
            }}
          >
            {t('panel.notes.placeholder')}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Collapsed-tab vertical handle
// ─────────────────────────────────────────────
function CollapsedTab({
  label,
  onExpand,
}: {
  label: string
  onExpand: () => void
}) {
  return (
    <button
      onClick={onExpand}
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
        flexShrink: 0,
      }}
      aria-label="Expand panel"
    >
      <span
        style={{
          writingMode: 'vertical-rl',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </span>
    </button>
  )
}

// ─────────────────────────────────────────────
// Settings (now full-width center panel for SETTINGS group)
// ─────────────────────────────────────────────
const KEYBOARD_SHORTCUTS: Array<{ keys: string; labelKey: string }> = [
  { keys: '⌘ K', labelKey: 'settings.shortcut.palette' },
  { keys: '⌘ N', labelKey: 'settings.shortcut.newSession' },
  { keys: '⌘ 1', labelKey: 'rail.markets' },
  { keys: '⌘ 2', labelKey: 'rail.learning' },
  { keys: '⌘ 3', labelKey: 'rail.settings' },
  { keys: '⌘ B', labelKey: 'settings.shortcut.toggleLeft' },
  { keys: '⌘ G', labelKey: 'settings.shortcut.toggleRight' },
]

function SettingsCenterPanel({
  colorMode,
  onSetColorMode,
  lang,
  onSetLang,
}: {
  colorMode: PriceColorMode
  onSetColorMode: (mode: PriceColorMode) => void
  lang: Language
  onSetLang: (l: Language) => void
}) {
  const { t } = useT()
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 40px',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '720px',
      }}
    >
      {/* Language */}
      <SettingsSection labelKey="settings.lang.label">
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['jp', 'en'] as Language[]).map((option) => {
            const active = lang === option
            const labelKey = option === 'jp' ? 'settings.lang.jp' : 'settings.lang.en'
            return (
              <button
                key={option}
                onClick={() => onSetLang(option)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: active ? 'var(--bg-tertiary)' : 'transparent',
                  border: '1px solid',
                  borderColor: active
                    ? 'var(--accent-gold)'
                    : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                {t(labelKey as any)}
              </button>
            )
          })}
        </div>
      </SettingsSection>

      {/* Price color */}
      <SettingsSection labelKey="settings.colorMode.label">
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['jp', 'en'] as PriceColorMode[]).map((mode) => {
            const active = colorMode === mode
            const labelKey =
              mode === 'jp' ? 'settings.colorMode.jp' : 'settings.colorMode.en'
            return (
              <button
                key={mode}
                onClick={() => onSetColorMode(mode)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: active ? 'var(--bg-tertiary)' : 'transparent',
                  border: '1px solid',
                  borderColor: active
                    ? 'var(--accent-gold)'
                    : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color:
                        mode === 'jp' ? 'var(--price-up)' : 'var(--price-up-western)',
                    }}
                  >
                    ▲
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color:
                        mode === 'jp'
                          ? 'var(--price-down)'
                          : 'var(--price-down-western)',
                    }}
                  >
                    ▼
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    fontWeight: 500,
                    color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {t(labelKey as any)}
                </span>
              </button>
            )
          })}
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            lineHeight: 1.6,
          }}
        >
          {colorMode === 'jp'
            ? t('settings.colorMode.descJp')
            : t('settings.colorMode.descEn')}
        </p>
      </SettingsSection>

      {/* Shortcuts */}
      <SettingsSection labelKey="settings.shortcuts.label">
        <div>
          {KEYBOARD_SHORTCUTS.map(({ keys, labelKey }) => (
            <div
              key={keys}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                {t(labelKey as any)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2px 6px',
                }}
              >
                {keys}
              </span>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* About */}
      <SettingsSection labelKey="settings.about">
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            lineHeight: 1.7,
          }}
        >
          Market Lexicon — {t('brand.tagline')}
        </p>
      </SettingsSection>
    </div>
  )
}

function SettingsSection({
  labelKey,
  children,
}: {
  labelKey: string
  children: React.ReactNode
}) {
  const { t } = useT()
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          marginBottom: '12px',
        }}
      >
        {t(labelKey as any)}
      </div>
      {children}
    </div>
  )
}
