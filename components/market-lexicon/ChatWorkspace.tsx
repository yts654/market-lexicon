'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatMessage, MOCK_CHAT } from '@/lib/market-lexicon-data'
import { ChevronRight, RotateCcw, Zap, List, TrendingUp } from 'lucide-react'

const QUICK_REPLIES = [
  'What does "basis point" mean?',
  'Explain "yield curve inversion"',
  'What is a "carry trade"?',
  'Explain "quantitative tightening"',
]

interface ChatWorkspaceProps {
  onTermClick: (term: string) => void
}

export function ChatWorkspace({ onTermClick }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT)
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingDot, setProcessingDot] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isProcessing])

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date().toTimeString().slice(0, 8),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsProcessing(true)

    let dot = 0
    const iv = setInterval(() => {
      dot = (dot + 1) % 3
      setProcessingDot(dot)
    }, 350)

    setTimeout(() => {
      clearInterval(iv)
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: 'assistant',
        content:
          'This is a simulated response. In production, this would call the AI API to generate a real translation and term breakdown based on your input.',
        timestamp: new Date().toTimeString().slice(0, 8),
        translation:
          'これはシミュレーションされた応答です。本番環境では、AIのAPIを呼び出して入力に基づいた翻訳と用語解説を生成します。実際の実装ではClaude/GPT-4oを使用し、金融英語の専門的な解説を日本語で提供します。',
        keyTerms: [
          {
            term: 'API INTEGRATION',
            reading: 'API連携',
            definition: '翻訳エンジンとの接続。本番環境ではAnthropicまたはOpenAI APIを使用。',
          },
          {
            term: 'PRODUCTION READY',
            reading: '本番対応済み',
            definition: 'このインターフェースはバックエンド接続後にフル機能で動作します。',
          },
        ],
        marketContext:
          'バックエンドAPIに接続すると、Goldman Sachsのアナリストが実際に使うような高精度の金融用語解説が生成されます。各レスポンスには市場コンテキスト、語源、実際の使用例が含まれます。',
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsProcessing(false)
    }, 1800)
  }

  const handleClear = () => {
    setMessages([])
  }

  const dots = ['.  ', '.. ', '...']

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
        <span className="label-caps">INTERACTIVE SESSION</span>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#555555',
            letterSpacing: '0.08em',
          }}
        >
          {messages.length} MESSAGES
        </span>
        <button
          onClick={handleClear}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#555555',
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
            ;(e.currentTarget as HTMLElement).style.borderColor = '#FF3B3B'
            ;(e.currentTarget as HTMLElement).style.color = '#FF3B3B'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
            ;(e.currentTarget as HTMLElement).style.color = '#555555'
          }}
        >
          <RotateCcw size={10} />
          CLEAR
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              opacity: 0.5,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: '#555555',
                textAlign: 'center',
                lineHeight: 2,
                letterSpacing: '0.06em',
              }}
            >
              ─────────────────────────────────────────
              <br />
              [ NO MESSAGES — START YOUR FIRST QUERY ]
              <br />─────────────────────────────────────────
            </div>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === 'user' ? (
            <UserMessage key={msg.id} msg={msg} />
          ) : (
            <AssistantMessage key={msg.id} msg={msg} onTermClick={onTermClick} />
          )
        )}

        {isProcessing && (
          <div
            style={{
              padding: '10px 12px',
              background: '#141414',
              border: '1px solid #2A2A2A',
              borderLeft: '2px solid #58A6FF',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#58A6FF',
                letterSpacing: '0.08em',
              }}
            >
              ANALYZING{dots[processingDot]}
            </span>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      {messages.length === 0 && (
        <div
          style={{
            padding: '8px 12px',
            borderTop: '1px solid #2A2A2A',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            background: '#0E0E0E',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: '#555555',
              letterSpacing: '0.08em',
              alignSelf: 'center',
            }}
          >
            QUICK:
          </span>
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr}
              onClick={() => handleSend(qr)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: '#888888',
                background: 'transparent',
                border: '1px solid #2A2A2A',
                padding: '3px 8px',
                cursor: 'pointer',
                letterSpacing: '0.04em',
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
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid #2A2A2A',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          background: '#0E0E0E',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: '#58A6FF',
            fontWeight: 600,
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          &gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="ASK ABOUT ANY FINANCIAL TERM OR PHRASE..."
          disabled={isProcessing}
          style={{
            flex: 1,
            background: '#1F1F1F',
            border: '1px solid #2A2A2A',
            outline: 'none',
            color: '#E8E8E8',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '7px 10px',
            letterSpacing: '0.02em',
            transition: 'border-color 150ms',
            opacity: isProcessing ? 0.5 : 1,
          }}
          onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#58A6FF')}
          onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A')}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isProcessing}
          style={{
            padding: '7px 14px',
            background: input.trim() && !isProcessing ? '#58A6FF' : '#2A2A2A',
            border: 'none',
            color: input.trim() && !isProcessing ? '#0A0A0A' : '#555555',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: input.trim() && !isProcessing ? 'pointer' : 'not-allowed',
            transition: 'all 150ms',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !isProcessing)
              (e.currentTarget as HTMLElement).style.background = '#388BFD'
          }}
          onMouseLeave={(e) => {
            if (input.trim() && !isProcessing)
              (e.currentTarget as HTMLElement).style.background = '#58A6FF'
          }}
        >
          SEND
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}

function UserMessage({ msg }: { msg: ChatMessage }) {
  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#1F1F1F',
        border: '1px solid #2A2A2A',
        alignSelf: 'flex-end',
        maxWidth: '80%',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#58A6FF',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          YOU
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#555555',
            letterSpacing: '0.04em',
          }}
        >
          {msg.timestamp}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          color: '#E8E8E8',
          lineHeight: 1.6,
        }}
      >
        {msg.content}
      </p>
    </div>
  )
}

