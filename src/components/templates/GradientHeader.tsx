/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-26
 */

'use client'

import React from 'react'
import Image from 'next/image'
import { ResumeData } from '@/types/resume'
import { StyleConfig } from '@/contexts/StyleContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatDate } from '@/utils/dateFormatter'
import { getAvatarClassName, getAvatarInlineStyle } from '@/utils/avatarUtils'
import { getUnifiedResumeMetrics } from './resumePrintMetrics'
import { createContactQRCodeImageUrl, resolveContactQRCodePayload } from '@/utils/contactQRCode'

interface TemplateProps {
  resumeData: ResumeData
  styleConfig: StyleConfig
  onSectionClick?: (section: string) => void
}

/**
 * 顶部信息带模板
 * 采用“头部信息带 + 双栏正文”的投递结构，兼顾信息密度与可读性。
 */
export const GradientHeader: React.FC<TemplateProps> = ({
  resumeData,
  styleConfig,
  onSectionClick
}) => {
  const { personalInfo, experience, education, projects, skills } = resumeData
  const { colors, fontSize, spacing, fontFamily } = styleConfig
  const { locale, t } = useLanguage()

  const fontFamilyStyle = fontFamily || '"Calibri", "Arial", "PingFang SC", "Hiragino Sans GB", sans-serif'
  const pagePadding = styleConfig.layout?.padding || 32
  const baseContentSize = fontSize?.content || 14
  const metrics = getUnifiedResumeMetrics({ baseContentSize, sectionSpacing: spacing?.section })
  const sectionGap = metrics.sectionGap
  const headingColor = colors.primary || '#1f2937'
  const textColor = colors.text || '#1f2937'
  const mutedColor = colors.secondary || '#6b7280'
  const accentColor = colors.accent || '#2563eb'
  const borderColor = '#d8dee7'
  const isEnglish = locale === 'en'
  const contactQRCodePayload = resolveContactQRCodePayload(personalInfo)
  const contactQRCodeUrl = contactQRCodePayload ? createContactQRCodeImageUrl(contactQRCodePayload, 176) : null

  /**
   * 格式化日期文本
   * 统一中英文模式下的年月输出。
   */
  const formatDateStr = (date?: string) => formatDate(date, locale)

  /**
   * 格式化时间区间
   * 支持“当前在职”和普通结束时间两种状态。
   */
  const formatPeriod = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    return `${formatDateStr(startDate)} - ${isCurrent ? t.editor.experience.current : formatDateStr(endDate)}`
  }

  /**
   * 构建联系方式摘要
   * 使用“·”连接联系人字段，符合主流招聘平台样式。
   */
  const getContactSummary = () => {
    const websiteLabel = personalInfo.website
      ? personalInfo.website.replace(/^https?:\/\//i, '').replace(/\/$/, '')
      : ''
    return [personalInfo.phone, personalInfo.email, personalInfo.location, websiteLabel]
      .filter(Boolean)
      .join(' · ')
  }

  /**
   * 渲染章节标题
   * 统一章节标题比例与底线间距，提升全文扫描效率。
   */
  const renderSectionTitle = (title: string, helperText?: string) => (
    <div
      className="flex items-end justify-between border-b"
      style={{
        borderColor,
        paddingBottom: `${metrics.sectionTitlePaddingBottom}px`,
        marginBottom: `${metrics.sectionTitleMarginBottom}px`
      }}
    >
      <h2
        className={`text-sm font-semibold ${isEnglish ? 'uppercase tracking-[0.1em]' : ''}`}
        style={{
          color: headingColor,
          fontSize: `${metrics.sectionTitleSize}px`,
          fontWeight: metrics.sectionTitleWeight
        }}
      >
        {title}
      </h2>
      {helperText && (
        <span className="text-xs" style={{ color: mutedColor, fontWeight: metrics.metaWeight }}>
          {helperText}
        </span>
      )}
    </div>
  )

  /**
   * 聚合技能分组
   * 将技能统一为“分类 + 技能串”形式，减少标签噪音。
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

  return (
    <div
      className="w-full min-h-full border bg-white"
      style={{
        fontFamily: fontFamilyStyle,
        color: textColor,
        fontSize: `${baseContentSize}px`,
        lineHeight: metrics.bodyLineHeight,
        padding: `${pagePadding}px`,
        borderColor
      }}
    >
      <section
        className="cursor-pointer border-b pb-5"
        onClick={() => onSectionClick?.('personal')}
        style={{ marginBottom: `${sectionGap}px`, borderColor }}
      >
        <div
          className="rounded-md px-4 py-3"
          style={{
            background: `linear-gradient(90deg, ${headingColor}14 0%, ${accentColor}10 70%, ${accentColor}06 100%)`,
            border: `1px solid ${borderColor}`
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1
                className="font-semibold tracking-[0.02em]"
                style={{
                  fontSize: `${metrics.nameSize}px`,
                  color: headingColor,
                  fontWeight: metrics.nameWeight
                }}
              >
                {personalInfo.name}
              </h1>
              <p
                className="mt-1 font-medium"
                style={{
                  fontSize: `${metrics.roleSize}px`,
                  color: mutedColor,
                  fontWeight: metrics.roleWeight
                }}
              >
                {personalInfo.title}
              </p>
              {!!getContactSummary() && (
                <p
                  style={{
                    marginTop: `${metrics.bulletGap + 1}px`,
                    color: mutedColor,
                    fontSize: `${metrics.metaSize}px`,
                    fontWeight: metrics.metaWeight
                  }}
                >
                  {getContactSummary()}
                </p>
              )}
            </div>
            {(personalInfo.avatar || contactQRCodeUrl) && (
              <div className="flex flex-col items-end gap-2">
                {personalInfo.avatar && (
                  <Image
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    width={metrics.headerAvatarSize}
                    height={metrics.headerAvatarSize}
                    unoptimized
                    className={getAvatarClassName(styleConfig, 'h-[72px] w-[72px]')}
                    style={{
                      ...getAvatarInlineStyle(
                        personalInfo.avatarBorderRadius,
                        styleConfig,
                        metrics.headerAvatarSize
                      ),
                      border: `1px solid ${borderColor}`
                    }}
                  />
                )}
                {contactQRCodeUrl && (
                  <div className="rounded border bg-white p-1.5 text-center" style={{ borderColor }}>
                    <Image
                      src={contactQRCodeUrl}
                      alt={isEnglish ? 'Contact QR Code' : '联系方式二维码'}
                      width={68}
                      height={68}
                      unoptimized
                      className="h-[68px] w-[68px]"
                    />
                    <p className="mt-1 text-[10px]" style={{ color: mutedColor }}>
                      {isEnglish ? 'Contact QR' : '联系二维码'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {personalInfo.summary && (
          <p
            className="whitespace-pre-line"
            style={{
              marginTop: `${metrics.entryGap - 3}px`,
              lineHeight: metrics.summaryLineHeight
            }}
          >
            {personalInfo.summary}
          </p>
        )}
      </section>

      <div className="grid grid-cols-[1.65fr,1fr]" style={{ columnGap: `${Math.max(sectionGap - 2, metrics.entryGap + 8)}px` }}>
        <div>
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
              <div style={{ display: 'grid', rowGap: `${metrics.entryGap}px` }}>
                {experience.map((exp) => (
                  <article key={exp.id} className="pb-3 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3
                        className="font-semibold"
                        style={{
                          color: headingColor,
                          fontSize: `${metrics.itemTitleSize}px`,
                          fontWeight: metrics.itemTitleWeight
                        }}
                      >
                        {exp.position}
                      </h3>
                      <span
                        className="font-medium"
                        style={{
                          color: mutedColor,
                          fontSize: `${metrics.metaSize}px`,
                          fontWeight: metrics.metaWeight,
                          minWidth: `${metrics.dateColumnWidth}px`,
                          textAlign: 'right'
                        }}
                      >
                        {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium" style={{ color: headingColor }}>
                      {exp.company}
                      {exp.location && <span style={{ color: mutedColor }}> · {exp.location}</span>}
                    </p>
                    {exp.description.length > 0 && (
                      <ul
                        className="pl-4"
                        style={{
                          marginTop: `${metrics.bulletGap}px`,
                          display: 'grid',
                          rowGap: `${metrics.bulletGap}px`
                        }}
                      >
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
            <section className="cursor-pointer" onClick={() => onSectionClick?.('projects')}>
              {renderSectionTitle(
                t.editor.projects.title,
                locale === 'en' ? `${projects.length} projects` : `${projects.length} 个项目`
              )}
              <div style={{ display: 'grid', rowGap: `${metrics.entryGap}px` }}>
                {projects.map((project) => (
                  <article key={project.id} className="pb-3 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3
                        className="font-semibold"
                        style={{
                          color: headingColor,
                          fontSize: `${metrics.itemTitleSize}px`,
                          fontWeight: metrics.itemTitleWeight
                        }}
                      >
                        {project.name}
                      </h3>
                      <span
                        className="font-medium"
                        style={{
                          color: mutedColor,
                          fontSize: `${metrics.metaSize}px`,
                          fontWeight: metrics.metaWeight,
                          minWidth: `${metrics.dateColumnWidth}px`,
                          textAlign: 'right'
                        }}
                      >
                        {formatDateStr(project.startDate)} - {formatDateStr(project.endDate)}
                      </span>
                    </div>
                    <p className="mt-1.5">{project.description}</p>
                    {project.highlights.length > 0 && (
                      <ul
                        className="pl-4"
                        style={{
                          marginTop: `${metrics.bulletGap}px`,
                          display: 'grid',
                          rowGap: `${metrics.bulletGap}px`
                        }}
                      >
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
        </div>

        <aside className="border-l pl-5" style={{ borderColor }}>
          {skills.length > 0 && (
            <section
              className="cursor-pointer"
              onClick={() => onSectionClick?.('skills')}
              style={{ marginBottom: `${sectionGap}px` }}
            >
              {renderSectionTitle(
                t.editor.skills.title,
                locale === 'en' ? `${skills.length} skills` : `${skills.length} 项技能`
              )}
              <div style={{ display: 'grid', rowGap: `${metrics.bulletGap + 1}px` }}>
                {Object.entries(skillGroups).map(([category, items]) => (
                  <article key={category}>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: mutedColor }}>
                      {category}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: textColor }}>
                      {items.map((skill, index) => (
                        <span key={skill.id}>
                          {skill.name}
                          {index < items.length - 1 && <span style={{ color: mutedColor }}> / </span>}
                        </span>
                      ))}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="cursor-pointer" onClick={() => onSectionClick?.('education')}>
              {renderSectionTitle(
                t.editor.education.title,
                locale === 'en' ? `${education.length} records` : `${education.length} 条记录`
              )}
              <div style={{ display: 'grid', rowGap: `${metrics.entryGap - 2}px` }}>
                {education.map((edu) => (
                  <article key={edu.id}>
                    <h3
                      className="font-semibold"
                      style={{
                        color: headingColor,
                        fontSize: `${metrics.itemTitleSize}px`,
                        fontWeight: metrics.itemTitleWeight
                      }}
                    >
                      {edu.school}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: mutedColor }}>
                      {edu.degree} · {edu.major}
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: mutedColor, fontSize: `${metrics.metaSize}px`, fontWeight: metrics.metaWeight }}
                    >
                      {formatDateStr(edu.startDate)} - {formatDateStr(edu.endDate)}
                      {edu.gpa && <span> · GPA {edu.gpa}</span>}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
