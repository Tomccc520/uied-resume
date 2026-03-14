/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-14
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Check, Heart, Columns, FileText, Eye } from 'lucide-react'
import { TemplateStyle } from '@/types/template'
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
 * 升级视觉层级与状态反馈，保持现有选择行为不变。
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
   * 阻止冒泡，避免触发卡片选中逻辑。
   */
  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const newState = toggleFavoriteTemplate(template.id)
    setIsFavorite(newState)
  }

  /**
   * 键盘触发卡片点击
   * 保障可访问性下 Enter/Space 均可触发选中。
   */
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  /**
   * 获取模板名称
   * 根据当前语言返回中英文标题。
   */
  const getTemplateName = () => {
    return locale === 'en' && template.nameEn ? template.nameEn : template.name
  }

  /**
   * 获取模板描述
   * 根据当前语言返回中英文描述。
   */
  const getTemplateDescription = () => {
    return locale === 'en' && template.descriptionEn ? template.descriptionEn : template.description
  }

  /**
   * 获取布局标签
   * 为单双栏模板提供不同视觉标签与图标。
   */
  const getLayoutType = () => {
    if (template.layoutType === 'left-right' || template.layout.columns.count === 2) {
      return {
        icon: Columns,
        label: locale === 'en' ? 'Two Columns' : '双栏布局',
        tone: 'bg-cyan-50 text-cyan-700 border-cyan-100'
      }
    }
    return {
      icon: FileText,
      label: locale === 'en' ? 'Single Column' : '单栏布局',
      tone: 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const layoutInfo = getLayoutType()
  const LayoutIcon = layoutInfo.icon

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
        isSelected ? 'translate-y-[-2px]' : 'hover:translate-y-[-2px]'
      }`}
      style={{
        borderColor: isSelected ? '#0f766e' : '#e2e8f0',
        boxShadow: isSelected
          ? '0 18px 36px -24px rgba(15, 118, 110, 0.6)'
          : '0 14px 30px -30px rgba(15, 23, 42, 0.72)'
      }}
      aria-label={`${locale === 'en' ? 'Choose template' : '选择模板'}: ${getTemplateName()}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-900/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {isSelected && (
        <div className="absolute right-3 top-3 z-20 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg">
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </div>
      )}

      <button
        type="button"
        onClick={handleToggleFavorite}
        className={`absolute top-3 z-10 rounded-full border p-1.5 transition-all ${
          isSelected ? 'right-11' : 'right-3'
        } ${
          isFavorite
            ? 'border-rose-200 bg-rose-50 text-rose-500 opacity-100'
            : 'border-white/70 bg-white/90 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100'
        } ${isFavorite ? '' : 'opacity-0'}`}
        aria-label={locale === 'en' ? 'Toggle favorite template' : '切换收藏模板'}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <div className="absolute left-3 top-3 z-10">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${layoutInfo.tone}`}>
          <LayoutIcon className="h-3 w-3" />
          {layoutInfo.label}
        </span>
      </div>

      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        <TemplatePreview template={template} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/10 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className={`text-sm font-semibold ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
          {getTemplateName()}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{getTemplateDescription()}</p>

        {template.tags && template.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${template.id}-tag-${index}`}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-1">
            {Object.values(template.colors)
              .slice(0, 4)
              .map((color, index) => (
                <span
                  key={`${template.id}-color-${index}`}
                  className="h-4 w-4 rounded-full border border-slate-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
          </div>
          <div className="flex items-center gap-2">
            {onPreview && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onPreview()
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Eye className="h-3.5 w-3.5" />
                {locale === 'en' ? 'Preview' : '预览'}
              </button>
            )}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onClick()
              }}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                isSelected
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-700'
              }`}
            >
              {isSelected
                ? locale === 'en'
                  ? 'Selected'
                  : '已选'
                : locale === 'en'
                  ? 'Use'
                  : '使用'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
