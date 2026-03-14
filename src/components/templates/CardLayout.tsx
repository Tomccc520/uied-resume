/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-14
 */

'use client'

import React from 'react'
import Image from 'next/image'
import { ResumeData } from '@/types/resume'
import { StyleConfig } from '@/contexts/StyleContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatDate } from '@/utils/dateFormatter'
import { getAvatarClassName, getAvatarInlineStyle } from '@/utils/avatarUtils'

interface TemplateProps {
  resumeData: ResumeData
  styleConfig: StyleConfig
  onSectionClick?: (section: string) => void
}

/**
 * 创意卡片布局
 * 以“标准章节 + 轻卡片分组”呈现，兼顾市场主流风格与可读性。
 */
export const CardLayout: React.FC<TemplateProps> = ({
  resumeData,
  styleConfig,
  onSectionClick
}) => {
  const { personalInfo, experience, education, projects, skills } = resumeData
  const { colors, fontSize, spacing, fontFamily } = styleConfig
  const { locale, t } = useLanguage()

  const fontFamilyStyle = fontFamily || '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif'
  const pagePadding = styleConfig.layout?.padding || 30
  const sectionGap = spacing?.section || 24
  const headingColor = colors.primary || '#1f2937'
  const textColor = colors.text || '#1f2937'
  const mutedColor = colors.secondary || '#6b7280'
  const accentColor = colors.accent || '#0f766e'
  const borderColor = '#e2e8f0'
  const cardShadow = '0 4px 10px -10px rgba(15, 23, 42, 0.6)'

  /**
   * 格式化日期文本
   * 统一多语言环境下的日期展示格式。
   */
  const formatDateStr = (date?: string) => formatDate(date, locale)

  /**
   * 格式化时间区间
   * 处理“当前在职”与普通结束时间两种场景。
   */
  const formatPeriod = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    return `${formatDateStr(startDate)} - ${isCurrent ? t.editor.experience.current : formatDateStr(endDate)}`
  }

  /**
   * 渲染章节标题
   * 使用主流简历模板常见的简洁标题样式。
   */
  const renderSectionTitle = (title: string, helperText?: string) => (
    <div className="mb-3 flex items-end justify-between border-b pb-2" style={{ borderColor }}>
      <h2
        className="text-sm font-semibold uppercase tracking-[0.14em]"
        style={{ color: headingColor }}
      >
        {title}
      </h2>
      {helperText && (
        <span className="text-xs" style={{ color: mutedColor }}>
          {helperText}
        </span>
      )}
    </div>
  )

  /**
   * 按分类分组技能
   * 提升技能模块可读性，避免标签堆叠。
   */
  const groupSkillsByCategory = () => {
    const fallbackCategory = locale === 'en' ? 'General' : '综合'
    return skills.reduce<Record<string, typeof skills>>((groups, skill) => {
      const category = skill.category || fallbackCategory
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(skill)
      return groups
    }, {})
  }

  const skillGroups = groupSkillsByCategory()

  /**
   * 生成联系方式摘要
   * 采用市场常见的一行分隔文本，减少视觉干扰。
   */
  const getContactSummary = () => {
    return [personalInfo.phone, personalInfo.email, personalInfo.location, personalInfo.website]
      .filter(Boolean)
      .join(' · ')
  }

  return (
    <div
      className="w-full min-h-full border bg-white"
      style={{
        fontFamily: fontFamilyStyle,
        color: textColor,
        fontSize: `${fontSize?.content || 14}px`,
        lineHeight: 1.6,
        padding: `${pagePadding}px`,
        borderColor
      }}
    >
      <section
        className="cursor-pointer rounded-lg border px-5 py-5"
        onClick={() => onSectionClick?.('personal')}
        style={{
          marginBottom: `${sectionGap}px`,
          borderColor,
          boxShadow: cardShadow,
          backgroundColor: '#ffffff'
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {personalInfo.avatar && (
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name}
              width={84}
              height={84}
              unoptimized
              className={getAvatarClassName(styleConfig, 'h-[84px] w-[84px]')}
              style={{
                ...getAvatarInlineStyle(personalInfo.avatarBorderRadius, styleConfig, 84),
                border: `2px solid ${accentColor}44`
              }}
            />
          )}
          <div className="flex-1">
            <h1
              className="font-semibold"
              style={{
                fontSize: `${fontSize?.name || 30}px`,
                color: headingColor
              }}
            >
              {personalInfo.name}
            </h1>
            <p
              className="mt-1 font-medium"
              style={{
                fontSize: `${fontSize?.title || 18}px`,
                color: mutedColor
              }}
            >
              {personalInfo.title}
            </p>
            {getContactSummary() && (
              <p className="mt-2 text-xs sm:text-sm" style={{ color: mutedColor }}>
                {getContactSummary()}
              </p>
            )}
          </div>
        </div>
        {personalInfo.summary && (
          <p className="mt-4 whitespace-pre-line text-sm leading-7">{personalInfo.summary}</p>
        )}
      </section>

      {experience.length > 0 && (
        <section
          className="cursor-pointer"
          onClick={() => onSectionClick?.('experience')}
          style={{ marginBottom: `${sectionGap}px` }}
        >
          {renderSectionTitle(
            t.editor.experience.title,
            locale === 'en' ? `${experience.length} records` : `${experience.length} 条记录`
          )}
          <div className="grid gap-3">
            {experience.map((exp) => (
              <article
                key={exp.id}
                className="rounded-md border px-4 py-3"
                style={{
                  borderColor,
                  boxShadow: cardShadow
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold" style={{ color: headingColor }}>
                    {exp.position}
                  </h3>
                  <span className="text-xs font-medium" style={{ color: mutedColor }}>
                    {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium" style={{ color: accentColor }}>
                  {exp.company}
                  {exp.location && <span style={{ color: mutedColor }}> · {exp.location}</span>}
                </p>
                {exp.description.length > 0 && (
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {exp.description.map((desc, index) => (
                      <li key={`${exp.id}-desc-${index}`} className="list-disc">
                        {desc}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section
          className="cursor-pointer"
          onClick={() => onSectionClick?.('projects')}
          style={{ marginBottom: `${sectionGap}px` }}
        >
          {renderSectionTitle(
            t.editor.projects.title,
            locale === 'en' ? `${projects.length} projects` : `${projects.length} 个项目`
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-md border px-4 py-3"
                style={{
                  borderColor,
                  boxShadow: cardShadow
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold" style={{ color: headingColor }}>
                    {project.name}
                  </h3>
                  <span className="text-xs font-medium" style={{ color: mutedColor }}>
                    {formatDateStr(project.startDate)} - {formatDateStr(project.endDate)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm">{project.description}</p>
                {project.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {project.highlights.map((highlight, index) => (
                      <li key={`${project.id}-highlight-${index}`} className="list-disc">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section
          className="cursor-pointer"
          onClick={() => onSectionClick?.('education')}
          style={{ marginBottom: `${sectionGap}px` }}
        >
          {renderSectionTitle(
            t.editor.education.title,
            locale === 'en' ? `${education.length} records` : `${education.length} 条记录`
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {education.map((edu) => (
              <article
                key={edu.id}
                className="rounded-md border px-4 py-3"
                style={{
                  borderColor,
                  boxShadow: cardShadow
                }}
              >
                <h3 className="font-semibold" style={{ color: headingColor }}>
                  {edu.school}
                </h3>
                <p className="mt-1 text-sm" style={{ color: mutedColor }}>
                  {edu.degree} · {edu.major}
                  {edu.gpa && <span> · GPA {edu.gpa}</span>}
                </p>
                <p className="mt-1 text-xs font-medium" style={{ color: mutedColor }}>
                  {formatDateStr(edu.startDate)} - {formatDateStr(edu.endDate)}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="cursor-pointer" onClick={() => onSectionClick?.('skills')}>
          {renderSectionTitle(
            t.editor.skills.title,
            locale === 'en' ? `${skills.length} skills` : `${skills.length} 项技能`
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(skillGroups).map(([category, items]) => (
              <article
                key={category}
                className="rounded-md border px-4 py-3"
                style={{
                  borderColor,
                  boxShadow: cardShadow
                }}
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: mutedColor }}>
                  {category}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded border px-2.5 py-1 text-sm"
                      style={{
                        borderColor,
                        color: headingColor,
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
