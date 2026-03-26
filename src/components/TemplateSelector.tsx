/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 * @updateDate 2026-03-26
 */

'use client'

import React, { useMemo, useState } from 'react'
import { Check, Palette, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TemplateStyle } from '@/types/template'
import { CORE_TEMPLATE_IDS, getAvailableTemplates } from '@/data/templates'
import { ResumeData } from '@/types/resume'
import { getCareerTemplateData, isCareerTemplate } from '@/data/careerTemplates'
import TemplatePreview from './TemplatePreview'
import TemplateCard from './templates/TemplateCard'
import { useLanguage } from '@/contexts/LanguageContext'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: TemplateStyle) => void
  onUpdateResumeData?: (data: ResumeData) => void
  currentTemplate?: string
}

/**
 * 获取三套模板的固定排序
 * 通过 CORE_TEMPLATE_IDS 保证展示顺序稳定，避免因为数组顺序变化导致 UI 抖动。
 */
function getOrderedCoreTemplates(): TemplateStyle[] {
  const availableTemplates = getAvailableTemplates()
  return CORE_TEMPLATE_IDS
    .map((id) => availableTemplates.find((template) => template.id === id))
    .filter((template): template is TemplateStyle => Boolean(template))
}

/**
 * 模板选择器组件
 * 仅保留三套核心模板，专注招聘投递场景，不再展示复杂分类筛选。
 */
export default function TemplateSelector({
  isOpen,
  onClose,
  onSelectTemplate,
  onUpdateResumeData,
  currentTemplate
}: TemplateSelectorProps) {
  const { locale } = useLanguage()
  const [previewTemplate, setPreviewTemplate] = useState<TemplateStyle | null>(null)

  /**
   * 缓存三套核心模板列表
   * 仅在组件初始化时读取，避免弹窗内重复计算。
   */
  const coreTemplates = useMemo(() => getOrderedCoreTemplates(), [])

  /**
   * 获取模板风格简称
   * 用于卡片上方辅助文案，帮助用户快速区分三套版本定位。
   */
  const getTemplateVersionLabel = (templateId: string) => {
    const labelMap = {
      'banner-layout': locale === 'en' ? 'Indeed Style' : 'Indeed 风',
      'card-layout': locale === 'en' ? 'Canva Style' : 'Canva 风',
      'timeline-layout': locale === 'en' ? 'Boss Style' : 'Boss 风'
    }
    return labelMap[templateId as keyof typeof labelMap] || (locale === 'en' ? 'General Style' : '通用风格')
  }

  /**
   * 获取模板风格说明
   * 保持简短描述，强调“投递效率”和“阅读效率”。
   */
  const getTemplateVersionDescription = (templateId: string) => {
    const descMap = {
      'banner-layout': locale === 'en' ? 'ATS-first, single column' : '单栏 ATS 优先，投递稳妥',
      'card-layout': locale === 'en' ? 'Business dual-column hierarchy' : '商务双栏信息分区，结构清晰',
      'timeline-layout': locale === 'en' ? 'Compact timeline for quick scan' : '紧凑时间线，招聘方快速扫读'
    }
    return (
      descMap[templateId as keyof typeof descMap] ||
      (locale === 'en' ? 'Mainstream application-ready template' : '主流投递场景可直接使用')
    )
  }

  /**
   * 处理职业模板应用
   * 保留兼容逻辑，防止后续恢复职业模板时需要再次改动接入链路。
   */
  const handleApplyCareerTemplate = (templateId: string) => {
    const careerTemplateData = getCareerTemplateData(templateId)
    if (careerTemplateData && onUpdateResumeData) {
      onUpdateResumeData(careerTemplateData)
      onClose()
    }
  }

  /**
   * 处理模板选择
   * 统一选择入口，确保选择后立刻关闭弹窗并应用模板。
   */
  const handleTemplateSelect = (template: TemplateStyle) => {
    if (isCareerTemplate(template.id)) {
      handleApplyCareerTemplate(template.id)
      return
    }
    onSelectTemplate(template)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 sm:text-2xl">
              <Palette className="h-5 w-5 text-slate-700" />
              {locale === 'en' ? 'Template Versions' : '模板版本选择'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {locale === 'en'
                ? 'Keep only 3 mainstream apply-ready versions.'
                : '仅保留 3 套主流投递版本，直接用于求职投递。'}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[calc(95vh-92px)] overflow-y-auto p-4 sm:p-6">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {coreTemplates.map((template) => (
              <div key={`version-${template.id}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="text-xs font-semibold text-slate-700">{getTemplateVersionLabel(template.id)}</p>
                <p className="mt-1 text-xs text-slate-500">{getTemplateVersionDescription(template.id)}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {coreTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={currentTemplate === template.id}
                onClick={() => handleTemplateSelect(template)}
                onPreview={() => setPreviewTemplate(template)}
              />
            ))}
          </div>

          {coreTemplates.length === 0 && (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center">
              <p className="text-sm text-slate-500">
                {locale === 'en' ? 'No templates available currently.' : '当前没有可用模板，请稍后重试。'}
              </p>
            </div>
          )}
        </div>
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {locale === 'en' ? 'Template Preview' : '模板预览'}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                onClick={() => setPreviewTemplate(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[72vh] overflow-auto p-4">
              <div className="mx-auto w-full max-w-[820px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <TemplatePreview template={previewTemplate} fullSize />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <Button type="button" variant="outline" onClick={() => setPreviewTemplate(null)}>
                {locale === 'en' ? 'Close' : '关闭'}
              </Button>
              <Button
                type="button"
                onClick={() => handleTemplateSelect(previewTemplate)}
                className="inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                {locale === 'en' ? 'Use This Template' : '使用此模板'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
