/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-01-15
 * 
 * 预览面板组件 - 优化版本
 * 实现 A4 纸张比例显示、纸张阴影和圆角效果、深色模式支持
 * Requirements: 2.1, 2.2, 2.6
 */

'use client'

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ResumeData } from '@/types/resume'
import { TemplateStyle } from '@/types/template'
import PreviewToolbar from './PreviewToolbar'
import PreviewSkeleton from './PreviewSkeleton'

// Re-export constants and utilities from previewUtils for backward compatibility
export {
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  A4_ASPECT_RATIO,
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  MIN_ZOOM,
  MAX_ZOOM,
  calculatePaperStyle,
  clampZoom,
  clampPageNumber
} from './previewUtils'

import {
  A4_HEIGHT_PX,
  clampZoom,
  clampPageNumber
} from './previewUtils'

interface PreviewPanelProps {
  resumeData: ResumeData
  template: TemplateStyle
  zoom: number
  onZoomChange: (zoom: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onExport?: (format: 'pdf' | 'png' | 'jpg') => void
  isLoading?: boolean
  isDarkMode?: boolean
  isUpdating?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * 预览面板组件
 * 显示简历预览，支持缩放、分页、深色模式
 */
export function PreviewPanel({
  resumeData,
  template,
  zoom,
  onZoomChange,
  currentPage,
  totalPages,
  onPageChange,
  onExport,
  isLoading = false,
  isDarkMode = false,
  isUpdating = false,
  children,
  className = ''
}: PreviewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)

  // 确保缩放值在有效范围内
  const safeZoom = useMemo(() => clampZoom(zoom), [zoom])
  
  // 确保页码有效
  const safeCurrentPage = useMemo(() => clampPageNumber(currentPage, totalPages), [currentPage, totalPages])
  const safeTotalPages = useMemo(() => Math.max(1, totalPages), [totalPages])

  // 处理缩放变化，确保值在有效范围内
  const handleZoomChange = useCallback((newZoom: number) => {
    const clampedZoom = clampZoom(newZoom)
    onZoomChange(clampedZoom)
  }, [onZoomChange])

  // 处理页码变化，确保值有效
  const handlePageChange = useCallback((newPage: number) => {
    const clampedPage = clampPageNumber(newPage, safeTotalPages)
    onPageChange(clampedPage)
  }, [onPageChange, safeTotalPages])

  // 监听容器高度变化
  useEffect(() => {
    if (!containerRef.current) return
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })
    
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  // 处理滚动到指定页
  const scrollToPage = useCallback((page: number) => {
    if (!containerRef.current) return
    const pageHeight = A4_HEIGHT_PX * (safeZoom / 100)
    const targetScroll = (page - 1) * pageHeight
    containerRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    })
  }, [safeZoom])

  // 处理滚动事件，更新当前页码
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const pageHeight = A4_HEIGHT_PX * (safeZoom / 100)
    const newPage = Math.floor(scrollTop / pageHeight) + 1
    
    if (newPage !== safeCurrentPage && newPage >= 1 && newPage <= safeTotalPages) {
      onPageChange(newPage)
    }
  }, [safeZoom, safeCurrentPage, safeTotalPages, onPageChange])

  // 加载状态显示骨架屏
  if (isLoading) {
    return <PreviewSkeleton isDarkMode={isDarkMode} />
  }

  // Suppress unused variable warnings - these are used for future features
  void resumeData
  void template
  void containerHeight
  void scrollToPage

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 工具栏 */}
      <PreviewToolbar
        zoom={safeZoom}
        onZoomChange={handleZoomChange}
        currentPage={safeCurrentPage}
        totalPages={safeTotalPages}
        onPageChange={handlePageChange}
        onExport={onExport}
        isUpdating={isUpdating}
        isDarkMode={isDarkMode}
      />
      
      {/* 预览区域 */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-auto custom-scrollbar p-4 sm:p-6 lg:p-8 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-100/50'
        }`}
        onScroll={handleScroll}
      >
        <div className="flex justify-center min-h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
            style={{
              // 缩放由 ResumePreview 组件自行处理
              // PreviewPanel 只提供容器和工具栏
              transformOrigin: 'top center'
            }}
          >
            {/* 更新指示器 */}
            {isUpdating && (
              <div className="absolute top-2 right-2 z-10">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </div>
            )}
            
            {/* 简历内容 - 缩放由 children (ResumePreview) 处理 */}
            <div id="resume-preview-content" className="w-full h-full">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPanel
