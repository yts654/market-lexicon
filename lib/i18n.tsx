'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Language = 'jp' | 'en'

const LANG_KEY = 'market-lexicon:lang'

type Dict = {
  [key: string]: { jp: string; en: string }
}

export const dict: Dict = {
  // ─── Brand / Header ───
  'brand.tagline': {
    jp: '金融英語学習ツール',
    en: 'Financial English Learning Tool',
  },
  'header.signIn': { jp: 'ログイン', en: 'Sign In' },
  'header.lang.jp': { jp: '日本語', en: 'JP' },
  'header.lang.en': { jp: '英語', en: 'EN' },

  // ─── Function Rail (Left) ───
  'rail.markets': { jp: 'マーケット', en: 'Markets' },
  'rail.learning': { jp: '英語学習', en: 'Learning' },
  'rail.settings': { jp: '設定', en: 'Settings' },
  'rail.help': { jp: 'ヘルプ', en: 'Help' },

  // ─── Section Markers ───
  'section.markets.subtitle': { jp: 'GLOBAL MARKETS', en: 'GLOBAL MARKETS' },
  'section.markets.title': {
    jp: 'アジア・米国・欧州',
    en: 'Asia · United States · Europe',
  },
  'section.learning.subtitle': { jp: 'ENGLISH LEARNING', en: 'ENGLISH LEARNING' },
  'section.learning.title': {
    jp: '金融英語の学習',
    en: 'Financial English Learning',
  },
  'section.settings.subtitle': { jp: 'PREFERENCES', en: 'PREFERENCES' },
  'section.settings.title': {
    jp: '環境設定',
    en: 'Preferences',
  },

  // ─── Mode Switcher (Learning sub-tabs) ───
  'mode.transcript': { jp: 'トランスクリプト', en: 'Transcripts' },
  'mode.chat': { jp: 'チャット', en: 'Chat' },

  // ─── Archive Sidebar ───
  'archive.title': { jp: 'アーカイブ', en: 'ARCHIVE' },
  'archive.search.placeholder': {
    jp: 'セッションを検索…',
    en: 'SEARCH SESSIONS...',
  },
  'archive.filter.all': { jp: 'すべて', en: 'ALL' },
  'archive.filter.transcripts': { jp: '対訳', en: 'TRANS' },
  'archive.filter.chats': { jp: 'チャット', en: 'CHATS' },
  'archive.filter.favorites': { jp: 'お気に入り', en: 'FAV' },
  'archive.found': { jp: '件のセッション', en: 'SESSIONS FOUND' },
  'archive.empty': {
    jp: 'セッションが見つかりません',
    en: 'NO SESSIONS FOUND',
  },
  'archive.newSession': { jp: '＋ 新規セッション', en: '+ NEW SESSION' },
  'archive.delete.aria': { jp: 'セッションを削除', en: 'Delete session' },
  'archive.delete.confirm': {
    jp: 'このセッションを削除しますか？',
    en: 'Delete this session?',
  },

  // ─── Right Panel Tabs ───
  'tab.markets': { jp: 'マーケット', en: 'Markets' },
  'tab.glossary': { jp: '用語集', en: 'Glossary' },
  'tab.notes': { jp: 'ノート', en: 'Notes' },
  'tab.settings': { jp: '設定', en: 'Settings' },
  'panel.notes.placeholder': {
    jp: 'ノート機能は近日公開予定です。',
    en: 'Notes feature coming soon.',
  },

  // ─── Glossary Panel ───
  'glossary.header': { jp: '金融用語集', en: 'TERM GLOSSARY' },
  'glossary.progress.label': { jp: '習得進捗', en: 'MASTERY PROGRESS' },
  'glossary.search.placeholder': {
    jp: '用語を絞り込み…',
    en: 'FILTER TERMS...',
  },
  'glossary.sort.frequency': { jp: '頻度順', en: 'FREQUENCY' },
  'glossary.sort.alphabetical': { jp: 'A–Z', en: 'A–Z' },
  'glossary.sort.recent': { jp: '最近', en: 'RECENT' },
  'glossary.sort.unmastered': { jp: '未習得', en: 'UNMASTERED' },
  'glossary.detail.back': { jp: '← 戻る', en: '← BACK' },
  'glossary.detail.title': { jp: '用語詳細', en: 'TERM DETAIL' },
  'glossary.detail.seen': { jp: '出現回数', en: 'SEEN' },
  'glossary.detail.category': { jp: 'カテゴリ', en: 'CATEGORY' },
  'glossary.detail.lastSeen': { jp: '最終', en: 'LAST SEEN' },
  'glossary.detail.definition': { jp: '定義', en: 'DEFINITION' },
  'glossary.detail.english': { jp: '英文定義', en: 'ENGLISH' },
  'glossary.detail.etymology': { jp: '語源', en: 'ETYMOLOGY' },
  'glossary.detail.usage': { jp: '実例', en: 'REAL-WORLD USAGE' },
  'glossary.detail.markMastered': {
    jp: '習得済みにする',
    en: 'MARK AS MASTERED',
  },
  'glossary.detail.unmark': {
    jp: '習得済み — クリックで取消',
    en: 'MASTERED — CLICK TO UNMARK',
  },

  // ─── Status Bar ───
  'status.connected': { jp: '接続中', en: 'Connected' },
  'status.offline': { jp: 'オフライン', en: 'Offline' },
  'status.terminal': {
    jp: 'Market Lexicon ターミナル',
    en: 'Market Lexicon Terminal',
  },
  'status.session': { jp: 'セッション', en: 'Session' },
  'status.terms': { jp: '用語', en: 'terms' },
  'status.dataVia': { jp: 'データ提供: Twelve Data', en: 'Data via Twelve Data' },
  'status.mode.markets': { jp: 'マーケット', en: 'Markets' },
  'status.mode.learning': { jp: '英語学習', en: 'Learning' },
  'status.mode.settings': { jp: '設定', en: 'Settings' },

  // ─── Settings Panel ───
  'settings.header': { jp: '設定', en: 'SETTINGS' },
  'settings.colorMode.label': {
    jp: '価格カラーモード',
    en: 'PRICE COLOR MODE',
  },
  'settings.colorMode.jp': { jp: '日本式', en: 'Japan' },
  'settings.colorMode.en': { jp: '欧米式', en: 'Western' },
  'settings.colorMode.descJp': {
    jp: '日本式: 上昇=赤、下落=緑',
    en: 'Japan: up=red, down=green',
  },
  'settings.colorMode.descEn': {
    jp: '欧米式: 上昇=緑、下落=赤',
    en: 'Western: up=green, down=red',
  },
  'settings.lang.label': { jp: '表示言語', en: 'DISPLAY LANGUAGE' },
  'settings.lang.jp': { jp: '日本語', en: 'Japanese' },
  'settings.lang.en': { jp: '英語', en: 'English' },
  'settings.shortcuts.label': {
    jp: 'キーボードショートカット',
    en: 'KEYBOARD SHORTCUTS',
  },
  'settings.shortcut.palette': {
    jp: 'コマンドパレット',
    en: 'Command Palette',
  },
  'settings.shortcut.newSession': {
    jp: '新規セッション',
    en: 'New Session',
  },
  'settings.shortcut.transcript': {
    jp: 'トランスクリプト',
    en: 'Transcripts',
  },
  'settings.shortcut.chat': { jp: 'チャット', en: 'Chat' },
  'settings.shortcut.markets': { jp: 'マーケット', en: 'Markets' },
  'settings.shortcut.toggleLeft': {
    jp: '左サイドバー切替',
    en: 'Toggle Left Sidebar',
  },
  'settings.shortcut.toggleRight': {
    jp: '右パネル切替',
    en: 'Toggle Right Panel',
  },
  'settings.about': { jp: 'このアプリについて', en: 'ABOUT' },

  // ─── /markets/[symbol] page ───
  'instrument.understanding': { jp: 'を理解する', en: 'Understanding' },
  'instrument.subtitle': {
    jp: '定義 · 計算 · 値動き要因 · 解釈',
    en: 'Definition · Calculation · Drivers · Interpretation',
  },
  'instrument.related': { jp: '関連銘柄', en: 'Related Instruments' },
  'instrument.keyStats': { jp: '主要指標', en: 'KEY STATISTICS' },
  'instrument.todayRange': { jp: '本日のレンジ', en: "TODAY'S RANGE" },
  'instrument.weekRange': { jp: '52週レンジ', en: '52-WEEK RANGE' },
  'instrument.stats.open': { jp: '始値', en: 'Open' },
  'instrument.stats.high': { jp: '高値', en: 'High' },
  'instrument.stats.low': { jp: '安値', en: 'Low' },
  'instrument.stats.prevClose': { jp: '前日終値', en: 'Prev Close' },
  'instrument.stats.week52High': { jp: '52週高値', en: '52W High' },
  'instrument.stats.week52Low': { jp: '52週安値', en: '52W Low' },
  'instrument.stats.volume': { jp: '出来高', en: 'Volume' },
  'instrument.stats.avgVolume': { jp: '平均出来高(10日)', en: 'Avg Vol (10D)' },

  // ─── Why It Moved Today (MoverExplanation) ───
  'movers.title': {
    jp: '本日の値動き要因',
    en: 'Why It Moved Today',
  },
  'movers.subtitle': {
    jp: '世界のニュースに基づくAI解説',
    en: 'AI commentary grounded in global headlines',
  },
  'movers.loading': {
    jp: 'ニュースを取得し、解説を生成しています…',
    en: 'Fetching headlines and generating commentary…',
  },
  'movers.error': {
    jp: '解説の取得に失敗しました。',
    en: 'Unable to load commentary.',
  },
  'movers.missingKey.title': {
    jp: 'この機能を有効化するには、Vercelの環境変数に Anthropic APIキーを設定してください。',
    en: 'To enable this section, set the Anthropic API key in your Vercel project environment variables.',
  },
  'movers.sources': { jp: '引用元', en: 'Sources' },
  'movers.generatedAt': { jp: '生成時刻:', en: 'Generated:' },
}

export type DictKey = keyof typeof dict

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: (key: DictKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('jp')

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(LANG_KEY) as Language | null
    if (saved === 'jp' || saved === 'en') setLangState(saved)
  }, [])

  const setLang = (next: Language) => {
    setLangState(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_KEY, next)
    }
  }

  const toggleLang = () => setLang(lang === 'jp' ? 'en' : 'jp')

  const t = (key: DictKey): string => {
    const entry = dict[key]
    if (!entry) return String(key)
    return entry[lang]
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useT() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useT must be used within a LanguageProvider')
  }
  return ctx
}
