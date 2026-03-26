/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-9-22
 * @updateDate 2026.1.30 - 优化预览质量，添加骨架屏，改进缩放算法
 */

'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { TemplateStyle } from '@/types/template'
import { ResumeData } from '@/types/resume'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatDate } from '@/utils/dateFormatter'
import { Mail, Phone } from 'lucide-react'

interface TemplatePreviewProps {
  template: TemplateStyle
  fullSize?: boolean
  loading?: boolean
}

/**
 * 模板预览组件 - 优化版
 * 生成模板的真实预览效果，用于模板选择器
 * 
 * 优化点：
 * 1. 添加骨架屏加载状态
 * 2. 优化缩放算法，使用 CSS transform 提升性能
 * 3. 使用 will-change 和 contain 优化渲染
 * 4. 懒加载支持
 */
const TemplatePreview = ({ 
  template, 
  fullSize = false,
  loading = false
}: TemplatePreviewProps) => {
  const { locale, t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  
  // 模拟加载延迟，实际项目中可以根据图片加载状态控制
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsLoaded(true), 50)
      return () => clearTimeout(timer)
    }
  }, [loading])
  
  // 日期格式化辅助函数
  const formatDateStr = (date?: string) => {
    return formatDate(date, locale, template.components?.dateFormat?.format)
  }
  
  // 使用示例数据 - 使用 useMemo 优化，避免每次渲染重新创建
  const sampleData = useMemo<ResumeData>(() => ({
    personalInfo: {
      name: t.editor.templatePreview.sampleData.name,
      title: t.editor.templatePreview.sampleData.title,
      email: 'example@email.com',
      phone: '138-0000-0000',
      location: t.editor.templatePreview.sampleData.location,
      summary: t.editor.templatePreview.sampleData.summary,
      avatar: template.components?.personalInfo?.defaultAvatar || '/avatars/img1.png'
    },
    experience: [
      {
        id: '1',
        company: t.editor.templatePreview.sampleData.company,
        position: t.editor.templatePreview.sampleData.position,
        startDate: '2022-03',
        endDate: t.editor.templatePreview.present,
        current: true,
        description: [t.editor.templatePreview.sampleData.workDesc1, t.editor.templatePreview.sampleData.workDesc2],
        location: t.editor.templatePreview.sampleData.location
      }
    ],
    education: [
      {
        id: '1',
        school: t.editor.templatePreview.sampleData.school,
        degree: t.editor.templatePreview.sampleData.degree,
        major: t.editor.templatePreview.sampleData.major,
        startDate: '2018-09',
        endDate: '2022-06',
        gpa: '3.8/4.0',
        description: t.editor.templatePreview.sampleData.eduDesc
      }
    ],
    skills: [
      { id: '1', name: 'JavaScript', level: 90, category: t.editor.templatePreview.sampleData.skillCategory1 },
      { id: '2', name: 'React', level: 80, category: t.editor.templatePreview.sampleData.skillCategory2 },
      { id: '3', name: 'Vue.js', level: 80, category: t.editor.templatePreview.sampleData.skillCategory2 }
    ],
    projects: [
      {
        id: '1',
        name: t.editor.templatePreview.sampleData.projectName,
        description: t.editor.templatePreview.sampleData.projectDesc,
        technologies: ['React', 'TypeScript', 'Ant Design'],
        startDate: '2023-01',
        endDate: '2023-06',
        highlights: [t.editor.templatePreview.sampleData.projectHighlight1, t.editor.templatePreview.sampleData.projectHighlight2]
      }
    ]
  }), [t, template.components?.personalInfo?.defaultAvatar])

  const scale = fullSize ? 1 : 0.28
  
  // 根据模板类型选择渲染方式 - 使用 useMemo 优化，避免每次渲染重新计算
  const layoutType = useMemo((): 'sidebar' | 'gradient' | 'classic' | 'minimal' | 'creative' | 'marketBanner' | 'marketCard' | 'marketTimeline' | 'default' => {
    const id = template.id

    // 招聘市场主流模板（优先精确匹配）
    if (id === 'banner-layout') return 'marketBanner'
    if (id === 'card-layout') return 'marketCard'
    if (id === 'timeline-layout') return 'marketTimeline'
    
    // 根据模板ID精确匹配布局类型
    // 侧边栏布局
    if (id.includes('sidebar') || id === 'professional-executive' || id === 'frontend-developer-sidebar') {
      return 'sidebar'
    }
    
    // 顶部横幅布局
    if (id.includes('header') || id.includes('banner') || id === 'ux-designer-modern') {
      return 'gradient'
    }
    
    // 居中对称布局
    if (id.includes('centered') || id.includes('symmetric') || id === 'classic-elegant' || id === 'business-professional' || id === 'general-classic') {
      return 'classic'
    }
    
    // 极简布局
    if (id.includes('minimal') || id.includes('clean') || id === 'ui-designer-minimal' || id === 'general-minimal') {
      return 'minimal'
    }
    
    // 创意布局（左右栏）
    if (id.includes('creative') || id === 'creative-designer' || id === 'magazine-style' || 
        id === 'ui-designer-modern' || id === 'graphic-designer-creative' || id === 'fullstack-developer') {
      return 'creative'
    }
    
    // 根据布局配置判断
    if (template.layout.columns.count === 2) {
      // 如果是双栏且左栏宽度小于35%，判断为侧边栏
      const leftWidth = parseInt(template.layout.columns.leftWidth || '35')
      if (leftWidth <= 32) {
        return 'sidebar'
      }
      return 'creative'
    }
    
    // 默认单栏布局
    return 'default'
  }, [template.id, template.layout.columns])

  // 现代侧边栏布局预览
  const renderSidebarLayout = () => (
    <div className="flex w-full h-full">
      {/* 左侧深色侧边栏 */}
      <div 
        className="w-[32%] p-3 text-white flex flex-col gap-3"
        style={{ backgroundColor: template.colors.primary }}
      >
        {/* 头像占位 */}
        <div className="w-12 h-12 rounded-full bg-white/20 mx-auto" />
        <div className="text-center">
          <div className="text-[10px] font-bold">{sampleData.personalInfo.name}</div>
          <div className="text-[7px] opacity-80">{sampleData.personalInfo.title}</div>
        </div>
        
        {/* 联系信息 */}
        <div className="space-y-1 text-[6px] opacity-80">
          <div className="flex items-center gap-1">
            <Phone size={6} />
            <span>{sampleData.personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail size={6} />
            <span className="truncate">{sampleData.personalInfo.email}</span>
          </div>
        </div>
        
        {/* 技能 */}
        <div>
          <div className="text-[7px] font-bold mb-1 border-b border-white/30 pb-1">{t.editor.skills.title}</div>
          <div className="space-y-1">
            {sampleData.skills.slice(0, 2).map(skill => (
              <div key={skill.id}>
                <div className="text-[6px]">{skill.name}</div>
                <div className="h-1 bg-white/30 rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: template.colors.accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 右侧内容区 */}
      <div className="flex-1 p-3 space-y-3" style={{ color: template.colors.text }}>
        <div>
          <div className="text-[8px] font-bold border-l-2 pl-1 mb-1" style={{ borderColor: template.colors.accent, color: template.colors.primary }}>
            {t.editor.experience.title}
          </div>
          <div className="text-[6px]">
            <div className="font-medium">{sampleData.experience[0].position}</div>
            <div style={{ color: template.colors.accent }}>{sampleData.experience[0].company}</div>
            <div className="text-gray-400 mt-0.5">{sampleData.experience[0].description[0]}</div>
          </div>
        </div>
        
        <div>
          <div className="text-[8px] font-bold border-l-2 pl-1 mb-1" style={{ borderColor: template.colors.accent, color: template.colors.primary }}>
            {t.editor.projects.title}
          </div>
          <div className="text-[6px] bg-gray-50 p-1.5 rounded">
            <div className="font-medium">{sampleData.projects[0].name}</div>
            <div className="text-gray-500 mt-0.5 line-clamp-2">{sampleData.projects[0].description}</div>
          </div>
        </div>
      </div>
    </div>
  )

  // 渐变头部布局预览
  const renderGradientLayout = () => (
    <div className="w-full h-full flex flex-col">
      {/* 渐变头部 */}
      <div 
        className="p-3 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)` }}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/30" />
          <div>
            <div className="text-[10px] font-bold">{sampleData.personalInfo.name}</div>
            <div className="text-[7px] opacity-90">{sampleData.personalInfo.title}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-2 text-[5px] opacity-80">
          <span>{sampleData.personalInfo.phone}</span>
          <span>{sampleData.personalInfo.email}</span>
        </div>
      </div>
      
      {/* 内容区 */}
      <div className="flex-1 p-3 space-y-2" style={{ color: template.colors.text }}>
        <div>
          <div className="text-[8px] font-bold pb-1 border-b" style={{ color: template.colors.primary, borderColor: `${template.colors.primary}30` }}>
            {t.editor.experience.title}
          </div>
          <div className="text-[6px] mt-1">
            <div className="font-medium">{sampleData.experience[0].position}</div>
            <div style={{ color: template.colors.primary }}>{sampleData.experience[0].company}</div>
          </div>
        </div>
        
        <div>
          <div className="text-[8px] font-bold pb-1 border-b" style={{ color: template.colors.primary, borderColor: `${template.colors.primary}30` }}>
            {t.editor.skills.title}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {sampleData.skills.map(skill => (
              <span 
                key={skill.id} 
                className="text-[5px] px-1 py-0.5 rounded-full"
                style={{ backgroundColor: `${template.colors.primary}15`, color: template.colors.primary }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * 市场化顶部信息模板预览
   * 参考招聘平台常见单栏 ATS 版式：页眉 + 经历主区 + 技能文本行。
   */
  const renderMarketBannerLayout = () => (
    <div className="w-full h-full p-3" style={{ color: '#111827' }}>
      <div className="border-b pb-2.5" style={{ borderColor: '#d7dee8' }}>
        <div className="text-[10px] font-semibold tracking-[0.02em]">{sampleData.personalInfo.name}</div>
        <div className="text-[7px] text-slate-600 mt-0.5">{sampleData.personalInfo.title}</div>
        <div className="text-[5px] text-slate-500 mt-1.5">
          {sampleData.personalInfo.phone} · {sampleData.personalInfo.email}
        </div>
        <div className="mt-1.5 rounded-sm border-l-2 bg-slate-50 px-2 py-1 text-[5px] text-slate-600" style={{ borderColor: '#e2e8f0' }}>
          {sampleData.personalInfo.summary}
        </div>
      </div>

      <div className="mt-2.5">
        <div className="text-[6.5px] font-semibold pb-1 border-b" style={{ borderColor: '#dfe6ef' }}>
          {t.editor.experience.title}
        </div>
        <div className="mt-1.5 space-y-1.5 text-[6px]">
          <div className="border-b pb-1" style={{ borderColor: '#edf2f7' }}>
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{sampleData.experience[0].position}</span>
              <span className="text-slate-500">{formatDateStr(sampleData.experience[0].startDate)}</span>
            </div>
            <div className="text-slate-600 mt-0.5">{sampleData.experience[0].company}</div>
          </div>
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{sampleData.projects[0].name}</span>
              <span className="text-slate-500">{formatDateStr(sampleData.projects[0].startDate)}</span>
            </div>
            <div className="text-slate-600 mt-0.5 line-clamp-1">{sampleData.projects[0].description}</div>
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <div className="text-[6.5px] font-semibold pb-1 border-b" style={{ borderColor: '#dfe6ef' }}>
          {t.editor.skills.title}
        </div>
        <div className="mt-1 text-[5px] text-slate-600 line-clamp-2">
          {sampleData.skills.map((skill, index) => (
            <span key={skill.id}>
              {skill.name}
              {index < sampleData.skills.length - 1 && <span> / </span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  /**
   * 市场化项目强化模板预览
   * 参考主流双栏模板：左主栏放经历项目，右侧栏放技能教育。
   */
  const renderMarketCardLayout = () => (
    <div className="w-full h-full p-3 text-[6px]" style={{ color: '#111827' }}>
      <div className="border-b pb-2.5" style={{ borderColor: '#d7dee8' }}>
        <div className="text-[10px] font-semibold">{sampleData.personalInfo.name}</div>
        <div className="text-[7px] text-slate-600">{sampleData.personalInfo.title}</div>
      </div>

      <div className="mt-2 grid grid-cols-[1.55fr,1fr] gap-2">
        <div>
          <div className="text-[6.5px] font-semibold pb-1 border-b" style={{ borderColor: '#dfe6ef' }}>
            {t.editor.experience.title}
          </div>
          <div className="mt-1.5">
            <div className="font-medium">{sampleData.experience[0].position}</div>
            <div className="text-slate-600">{sampleData.experience[0].company}</div>
            <div className="text-slate-500 mt-0.5 line-clamp-1">{sampleData.experience[0].description[0]}</div>
          </div>

          <div className="text-[6.5px] font-semibold pb-1 border-b mt-2" style={{ borderColor: '#dfe6ef' }}>
            {t.editor.projects.title}
          </div>
          <div className="mt-1.5">
            <div className="font-medium">{sampleData.projects[0].name}</div>
            <div className="text-slate-500 line-clamp-2">{sampleData.projects[0].description}</div>
          </div>
        </div>

        <div className="rounded border bg-slate-50 px-2 py-1.5" style={{ borderColor: '#e7edf4' }}>
          <div className="text-[6.5px] font-semibold pb-1 border-b" style={{ borderColor: '#dfe6ef' }}>
            {t.editor.skills.title}
          </div>
          <div className="mt-1 text-[5px] text-slate-600 line-clamp-2">
            {sampleData.skills.map((skill, index) => (
              <span key={skill.id}>
                {skill.name}
                {index < sampleData.skills.length - 1 && <span> / </span>}
              </span>
            ))}
          </div>

          <div className="text-[6.5px] font-semibold pb-1 border-b mt-2" style={{ borderColor: '#dfe6ef' }}>
            {t.editor.education.title}
          </div>
          <div className="mt-1">
            <div className="font-medium line-clamp-1">{sampleData.education[0].school}</div>
            <div className="text-slate-600 line-clamp-1">{sampleData.education[0].major}</div>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * 市场化时间轴模板预览
   * 采用招聘常见逆序时间线：左日期、右侧纵向事件轨道。
   */
  const renderMarketTimelineLayout = () => (
    <div className="w-full h-full p-3" style={{ color: '#111827' }}>
      <div className="border-b pb-2.5" style={{ borderColor: '#d7dee8' }}>
        <div className="text-[10px] font-semibold">{sampleData.personalInfo.name}</div>
        <div className="text-[7px] text-slate-600">{sampleData.personalInfo.title}</div>
      </div>

      <div className="mt-2.5 text-[6.5px] font-semibold pb-1 border-b" style={{ borderColor: '#dfe6ef' }}>
        {t.editor.experience.title}
      </div>
      <div className="mt-1.5 space-y-1.5">
        <div className="grid grid-cols-[46px,1fr] gap-2 border-b pb-1" style={{ borderColor: '#edf2f7' }}>
          <div className="text-slate-500">{formatDateStr(sampleData.experience[0].startDate)}</div>
          <div className="relative border-l pl-2" style={{ borderColor: '#ced6e0' }}>
            <span className="absolute left-0 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-500" />
            <div className="font-medium">{sampleData.experience[0].position}</div>
            <div className="text-slate-600">{sampleData.experience[0].company}</div>
          </div>
        </div>
        <div className="grid grid-cols-[46px,1fr] gap-2 text-[6px]">
          <div className="text-slate-500">{formatDateStr(sampleData.education[0].startDate)}</div>
          <div className="relative border-l pl-2" style={{ borderColor: '#ced6e0' }}>
            <span className="absolute left-0 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-500" />
            <div className="font-medium">{sampleData.education[0].school}</div>
            <div className="text-slate-600">{sampleData.education[0].major}</div>
          </div>
        </div>
      </div>
    </div>
  )

  // 经典优雅布局预览
  const renderClassicLayout = () => (
    <div className="w-full h-full p-4" style={{ color: template.colors.text }}>
      {/* 居中头部 */}
      <div className="text-center pb-2 mb-3 border-b-2" style={{ borderColor: template.colors.primary }}>
        <div className="text-[12px] font-serif font-bold tracking-wider" style={{ color: template.colors.primary }}>
          {sampleData.personalInfo.name}
        </div>
        <div className="text-[8px] text-gray-600 mt-0.5">{sampleData.personalInfo.title}</div>
        <div className="flex justify-center gap-2 mt-1 text-[5px] text-gray-500">
          <span>{sampleData.personalInfo.phone}</span>
          <span>|</span>
          <span>{sampleData.personalInfo.email}</span>
        </div>
      </div>
      
      {/* 工作经历 */}
      <div className="mb-2">
        <div className="text-[8px] font-serif font-bold text-center pb-1 border-b" style={{ color: template.colors.primary, borderColor: `${template.colors.primary}30` }}>
          {t.editor.experience.title}
        </div>
        <div className="text-[6px] mt-1">
          <div className="flex justify-between">
            <span className="font-bold">{sampleData.experience[0].position}</span>
            <span className="text-gray-500 italic">{formatDateStr(sampleData.experience[0].startDate)}</span>
          </div>
          <div className="text-gray-600">{sampleData.experience[0].company}</div>
        </div>
      </div>
      
      {/* 教育背景 */}
      <div>
        <div className="text-[8px] font-serif font-bold text-center pb-1 border-b" style={{ color: template.colors.primary, borderColor: `${template.colors.primary}30` }}>
          {t.editor.education.title}
        </div>
        <div className="text-[6px] mt-1">
          <div className="font-bold">{sampleData.education[0].school}</div>
          <div className="text-gray-600">{sampleData.education[0].degree} · {sampleData.education[0].major}</div>
        </div>
      </div>
    </div>
  )

  // 极简布局预览
  const renderMinimalLayout = () => (
    <div className="w-full h-full p-4" style={{ color: template.colors.text }}>
      {/* 简洁头部 */}
      <div className="mb-4">
        <div className="text-[11px] font-light tracking-widest">{sampleData.personalInfo.name}</div>
        <div className="text-[7px] text-gray-500 font-light">{sampleData.personalInfo.title}</div>
        <div className="flex gap-3 mt-1 text-[5px] text-gray-400">
          <span>{sampleData.personalInfo.email}</span>
          <span>{sampleData.personalInfo.phone}</span>
        </div>
      </div>
      
      {/* 工作经历 */}
      <div className="mb-3">
        <div className="text-[6px] font-medium tracking-[0.2em] text-gray-400 uppercase mb-1">
          {t.editor.experience.title}
        </div>
        <div className="text-[6px]">
          <div className="font-medium">{sampleData.experience[0].position}</div>
          <div className="text-gray-500">{sampleData.experience[0].company}</div>
        </div>
      </div>
      
      {/* 技能 */}
      <div>
        <div className="text-[6px] font-medium tracking-[0.2em] text-gray-400 uppercase mb-1">
          {t.editor.skills.title}
        </div>
        <div className="flex flex-wrap gap-2 text-[5px] text-gray-600">
          {sampleData.skills.map(skill => (
            <span key={skill.id}>{skill.name}</span>
          ))}
        </div>
      </div>
    </div>
  )

  // 创意布局预览
  const renderCreativeLayout = () => (
    <div className="flex w-full h-full" style={{ backgroundColor: template.colors.background }}>
      {/* 左侧 */}
      <div className="w-[35%] p-3 flex flex-col items-center gap-2" style={{ color: template.colors.text }}>
        <div 
          className="w-14 h-14 rounded-full"
          style={{ backgroundColor: template.colors.primary }}
        />
        <div className="text-center">
          <div className="text-[9px] font-bold">{sampleData.personalInfo.name}</div>
          <div className="text-[6px]" style={{ color: template.colors.secondary }}>{sampleData.personalInfo.title}</div>
        </div>
        
        <div className="w-full">
          <div 
            className="text-[7px] font-bold px-1.5 py-0.5 rounded mb-1"
            style={{ backgroundColor: `${template.colors.primary}20`, color: template.colors.primary }}
          >
            {t.editor.skills.title}
          </div>
          <div className="space-y-1">
            {sampleData.skills.slice(0, 2).map(skill => (
              <div key={skill.id} className="text-[5px]">{skill.name}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 右侧 */}
      <div className="flex-1 p-3 space-y-2" style={{ color: template.colors.text }}>
        <div>
          <div 
            className="text-[7px] font-bold px-1.5 py-0.5 rounded mb-1 inline-block"
            style={{ backgroundColor: `${template.colors.primary}20`, color: template.colors.primary }}
          >
            {t.editor.experience.title}
          </div>
          <div className="text-[6px]">
            <div className="font-medium">{sampleData.experience[0].position}</div>
            <div style={{ color: template.colors.accent }}>{sampleData.experience[0].company}</div>
          </div>
        </div>
        
        <div>
          <div 
            className="text-[7px] font-bold px-1.5 py-0.5 rounded mb-1 inline-block"
            style={{ backgroundColor: `${template.colors.primary}20`, color: template.colors.primary }}
          >
            {t.editor.projects.title}
          </div>
          <div className="text-[6px]">
            <div className="font-medium">{sampleData.projects[0].name}</div>
          </div>
        </div>
      </div>
    </div>
  )

  // 默认单栏布局预览
  const renderDefaultLayout = () => (
    <div className="w-full h-full p-3" style={{ color: template.colors.text }}>
      {/* 头部 */}
      <div className="flex items-center gap-2 pb-2 mb-2 border-b" style={{ borderColor: template.colors.primary }}>
        {template.components.personalInfo.showAvatar && (
          <div className="w-10 h-10 rounded-full" style={{ backgroundColor: template.colors.primary }} />
        )}
        <div>
          <div className="text-[10px] font-bold" style={{ color: template.colors.primary }}>
            {sampleData.personalInfo.name}
          </div>
          <div className="text-[7px]" style={{ color: template.colors.secondary }}>
            {sampleData.personalInfo.title}
          </div>
        </div>
      </div>
      
      {/* 工作经历 */}
      <div className="mb-2">
        <div className="text-[8px] font-bold pb-0.5 border-b mb-1" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
          {t.editor.experience.title}
        </div>
        <div className="text-[6px]">
          <div className="flex justify-between">
            <span className="font-medium">{sampleData.experience[0].position}</span>
            <span style={{ color: template.colors.secondary }}>{formatDateStr(sampleData.experience[0].startDate)}</span>
          </div>
          <div style={{ color: template.colors.secondary }}>{sampleData.experience[0].company}</div>
        </div>
      </div>
      
      {/* 技能 */}
      <div>
        <div className="text-[8px] font-bold pb-0.5 border-b mb-1" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
          {t.editor.skills.title}
        </div>
        <div className="space-y-1">
          {sampleData.skills.slice(0, 2).map(skill => (
            <div key={skill.id}>
              <div className="flex justify-between text-[5px] mb-0.5">
                <span>{skill.name}</span>
                <span style={{ color: template.colors.secondary }}>{skill.level}%</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full" 
                  style={{ width: `${skill.level}%`, backgroundColor: template.colors.primary }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 根据布局类型选择渲染函数
  const renderLayout = () => {
    switch (layoutType) {
      case 'sidebar': return renderSidebarLayout()
      case 'gradient': return renderGradientLayout()
      case 'classic': return renderClassicLayout()
      case 'minimal': return renderMinimalLayout()
      case 'creative': return renderCreativeLayout()
      case 'marketBanner': return renderMarketBannerLayout()
      case 'marketCard': return renderMarketCardLayout()
      case 'marketTimeline': return renderMarketTimelineLayout()
      default: return renderDefaultLayout()
    }
  }
  
  // 骨架屏组件
  const renderSkeleton = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse">
      <div className="p-4 space-y-3">
        {/* 头部骨架 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-2 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        
        {/* 内容骨架 */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded w-1/4" />
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded w-5/6" />
        </div>
        
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded w-1/3" />
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    </div>
  )

  return (
    <div 
      className="overflow-hidden bg-white" 
      style={{ 
        aspectRatio: '3/4',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
        // 性能优化：使用 CSS containment 和 will-change
        contain: 'layout style paint',
        willChange: fullSize ? 'auto' : 'transform',
        // 优化渲染质量
        imageRendering: 'crisp-edges',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      {loading || !isLoaded ? renderSkeleton() : renderLayout()}
    </div>
  )
}

// 使用 React.memo 优化，只在 template 或 fullSize 变化时重新渲染
export default React.memo(TemplatePreview, (prevProps, nextProps) => {
  return (
    prevProps.template.id === nextProps.template.id &&
    prevProps.fullSize === nextProps.fullSize &&
    prevProps.loading === nextProps.loading
  )
})
