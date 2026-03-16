
/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-9-22
 */

import React from 'react'
import { Briefcase, Copy, MoveDown, MoveUp } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { Experience } from '@/types/resume'
import { EditableCard } from './EditableCard'
import { AddCardButton } from './AddCardButton'
import { SectionHeader } from './SectionHeader'
import FormField, { FormFieldGroup } from '@/components/FormField'
import { RichTextEditor } from './RichTextEditor'
import { useLanguage } from '@/contexts/LanguageContext'
import { useListEditor } from '@/hooks/useListEditor'
import { formatLineItems, parseLineItems } from '@/utils/editorTextParsers'

interface ExperienceFormProps {
  experiences: Experience[]
  onChange: (data: Experience[]) => void
}

export function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const { t, locale } = useLanguage()
  const isZh = locale === 'zh'
  const {
    addItem,
    updateItem,
    updateItemField,
    deleteItem,
    duplicateItem,
    moveItem
  } = useListEditor<Experience>({
    items: experiences,
    onChange
  })

  /**
   * 添加工作经历
   * 使用统一列表编辑 Hook，避免每个表单重复实现增删改。
   */
  const addExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
      location: ''
    }
    addItem(newExperience)
  }

  /**
   * 切换“至今”状态
   * 当状态切到“至今”时清空结束时间，避免时间冲突。
   */
  const toggleCurrent = (id: string, nextCurrent?: boolean) => {
    updateItem(id, (item) => {
      const current = nextCurrent ?? !item.current
      return {
        ...item,
        current,
        endDate: current ? '' : item.endDate
      }
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        title={t.editor.experience.title}
        description={t.editor.experience.description}
        count={experiences.length}
        icon={<Briefcase className="w-5 h-5" />}
      />

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {experiences.map((exp, index) => (
            <EditableCard
              key={exp.id}
              title={exp.company || t.editor.experience.placeholders.company}
              subtitle={exp.position}
              onDelete={() => deleteItem(exp.id)}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      duplicateItem(exp.id, {
                        company: exp.company ? `${exp.company}${isZh ? '（复制）' : ' (Copy)'}` : exp.company
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {isZh ? '复制' : 'Duplicate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(exp.id, 'up')}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                    {isZh ? '上移' : 'Move Up'}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(exp.id, 'down')}
                    disabled={index === experiences.length - 1}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                    {isZh ? '下移' : 'Move Down'}
                  </button>
                </div>

                <FormFieldGroup>
                  <FormField
                    label={t.editor.experience.company}
                    type="text"
                    value={exp.company}
                    onChange={(value) => updateItemField(exp.id, 'company', value)}
                    placeholder={t.editor.experience.placeholders.company}
                  />
                  <FormField
                    label={t.editor.experience.position}
                    type="text"
                    value={exp.position}
                    onChange={(value) => updateItemField(exp.id, 'position', value)}
                    placeholder={t.editor.experience.placeholders.position}
                  />
                </FormFieldGroup>

                <FormFieldGroup>
                  <FormField
                    label={t.editor.experience.startDate}
                    type="month"
                    value={exp.startDate}
                    onChange={(value) => updateItemField(exp.id, 'startDate', value)}
                  />
                  <FormField
                    label={t.editor.experience.endDate}
                    type="month"
                    value={exp.current ? '' : exp.endDate}
                    onChange={(value) => updateItemField(exp.id, 'endDate', value)}
                    disabled={exp.current}
                  />
                </FormFieldGroup>

                <div className="flex items-center p-3 bg-white/50 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-colors cursor-pointer" onClick={() => toggleCurrent(exp.id)}>
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${exp.current ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${exp.current ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <label htmlFor={`current-${exp.id}`} className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                    {t.editor.experience.current}
                  </label>
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => toggleCurrent(exp.id, e.target.checked)}
                    className="hidden"
                  />
                </div>

                <FormField
                  label={t.editor.experience.location}
                  type="text"
                  value={exp.location || ''}
                  onChange={(value) => updateItemField(exp.id, 'location', value)}
                  placeholder={t.editor.experience.placeholders.location}
                />

                {/* 使用富文本编辑器替代普通文本框 */}
                <RichTextEditor
                  label={t.editor.experience.description_label}
                  value={formatLineItems(exp.description)}
                  onChange={(value) => updateItemField(exp.id, 'description', parseLineItems(value))}
                  placeholder={t.editor.experience.placeholders.description}
                  minRows={4}
                  maxRows={12}
                  showToolbar={true}
                  enableAI={false}
                />
              </div>
            </EditableCard>
          ))}
        </AnimatePresence>
      </div>

      <AddCardButton onAdd={addExperience} text={t.editor.experience.add} />
    </div>
  )
}
