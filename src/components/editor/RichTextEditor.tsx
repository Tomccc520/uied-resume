/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-16
 *
 * @description 富文本编辑器组件 - 支持格式化文本、快捷片段、长度建议与内容质量检查
 */

'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Type,
  Sparkles,
  ChevronDown,
  BookText
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ContentSnippet {
  label: string
  content: string
}

interface RichTextEditorProps {
  /** 当前文本内容 */
  value: string
  /** 内容变化回调 */
  onChange: (value: string) => void
  /** 占位符文本 */
  placeholder?: string
  /** 最小行数 */
  minRows?: number
  /** 最大行数 */
  maxRows?: number
  /** 是否显示格式化工具栏 */
  showToolbar?: boolean
  /** 是否启用 AI 优化 */
  enableAI?: boolean
  /** AI 优化回调 */
  onAIOptimize?: () => void
  /** 标签 */
  label?: string
  /** 推荐字数区间 */
  recommendedLength?: { min: number; max: number }
  /** 快捷片段 */
  snippets?: ContentSnippet[]
  /** 是否启用内容质量检查 */
  enableQualityCheck?: boolean
}

type LengthState = 'short' | 'ideal' | 'long'

/**
 * 推断推荐长度
 * 根据字段标签判断推荐区间，避免每个表单都重复传参。
 */
function inferRecommendedLength(label?: string, placeholder?: string): { min: number; max: number } {
  const hint = `${label || ''} ${placeholder || ''}`.toLowerCase()
  if (hint.includes('summary') || hint.includes('简介') || hint.includes('自我')) {
    return { min: 80, max: 240 }
  }
  if (hint.includes('highlight') || hint.includes('亮点')) {
    return { min: 40, max: 180 }
  }
  if (hint.includes('description') || hint.includes('描述') || hint.includes('内容')) {
    return { min: 60, max: 300 }
  }
  return { min: 30, max: 220 }
}

/**
 * 分析长度状态
 * 返回当前文本相对推荐区间的状态。
 */
function resolveLengthState(length: number, range: { min: number; max: number }): LengthState {
  if (length < range.min) return 'short'
  if (length > range.max) return 'long'
  return 'ideal'
}

/**
 * 生成默认快捷片段
 * 在未显式传入 snippets 时，提供可直接落地的高质量模板片段。
 */
function buildDefaultSnippets(locale: 'zh' | 'en', label?: string): ContentSnippet[] {
  const hint = (label || '').toLowerCase()

  if (hint.includes('简介') || hint.includes('summary')) {
    if (locale === 'zh') {
      return [
        {
          label: '结果导向模板',
          content:
            '5年产品与增长经验，主导多个核心项目从0到1落地。擅长将业务目标拆解为可执行方案，通过数据分析与跨团队协作持续优化转化效率。'
        },
        {
          label: '技术岗位模板',
          content:
            '专注前端工程化与性能优化，熟悉 React / TypeScript / Next.js 技术栈。具备复杂业务系统设计经验，能够在高迭代节奏下稳定交付。'
        },
        {
          label: '管理协作模板',
          content:
            '具备跨部门项目推进经验，擅长梳理流程、明确目标和资源协调。重视团队协作与持续改进，能够推动复杂任务按期达成。'
        }
      ]
    }

    return [
      {
        label: 'Impact-focused',
        content:
          'Experienced in driving complex initiatives from planning to delivery, with a strong focus on measurable business outcomes and cross-functional execution.'
      },
      {
        label: 'Technical profile',
        content:
          'Skilled in modern web engineering with strong ownership of architecture, performance optimization, and scalable delivery under tight timelines.'
      },
      {
        label: 'Collaboration profile',
        content:
          'Strong communicator and team player who translates goals into actionable plans, aligns stakeholders, and improves execution efficiency continuously.'
      }
    ]
  }

  if (locale === 'zh') {
    return [
      {
        label: 'STAR 成果句式',
        content: '负责 [场景]，通过 [行动]，在 [时间] 内实现 [量化结果]。'
      },
      {
        label: '项目亮点句式',
        content: '主导 [模块] 设计与落地，覆盖 [范围]，将 [核心指标] 提升 [数值]。'
      }
    ]
  }

  return [
    {
      label: 'STAR sentence',
      content: 'Handled [context], implemented [action], and improved [metric] by [number] within [timeframe].'
    },
    {
      label: 'Project impact',
      content: 'Led [module] delivery, covering [scope], and increased [core metric] by [number].'
    }
  ]
}

interface QualityCheckResult {
  score: number
  suggestions: string[]
}

/**
 * 内容质量检查
 * 结合长度、量化指标和文本噪声给出可执行建议。
 */
