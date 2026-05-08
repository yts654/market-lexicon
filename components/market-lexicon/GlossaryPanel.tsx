'use client'

import { useState } from 'react'
import { GlossaryTerm, GlossarySortType } from '@/lib/market-lexicon-data'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useT } from '@/lib/i18n'

interface GlossaryPanelProps {
  terms: GlossaryTerm[]
  onTermUpdate: (id: string, mastered: boolean) => void
  activeTermId?: string
  collapsed: boolean
  onToggleCollapse: () => void
}

export function GlossaryPanel({
  terms,
  onTermUpdate,
  activeTermId,
  collapsed,
  onToggleCollapse,
}: GlossaryPanelProps) {
  const { t } = useT()
  const [sort, setSort] = useState<GlossarySortType>('FREQUENCY')
  const [selectedId, setSelectedId] = useState<string | undefined>(activeTermId)
  const [search, setSearch] = useState('')

  const sorted = [...terms]
    .filter(
      (t) =>
        search === '' ||
        t.english.toLowerCase().includes(search.toLowerCase()) ||
        t.japanese.includes(search)
    )
    .sort((a, b) => {
      switch (sort) {
        case 'FREQUENCY':
          return b.seenCount - a.seenCount
        case 'ALPHABETICAL':
          return a.english.localeCompare(b.english)
        case 'RECENT':
          return b.lastSeen.localeCompare(a.lastSeen)
        case 'NOT MASTERED':
          if (a.mastered === b.mastered) return b.seenCount - a.seenCount
          return a.mastered ? 1 : -1
        default:
          return 0
      }
    })

  const masteredCount = terms.filter((t) => t.mastered).length
  const selectedTerm = terms.find((t) => t.id === selectedId)

  // When used inside RightPanel, collapsed state is handled by parent
  if (collapsed) {
    return null
  }

  // Original collapsed UI removed - now parent handles this
  const _collapsedPlaceholder = (
      <div
        style={{
          width: '36px',
          background: '#141414',
          borderLeft: '1px solid #2A2A2A',
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
          <ChevronLeft size={12} />
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
          GLOSSARY
        </div>
      </div>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--bg-panel)',
      }}
    >
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="label-caps">{t('glossary.header')}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: '#00D964',
              background: 'rgba(0,217,100,0.1)',
              border: '1px solid rgba(0,217,100,0.2)',
              padding: '1px 5px',
            }}
          >
            {masteredCount}/{terms.length}
          </span>
        </div>
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
          <ChevronRight size={10} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '6px 12px', borderBottom: '1px solid #2A2A2A', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', letterSpacing: '0.08em' }}>
            {t('glossary.progress.label')}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#00D964', letterSpacing: '0.08em' }}>
            {Math.round((masteredCount / terms.length) * 100)}%
          </span>
        </div>
        <div style={{ height: '3px', background: '#1F1F1F', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${(masteredCount / terms.length) * 100}%`,
              background: '#00D964',
              transition: 'width 300ms ease',
            }}
          />
        </div>
      </div>

      {/* Sort + Search */}
      <div
        style={{
          padding: '6px 10px',
          borderBottom: '1px solid #2A2A2A',
          flexShrink: 0,
        }}
      >
        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('glossary.search.placeholder')}
          style={{
            width: '100%',
            background: '#1F1F1F',
            border: '1px solid #2A2A2A',
            outline: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#E8E8E8',
            padding: '4px 8px',
            letterSpacing: '0.04em',
            marginBottom: '6px',
            transition: 'border-color 150ms',
          }}
          onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#58A6FF')}
          onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A')}
        />
        {/* Sort chips */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {(['FREQUENCY', 'ALPHABETICAL', 'RECENT', 'NOT MASTERED'] as GlossarySortType[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.08em',
                  padding: '2px 5px',
                  border: '1px solid',
                  borderColor: sort === s ? '#58A6FF' : '#2A2A2A',
                  background: sort === s ? 'rgba(88,166,255,0.10)' : 'transparent',
                  color: sort === s ? '#58A6FF' : '#555555',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {s === 'FREQUENCY'
                  ? t('glossary.sort.frequency')
                  : s === 'ALPHABETICAL'
                  ? t('glossary.sort.alphabetical')
                  : s === 'RECENT'
                  ? t('glossary.sort.recent')
                  : t('glossary.sort.unmastered')}
              </button>
            )
          )}
        </div>
      </div>

      {/* If a term is selected, show detail view */}
      {selectedTerm ? (
        <TermDetailView
          term={selectedTerm}
          onClose={() => setSelectedId(undefined)}
          onMasteredToggle={(mastered) => {
            onTermUpdate(selectedTerm.id, mastered)
          }}
        />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sorted.map((term) => (
            <TermCard
              key={term.id}
              term={term}
              onMasteredToggle={(mastered) => onTermUpdate(term.id, mastered)}
              onClick={() => setSelectedId(term.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TermCard({
  term,
  onMasteredToggle,
  onClick,
}: {
  term: GlossaryTerm
  onMasteredToggle: (mastered: boolean) => void
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 12px',
        borderBottom: '1px solid #1A1A1A',
        background: hovered ? 'rgba(255,255,255,0.015)' : 'transparent',
        transition: 'background 150ms',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        {/* Mastery toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMasteredToggle(!term.mastered)
          }}
          style={{
            width: '16px',
            height: '16px',
            flexShrink: 0,
            marginTop: '2px',
            border: '1px solid',
            borderColor: term.mastered ? '#00D964' : '#2A2A2A',
            background: term.mastered ? 'rgba(0,217,100,0.15)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            if (!term.mastered)
              (e.currentTarget as HTMLElement).style.borderColor = '#00D964'
          }}
          onMouseLeave={(e) => {
            if (!term.mastered)
              (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
          }}
        >
          {term.mastered && <Check size={9} style={{ color: '#00D964' }} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }} onClick={onClick}>
          {/* Term + freq */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '2px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: term.mastered ? '#888888' : '#E8E8E8',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textDecoration: term.mastered ? 'line-through' : 'none',
                textDecorationColor: '#555555',
              }}
            >
              {term.english}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: '#555555',
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}
            >
              {term.seenCount}×
            </span>
          </div>
          {/* JP */}
          <div
            className="font-jp"
            style={{
              fontSize: '0.65rem',
              color: '#888888',
              marginBottom: '3px',
            }}
          >
            {term.japanese}
          </div>
          {/* Definition */}
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              color: '#555555',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
            }}
          >
            {term.definitionJP}
          </p>
        </div>
      </div>
    </div>
  )
}

function TermDetailView({
  term,
  onClose,
  onMasteredToggle,
}: {
  term: GlossaryTerm
  onClose: () => void
  onMasteredToggle: (mastered: boolean) => void
}) {
  const { t } = useT()
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Detail header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#1A1A1A',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#888888',
            background: 'transparent',
            border: '1px solid #2A2A2A',
            padding: '3px 7px',
            cursor: 'pointer',
            transition: 'all 150ms',
            letterSpacing: '0.06em',
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
          {t('glossary.detail.back')}
        </button>
        <span className="label-caps" style={{ fontSize: '0.6rem' }}>
          {t('glossary.detail.title')}
        </span>
      </div>

      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Main term */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              color: '#58A6FF',
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginBottom: '4px',
            }}
          >
            {term.english}
          </div>
          <div
            className="font-jp"
            style={{ fontSize: '0.8rem', color: '#E8E8E8', marginBottom: '2px' }}
          >
            {term.japanese}
          </div>
          <div
            className="font-jp"
            style={{ fontSize: '0.65rem', color: '#888888' }}
          >
            {term.reading}
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
          }}
        >
          {[
            { label: t('glossary.detail.seen'), value: `${term.seenCount}×` },
            { label: t('glossary.detail.category'), value: term.category },
            { label: t('glossary.detail.lastSeen'), value: term.lastSeen },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                padding: '6px 8px',
                background: '#1F1F1F',
                border: '1px solid #2A2A2A',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#555555', letterSpacing: '0.10em', marginBottom: '3px' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#E8E8E8', fontWeight: 600 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Definition JP */}
        <div style={{ borderLeft: '2px solid #58A6FF', paddingLeft: '10px' }}>
          <div className="label-caps" style={{ fontSize: '0.55rem', marginBottom: '6px' }}>
            {t('glossary.detail.definition')}
          </div>
          <p
            className="font-jp"
            style={{ margin: 0, fontSize: '0.75rem', color: '#E8E8E8', lineHeight: 1.9 }}
          >
            {term.definitionJP}
          </p>
        </div>

        {/* English definition */}
        <div style={{ borderLeft: '2px solid #2A2A2A', paddingLeft: '10px' }}>
          <div className="label-caps-muted" style={{ fontSize: '0.55rem', marginBottom: '6px' }}>
            {t('glossary.detail.english')}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              color: '#C8C8C8',
              lineHeight: 1.7,
            }}
          >
            {term.definition}
          </p>
        </div>

        {/* Etymology */}
        {term.etymology && (
          <div>
            <div className="label-caps-muted" style={{ fontSize: '0.55rem', marginBottom: '6px' }}>
              {t('glossary.detail.etymology')}
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: '#888888',
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              {term.etymology}
            </p>
          </div>
        )}

        {/* Example */}
        {term.example && (
          <div
            style={{
              padding: '10px',
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
            }}
          >
            <div className="label-caps" style={{ fontSize: '0.55rem', marginBottom: '6px' }}>
              {t('glossary.detail.usage')}
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                color: '#C8C8C8',
                lineHeight: 1.7,
                marginBottom: '6px',
              }}
            >
              {term.example}
            </p>
            {term.exampleJP && (
              <p
                className="font-jp"
                style={{ margin: 0, fontSize: '0.68rem', color: '#888888', lineHeight: 1.8 }}
              >
                {term.exampleJP}
              </p>
            )}
          </div>
        )}

        {/* Mastery toggle */}
        <button
          onClick={() => onMasteredToggle(!term.mastered)}
          style={{
            width: '100%',
            padding: '9px',
            background: term.mastered ? 'rgba(0,217,100,0.10)' : 'transparent',
            border: '1px solid',
            borderColor: term.mastered ? '#00D964' : '#2A2A2A',
            color: term.mastered ? '#00D964' : '#888888',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.10em',
            cursor: 'pointer',
            transition: 'all 150ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (!term.mastered) {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#00D964'
              ;(e.currentTarget as HTMLElement).style.color = '#00D964'
            }
          }}
          onMouseLeave={(e) => {
            if (!term.mastered) {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
              ;(e.currentTarget as HTMLElement).style.color = '#888888'
            }
          }}
        >
          {term.mastered ? (
            <>
              <Check size={12} />
              {t('glossary.detail.unmark')}
            </>
          ) : (
            t('glossary.detail.markMastered')
          )}
        </button>
      </div>
    </div>
  )
}
