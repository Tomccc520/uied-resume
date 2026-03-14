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
 * 横幅布局
 * 参考主流招聘平台模板：顶部信息清晰、章节标准化、视觉克制。
 */
export const BannerLayout: React.FC<TemplateProps> = ({
  resumeData,
  styleConfig,
  onSectionClick
}) => {
  const { personalInfo, experience, education, projects, skills } = resumeData
  const { colors, fontSize, spacing, fontFamily } = styleConfig
  const { locale, t } = useLanguage()

  const fontFamilyStyle = fontFamily || '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif'
  const pagePadding = styleConfig.layout?.padding || 32
  const sectionGap = Math.min(Math.max(spacing?.section || 24, 22), 28)
  const headingColor = colors.primary || '#1f2937'
  const textColor = colors.text || '#1f2937'
  const mutedColor = colors.secondary || '#6b7280'
  const accentColor = colors.accent || '#2563eb'
  const headerBackground = (colors as Record<string, string>).bannerBg || '#f8fafc'
  const borderColor = '#e2e8f0'
  const baseContentSize = fontSize?.content || 14
  const bodyLineHeight = 1.62
  const summaryLineHeight = 1.68
  const nameSize = Math.round(baseContentSize * 2.2)
  const roleSize = Math.round(baseContentSize * 1.28)
  const sectionTitleSize = Math.round(baseContentSize * 1.02)
  const itemTitleSize = Math.round(baseContentSize * 1.12)
  const metaSize = Math.round(baseContentSize * 0.86)

  /**
   * 格式化日期文本
   * 统一多语言环境下的日期输出。
   */
  const formatDateStr = (date?: string) => formatDate(date, locale)

  /**
   * 格式化时间区间
   * 处理当前在职与普通结束时间两种场景。
   */
  const formatPeriod = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    return `${formatDateStr(startDate)} - ${isCurrent ? t.editor.experience.current : formatDateStr(endDate)}`
  }

  /**
   * 渲染章节标题
   * 使用主流简历模板常见的“标题 + 分隔线”结构。
   */
  const renderSectionTitle = (title: string, helperText?: string) => (
    <div className="mb-3 flex items-end justify-between border-b pb-2" style={{ borderColor }}>
      <h2
        className="text-sm font-semibold uppercase tracking-[0.14em]"
        style={{ color: headingColor, fontSize: `${sectionTitleSize}px` }}
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
   * 构建联系方式列表
   * 统一联系方式渲染顺序，避免模板内重复判断。
   */
  const getContactItems = () => {
    return [personalInfo.phone, personalInfo.email, personalInfo.location, personalInfo.website].filter(
      Boolean
    ) as string[]
  }

  /**
   * 生成联系方式摘要
   * 使用主流简历常见的“·”分隔文本，避免标签化视觉噪音。
   */
  const getContactSummary = () => {
    return getContactItems().join(' · ')
  }

  return (
    <div
      className="w-full min-h-full border bg-white"
      style={{
        fontFamily: fontFamilyStyle,
        color: textColor,
        fontSize: `${baseContentSize}px`,
        lineHeight: bodyLineHeight,
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
          backgroundColor: headerBackground
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {personalInfo.avatar && (
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name}
              width={88}
              height={88}
              unoptimized
              className={getAvatarClassName(styleConfig, 'h-[88px] w-[88px]')}
              style={{
                ...getAvatarInlineStyle(personalInfo.avatarBorderRadius, styleConfig, 88),
                border: `2px solid ${accentColor}55`
              }}
            />
          )}
          <div className="flex-1">
            <h1
              className="font-semibold tracking-[0.01em]"
              style={{
                fontSize: `${nameSize}px`,
                color: headingColor
              }}
            >
              {personalInfo.name}
            </h1>
            <p
              className="mt-1 font-medium"
              style={{
                fontSize: `${roleSize}px`,
                color: mutedColor
              }}
            >
              {personalInfo.title}
            </p>
            {getContactSummary() && (
              <p className="mt-2" style={{ color: mutedColor, fontSize: `${metaSize}px` }}>
                {getContactSummary()}
              </p>
            )}
          </div>
        </div>
        {personalInfo.summary && (
          <p className="mt-4 whitespace-pre-line" style={{ color: textColor, lineHeight: summaryLineHeight }}>
            {personalInfo.summary}
          </p>
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
          <div className="space-y-4">
            {experience.map((exp) => (
              <article key={exp.id} className="border-b pb-4 last:border-b-0 last:pb-0" style={{ borderColor }}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: `${itemTitleSize}px`,
                      color: headingColor
                    }}
                  >
                    {exp.position}
                  </h3>
                  <span className="font-medium" style={{ color: mutedColor, fontSize: `${metaSize}px` }}>
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
                      <li key={`${exp.id}-desc-${index}`} className="list-disc" style={{ color: textColor }}>
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
          <div className="space-y-4">
            {projects.map((project) => (
              <article key={project.id} className="border-b pb-4 last:border-b-0 last:pb-0" style={{ borderColor }}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: `${itemTitleSize}px`,
                      color: headingColor
                    }}
                  >
                    {project.name}
                  </h3>
                  <span className="font-medium" style={{ color: mutedColor, fontSize: `${metaSize}px` }}>
                    {formatDateStr(project.startDate)} - {formatDateStr(project.endDate)}
                  </span>
                </div>
                <p className="mt-1.5">{project.description}</p>
                {project.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {project.highlights.map((highlight, index) => (
                      <li key={`${project.id}-highlight-${index}`} className="list-disc" style={{ color: textColor }}>
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
          <div className="space-y-3">
            {education.map((edu) => (
              <article key={edu.id} className="border-b pb-3 last:border-b-0 last:pb-0" style={{ borderColor }}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold" style={{ color: headingColor }}>
                    {edu.school}
                  </h3>
                  <span className="font-medium" style={{ color: mutedColor, fontSize: `${metaSize}px` }}>
                    {formatDateStr(edu.startDate)} - {formatDateStr(edu.endDate)}
                  </span>
                </div>
                <p className="mt-1 text-sm" style={{ color: mutedColor }}>
                  {edu.degree} · {edu.major}
                  {edu.gpa && <span> · GPA {edu.gpa}</span>}
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
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
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
        </section>
      )}
    </div>
  )
}