function evaluateContentQuality(
  text: string,
  lengthState: LengthState,
  locale: 'zh' | 'en'
): QualityCheckResult {
  const trimmed = text.trim()
  if (!trimmed) {
    return {
      score: 0,
      suggestions: [locale === 'zh' ? '内容为空，建议先写 1-2 句核心价值。' : 'Content is empty. Start with 1-2 key value statements.']
    }
  }

  let score = 100
  const suggestions: string[] = []
  const hasNumber = /\d/.test(trimmed)
  const hasRepeatedPunctuation = /(。{2,}|！{2,}|？{2,}|\.{3,}|!{3,}|\?{3,})/.test(trimmed)
  const lineCount = trimmed.split('\n').filter(Boolean).length

  if (lengthState === 'short') {
    score -= 22
    suggestions.push(locale === 'zh' ? '内容偏短，建议补充职责场景和结果数据。' : 'Text is short. Add context, action, and measurable outcomes.')
  }

  if (lengthState === 'long') {
    score -= 18
    suggestions.push(locale === 'zh' ? '内容偏长，建议拆成 2-4 条要点并保留关键数据。' : 'Text is long. Split into 2-4 concise points and keep key metrics.')
  }

  if (!hasNumber) {
    score -= 12
    suggestions.push(locale === 'zh' ? '建议加入量化结果（如提升 xx%、节省 xx 小时）。' : 'Add measurable outcomes (e.g. +xx%, reduced xx hours).')
  }

  if (hasRepeatedPunctuation) {
    score -= 10
    suggestions.push(locale === 'zh' ? '检测到重复标点，建议精简语气。' : 'Repeated punctuation detected. Consider cleaner professional tone.')
  }

  if (lineCount >= 5) {
    score -= 8
    suggestions.push(locale === 'zh' ? '行数较多，建议优先保留最能体现竞争力的 3-4 条。' : 'Too many lines. Keep the top 3-4 most competitive points.')
  }

  return {
    score: Math.max(0, score),
    suggestions
  }
}

