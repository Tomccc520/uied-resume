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
import { getMarketResumeMetrics } from './marketResumeMetrics'
import { createContactQRCodeImageUrl, resolveContactQRCodePayload } from '@/utils/contactQRCode'

interface TemplateProps {
  resumeData: ResumeData
  styleConfig: StyleConfig
  onSectionClick?: (section: string) => void
}

/**
 * 逆序时间轴布局
 * 对齐招聘平台常见“左日期 + 右内容”的履历呈现方式。
 */
export const TimelineLayout: React.FC<TemplateProps> = ({
  resumeData,
  styleConfig,
  onSectionClick
}) => {
  const { personalInfo, experience, education, projects, skills } = resumeData
  const { colors, fontSize, spacing, fontFamily } = styleConfig
  const { locale, t } = useLanguage()

  const fontFamilyStyle = fontFamily || '"Calibri", "Arial", "PingFang SC", "Hiragino Sans GB", sans-serif'
  const pagePadding = Math.max(styleConfig.layout?.padding || 34, 32)
  const baseContentSize = fontSize?.content || 14
  const metrics = getMarketResumeMetrics({ baseContentSize, sectionSpacing: spacing?.section })
  const sectionGap = metrics.sectionGap
  const headingColor = colors.primary || '#0f172a'
  const textColor = colors.text || '#111827'
  const mutedColor = colors.secondary || '#64748b'
  const borderColor = '#d7dee8'
  const rowDividerColor = '#e7edf4'
  const timelineColor = '#ced6e0'
  const timelineDotColor = '#475569'
  const summaryBgColor = '#f8fafc'
  const isEnglish = locale === 'en'
  const contactQRCodePayload = resolveContactQRCodePayload(personalInfo)
  const contactQRCodeUrl = contactQRCodePayload ? createContactQRCodeImageUrl(contactQRCodePayload, 176) : null

  /**
   * 格式化日期文本
   * 统一中英文环境下的日期输出。
   */
  const formatDateStr = (date?: string) => formatDate(date, locale)

  /**
   * 格式化时间区间
   * 统一处理“当前在职”与普通结束日期。
   */
  const formatPeriod = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    return `${formatDateStr(startDate)} - ${isCurrent ? t.editor.experience.current : formatDateStr(endDate)}`
  }

  /**
   * 渲染章节标题
   * 使用招聘模板常见的小标题 + 底线样式。
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
      <div className="inline-flex items-center gap-2">
        <span className="h-3 w-[2px] rounded-full" style={{ backgroundColor: headingColor }} />
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
      </div>
      {helperText && (
        <span className="text-xs" style={{ color: mutedColor, fontWeight: metrics.metaWeight }}>
          {helperText}
        </span>
      )}
    </div>
  )

  /**
   * 生成联系方式摘要
   * 使用“·”连接信息，保持页眉紧凑。
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
   * 按分类聚合技能
   * 将技能改为“分类 + 文本行”，减少时间轴模板底部的视觉噪音。
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

  const contactSummary = getContactSummary()
  const skillGroupEntries = Object.entries(groupSkillsByCategory())

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
        style={{
          marginBottom: `${sectionGap}px`,
          borderColor
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
            {!!contactSummary && (
              <p
                style={{
                  marginTop: `${metrics.bulletGap + 1}px`,
                  color: mutedColor,
                  fontSize: `${metrics.metaSize}px`,
                  fontWeight: metrics.metaWeight,
                  lineHeight: 1.45
                }}
              >
                {contactSummary}
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
                <div className="rounded border bg-white p-1.5 text-center" style={{ borderColor: rowDividerColor }}>
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
        {personalInfo.summary && (
          <div
            className="whitespace-pre-line rounded-sm border-l-[3px] px-3 py-2"
            style={{
              marginTop: `${metrics.entryGap - 3}px`,
              lineHeight: metrics.summaryLineHeight,
              backgroundColor: summaryBgColor,
              borderColor: rowDividerColor
            }}
          >
            {personalInfo.summary}
          </div>
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
          <div style={{ display: 'grid', rowGap: `${metrics.entryGap}px` }}>
            {experience.map((exp, index) => (
              <article
                key={exp.id}
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `${metrics.dateColumnWidth + 8}px 1fr`,
                  borderBottom: index < experience.length - 1 ? `1px solid ${rowDividerColor}` : 'none',
                  paddingBottom: index < experience.length - 1 ? `${metrics.entryGap - 1}px` : 0
                }}
              >
                <div
                  className="pt-0.5 text-xs font-medium"
                  style={{ color: mutedColor, fontSize: `${metrics.metaSize}px`, fontWeight: metrics.metaWeight }}
                >
                  {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                </div>
                <div className="relative border-l pl-4" style={{ borderColor: timelineColor }}>
                  <span
                    className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: timelineDotColor }}
                  />
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
                        rowGap: `${metrics.bulletGap}px`,
                        lineHeight: metrics.bodyLineHeight
                      }}
                    >
                      {exp.description.map((desc, index) => (
                        <li key={`${exp.id}-desc-${index}`} className="list-disc">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
          <div style={{ display: 'grid', rowGap: `${metrics.entryGap}px` }}>
            {projects.map((project, index) => (
              <article
                key={project.id}
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `${metrics.dateColumnWidth + 8}px 1fr`,
                  borderBottom: index < projects.length - 1 ? `1px solid ${rowDividerColor}` : 'none',
                  paddingBottom: index < projects.length - 1 ? `${metrics.entryGap - 1}px` : 0
                }}
              >
                <div
                  className="pt-0.5 text-xs font-medium"
                  style={{ color: mutedColor, fontSize: `${metrics.metaSize}px`, fontWeight: metrics.metaWeight }}
                >
                  {formatDateStr(project.startDate)} - {formatDateStr(project.endDate)}
                </div>
                <div className="relative border-l pl-4" style={{ borderColor: timelineColor }}>
                  <span
                    className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: timelineDotColor }}
                  />
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
                  <p className="mt-1.5">{project.description}</p>
                  {project.highlights.length > 0 && (
                    <ul
                      className="pl-4"
                      style={{
                        marginTop: `${metrics.bulletGap}px`,
                        display: 'grid',
                        rowGap: `${metrics.bulletGap}px`,
                        lineHeight: metrics.bodyLineHeight
                      }}
                    >
                      {project.highlights.map((highlight, highlightIndex) => (
                        <li key={`${project.id}-highlight-${highlightIndex}`} className="list-disc">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
          <div style={{ display: 'grid', rowGap: `${metrics.entryGap - 2}px` }}>
            {education.map((edu, index) => (
              <article
                key={edu.id}
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `${metrics.dateColumnWidth + 8}px 1fr`,
                  borderBottom: index < education.length - 1 ? `1px solid ${rowDividerColor}` : 'none',
                  paddingBottom: index < education.length - 1 ? `${metrics.entryGap - 2}px` : 0
                }}
              >
                <div
                  className="pt-0.5 text-xs font-medium"
                  style={{ color: mutedColor, fontSize: `${metrics.metaSize}px`, fontWeight: metrics.metaWeight }}
                >
                  {formatDateStr(edu.startDate)} - {formatDateStr(edu.endDate)}
                </div>
                <div className="relative border-l pl-4" style={{ borderColor: timelineColor }}>
                  <span
                    className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: timelineDotColor }}
                  />
                  <h3 className="font-semibold" style={{ color: headingColor, fontWeight: metrics.itemTitleWeight }}>
                    {edu.school}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: mutedColor }}>
                    {edu.degree} · {edu.major}
                    {edu.gpa && <span> · GPA {edu.gpa}</span>}
                  </p>
                </div>
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
          <div style={{ display: 'grid', rowGap: `${metrics.bulletGap + 2}px` }}>
            {skillGroupEntries.map(([category, items]) => (
              <article key={category}>
                <h3
                  className="text-xs font-semibold uppercase tracking-[0.08em]"
                  style={{ color: mutedColor, fontSize: `${metrics.metaSize}px` }}
                >
                  {category}
                </h3>
                <p className="mt-1" style={{ color: textColor, lineHeight: metrics.bodyLineHeight }}>
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
    </div>
  )
}
