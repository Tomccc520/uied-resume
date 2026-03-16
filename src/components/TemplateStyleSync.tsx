/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-11-30
 */

'use client'

import { useEffect, useRef } from 'react'
import { TemplateStyle } from '@/types/template'
import { useStyle, defaultStyleConfig, StyleConfig } from '@/contexts/StyleContext'

interface TemplateStyleSyncProps {
  currentTemplate: TemplateStyle
}

/**
 * 模板样式同步组件
 * 负责监听当前模板的变化，并将模板样式应用到全局样式上下文中
 * 这解决了选中模板后预览区域样式不更新的问题
 */
export default function TemplateStyleSync({ currentTemplate }: TemplateStyleSyncProps) {
  const { updateStyleConfig } = useStyle()
  const lastTemplateIdRef = useRef<string>('')

  useEffect(() => {
    // 避免重复应用相同的模板
    if (currentTemplate.id === lastTemplateIdRef.current) return
    
    lastTemplateIdRef.current = currentTemplate.id
    
    // 辅助函数：将CSS尺寸字符串转换为像素值
    const parseSize = (sizeStr: string | undefined, defaultValue: number): number => {
      if (!sizeStr) return defaultValue
      
      if (sizeStr.includes('rem')) {
        const remValue = parseFloat(sizeStr.replace('rem', ''))
        return Math.round(remValue * 16)
      }
      
      if (sizeStr.includes('px')) {
        return parseInt(sizeStr.replace('px', ''))
      }
      
      const numValue = parseFloat(sizeStr)
      return isNaN(numValue) ? defaultValue : Math.round(numValue)
    }

    // 构建新的样式配置
    const avatarShape: StyleConfig['avatar']['shape'] =
      currentTemplate.components?.personalInfo?.avatarPosition === 'center' ? 'circle' : 'rounded'

    const newConfig: StyleConfig = {
      ...defaultStyleConfig,
      fontFamily: currentTemplate.fonts?.heading || defaultStyleConfig.fontFamily,
      fontSize: {
        name: parseSize(currentTemplate.fonts?.size?.heading, defaultStyleConfig.fontSize.name),
        title: parseSize(currentTemplate.fonts?.size?.body, defaultStyleConfig.fontSize.title),
        content: parseSize(currentTemplate.fonts?.size?.body, defaultStyleConfig.fontSize.content),
        small: parseSize(currentTemplate.fonts?.size?.small, defaultStyleConfig.fontSize.small)
      },
      colors: {
        ...defaultStyleConfig.colors,
        primary: currentTemplate.colors?.primary || defaultStyleConfig.colors.primary,
        secondary: currentTemplate.colors?.secondary || defaultStyleConfig.colors.secondary,
        text: currentTemplate.colors?.text || defaultStyleConfig.colors.text,
        accent: currentTemplate.colors?.accent || defaultStyleConfig.colors.accent,
        background: currentTemplate.colors?.background || defaultStyleConfig.colors.background
      },
      spacing: {
        section: parseSize(currentTemplate.layout?.spacing?.section, defaultStyleConfig.spacing.section),
        item: parseSize(currentTemplate.layout?.spacing?.item, defaultStyleConfig.spacing.item),
        line: parseSize(currentTemplate.layout?.spacing?.line, defaultStyleConfig.spacing.line)
      },
      layout: {
        ...defaultStyleConfig.layout,
        columns: currentTemplate.layout?.columns?.count || defaultStyleConfig.layout.columns,
        columnGap: parseSize(currentTemplate.layout?.columns?.gap, defaultStyleConfig.layout.columnGap),
        padding: parseSize(currentTemplate.layout?.margins?.left, defaultStyleConfig.layout.padding), // 使用左边距作为内边距参考
        headerLayout: currentTemplate.components?.personalInfo?.layout === 'vertical' ? 'centered' : 'horizontal',
        // 其他布局属性保留默认或根据需要进一步映射
      },
      avatar: {
        ...defaultStyleConfig.avatar,
        shape: avatarShape,
        // 根据模板显示设置决定
        border: true
      },
      skills: { ...defaultStyleConfig.skills }
    }

    // 更新全局样式配置
    updateStyleConfig(newConfig)
    
  }, [currentTemplate, updateStyleConfig])

  return null
}
