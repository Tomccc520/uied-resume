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
 * 经典衬线模板
 * 以“中心头部 + 单栏正文”承载传统行业常见简历视觉。
 */
export const ClassicElegant: React.FC<TemplateProps> = ({
  resumeData,
  styleConfig,
  onSectionClick
}) => {
  const { personalInfo, experience, education, projects, skills } = resumeData
  const { colors, fontSize, spacing, fontFamily } = styleConfig
  const { locale, t } = useLanguage()

  const fontFamilyStyle = fontFamily || '"Georgia", "Times New Roman", "PingFang SC", serif'
  const pagePadding = styleConfig.layout?.padding || 34
  const baseContentSize = fontSize?.content || 14
  const metrics = getUnifiedResumeMetrics({ baseContentSize, sectionSpacing: spacing?.section })
  const sectionGap = metrics.sectionGap
  const headingColor = colors.primary || '#1f2937'
  const textColor = colors.text || '#1f2937'
  const mutedColor = colors.secondary || '#6b7280'
  const borderColor = '#d8dee7'
  const isEnglish = locale === 'en'
  const contactQRCodePayload = resolveContactQRCodePayload(personalInfo)
  const contactQRCodeUrl = contactQRCodePayload ? createContactQRCodeImageUrl(contactQRCodePayload, 176) : null

  /**
   * 格式化日期文本
   * 对齐所有模块的时间格式表现。
   */
  const formatDateStr = (date?: string) => formatDate(date, locale)

  /**
   * 格式化时间区间
   * 对“当前在职”场景做本地化兼容。
   */
  const formatPeriod = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    return `${formatDateStr(startDate)} - ${isCurrent ? t.editor.experience.current : formatDateStr(endDate)}`
  }

  /**
   * 构建联系信息摘要
   * 采用中心化一行展示，保持头部整洁。
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
   * 使用经典模板常见的居中标题与细分隔线。
   */
  const renderSectionTitle = (title: string, helperText?: string) => (
    <div
      className="border-b text-center"
      style={{
        borderColor,
        paddingBottom: `${metrics.sectionTitlePaddingBottom}px`,
        marginBottom: `${metrics.sectionTitleMarginBottom}px`
      }}
    >
      <h2
        className={`text-sm font-semibold ${isEnglish ? 'uppercase tracking-[0.14em]' : 'tracking-[0.08em]'}`}
        style={{
          color: headingColor,
          fontSize: `${metrics.sectionTitleSize}px`,
          fontWeight: metrics.sectionTitleWeight
        }}
      >
        {title}
      </h2>
      {helperText && (
        <p
          className="mt-1 text-[11px]"
          style={{ color: mutedColor, fontWeight: metrics.metaWeight }}
        >
          {helperText}
        </p>
      )}
    </div>
  )

  /**
   * 聚合技能分组
   * 将技能整理成分类段落，避免标签堆叠造成视觉噪音。
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
        className="cursor-pointer border-b pb-5 text-center"
        onClick={() => onSectionClick?.('personal')}
        style={{ marginBottom: `${sectionGap}px`, borderColor }}
      >
        {personalInfo.avatar && (
          <Image
            src={personalInfo.avatar}
            alt={personalInfo.name}
            width={88}
            height={88}
            unoptimized
            className={getAvatarClassName(styleConfig, 'mx-auto h-[88px] w-[88px]')}
            style={{
              ...getAvatarInlineStyle(personalInfo.avatarBorderRadius, styleConfig, 88),
              border: `1px solid ${borderColor}`
            }}
          />
        )}
        <h1
          className="mt-3 font-semibold tracking-[0.05em]"
          style={{
            fontSize: `${metrics.nameSize}px`,
            color: headingColor,
            fontWeight: metrics.nameWeight
          }}
        >
          {personalInfo.name}
        </h1>
        <p
          className="mt-1"
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
            className="mx-auto"
            style={{
              marginTop: `${metrics.bulletGap + 1}px`,
              color: mutedColor,
              fontSize: `${metrics.metaSize}px`,
              fontWeight: metrics.metaWeight,
              maxWidth: '78%'
            }}
          >
            {getContactSummary()}
          </p>
        )}
        {contactQRCodeUrl && (
          <div className="mt-3 inline-flex rounded border bg-white p-1.5 text-center" style={{ borderColor }}>
            <div>
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
          </div>
        )}
        {personalInfo.summary && (
          <p
            className="mx-auto whitespace-pre-line text-left"
            style={{
              marginTop: `${metrics.entryGap - 3}px`,
              maxWidth: '88%',
              lineHeight: metrics.summaryLineHeight
            }}
          >
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
            {education.map((edu) => (
              <article key={edu.id} className="pb-2.5 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold" style={{ color: headingColor, fontWeight: metrics.itemTitleWeight }}>
                    {edu.school}
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
          <div style={{ display: 'grid', rowGap: `${metrics.bulletGap}px` }}>
            {Object.entries(skillGroups).map(([category, items]) => (
              <article key={category} className="flex gap-2 text-sm">
                <span className="min-w-[72px] font-semibold" style={{ color: headingColor }}>
                  {category}
                </span>
                <p style={{ color: textColor }}>
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
