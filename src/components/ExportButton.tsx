/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 * 
 * @description 简历导出功能组件，支持PDF、PNG、JPG格式导出
 * 使用 html2canvas 和 jsPDF 进行导出，确保导出结果稳定
 */


/**
 * 简历导出功能组件
 * 支持PDF、PNG、JPG格式导出
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Loader2, CheckCircle, AlertCircle, Image, Camera, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { exportResumeFile } from '@/services/resumeExportService'

interface ExportButtonProps {
  className?: string
  onExport?: (format: 'pdf' | 'png' | 'jpg') => Promise<void>
}

/**
 * 导出按钮组件
 */
export default function ExportButton({ className = '', onExport }: ExportButtonProps) {
  /**
   * 导出调试日志
   * 仅在开发环境输出，避免生产环境产生噪音日志
   */
  const logExportDebug = useCallback((...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args)
    }
  }, [])

  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState<'pdf' | 'png' | 'jpg' | null>(null)
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * 清理延时器
   * 防止组件卸载后仍触发状态更新
   */
  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [clearCloseTimer])

  /**
   * 统一处理导出后收尾逻辑
   * 包含状态提示自动关闭与面板收起
   */
  const scheduleClosePanel = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setExportStatus(null)
      setIsOpen(false)
    }, 2000)
  }, [clearCloseTimer])

  /**
   * 默认导出逻辑
   * 通过统一导出服务执行，避免按钮组件重复维护导出细节
   */
  const defaultExport = useCallback(async (format: 'pdf' | 'png' | 'jpg') => {
    const element = document.getElementById('resume-preview')
    if (!element) {
      throw new Error('找不到简历预览元素 #resume-preview')
    }

    logExportDebug('[导出调试] 找到元素:', element)
    logExportDebug('[导出调试] 元素尺寸:', element.getBoundingClientRect())
    logExportDebug('[导出调试] 内容长度:', element.innerHTML.length)
    logExportDebug('[导出调试] 子元素数量:', element.children.length)

    // 检查元素是否真的有内容
    if (element.innerHTML.length === 0) {
      throw new Error('简历预览元素是空的，请先添加简历内容')
    }

    await exportResumeFile({
      format,
      element,
      fileName: `resume.${format}`,
      logger: logExportDebug
    })
  }, [logExportDebug])

  /**
   * 处理导出 - 支持PDF、PNG、JPG格式
   */
  const handleExport = useCallback(async (format: 'pdf' | 'png' | 'jpg') => {
    if (isExporting) return

    logExportDebug('[导出调试] 开始导出:', format)

    setIsExporting(format)
    setExportStatus(null)

    try {
      const exportHandler = onExport ?? defaultExport
      await exportHandler(format)
      setExportStatus({
        type: 'success',
        message: `${format.toUpperCase()} ${t.editor.toolbar.exportSuccess}`
      })
    } catch (error) {
      console.error('[导出错误] Export failed:', error)
      setExportStatus({
        type: 'error',
        message: t.editor.toolbar.exportFailed
      })
    } finally {
      setIsExporting(null)
      scheduleClosePanel()
    }
  }, [isExporting, logExportDebug, onExport, defaultExport, t.editor.toolbar.exportSuccess, t.editor.toolbar.exportFailed, scheduleClosePanel])

  /**
   * 获取导出选项
   */
  const exportOptions = [
    {
      format: 'pdf' as const,
      label: t.editor.toolbar.pdfFormat,
      description: t.editor.toolbar.pdfDesc,
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100'
    },
    {
      format: 'png' as const,
      label: t.editor.toolbar.pngFormat,
      description: t.editor.toolbar.pngDesc,
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      format: 'jpg' as const,
      label: t.editor.toolbar.jpgFormat,
      description: t.editor.toolbar.jpgDesc,
      icon: Camera,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    }
  ]

  return (
    <div className={`relative ${className}`}>
      {/* 主按钮 - 调整为更小的尺寸 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        className="gap-1.5"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm">{t.editor.toolbar.exportResume}</span>
      </Button>

      {/* 导出选项面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-[100]"
          >
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">{t.editor.toolbar.selectFormat}</h3>
              
              <div className="space-y-2">
                {exportOptions.map((option) => {
                  const Icon = option.icon
                  const isCurrentlyExporting = isExporting === option.format
                  
                  return (
                    <motion.button
                      key={option.format}
                      onClick={() => handleExport(option.format)}
                      disabled={isExporting !== null}
                      className={`btn btn-outline btn-md w-full ${option.bgColor} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
                      whileHover={{ scale: isExporting ? 1 : 1.02 }}
                      whileTap={{ scale: isExporting ? 1 : 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${option.bgColor}`}>
                          {isCurrentlyExporting ? (
                            <motion.div
                              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                              transition={{ 
                                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                                scale: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
                              }}
                            >
                              <Loader2 className={`icon icon-md ${option.color}`} />
                            </motion.div>
                          ) : (
                            <motion.div
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Icon className={`icon icon-md ${option.color}`} />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* 导出状态 */}
              <AnimatePresence>
                {exportStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-3 p-3 rounded-lg ${
                      exportStatus.type === 'success' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {exportStatus.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        exportStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {exportStatus.message}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 提示信息 */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> {t.editor.toolbar.exportTip}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
