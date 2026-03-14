'use client'

/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 * 
 * @description AI 生成模式选择对话框
 */

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ListChecks, X, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { GenerationMode } from '@/types/stepwise'

interface ModeSelectionDialogProps {
  isOpen: boolean
  defaultMode: GenerationMode
  onSelectMode: (mode: GenerationMode) => void
  onClose: () => void
}

export function ModeSelectionDialog({
  isOpen,
  defaultMode,
  onSelectMode,
  onClose
}: ModeSelectionDialogProps) {
  const { t, locale } = useLanguage()

  const handleSelectMode = useCallback((mode: GenerationMode) => {
    onSelectMode(mode)
  }, [onSelectMode])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {locale === 'zh' ? 'AI生成简历' : 'AI Resume Generator'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Mode Cards */}
          <div className="p-6 space-y-4">
            {/* Quick Mode */}
            <button
              onClick={() => handleSelectMode('quick')}
              className={`group w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                defaultMode === 'quick'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  defaultMode === 'quick'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
                    : 'bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/70'
                }`}>
                  <Zap className={`w-6 h-6 ${
                    defaultMode === 'quick' 
                      ? 'text-white' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t.stepwise?.modeSelection?.quickMode || '快速模式'}
                    </h3>
                    {defaultMode === 'quick' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-blue-500 text-white rounded-full shadow-sm">
                        {t.stepwise?.modeSelection?.lastUsed || '推荐'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {t.stepwise?.modeSelection?.quickModeDesc || '一键生成所有内容，AI自动完成全部模块，最后统一审核确认'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md">
                      节省时间
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md">
                      适合新手
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md">
                      一键完成
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Step-by-Step Mode */}
            <button
              onClick={() => handleSelectMode('stepByStep')}
              className={`group w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                defaultMode === 'stepByStep'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  defaultMode === 'stepByStep'
                    ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30'
                    : 'bg-green-100 dark:bg-green-900/50 group-hover:bg-green-200 dark:group-hover:bg-green-800/70'
                }`}>
                  <ListChecks className={`w-6 h-6 ${
                    defaultMode === 'stepByStep' 
                      ? 'text-white' 
                      : 'text-green-600 dark:text-green-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t.stepwise?.modeSelection?.stepByStepMode || '逐步模式'}
                    </h3>
                    {defaultMode === 'stepByStep' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-500 text-white rounded-full shadow-sm">
                        {t.stepwise?.modeSelection?.lastUsed || '精细'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {t.stepwise?.modeSelection?.stepByStepModeDesc || '逐个模块生成，每步都可以编辑、确认或重新生成，完全掌控每个细节'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md">
                      精细控制
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md">
                      随时编辑
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md">
                      可重新生成
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {locale === 'zh' ? '温馨提示' : 'Tip'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t.stepwise?.modeSelection?.hint || '选择后可在生成过程中随时切换到快速模式，两种模式可以灵活切换'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
