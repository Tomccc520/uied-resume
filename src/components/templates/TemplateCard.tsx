/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-14
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Check, Eye, Heart } from 'lucide-react'
import { TemplateStyle, TemplateRecommendedRole, TemplateExperienceLevel } from '@/types/template'
import TemplatePreview from '../TemplatePreview'
import { useLanguage } from '@/contexts/LanguageContext'
import { isFavoriteTemplate, toggleFavoriteTemplate } from '@/utils/templateFavorites'

interface TemplateCardProps {
  template: TemplateStyle
  isSelected: boolean
  onClick: () => void
  onPreview?: () => void
}

/**
 * 模板卡片组件
 * 使用招聘工具风信息结构：缩略图 + 模板定位 + 一键使用。
 */
export default function TemplateCard({
  template,
  isSelected,
  onClick,
  onPreview
}: TemplateCardProps) {
  const { locale } = useLanguage()
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setIsFavorite(isFavoriteTemplate(template.id))
  }, [template.id])

  /**
   * 切换收藏状态
   * 阻止事件冒泡，避免触发模板选中。
   */
  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const newState = toggleFavoriteTemplate(template.id)
    setIsFavorite(newState)
  }

  /**
   * 键盘触发卡片选中
   * 保持 Enter/Space 可访问性。
   */
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  /**
   * 获取模板名称
   * 根据当前语言环境切换中英文文案。
   */
  const getTemplateName = () => {
    return locale === 'en' && template.nameEn ? template.nameEn : template.name
  }

  /**
   * 获取模板描述
   * 根据当前语言环境切换中英文文案。
   */
  const getTemplateDescription = () => {
    return locale === 'en' && template.descriptionEn ? template.descriptionEn : template.description
  }

  /**
   * 获取推荐岗位列表
   * 未配置时回退为“通用”。
   */
  const getRecommendedRoles = (): TemplateRecommendedRole[] => {
    if (template.recommendedRoles && template.recommendedRoles.length > 0) {
      return template.recommendedRoles
    }
    return ['general']
  }

  /**
   * 获取推荐经验段位列表
   * 未配置时回退为“1-3年”。
   */
  const getRecommendedExperienceLevels = (): TemplateExperienceLevel[] => {
    if (template.recommendedExperienceLevels && template.recommendedExperienceLevels.length > 0) {
      return template.recommendedExperienceLevels
    }
    return ['1-3']
  }

  /**
   * 获取岗位文案
   * 统一岗位在中英文环境下的展示。
   */
  const getRoleLabel = (role: TemplateRecommendedRole) => {
    if (locale === 'en') {
      const roleMap: Record<TemplateRecommendedRole, string> = {
        tech: 'Tech',
        product: 'Product',
        operations: 'Operations',
        design: 'Design',
        general: 'General'
      }
      return roleMap[role]
    }
    const roleMap: Record<TemplateRecommendedRole, string> = {
      tech: '技术',
      product: '产品',
      operations: '运营',
      design: '设计',
      general: '通用'
    }
    return roleMap[role]
  }

  /**
   * 获取经验段位文案
   * 统一经验段位在中英文环境下的展示。
   */
  const getExperienceLabel = (level: TemplateExperienceLevel) => {
    if (locale === 'en') {
      const levelMap: Record<TemplateExperienceLevel, string> = {
        campus: 'Campus',
        '1-3': '1-3 Years',
        '3-5': '3-5 Years',
        '5+': '5+ Years'
      }
      return levelMap[level]
    }
    const levelMap: Record<TemplateExperienceLevel, string> = {
      campus: '校招',
      '1-3': '1-3年',
      '3-5': '3-5年',
      '5+': '5年+'
    }
    return levelMap[level]
  }

  /**
   * 获取结构标签
   * 输出单栏/双栏结构，帮助用户快速判断版式。
   */
  const getStructureLabel = () => {
    const isTwoColumn = template.layout.columns.count === 2 || template.layoutType === 'left-right'
    if (locale === 'en') {
      return isTwoColumn ? 'Two-column' : 'Single-column'
    }
    return isTwoColumn ? '双栏' : '单栏'
  }

  /**
   * 获取 ATS 标签
   * 输出简化版本的 ATS 适配等级。
   */
  const getATSLabel = () => {
    const isAtsFriendly =
      template.layout.columns.count === 1 &&
      !template.components.cardStyle &&
      !template.components.tableStyle &&
      template.components.listItem.bulletStyle !== 'timeline'

    if (isAtsFriendly) {
      return locale === 'en' ? 'ATS Friendly' : 'ATS 友好'
    }
    return locale === 'en' ? 'ATS Balanced' : 'ATS 均衡'
  }

  /**
   * 获取岗位与经验摘要
   * 仅展示第一优先场景，避免标签过多造成信息噪音。
   */
  const getScenarioSummary = () => {
    const roleSummary = getRoleLabel(getRecommendedRoles()[0] || 'general')
    const experienceSummary = getExperienceLabel(getRecommendedExperienceLevels()[0] || '1-3')
    return locale === 'en'
      ? `For ${roleSummary} · ${experienceSummary}`
      : `适配 ${roleSummary} · ${experienceSummary}`
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
      onClick={onClick}
      className="relative overflow-hidden rounded-lg border bg-white"
      style={{
        borderColor: isSelected ? '#334155' : '#d6dee8'
      }}
      aria-label={`${locale === 'en' ? 'Choose template' : '选择模板'}: ${getTemplateName()}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden border-b" style={{ borderColor: '#e5e7eb' }}>
        <TemplatePreview template={template} />
        {isSelected && (
          <div className="absolute right-2 top-2 rounded-full bg-slate-700 p-1 text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold leading-5 text-slate-900">{getTemplateName()}</h3>
            <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500">{getTemplateDescription()}</p>
          </div>
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`inline-flex h-7 w-7 items-center justify-center rounded border ${
              isFavorite
                ? 'border-rose-200 bg-rose-50 text-rose-500'
                : 'border-slate-200 bg-white text-slate-400'
            }`}
            aria-label={locale === 'en' ? 'Toggle favorite template' : '切换收藏模板'}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-600">
            {getStructureLabel()}
          </span>
          <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-600">
            {getATSLabel()}
          </span>
          <span className="truncate text-slate-500">{getScenarioSummary()}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {onPreview ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onPreview()
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600"
            >
              <Eye className="h-3.5 w-3.5" />
              {locale === 'en' ? 'Preview' : '预览'}
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onClick()
            }}
            className={`rounded px-3 py-1 text-xs font-semibold ${
              isSelected ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {isSelected ? (locale === 'en' ? 'Selected' : '已选') : (locale === 'en' ? 'Use' : '使用')}
          </button>
        </div>
      </div>
    </div>
  )
}
