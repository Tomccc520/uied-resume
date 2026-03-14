/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026.2.2
 */

'use client'

import React from 'react'
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
 * 网格布局 - 技能展示
 * 网格式排版，适合展示多项技能
 */
export const GridLayout: React.FC<TemplateProps> = ({
  resumeData,
  styleConfig,
  onSectionClick
}) => {
  const { personalInfo, experience, education, projects, skills } = resumeData
  const { colors, fontSize, spacing, fontFamily } = styleConfig
  const { locale, t } = useLanguage()

  const formatDateStr = (date?: string) => formatDate(date, locale)

  const fontFamilyStyle = fontFamily || 'Inter, -apple-system, sans-serif'
  const pagePadding = styleConfig.layout?.padding || 32
  const lineHeight = styleConfig.spacing?.line || 1.6
  
  // 优化配色 - 渐变网格背景
  const gridBg = `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.primary}03 100%)`
  const borderColor = `${colors.primary}15`

  return (
    <div 
      className="w-full min-h-full bg-white"
      style={{ 
        fontFamily: fontFamilyStyle,
        color: colors.text || '#000000',
        padding: `${pagePadding}px`,
        fontSize: `${fontSize?.content || 14}px`,
        lineHeight: 1.6
      }}
    >
      {/* 个人信息 - 居中优化 */}
      <div 
        className="flex flex-col items-center text-center cursor-pointer"
        onClick={() => onSectionClick?.('personal')}
        style={{ 
          marginBottom: `${spacing?.section || 32}px`,
          paddingBottom: `${spacing?.section || 32}px`,
          borderBottom: `2px solid ${borderColor}`
        }}
      >
        {personalInfo.avatar && (
          <img 
            src={personalInfo.avatar} 
            alt={personalInfo.name}
            className={`${getAvatarClassName(styleConfig, 'w-24 h-24')} mb-4`}
            style={{
              ...getAvatarInlineStyle(personalInfo.avatarBorderRadius, styleConfig, 96),
              border: `4px solid ${colors.primary}15`,
              boxShadow: `0 8px 24px ${colors.primary}20`
            }}
          />
        )}
        <h1 
          className="font-bold mb-2"
          style={{ 
            fontSize: `${fontSize?.name || 32}px`,
            color: colors.primary || '#000000',
            letterSpacing: '-0.02em'
          }}
        >
          {personalInfo.name}
        </h1>
        <div 
          className="font-semibold mb-4 px-4 py-2 rounded-full"
          style={{ 
            fontSize: `${fontSize?.title || 18}px`,
            color: colors.primary,
            background: `${colors.primary}10`
          }}
        >
          {personalInfo.title}
        </div>
        <div 
          className="flex flex-wrap justify-center gap-4 text-sm"
          style={{ color: colors.secondary || '#666666', lineHeight }}
        >
          {personalInfo.email && <span>邮箱: {personalInfo.email}</span>}
          {personalInfo.phone && <span>电话: {personalInfo.phone}</span>}
          {personalInfo.location && <span>地点: {personalInfo.location}</span>}
        </div>
        {personalInfo.summary && (
          <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: colors.text, lineHeight }}>
            {personalInfo.summary}
          </p>
        )}
      </div>

      {/* 技能网格 - 优化设计 */}
      {skills && skills.length > 0 && (
        <div 
          className="cursor-pointer"
          onClick={() => onSectionClick?.('skills')}
          style={{ marginBottom: `${spacing?.section || 28}px` }}
        >
          <h2 
            className="font-bold mb-6 text-center flex items-center justify-center gap-2"
            style={{ 
              fontSize: `${fontSize?.section || 18}px`,
              color: colors.primary || '#000000'
            }}
          >
            <span className="w-1 h-6 rounded-full" style={{ background: colors.primary }}></span>
            {t.editor.skills.title}
            <span className="w-1 h-6 rounded-full" style={{ background: colors.primary }}></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className="p-4 rounded-xl text-center transition-all hover:scale-105 hover:shadow-lg"
                style={{ 
                  background: gridBg,
                  border: `1px solid ${borderColor}`
                }}
              >
                <div 
                  className="font-bold mb-3 text-sm"
                  style={{ color: colors.primary || '#000000' }}
                >
                  {skill.name}
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: `${colors.primary}10` }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent || colors.primary} 100%)`
                    }}
                  />
                </div>
                <div className="text-xs mt-2 font-semibold" style={{ color: colors.primary }}>
                  {skill.level}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 工作经历 */}
      {experience && experience.length > 0 && (
        <div 
          className="cursor-pointer"
          onClick={() => onSectionClick?.('experience')}
          style={{ marginBottom: `${spacing?.section || 28}px` }}
        >
          <h2 
            className="font-bold mb-4"
            style={{ 
              fontSize: `${fontSize?.section || 18}px`,
              color: colors.primary || '#000000'
            }}
          >
            {t.editor.experience.title}
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 
                      className="font-semibold"
                      style={{ 
                        fontSize: `${fontSize?.title || 16}px`,
                        color: colors.primary || '#000000'
                      }}
                    >
                      {exp.position}
                    </h3>
                    <div style={{ color: colors.secondary || '#666666' }}>
                      {exp.company}
                    </div>
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: colors.secondary || '#666666' }}
                  >
                    {formatDateStr(exp.startDate)} - {exp.current ? t.editor.templatePreview.present : formatDateStr(exp.endDate)}
                  </div>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul className="space-y-1">
                    {exp.description.map((desc, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span style={{ color: colors.accent }}>•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 教育经历 */}
      {education && education.length > 0 && (
        <div 
          className="cursor-pointer"
          onClick={() => onSectionClick?.('education')}
        >
          <h2 
            className="font-bold mb-4"
            style={{ 
              fontSize: `${fontSize?.section || 18}px`,
              color: colors.primary || '#000000'
            }}
          >
            {t.editor.education.title}
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 
                    className="font-semibold"
                    style={{ 
                      fontSize: `${fontSize?.title || 16}px`,
                      color: colors.primary || '#000000'
                    }}
                  >
                    {edu.school}
                  </h3>
                  <div style={{ color: colors.secondary || '#666666' }}>
                    {edu.degree} · {edu.major}
                  </div>
                </div>
                <div 
                  className="text-sm"
                  style={{ color: colors.secondary || '#666666' }}
                >
                  {formatDateStr(edu.startDate)} - {formatDateStr(edu.endDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
