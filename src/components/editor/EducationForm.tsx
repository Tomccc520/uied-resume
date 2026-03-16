
/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-9-22
 */

import React from 'react'
import { Copy, GraduationCap, MoveDown, MoveUp } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { Education } from '@/types/resume'
import { EditableCard } from './EditableCard'
import { AddCardButton } from './AddCardButton'
import { SectionHeader } from './SectionHeader'
import FormField, { FormFieldGroup } from '@/components/FormField'
import { RichTextEditor } from './RichTextEditor'
import { useLanguage } from '@/contexts/LanguageContext'
import { useListEditor } from '@/hooks/useListEditor'

interface EducationFormProps {
  education: Education[]
  onChange: (data: Education[]) => void
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const { t, locale } = useLanguage()
  const isZh = locale === 'zh'
  const {
    addItem,
    updateItemField,
    deleteItem,
    duplicateItem,
    moveItem
  } = useListEditor<Education>({
    items: education,
    onChange
  })

  /**
   * 添加教育经历
   * 统一使用列表编辑 Hook，保持编辑逻辑一致。
   */
  const addEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }
    addItem(newEducation)
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        title={t.editor.education.title}
        description={t.editor.education.description}
        count={education.length}
        icon={<GraduationCap className="w-5 h-5" />}
      />

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {education.map((edu, index) => (
            <EditableCard
              key={edu.id}
              title={edu.school || t.editor.education.placeholders.school}
              subtitle={edu.major}
              onDelete={() => deleteItem(edu.id)}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      duplicateItem(edu.id, {
                        school: edu.school ? `${edu.school}${isZh ? '（复制）' : ' (Copy)'}` : edu.school
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {isZh ? '复制' : 'Duplicate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(edu.id, 'up')}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                    {isZh ? '上移' : 'Move Up'}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(edu.id, 'down')}
                    disabled={index === education.length - 1}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                    {isZh ? '下移' : 'Move Down'}
                  </button>
                </div>

                <FormFieldGroup>
                  <FormField
                    label={t.editor.education.school}
                    type="text"
                    value={edu.school}
                    onChange={(value) => updateItemField(edu.id, 'school', value)}
                    placeholder={t.editor.education.placeholders.school}
                  />
                  <FormField
                    label={t.editor.education.degree}
                    type="text"
                    value={edu.degree}
                    onChange={(value) => updateItemField(edu.id, 'degree', value)}
                    placeholder={t.editor.education.placeholders.degree}
                  />
                </FormFieldGroup>

                <FormFieldGroup>
                  <FormField
                    label={t.editor.education.major}
                    type="text"
                    value={edu.major}
                    onChange={(value) => updateItemField(edu.id, 'major', value)}
                    placeholder={t.editor.education.placeholders.major}
                  />
                  <FormField
                    label={t.editor.education.gpa}
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(value) => updateItemField(edu.id, 'gpa', value)}
                    placeholder={t.editor.education.placeholders.gpa}
                  />
                </FormFieldGroup>

                <FormFieldGroup>
                  <FormField
                    label={t.editor.education.startDate}
                    type="month"
                    value={edu.startDate}
                    onChange={(value) => updateItemField(edu.id, 'startDate', value)}
                  />
                  <FormField
                    label={t.editor.education.endDate}
                    type="month"
                    value={edu.endDate}
                    onChange={(value) => updateItemField(edu.id, 'endDate', value)}
                  />
                </FormFieldGroup>

                {/* 使用富文本编辑器 */}
                <RichTextEditor
                  label={t.editor.education.description_label}
                  value={edu.description || ''}
                  onChange={(value) => updateItemField(edu.id, 'description', value)}
                  placeholder={t.editor.education.placeholders.description}
                  minRows={3}
                  maxRows={8}
                  showToolbar={true}
                  enableAI={false}
                />
              </div>
            </EditableCard>
          ))}
        </AnimatePresence>
      </div>

      <AddCardButton onAdd={addEducation} text={t.editor.education.add} />
    </div>
  )
}
