/**
 * @file components/data/ImportExportDialog.tsx
 * @description 数据导入导出对话框组件，支持 JSON 格式导入导出、数据验证和预览
 * @author Tomda
 * @copyright 版权所有 (c) 2026 UIED技术团队
 * @website https://fsuied.com
 * @license MIT
 * @version 1.0.0
 * 
 * @requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
 */

'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Download,
  Upload,
  FileJson,
  AlertCircle,
  Check,
  Copy,
  RefreshCw,
  FileText,
  Palette,
  Settings
} from 'lucide-react'

/**
 * 简历数据类型（简化版）
 */
export interface ResumeData {
  personalInfo?: {
    name?: string
    title?: string
    email?: string
    phone?: string
    location?: string
    website?: string
    summary?: string
  }
  experience?: Array<{
    company?: string
    position?: string
    startDate?: string
    endDate?: string
    description?: string
  }>
  education?: Array<{
    school?: string
    degree?: string
    major?: string
    startDate?: string
    endDate?: string
  }>
  skills?: Array<{
    name?: string
    level?: number
  }>
  projects?: Array<{
    name?: string
    description?: string
    technologies?: string
    link?: string
  }>
}

/**
 * 样式配置类型（简化版）
 */
export interface StyleConfig {
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
  }
  fontFamily?: string
  fontSize?: {
    content?: number
    title?: number
    name?: number
  }
  spacing?: {
    section?: number
    item?: number
    line?: number
  }
}

/**
 * 导入的数据包
 */
export interface ImportedData {
  resumeData?: ResumeData
  styleConfig?: StyleConfig
  colorSchemes?: Array<{
    id: string
    name: string
    primary: string
    secondary: string
  }>
  version: string
  exportedAt: string
}

/**
 * 导出数据包
 */
export interface ExportPackage extends ImportedData {
  appName: string
  appVersion: string
}

/**
 * 验证错误
 */
interface ValidationError {
  field: string
  message: string
}

/**
 * 对话框属性
 */
export interface ImportExportDialogProps {
  /** 是否打开 */
  isOpen: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 当前简历数据 */
  resumeData: ResumeData
  /** 当前样式配置 */
  styleConfig: StyleConfig
  /** 导入回调 */
  onImport: (data: ImportedData, mode: 'replace' | 'merge') => void
}

/**
 * 验证导入数据
 */
