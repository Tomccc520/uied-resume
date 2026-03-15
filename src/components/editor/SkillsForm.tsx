
/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-9-22
 */

import React, { useMemo, useState } from 'react'
import { Code, GripVertical, Palette, Plus, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react'
import { AnimatePresence, Reorder } from 'framer-motion'
import { Skill } from '@/types/resume'
import { EditableCard } from './EditableCard'
import { AddCardButton } from './AddCardButton'
import { SectionHeader } from './SectionHeader'
import FormField, { FormFieldGroup } from '@/components/FormField'
import { useLanguage } from '@/contexts/LanguageContext'
import { StyleConfig, useStyle } from '@/contexts/StyleContext'

interface SkillsFormProps {
  skills: Skill[]
  onChange: (data: Skill[]) => void
}

type SkillDisplayStyle = StyleConfig['skills']['displayStyle']

interface SkillStyleOption {
  value: SkillDisplayStyle
  label: string
  icon: string
}

interface SkillPackOption {
  key: string
  label: string
  category: string
  values: string[]
}

/**
 * 预设技能颜色
 * 提供常用且对比度友好的配色，方便快速标记技能类别。
 */
const PRESET_COLORS = [
  '#2563EB',
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#4B5563'
]

/**
 * 解析批量技能输入
 * 支持英文逗号、中文逗号、分号和换行，自动去重。
 */
function parseQuickSkillTokens(input: string): string[] {
  const tokens = input
    .split(/[\n,，;；]+/)
    .map((token) => token.trim())
    .filter(Boolean)

  const normalized = new Set<string>()
  const result: string[] = []
  tokens.forEach((token) => {
    const key = token.toLowerCase()
    if (!normalized.has(key)) {
      normalized.add(key)
      result.push(token)
    }
  })
  return result
}

export function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const { t, locale } = useLanguage()
  const { styleConfig, updateStyleConfig } = useStyle()
  const [showAdvancedStyles, setShowAdvancedStyles] = useState(false)
  const [quickInput, setQuickInput] = useState('')

  const mainstreamStyles: SkillStyleOption[] = [
    { value: 'progress', label: locale === 'zh' ? '进度条' : 'Progress', icon: '━' },
    { value: 'tags', label: locale === 'zh' ? '标签' : 'Tags', icon: 'TAG' },
    { value: 'list', label: locale === 'zh' ? '列表' : 'List', icon: '•' },
    { value: 'cards', label: locale === 'zh' ? '卡片' : 'Cards', icon: '[]' }
  ]

  const advancedStyles: SkillStyleOption[] = [
    { value: 'minimal', label: locale === 'zh' ? '极简' : 'Minimal', icon: '─' },
    { value: 'grid', label: locale === 'zh' ? '网格' : 'Grid', icon: '##' },
    { value: 'circular', label: locale === 'zh' ? '圆形进度' : 'Circular', icon: 'O' },
    { value: 'radar', label: locale === 'zh' ? '雷达图' : 'Radar', icon: '<>' },
    { value: 'star-rating', label: locale === 'zh' ? '星级' : 'Star', icon: '***' },
    { value: 'badge', label: locale === 'zh' ? '徽章' : 'Badge', icon: 'BDG' },
    { value: 'wave-progress', label: locale === 'zh' ? '波浪' : 'Wave', icon: '~~~' },
    { value: 'gradient-card', label: locale === 'zh' ? '渐变卡片' : 'Gradient', icon: 'GRD' }
  ]

  const categoryOptions = locale === 'zh'
    ? ['前端开发', '后端开发', '数据分析', '产品能力', '设计能力', '通用能力']
    : ['Frontend', 'Backend', 'Data', 'Product', 'Design', 'General']

  /**
   * 常见岗位技能包
   * 提供招聘场景常用技能集合，支持一键补齐，降低手动输入成本。
   */
  const skillPackOptions = useMemo<SkillPackOption[]>(() => {
    if (locale === 'zh') {
      return [
        {
          key: 'frontend',
          label: '前端工程师常用',
          category: '前端开发',
          values: ['JavaScript', 'TypeScript', 'React', 'Next.js', '工程化', '性能优化']
        },
        {
          key: 'product',
          label: '产品经理常用',
          category: '产品能力',
          values: ['需求分析', '用户研究', 'PRD', '数据分析', '跨团队协作']
        },
        {
          key: 'operations',
          label: '运营岗位常用',
          category: '通用能力',
          values: ['活动策划', '内容运营', '增长策略', '数据复盘', '用户运营']
        },
        {
          key: 'design',
          label: '设计岗位常用',
          category: '设计能力',
          values: ['Figma', '视觉设计', '交互设计', '设计系统', '可用性测试']
        }
      ]
    }

    return [
      {
        key: 'frontend',
        label: 'Frontend Pack',
        category: 'Frontend',
        values: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Performance', 'Engineering']
      },
      {
        key: 'product',
        label: 'Product Pack',
        category: 'Product',
        values: ['Requirement Analysis', 'User Research', 'Roadmap', 'Data Insight', 'Collaboration']
      },
      {
        key: 'operations',
        label: 'Operations Pack',
        category: 'General',
        values: ['Campaign', 'Content Ops', 'Growth', 'Reporting', 'User Engagement']
      },
      {
        key: 'design',
        label: 'Design Pack',
        category: 'Design',
        values: ['Figma', 'Visual Design', 'Interaction Design', 'Design System', 'Usability Test']
      }
    ]
  }, [locale])

  /**
   * 添加单个技能条目
   * 保持最小默认字段，降低用户首次输入成本。
   */
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 50,
      category: locale === 'zh' ? '前端开发' : 'Frontend',
      color: '#2563EB'
    }
    onChange([...skills, newSkill])
  }

  /**
   * 更新技能字段
   * 仅替换目标项，保证列表顺序稳定。
   */
  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    const updatedSkills = skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    )
    onChange(updatedSkills)
  }

  /**
   * 删除技能
   */
  const deleteSkill = (id: string) => {
    onChange(skills.filter(skill => skill.id !== id))
  }

  /**
   * 处理拖拽排序
   */
  const handleReorder = (newSkills: Skill[]) => {
    onChange(newSkills)
  }

  /**
   * 应用技能展示样式
   * 统一入口，避免在 JSX 中分散写入样式更新逻辑。
   */
  const applyDisplayStyle = (style: SkillDisplayStyle) => {
    updateStyleConfig({
      skills: {
        ...styleConfig.skills,
        displayStyle: style
      }
    })
  }

  /**
   * 批量添加技能
   * 按输入内容拆分后自动去重，已存在技能不会重复添加。
   */
  const handleBatchAddSkills = () => {
    const tokens = parseQuickSkillTokens(quickInput)
    if (tokens.length === 0) return

    const exists = new Set(skills.map((item) => item.name.trim().toLowerCase()))
    const newSkills: Skill[] = []

    tokens.forEach((name, index) => {
      const key = name.toLowerCase()
      if (exists.has(key)) return
      exists.add(key)
      newSkills.push({
        id: `skill-${Date.now()}-${index}`,
        name,
        level: 70,
        category: locale === 'zh' ? '前端开发' : 'Frontend',
        color: '#2563EB'
      })
    })

    if (newSkills.length > 0) {
      onChange([...skills, ...newSkills])
    }
    setQuickInput('')
  }

  /**
   * 按熟练度降序排序
   * 让高价值技能优先展示，提升招聘方扫描效率。
   */
  const handleSortByLevel = () => {
    const sorted = [...skills].sort((a, b) => b.level - a.level)
    onChange(sorted)
  }

  /**
   * 应用岗位技能包
   * 只添加当前不存在的技能，避免覆盖用户已编辑内容。
   */
  const handleApplySkillPack = (pack: SkillPackOption) => {
    const exists = new Set(skills.map((item) => item.name.trim().toLowerCase()))
    const additions: Skill[] = []

    pack.values.forEach((name, index) => {
      const key = name.toLowerCase()
      if (exists.has(key)) return
      exists.add(key)
      additions.push({
        id: `pack-${pack.key}-${Date.now()}-${index}`,
        name,
        level: 70,
        category: pack.category,
        color: '#2563EB'
      })
    })

    if (additions.length > 0) {
      onChange([...skills, ...additions])
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        title={t.editor.skills.title}
        description={t.editor.skills.description}
        count={skills.length}
        icon={<Code className="w-5 h-5" />}
      />

      {/* 样式选择：先给主流样式，减少噪音；高级样式按需展开 */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              {locale === 'zh' ? '技能展示样式' : 'Skill Display'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {locale === 'zh' ? '先选主流样式，再按需切高级样式' : 'Pick mainstream first, advanced if needed'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {mainstreamStyles.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => applyDisplayStyle(style.value)}
              className={`px-3 py-2 rounded-lg border text-left transition-colors ${
                styleConfig.skills.displayStyle === style.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-semibold">{style.icon}</div>
              <div className="text-xs mt-0.5">{style.label}</div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedStyles((prev) => !prev)}
          className="mt-3 inline-flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {showAdvancedStyles
            ? (locale === 'zh' ? '收起高级样式' : 'Hide advanced styles')
            : (locale === 'zh' ? '显示高级样式' : 'Show advanced styles')}
        </button>

        {showAdvancedStyles && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {advancedStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => applyDisplayStyle(style.value)}
                className={`px-3 py-2 rounded-lg border text-left transition-colors ${
                  styleConfig.skills.displayStyle === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-sm font-semibold">{style.icon}</div>
                <div className="text-xs mt-0.5">{style.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 批量输入：减少逐条添加的操作负担 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              {locale === 'zh' ? '批量添加技能' : 'Batch Add Skills'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSortByLevel}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600"
          >
            <ArrowDownWideNarrow className="w-3.5 h-3.5" />
            {locale === 'zh' ? '按熟练度排序' : 'Sort by level'}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder={locale === 'zh' ? '例如：React, TypeScript, Node.js, 产品设计' : 'e.g. React, TypeScript, Node.js'}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={handleBatchAddSkills}
            disabled={!quickInput.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {locale === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
      </div>

      {/* 岗位技能包：面向常见招聘场景的一键补齐入口 */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            {locale === 'zh' ? '岗位技能包' : 'Role Skill Packs'}
          </span>
          <span className="text-xs text-gray-500">
            {locale === 'zh' ? '不会覆盖已填写技能' : 'Will not overwrite existing skills'}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {skillPackOptions.map((pack) => (
            <button
              key={pack.key}
              type="button"
              onClick={() => handleApplySkillPack(pack)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="text-sm font-medium text-gray-900">{pack.label}</div>
              <div className="mt-1 truncate text-xs text-gray-500">{pack.values.join(' / ')}</div>
            </button>
          ))}
        </div>
      </div>

      <Reorder.Group axis="y" values={skills} onReorder={handleReorder} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {skills.map((skill) => (
            <Reorder.Item key={skill.id} value={skill}>
              <EditableCard
                title={skill.name || t.editor.skills.placeholders.name}
                subtitle={`${skill.category || (locale === 'zh' ? '未分类' : 'Uncategorized')} · ${skill.level}%`}
                onDelete={() => deleteSkill(skill.id)}
                dragHandle={<GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing mr-2" />}
              >
                <div className="space-y-4">
                  <FormFieldGroup>
                    <FormField
                      label={t.editor.skills.name}
                      type="text"
                      value={skill.name}
                      onChange={(value) => updateSkill(skill.id, 'name', value)}
                      placeholder={t.editor.skills.placeholders.name}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {locale === 'zh' ? '技能分类' : 'Category'}
                      </label>
                      <select
                        value={skill.category}
                        onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        {categoryOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormFieldGroup>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        label={`${t.editor.skills.level}: ${skill.level}%`}
                        type="range"
                        min={0}
                        max={100}
                        value={skill.level}
                        onChange={(value) => updateSkill(skill.id, 'level', parseInt(value))}
                        className="mb-0"
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[40, 60, 80, 90].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => updateSkill(skill.id, 'level', preset)}
                              className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                                skill.level === preset
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">0-100</div>
                      </div>
                    </div>
                    
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1.5">
                         {locale === 'zh' ? '技能颜色' : 'Skill Color'}
                       </label>
                       <div className="flex flex-wrap gap-2 mt-1">
                         {PRESET_COLORS.map(color => (
                           <button
                             key={color}
                             type="button"
                             onClick={() => updateSkill(skill.id, 'color', color)}
                             className={`w-6 h-6 rounded-full border-2 transition-all ${
                               skill.color === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                             }`}
                             style={{ backgroundColor: color }}
                             aria-label={`Select color ${color}`}
                           />
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </EditableCard>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <AddCardButton onAdd={addSkill} text={t.editor.skills.add} />
    </div>
  )
}
