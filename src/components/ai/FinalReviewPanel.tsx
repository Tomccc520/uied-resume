'use client'

/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 * 
 * @description 最终审核面板组件（快速模式）
 */

import { useCallback, useState } from 'react'
import { Check, RefreshCw, CheckSquare, Square, Sparkles, RotateCcw, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { GenerationSession } from '@/types/stepwise'

interface FinalReviewPanelProps {
  session: GenerationSession
  onToggleSelection: (stepIndex: number) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onApply: () => void
  onRegenerate: (stepIndex: number) => void
  onRegenerateAll?: () => void
  onOptimizeStep?: (stepIndex: number, prompt: string) => void
  onSwitchMode?: () => void
}

export function FinalReviewPanel({
  session,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onApply,
  onRegenerate,
  onRegenerateAll,
  onOptimizeStep,
  onSwitchMode
}: FinalReviewPanelProps) {
  const { t, locale } = useLanguage()
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [optimizePrompt, setOptimizePrompt] = useState('')

  const getStepTitle = useCallback((type: string) => {
    const titles: Record<string, string> = {
      summary: t.stepwise?.steps?.summary || '个人简介',
      experience: t.stepwise?.steps?.experience || '工作经历',
      education: t.stepwise?.steps?.education || '教育背景',
      skills: t.stepwise?.steps?.skills || '技能特长',
      projects: t.stepwise?.steps?.projects || '项目经历'
    }
    return titles[type] || type
  }, [t])

  const handleOptimize = useCallback((stepIndex: number) => {
    if (onOptimizeStep && optimizePrompt.trim()) {
      onOptimizeStep(stepIndex, optimizePrompt.trim())
      setOptimizePrompt('')
      setExpandedStep(null)
    }
  }, [onOptimizeStep, optimizePrompt])

  const quickOptimizeOptions = locale === 'zh' ? [
    { label: '更专业', prompt: '使用更专业的语言优化这段内容' },
    { label: '更简洁', prompt: '精简这段内容，保留核心信息' },
    { label: '更详细', prompt: '扩展这段内容，增加更多细节' },
    { label: '突出成果', prompt: '突出量化成果和核心贡献' }
  ] : [
    { label: 'Professional', prompt: 'Make this content more professional' },
    { label: 'Concise', prompt: 'Make this content more concise' },
    { label: 'Detailed', prompt: 'Expand this content with more details' },
    { label: 'Results', prompt: 'Highlight quantified results and contributions' }
  ]

  const completedSteps = session.steps.filter(s => s.status === 'completed')
  const selectedCount = completedSteps.filter(s => s.isSelected).length

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t.stepwise?.finalReview?.title || '最终审核'}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">
            {t.stepwise?.finalReview?.desc || '审核AI生成的内容，选择要应用到简历的模块'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 ml-8 sm:ml-0">
          {/* 统计信息 */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              已选择 {selectedCount}/{completedSteps.length}
            </span>
          </div>
          
          {/* 重新生成全部按钮 */}
          {onRegenerateAll && (
            <button
              onClick={onRegenerateAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all hover:shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{locale === 'zh' ? '重新生成全部' : 'Regenerate All'}</span>
            </button>
          )}
          
          <div className="flex gap-2 px-2">
            <button
              onClick={onSelectAll}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {t.stepwise?.controls?.selectAll || '全选'}
            </button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
              onClick={onDeselectAll}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {t.stepwise?.controls?.deselectAll || '取消'}
            </button>
          </div>
        </div>
      </div>

      {/* Step List */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {session.steps.map((step, index) => {
          if (step.status !== 'completed') return null
          const isExpanded = expandedStep === index

          return (
            <div
              key={step.id}
              className={`group rounded-xl border-2 transition-all duration-300 ${
                step.isSelected
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10 shadow-lg shadow-blue-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* 选择框 */}
                  <button
                    onClick={() => onToggleSelection(index)}
                    className={`mt-1 flex-shrink-0 transition-all duration-200 ${
                      step.isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {step.isSelected ? (
                      <div className="p-1 bg-blue-500 rounded-lg shadow-md">
                        <CheckSquare className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <Square className="w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    {/* 标题栏 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                          {getStepTitle(step.type)}
                        </h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          step.isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {step.isSelected ? '已选' : '未选'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* AI 优化按钮 */}
                        {onOptimizeStep && (
                          <button
                            onClick={() => setExpandedStep(isExpanded ? null : index)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all ${
                              isExpanded
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span className="hidden sm:inline">{locale === 'zh' ? 'AI优化' : 'AI Optimize'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => onRegenerate(index)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span className="hidden sm:inline">{t.stepwise?.controls?.regenerate || '重新生成'}</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* 内容预览 */}
                    <div className={`text-sm leading-relaxed transition-all ${
                      isExpanded ? 'line-clamp-none' : 'line-clamp-3'
                    } ${
                      step.isSelected 
                        ? 'text-gray-700 dark:text-gray-200' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {step.content}
                    </div>
                    
                    {/* 展开/收起按钮 */}
                    {step.content && step.content.length > 150 && !isExpanded && (
                      <button
                        onClick={() => setExpandedStep(index)}
                        className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {locale === 'zh' ? '查看完整内容 ↓' : 'Show more ↓'}
                      </button>
                    )}
                    
                    {/* AI 优化输入区域 */}
                    {isExpanded && onOptimizeStep && (
                      <div className="mt-4 animate-in slide-in-from-top duration-300">
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                              {locale === 'zh' ? 'AI智能优化' : 'AI Smart Optimization'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {quickOptimizeOptions.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => onOptimizeStep(index, option.prompt)}
                                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 transition-all hover:shadow-md"
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={optimizePrompt}
                              onChange={(e) => setOptimizePrompt(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleOptimize(index)}
                              placeholder={locale === 'zh' ? '输入自定义优化要求...' : 'Enter custom optimization...'}
                              className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            <button
                              onClick={() => handleOptimize(index)}
                              disabled={!optimizePrompt.trim()}
                              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              <span className="hidden sm:inline">{locale === 'zh' ? '优化' : 'Optimize'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onApply}
            disabled={selectedCount === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all ${
              selectedCount > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02]'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            {t.stepwise?.controls?.apply || '应用到简历'} 
            {selectedCount > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {selectedCount}
              </span>
            )}
          </button>
        </div>
        {selectedCount === 0 && (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            {locale === 'zh' ? '请至少选择一个模块' : 'Please select at least one module'}
          </p>
        )}
      </div>
    </div>
  )
}