function validateImportData(data: unknown): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: '无效的数据格式，请确保是有效的 JSON 文件' })
    return { valid: false, errors }
  }

  const obj = data as Record<string, unknown>

  // 验证版本
  if (!obj.version || typeof obj.version !== 'string') {
    errors.push({ field: 'version', message: '缺少版本信息' })
  }

  // 验证导出时间
  if (!obj.exportedAt || typeof obj.exportedAt !== 'string') {
    errors.push({ field: 'exportedAt', message: '缺少导出时间信息' })
  }

  // 验证简历数据（如果存在）
  if (obj.resumeData !== undefined) {
    if (typeof obj.resumeData !== 'object' || obj.resumeData === null) {
      errors.push({ field: 'resumeData', message: '简历数据格式无效' })
    }
  }

  // 验证样式配置（如果存在）
  if (obj.styleConfig !== undefined) {
    if (typeof obj.styleConfig !== 'object' || obj.styleConfig === null) {
      errors.push({ field: 'styleConfig', message: '样式配置格式无效' })
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * 创建导出数据包
 */
function createExportPackage(
  resumeData: ResumeData,
  styleConfig: StyleConfig
): ExportPackage {
  return {
    appName: 'AI Resume Builder',
    appVersion: '1.0.0',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    resumeData,
    styleConfig
  }
}

/**
 * 数据导入导出对话框组件
 * 
 * @requirements
 * - 8.1: 支持将简历数据导出为 JSON 格式文件
 * - 8.2: 支持从 JSON 文件导入简历数据
 * - 8.3: 导入数据时验证数据格式的有效性
 * - 8.4: 导入的数据格式无效时显示具体的错误信息
 * - 8.5: 支持导入时选择覆盖或合并现有数据
 * - 8.6: 导入成功时显示导入的数据摘要
 * - 8.7: 支持导出包含样式配置的完整数据包
 * - 8.8: 导入前显示数据预览，让用户确认后再导入
 */
export function ImportExportDialog({
  isOpen,
  onClose,
  resumeData,
  styleConfig,
  onImport
}: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [importedData, setImportedData] = useState<ImportedData | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace')
  const [showPreview, setShowPreview] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理导出
  const handleExport = useCallback(() => {
    const exportData = createExportPackage(resumeData, styleConfig)
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `resume-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [resumeData, styleConfig])

  // 处理文件选择
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        const { valid, errors } = validateImportData(data)
        
        if (valid) {
          setImportedData(data as ImportedData)
          setValidationErrors([])
          setShowPreview(true)
        } else {
          setImportedData(null)
          setValidationErrors(errors)
          setShowPreview(false)
        }
      } catch {
        setValidationErrors([{ field: 'parse', message: 'JSON 解析失败，请检查文件格式' }])
        setImportedData(null)
        setShowPreview(false)
      }
    }
    reader.readAsText(file)
    
    // 重置 input 以允许重复选择同一文件
    event.target.value = ''
  }, [])

  // 处理导入确认
  const handleImportConfirm = useCallback(() => {
    if (importedData) {
      onImport(importedData, importMode)
      setImportSuccess(true)
      setTimeout(() => {
        setImportSuccess(false)
        setImportedData(null)
        setShowPreview(false)
        onClose()
      }, 1500)
    }
  }, [importedData, importMode, onImport, onClose])

  // 重置导入状态
  const resetImport = useCallback(() => {
    setImportedData(null)
    setValidationErrors([])
    setShowPreview(false)
    setImportSuccess(false)
  }, [])

  // 复制导出数据到剪贴板
  const handleCopyToClipboard = useCallback(() => {
    const exportData = createExportPackage(resumeData, styleConfig)
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
  }, [resumeData, styleConfig])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">数据管理</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 标签页 */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setActiveTab('export'); resetImport(); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Download size={16} />
              导出数据
            </button>
            <button
              onClick={() => { setActiveTab('import'); resetImport(); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'import'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload size={16} />
              导入数据
            </button>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            {activeTab === 'export' ? (
              /* 导出面板 */
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  导出您的简历数据和样式配置，以便备份或在其他设备上使用。
                </p>
                
                {/* 导出内容预览 */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">导出内容包含：</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={14} className="text-blue-500" />
                      <span>简历数据（个人信息、工作经历、教育背景等）</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Palette size={14} className="text-purple-500" />
                      <span>样式配置（颜色、字体、间距等）</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Settings size={14} className="text-gray-500" />
                      <span>版本信息和导出时间</span>
                    </div>
                  </div>
                </div>

                {/* 导出按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={handleExport}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Download size={16} />
                    下载 JSON 文件
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    title="复制到剪贴板"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            ) : (
              /* 导入面板 */
              <div className="space-y-4">
                {importSuccess ? (
                  /* 导入成功 */
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">导入成功</h3>
                    <p className="text-sm text-gray-500">数据已成功导入</p>
                  </motion.div>
                ) : showPreview && importedData ? (
                  /* 数据预览 */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">数据预览</h4>
                      <button
                        onClick={resetImport}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        重新选择
                      </button>
                    </div>

                    {/* 预览内容 */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                      {importedData.resumeData && (
                        <div className="flex items-start gap-2">
                          <FileText size={14} className="text-blue-500 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">简历数据</span>
                            <p className="text-xs text-gray-500">
                              {importedData.resumeData.personalInfo?.name || '未命名'} 的简历
                            </p>
                          </div>
                        </div>
                      )}
                      {importedData.styleConfig && (
                        <div className="flex items-start gap-2">
                          <Palette size={14} className="text-purple-500 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">样式配置</span>
                            <p className="text-xs text-gray-500">
                              包含颜色、字体和间距设置
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
                        导出时间: {new Date(importedData.exportedAt).toLocaleString('zh-CN')}
                      </div>
                    </div>

                    {/* 导入模式选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        导入模式
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setImportMode('replace')}
                          className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                            importMode === 'replace'
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          覆盖现有数据
                        </button>
                        <button
                          onClick={() => setImportMode('merge')}
                          className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                            importMode === 'merge'
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          合并数据
                        </button>
                      </div>
                    </div>

                    {/* 确认导入按钮 */}
                    <button
                      onClick={handleImportConfirm}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Check size={16} />
                      确认导入
                    </button>
                  </div>
                ) : (
                  /* 文件选择 */
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      从 JSON 文件导入简历数据和样式配置。
                    </p>

                    {/* 验证错误 */}
                    {validationErrors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                          <AlertCircle size={16} />
                          <span className="font-medium">导入失败</span>
                        </div>
                        <ul className="text-sm text-red-600 space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>• {error.message}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 文件上传区域 */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                    >
                      <FileJson size={40} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        点击选择文件或拖拽到此处
                      </p>
                      <p className="text-xs text-gray-500">
                        支持 .json 格式文件
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ImportExportDialog