function AssistantMessage({
  msg,
  onTermClick,
}: {
  msg: ChatMessage
  onTermClick: (term: string) => void
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['translation']))

  const toggle = (section: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  return (
    <div
      style={{
        background: '#141414',
        border: '1px solid #2A2A2A',
        borderLeft: '2px solid #58A6FF',
        maxWidth: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '6px 12px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#1A1A1A',
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            background: '#58A6FF',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#58A6FF',
            letterSpacing: '0.10em',
            fontWeight: 600,
          }}
        >
          MARKET LEXICON AI
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#555555',
            letterSpacing: '0.04em',
          }}
        >
          {msg.timestamp}
        </span>
      </div>

      {/* Translation section */}
      <CollapsibleSection
        id="translation"
        title="TRANSLATION"
        icon={<ChevronRight size={10} />}
        expanded={expanded.has('translation')}
        onToggle={() => toggle('translation')}
        color="#58A6FF"
      >
        <p
          className="font-jp"
          style={{
            margin: 0,
            fontSize: '0.8rem',
            color: '#E8E8E8',
            lineHeight: 1.9,
            padding: '10px 12px',
          }}
        >
          {msg.translation || msg.content}
        </p>
      </CollapsibleSection>

      {/* Key Terms section */}
      {msg.keyTerms && msg.keyTerms.length > 0 && (
        <CollapsibleSection
          id="terms"
          title="KEY TERMS"
          icon={<List size={10} />}
          expanded={expanded.has('terms')}
          onToggle={() => toggle('terms')}
          color="#58A6FF"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {msg.keyTerms.map((term, i) => (
              <div
                key={i}
                onClick={() => onTermClick(term.term)}
                style={{
                  padding: '8px 12px',
                  borderBottom: i < msg.keyTerms!.length - 1 ? '1px solid #2A2A2A' : 'none',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'rgba(88,166,255,0.04)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'transparent')
                }
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: '#58A6FF',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {term.term}
                  </span>
                  <span
                    className="font-jp"
                    style={{ fontSize: '0.65rem', color: '#888888' }}
                  >
                    {term.reading}
                  </span>
                </div>
                <p
                  className="font-jp"
                  style={{
                    margin: 0,
                    fontSize: '0.72rem',
                    color: '#C8C8C8',
                    lineHeight: 1.7,
                  }}
                >
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Market Context section */}
      {msg.marketContext && (
        <CollapsibleSection
          id="context"
          title="MARKET CONTEXT"
          icon={<TrendingUp size={10} />}
          expanded={expanded.has('context')}
          onToggle={() => toggle('context')}
          color="#00D964"
        >
          <p
            className="font-jp"
            style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#C8C8C8',
              lineHeight: 1.9,
              padding: '10px 12px',
              borderLeft: '2px solid #00D964',
              marginLeft: '12px',
              marginRight: '12px',
              marginBottom: '10px',
            }}
          >
            {msg.marketContext}
          </p>
        </CollapsibleSection>
      )}

      {/* Quick actions */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid #2A2A2A',
          display: 'flex',
          gap: '6px',
        }}
      >
        {[
          { icon: <Zap size={9} />, label: 'EXPLAIN DEEPER' },
          { icon: <List size={9} />, label: 'GIVE EXAMPLE' },
          { icon: <TrendingUp size={9} />, label: 'RELATED TERMS' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: '#555555',
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
              ;(e.currentTarget as HTMLElement).style.color = '#555555'
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function CollapsibleSection({
  id,
  title,
  icon,
  expanded,
  onToggle,
  color,
  children,
}: {
  id: string
  title: string
  icon: React.ReactNode
  expanded: boolean
  onToggle: () => void
  color: string
  children: React.ReactNode
}) {
  return (
    <div style={{ borderBottom: '1px solid #2A2A2A' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '7px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 150ms',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = 'transparent')
        }
      >
        <span style={{ color, display: 'flex' }}>{icon}</span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color,
            letterSpacing: '0.10em',
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#555555',
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 150ms',
          }}
        >
          ▶
        </span>
      </button>
      {expanded && children}
    </div>
  )
}