/**
 * 富文本编辑器组件
 * 提供基础格式化能力，并内置编辑提效工具。
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = '',
  minRows = 3,
  maxRows = 10,
  showToolbar = true,
  enableAI = false,
  onAIOptimize,
  label,
  recommendedLength,
  snippets,
  enableQualityCheck = true
}: RichTextEditorProps) {
  const { locale } = useLanguage()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showFormatMenu, setShowFormatMenu] = useState(false)
  const [showSnippetMenu, setShowSnippetMenu] = useState(false)

  const lengthRange = useMemo(
    () => recommendedLength || inferRecommendedLength(label, placeholder),
    [recommendedLength, label, placeholder]
  )
  const lengthState = useMemo(() => resolveLengthState(value.trim().length, lengthRange), [value, lengthRange])
  const qualityResult = useMemo(
    () => evaluateContentQuality(value, lengthState, locale),
    [value, lengthState, locale]
  )
  const effectiveSnippets = useMemo(
    () => (snippets && snippets.length > 0 ? snippets : buildDefaultSnippets(locale, label)),
    [snippets, locale, label]
  )

  /**
   * 自动调整文本框高度
   */
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight || '24', 10)
    const minHeight = lineHeight * minRows
    const maxHeight = lineHeight * maxRows
    textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
  }, [minRows, maxRows])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  /**
   * 插入格式化文本
   */
  const insertFormat = useCallback(
    (prefix: string, suffix: string = '') => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const beforeText = value.substring(0, start)
      const afterText = value.substring(end)
      const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`
      onChange(newText)

      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + prefix.length + selectedText.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    },
    [value, onChange]
  )

  /**
   * 插入快捷片段
   * 若用户已选中文本，则替换选中内容；否则在光标处插入。
   */
  const insertSnippet = useCallback(
    (snippet: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = value.slice(0, start)
      const after = value.slice(end)
      const prefix = before && !before.endsWith('\n') ? '\n' : ''
      const suffix = after && !after.startsWith('\n') ? '\n' : ''
      const nextValue = `${before}${prefix}${snippet}${suffix}${after}`

      onChange(nextValue)
      setShowSnippetMenu(false)

      setTimeout(() => {
        textarea.focus()
      }, 0)
    },
    [value, onChange]
  )

  /**
   * 键盘快捷键处理
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'b':
            event.preventDefault()
            insertFormat('**', '**')
            break
          case 'i':
            event.preventDefault()
            insertFormat('*', '*')
            break
          case 'l':
            event.preventDefault()
            if (event.shiftKey) {
              insertFormat('1. ')
            } else {
              insertFormat('• ')
            }
            break
          default:
            break
        }
      }
    },
    [insertFormat]
  )

  const formatButtons = [
    {
      icon: Bold,
      label: locale === 'zh' ? '加粗' : 'Bold',
      action: () => insertFormat('**', '**'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      label: locale === 'zh' ? '斜体' : 'Italic',
      action: () => insertFormat('*', '*'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: List,
      label: locale === 'zh' ? '无序列表' : 'Bullet List',
      action: () => insertFormat('• '),
      shortcut: 'Ctrl+L'
    },
    {
      icon: ListOrdered,
      label: locale === 'zh' ? '有序列表' : 'Numbered List',
      action: () => insertFormat('1. '),
      shortcut: 'Ctrl+Shift+L'
    }
  ]

  const lengthStateClass =
    lengthState === 'ideal' ? 'text-emerald-600' : lengthState === 'short' ? 'text-amber-600' : 'text-rose-600'

  const lengthHintText =
    lengthState === 'ideal'
      ? locale === 'zh'
        ? '长度合适'
        : 'Length looks good'
      : lengthState === 'short'
        ? locale === 'zh'
          ? `建议至少 ${lengthRange.min} 字`
          : `Suggested min ${lengthRange.min} chars`
        : locale === 'zh'
          ? `建议控制在 ${lengthRange.max} 字以内`
          : `Suggested max ${lengthRange.max} chars`

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {showToolbar && (
        <div
          className={`rounded-lg border p-2 transition-colors ${
            isFocused ? 'border-blue-300 shadow-sm' : 'border-gray-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-0.5">
              {formatButtons.map((button) => (
                <button
                  key={button.label}
                  onClick={button.action}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  title={`${button.label} (${button.shortcut})`}
                  type="button"
                >
                  <button.icon size={16} />
                </button>
              ))}
            </div>

            <div className="mx-1 h-5 w-px bg-gray-200" />

            <button
              onClick={() => setShowSnippetMenu((prev) => !prev)}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-gray-200 px-2 text-xs font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-700"
              type="button"
            >
              <BookText size={12} />
              {locale === 'zh' ? '快捷片段' : 'Snippets'}
              <ChevronDown size={12} className={`transition-transform ${showSnippetMenu ? 'rotate-180' : ''}`} />
            </button>

            {enableAI && onAIOptimize && (
              <button
                onClick={onAIOptimize}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-3 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100"
                type="button"
              >
                <Sparkles size={14} />
                {locale === 'zh' ? 'AI 优化' : 'AI Optimize'}
              </button>
            )}

            <div className="ml-auto">
              <button
                onClick={() => setShowFormatMenu((prev) => !prev)}
                className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                type="button"
              >
                <Type size={12} />
                {locale === 'zh' ? '格式说明' : 'Format'}
                <ChevronDown size={12} className={`transition-transform ${showFormatMenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showSnippetMenu && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {effectiveSnippets.map((snippet) => (
                <button
                  key={snippet.label}
                  type="button"
                  onClick={() => insertSnippet(snippet.content)}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="text-xs font-semibold text-gray-800">{snippet.label}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-gray-500">{snippet.content}</div>
                </button>
              ))}
            </div>
          )}

          {showFormatMenu && (
            <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
              <div className="mb-1 font-medium">{locale === 'zh' ? '支持格式' : 'Supported formats'}</div>
              <div className="space-y-1">
                <div>
                  <code className="rounded bg-white px-1.5 py-0.5">**文本**</code> -{' '}
                  {locale === 'zh' ? '加粗' : 'Bold'}
                </div>
                <div>
                  <code className="rounded bg-white px-1.5 py-0.5">*文本*</code> -{' '}
                  {locale === 'zh' ? '斜体' : 'Italic'}
                </div>
                <div>
                  <code className="rounded bg-white px-1.5 py-0.5">• 条目</code> -{' '}
                  {locale === 'zh' ? '无序列表' : 'Bullet list'}
                </div>
                <div>
                  <code className="rounded bg-white px-1.5 py-0.5">1. 条目</code> -{' '}
                  {locale === 'zh' ? '有序列表' : 'Numbered list'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full resize-none rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
            isFocused
              ? 'border-blue-300 bg-white ring-blue-100'
              : 'border-gray-200 bg-white'
          }`}
          style={{
            minHeight: `${minRows * 1.5}rem`,
            maxHeight: `${maxRows * 1.5}rem`
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className={lengthStateClass}>
          {value.trim().length} / {lengthRange.min}-{lengthRange.max} · {lengthHintText}
        </div>
        <div className="text-gray-400">
          {locale === 'zh' ? '支持快捷键 Ctrl+B / Ctrl+I / Ctrl+L' : 'Shortcuts: Ctrl+B / Ctrl+I / Ctrl+L'}
        </div>
      </div>

      {enableQualityCheck && value.trim() && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">
              {locale === 'zh' ? '内容质量检查' : 'Content Quality'}
            </span>
            <span
              className={`text-xs font-semibold ${
                qualityResult.score >= 80
                  ? 'text-emerald-600'
                  : qualityResult.score >= 60
                    ? 'text-amber-600'
                    : 'text-rose-600'
              }`}
            >
              {locale === 'zh' ? '评分' : 'Score'} {qualityResult.score}
            </span>
          </div>
          {qualityResult.suggestions.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {qualityResult.suggestions.slice(0, 3).map((tip) => (
                <li key={tip}>- {tip}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-emerald-700">
              {locale === 'zh'
                ? '结构和长度都比较合适，可以继续补充更具体的结果数据。'
                : 'Structure and length look good. You can add more concrete metrics if needed.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
