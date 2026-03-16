/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-01-15
 * 
 * 预览骨架屏组件
 * 在预览加载时显示骨架屏动画
 * Requirements: 2.7
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { A4_WIDTH_PX, A4_WIDTH_MM, A4_HEIGHT_MM } from './PreviewPanel'

interface PreviewSkeletonProps {
  isDarkMode?: boolean
}

/**
 * 骨架屏动画变体
 */
const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
}

/**
 * 骨架屏行组件
 */
function SkeletonLine({ 
  width = '100%', 
  height = '12px',
  isDarkMode = false,
  className = ''
}: { 
  width?: string
  height?: string
  isDarkMode?: boolean
  className?: string
}) {
  return (
    <div 
      className={`relative overflow-hidden rounded ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      } ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent' 
            : 'bg-gradient-to-r from-transparent via-gray-100 to-transparent'
        }`}
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />
    </div>
  )
}

/**
 * 骨架屏圆形组件
 */
function SkeletonCircle({ 
  size = '48px',
  isDarkMode = false
}: { 
  size?: string
  isDarkMode?: boolean
}) {
  return (
    <div 
      className={`relative overflow-hidden rounded-full ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}
      style={{ width: size, height: size }}
    >
      <motion.div
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent' 
            : 'bg-gradient-to-r from-transparent via-gray-100 to-transparent'
        }`}
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />
    </div>
  )
}

/**
 * 预览骨架屏组件
 * 模拟简历预览的加载状态
 */
export function PreviewSkeleton({ isDarkMode = false }: PreviewSkeletonProps) {
  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100/50'}`}>
      {/* 工具栏骨架 */}
      <div className={`flex-shrink-0 flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-gray-50/95 border-gray-200'
      }`}>
        <SkeletonLine width="100px" height="32px" isDarkMode={isDarkMode} />
        <div className="flex items-center gap-2">
          <SkeletonLine width="200px" height="36px" isDarkMode={isDarkMode} />
        </div>
        <SkeletonLine width="80px" height="36px" isDarkMode={isDarkMode} />
      </div>

      {/* 预览区域骨架 */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8 flex justify-center">
        <motion.div
          className={`relative rounded ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
          style={{
            width: `${A4_WIDTH_PX}px`,
            aspectRatio: `${A4_WIDTH_MM} / ${A4_HEIGHT_MM}`,
            boxShadow: isDarkMode 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            maxWidth: '100%'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8 space-y-6">
            {/* 头部区域 - 头像和基本信息 */}
            <div className="flex items-start gap-6">
              <SkeletonCircle size="80px" isDarkMode={isDarkMode} />
              <div className="flex-1 space-y-3">
                <SkeletonLine width="60%" height="24px" isDarkMode={isDarkMode} />
                <SkeletonLine width="40%" height="16px" isDarkMode={isDarkMode} />
                <div className="flex gap-4 pt-2">
                  <SkeletonLine width="120px" height="14px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="100px" height="14px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="140px" height="14px" isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>

            {/* 个人简介 */}
            <div className="space-y-2">
              <SkeletonLine width="100%" height="14px" isDarkMode={isDarkMode} />
              <SkeletonLine width="95%" height="14px" isDarkMode={isDarkMode} />
              <SkeletonLine width="80%" height="14px" isDarkMode={isDarkMode} />
            </div>

            {/* 工作经历区域 */}
            <div className="space-y-4">
              <SkeletonLine width="120px" height="20px" isDarkMode={isDarkMode} />
              
              {/* 工作经历项 1 */}
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <div className="flex justify-between">
                  <SkeletonLine width="50%" height="16px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="100px" height="14px" isDarkMode={isDarkMode} />
                </div>
                <SkeletonLine width="40%" height="14px" isDarkMode={isDarkMode} />
                <div className="space-y-1.5 pt-2">
                  <SkeletonLine width="100%" height="12px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="95%" height="12px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="85%" height="12px" isDarkMode={isDarkMode} />
                </div>
              </div>

              {/* 工作经历项 2 */}
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <div className="flex justify-between">
                  <SkeletonLine width="45%" height="16px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="100px" height="14px" isDarkMode={isDarkMode} />
                </div>
                <SkeletonLine width="35%" height="14px" isDarkMode={isDarkMode} />
                <div className="space-y-1.5 pt-2">
                  <SkeletonLine width="100%" height="12px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="90%" height="12px" isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>

            {/* 教育经历区域 */}
            <div className="space-y-3">
              <SkeletonLine width="100px" height="20px" isDarkMode={isDarkMode} />
              <div className="flex justify-between">
                <div className="space-y-2">
                  <SkeletonLine width="180px" height="16px" isDarkMode={isDarkMode} />
                  <SkeletonLine width="140px" height="14px" isDarkMode={isDarkMode} />
                </div>
                <SkeletonLine width="100px" height="14px" isDarkMode={isDarkMode} />
              </div>
            </div>

            {/* 技能区域 */}
            <div className="space-y-3">
              <SkeletonLine width="80px" height="20px" isDarkMode={isDarkMode} />
              <div className="flex flex-wrap gap-2">
                <SkeletonLine width="80px" height="28px" isDarkMode={isDarkMode} className="rounded-full" />
                <SkeletonLine width="100px" height="28px" isDarkMode={isDarkMode} className="rounded-full" />
                <SkeletonLine width="70px" height="28px" isDarkMode={isDarkMode} className="rounded-full" />
                <SkeletonLine width="90px" height="28px" isDarkMode={isDarkMode} className="rounded-full" />
                <SkeletonLine width="85px" height="28px" isDarkMode={isDarkMode} className="rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PreviewSkeleton
