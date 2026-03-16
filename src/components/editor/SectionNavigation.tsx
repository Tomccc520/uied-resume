/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-16
 */

'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Palette, Settings2, ChevronDown, LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { navigationItems } from '@/data/navigation'
import { StyleSettingsPanel } from './StyleSettingsPanel'
import { ResumeSectionId, SectionCompleteness } from '@/utils/resumeCompleteness'

/**
 * Navigation item structure
 */
interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  description: string
}

/**
 * SectionNavigation component props
 */
interface SectionNavigationProps {
  /** Currently active section ID */
  activeSection: string
  /** Callback when section changes */
  onSectionChange: (section: string) => void
  /** Callback to show template selector */
  onShowTemplateSelector?: () => void
  /** 模块完成度 */
  sectionCompleteness?: Partial<Record<ResumeSectionId, SectionCompleteness>>
  /** 跳转到下一个待完善模块 */
  onJumpToNextIncomplete?: () => void
  /** Custom class name */
  className?: string
}

/**
 * SectionNavigation - Left sidebar navigation for resume sections
 * 
 * Features:
 * - Displays all resume sections with icons
 * - Highlights active section
 * - Supports click to navigate/scroll to section
 * - Includes template selector button
 * - Inline style settings panel (no popup)
 * - Fully internationalized
 */
export function SectionNavigation({
  activeSection,
  onSectionChange,
  onShowTemplateSelector,
  sectionCompleteness,
  onJumpToNextIncomplete,
  className = ''
}: SectionNavigationProps) {
  const { t, locale } = useLanguage()
  const [showStyleSettings, setShowStyleSettings] = useState(false) // 样式设置折叠状态

  // Get translated navigation items with enhanced descriptions
  const translatedItems: NavigationItem[] = navigationItems.map(item => {
    let label = item.label
    let description = item.description

    switch (item.id) {
      case 'personal':
        label = t.editor.personalInfo.title
        description = locale === 'zh' ? '完善您的基本信息，让招聘者了解您' : 'Complete your basic info for recruiters'
        break
      case 'experience':
        label = t.editor.experience.title
        description = locale === 'zh' ? '展示工作经验和职业发展历程' : 'Showcase your work experience'
        break
      case 'education':
        label = t.editor.education.title
        description = locale === 'zh' ? '填写学历和教育背景信息' : 'Add your education background'
        break
      case 'skills':
        label = t.editor.skills.title
        description = locale === 'zh' ? '突出专业技能和核心能力' : 'Highlight your key skills'
        break
      case 'projects':
        label = t.editor.projects.title
        description = locale === 'zh' ? '展示项目作品和实践成果' : 'Display your project achievements'
        break
    }

    return {
      ...item,
      label,
      description
    }
  })

  /**
   * 计算侧栏总完成度
   * 用于底部进度条和“继续完善”入口，减少用户在模块间来回查找。
   */
  const completionOverview = useMemo(() => {
    const sectionList = translatedItems
      .map((item) => sectionCompleteness?.[item.id as ResumeSectionId])
      .filter((item): item is SectionCompleteness => Boolean(item))

    if (sectionList.length === 0) {
      return {
        totalScore: 0,
        incompleteCount: translatedItems.length
      }
    }

    const totalScore = Math.round(
      sectionList.reduce((sum, item) => sum + item.score, 0) / sectionList.length
    )

    return {
      totalScore,
      incompleteCount: sectionList.filter((item) => !item.completed).length
    }
  }, [sectionCompleteness, translatedItems])

  // Handle section click - scroll to section in editor
  const handleSectionClick = useCallback((sectionId: string) => {
    onSectionChange(sectionId)
    
    // Dispatch custom event to scroll to section in editor
    const event = new CustomEvent('scrollToSection', { 
      detail: { section: sectionId } 
    })
    window.dispatchEvent(event)
  }, [onSectionChange])

  return (
    <div className={`flex flex-col bg-white/50 backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{t.editor.content}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{t.common.edit}</p>
      </div>

      {/* Navigation Items */}
      <div className="py-4 px-3">
        <nav className="space-y-2">
          {translatedItems.map((item) => {
            const IconComponent = item.icon
            const isActive = item.id === activeSection
            const sectionState = sectionCompleteness?.[item.id as ResumeSectionId]
            const sectionScore = sectionState?.score ?? 0
            const sectionCompleted = Boolean(sectionState?.completed)

            return (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`relative w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 ring-1 ring-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"
                  />
                )}

                {/* Icon with background */}
                <div className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                  <IconComponent className="h-4 w-4" />
                </div>

                {/* Label and description */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="text-sm font-semibold mb-0.5">{item.label}</div>
                  <div className={`text-xs leading-relaxed transition-colors ${
                    isActive ? 'text-blue-500/80' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {item.description}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        sectionCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-[11px] text-gray-500">
                      {sectionCompleted
                        ? (locale === 'zh' ? '已完善' : 'Completed')
                        : (locale === 'zh' ? '待完善' : 'Needs work')}
                    </span>
                    <span className="ml-auto text-[11px] font-semibold text-gray-600">
                      {sectionScore}%
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Template & Style Section */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-4 space-y-2">
        {/* Template Selector Button */}
        {onShowTemplateSelector && (
          <button
            onClick={onShowTemplateSelector}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-gray-700 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-colors group border border-gray-100 hover:border-purple-200"
          >
            <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
              <Palette className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{t.editor.template}</div>
              <div className="text-xs text-gray-500 group-hover:text-purple-600/70 transition-colors">
                {locale === 'zh' ? '选择专业模板' : 'Choose template'}
              </div>
            </div>
          </button>
        )}

        {/* Style Settings Toggle Button */}
        <button
          onClick={() => setShowStyleSettings(!showStyleSettings)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors group border ${
            showStyleSettings
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 ring-1 ring-blue-200 border-blue-200'
              : 'text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 border-gray-100 hover:border-blue-200'
          }`}
        >
          <div className={`flex-shrink-0 p-2 rounded-lg transition-all ${
            showStyleSettings 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 group-hover:from-blue-200 group-hover:to-indigo-200'
          }`}>
            <Settings2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{t.editor.styleSettings || '样式设置'}</div>
            <div className={`text-xs transition-colors ${
              showStyleSettings ? 'text-blue-600/70' : 'text-gray-500 group-hover:text-blue-600/70'
            }`}>
              {locale === 'zh' ? '自定义样式' : 'Customize styles'}
            </div>
          </div>
          <div className={`flex-shrink-0 transition-all ${
            showStyleSettings ? 'text-blue-600 rotate-180' : 'text-gray-400 group-hover:text-blue-600'
          }`}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* Inline Style Settings Panel */}
      <AnimatePresence>
        {showStyleSettings && (
          <div className="border-t border-gray-100 overflow-hidden bg-gray-50/50">
              <StyleSettingsPanel />
            </div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{locale === 'zh' ? '简历完成度' : 'Resume completion'}</span>
          <span className="font-medium text-gray-700">
            {completionOverview.totalScore}%
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              completionOverview.totalScore >= 80
                ? 'bg-emerald-500'
                : completionOverview.totalScore >= 60
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
            }`}
            style={{ 
              width: `${Math.max(0, Math.min(100, completionOverview.totalScore))}%` 
            }}
          />
        </div>
        {onJumpToNextIncomplete && completionOverview.incompleteCount > 0 && (
          <button
            type="button"
            onClick={onJumpToNextIncomplete}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700"
          >
            {locale === 'zh'
              ? `继续完善（剩余 ${completionOverview.incompleteCount} 项）`
              : `Continue (${completionOverview.incompleteCount} pending)`}
          </button>
        )}
      </div>
    </div>
  )
}

export default SectionNavigation
