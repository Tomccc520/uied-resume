/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 * 
 * 简历编辑器页面 - 性能优化版本
 * 使用懒加载优化非关键组件
 * Requirements: 1.5
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import ResumePreview from '@/components/ResumePreview'
import TemplateStyleSync from '@/components/TemplateStyleSync'
import Header from '@/components/Header'
import EditorToolbar from '@/components/EditorToolbar'
import AIConfigModal, { AIConfig } from '@/components/AIConfigModal'
import { StyleProvider } from '@/contexts/StyleContext'
import { useToastContext } from '@/components/Toast'
import { useRealtimePreview } from '@/hooks/useRealtimePreview'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useKeyboardShortcuts, createEditorShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useHorizontalSwipe } from '@/hooks/useSwipeGesture'
import { ResumeData, Experience } from '@/types/resume'
import { TemplateStyle } from '@/types/template'
import { getDefaultTemplate, getTemplateById } from '@/data/templates'
import { X } from 'lucide-react'
import { 
  EditorSkeleton, 
  AIAssistantSkeleton, 
  TemplateSelectorSkeleton, 
  ExportPreviewDialogSkeleton 
} from '@/components/LoadingStates'
import { ThreeColumnLayout } from '@/components/editor/ThreeColumnLayout'
import { SectionNavigation } from '@/components/editor/SectionNavigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { JDSuggestion } from '@/services/jdMatcher'
import { PreviewPanel } from '@/components/preview'
import { ExportProgressIndicator } from '@/components/export/ExportProgressIndicator'
import { ImportExportDialog, ImportedData } from '@/components/data/ImportExportDialog'
import { useStorageMonitor } from '@/hooks/useStorageMonitor'
import { ContextMenu } from '@/components/editor/ContextMenu'
import { BatchEditToolbar } from '@/components/editor/BatchEditToolbar'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useBatchSelection } from '@/hooks/useBatchSelection'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { useEditorExportFlow } from '@/hooks/useEditorExportFlow'

// 懒加载非关键组件 - 优化初始加载性能 (Requirements: 1.5)
const ResumeEditor = dynamic(() => import('@/components/ResumeEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false
})

// 懒加载统一 AI 助手面板
const UnifiedAIPanel = dynamic(() => import('@/components/UnifiedAIPanel'), {
  loading: () => <AIAssistantSkeleton />,
  ssr: false
})

// 懒加载模板选择器组件
const TemplateSelector = dynamic(() => import('@/components/TemplateSelector'), {
  loading: () => <TemplateSelectorSkeleton />,
  ssr: false
})

// 懒加载导出预览对话框组件
const ExportPreviewDialog = dynamic(() => import('@/components/ExportPreviewDialog'), {
  loading: () => <ExportPreviewDialogSkeleton />,
  ssr: false
})

/**
 * 简历编辑器页面 - 简洁版
 * 采用与首页一致的简约设计风格
 */
export default function EditorPage() {
  /**
   * 编辑器调试日志
   * 仅在开发环境输出，避免生产环境污染控制台
   */
  const logEditorDebug = useCallback((...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args)
    }
  }, [])

  const [showUnifiedAI, setShowUnifiedAI] = useState(false)
  const [showAIConfig, setShowAIConfig] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showShortcutHelp, setShowShortcutHelp] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<TemplateStyle>(() => {
    // 尝试从 localStorage 恢复用户之前选择的模板
    if (typeof window !== 'undefined') {
      try {
        const savedTemplateId = localStorage.getItem('currentTemplateId')
        if (savedTemplateId) {
          const savedTemplate = getTemplateById(savedTemplateId)
          if (savedTemplate) {
            return savedTemplate
          }
        }
      } catch (error) {
        console.error('恢复模板失败:', error)
      }
    }
    return getDefaultTemplate()
  })
  const [activeSection, setActiveSection] = useState('personal')
  const [, setExportOptions] = useState<{ margin: number; showPageBreaks: boolean; paper: 'a4' | 'letter' }>({ margin: 10, showPageBreaks: true, paper: 'a4' })
  
  // 新增状态
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 1
  
  const { t } = useLanguage()

  const { success: showSuccess, error: showError, info: showInfo } = useToastContext()
  // 简历数据状态
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '张三',
      title: '资深前端工程师',
      email: 'zhangsan@example.com',
      phone: '138-0000-0000',
      location: '北京市朝阳区',
      website: 'https://github.com/zhangsan',
      summary: '拥有5年前端开发经验，专注于构建高性能、可扩展的Web应用。精通React技术栈和现代前端工程化。具备良好的团队协作能力和技术领导力，曾主导多个大型项目的架构设计与开发。',
      avatar: '/avatars/img1.png'
    },
    experience: [
      {
        id: '1',
        company: '未来科技有限公司',
        position: '高级前端开发工程师',
        startDate: '2022-01',
        endDate: '至今',
        current: true,
        description: [
          '主导公司核心SaaS产品的前端重构，采用Next.js + TypeScript架构，首屏加载速度提升40%',
          '设计并实现企业级组件库，覆盖50+常用组件，提升团队开发效率30%',
          '负责前端团队技术建设，制定代码规范和Code Review流程，显著降低线上故障率'
        ],
        location: '北京'
      },
      {
        id: '2',
        company: '创新网络科技有限公司',
        position: '前端开发工程师',
        startDate: '2019-06',
        endDate: '2021-12',
        current: false,
        description: [
          '负责电商平台C端业务开发，参与双11大促活动页面的性能优化',
          '实现复杂的数据可视化大屏，支持实时数据更新和交互分析',
          '优化移动端H5页面体验，解决不同机型的兼容性问题'
        ],
        location: '北京'
      }
    ],
    education: [
      {
        id: '1',
        school: '北京大学',
        degree: '硕士',
        major: '软件工程',
        startDate: '2016-09',
        endDate: '2019-06',
        gpa: '3.8/4.0'
      },
      {
        id: '2',
        school: '北京邮电大学',
        degree: '学士',
        major: '计算机科学与技术',
        startDate: '2012-09',
        endDate: '2016-06',
        gpa: '3.7/4.0'
      }
    ],
    skills: [
      {
        id: '1',
        name: 'React / Next.js',
        level: 95,
        category: '前端框架',
        color: '#3B82F6'
      },
      {
        id: '2',
        name: 'TypeScript',
        level: 90,
        category: '编程语言',
        color: '#3B82F6'
      },
      {
        id: '3',
        name: 'Node.js',
        level: 85,
        category: '后端技术',
        color: '#10B981'
      },
      {
        id: '4',
        name: '性能优化',
        level: 85,
        category: '核心能力',
        color: '#F59E0B'
      },
      {
        id: '5',
        name: 'CI/CD',
        level: 80,
        category: '工程化',
        color: '#6B7280'
      }
    ],
    projects: [
      {
        id: '1',
        name: '企业级协作平台',
        description: '一款支持千人即时通讯和文档协作的企业级SaaS平台。',
        technologies: ['React', 'WebSocket', 'WebRTC', 'Redis'],
        startDate: '2023-03',
        endDate: '2023-08',
        url: 'https://example.com/project',
        highlights: [
          '设计并实现即时通讯模块，支持单聊、群聊和消息漫游，日均消息量达百万级',
          '基于WebRTC实现多人音视频通话功能，延迟控制在200ms以内',
          '优化富文本编辑器性能，支持大文档流畅编辑和协同操作'
        ]
      }
    ]
  })

  // 导出工作流 Hook
  const {
    isExporting,
    handleExport,
    handleExportByFormat,
    exportProgress,
    estimatedTimeRemaining,
    exportStatus,
    isExportInProgress,
    canCancel,
    cancelExport,
    resetExportProgress
  } = useEditorExportFlow({
    resumeData,
    resumeName: resumeData.personalInfo.name || '简历',
    exportSuccessMessage: t.editor.messages.exportSuccess,
    jsonExportSuccessMessage: t.editor.messages.jsonExportSuccess,
    exportErrorMessage: t.editor.messages.exportError,
    onSuccess: showSuccess,
    onError: showError,
    logger: logEditorDebug
  })

  // 实时预览状态
  const { previewData, isUpdating } = useRealtimePreview(resumeData)

  /**
   * 保存简历数据到本地存储 - 使用 useCallback 优化
   */
  const saveResumeData = useCallback(async (data: ResumeData) => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(data))
      localStorage.setItem('resumeData_backup', JSON.stringify(data))
      localStorage.setItem('resumeData_timestamp', new Date().toISOString())
    } catch (error) {
      console.error('保存失败:', error)
      throw error
    }
  }, [])

  // 自动保存功能
  const {
    isSaving,
    lastSavedAt,
    hasUnsavedChanges,
    saveNow,
  } = useAutoSave(resumeData, saveResumeData, {
    interval: 30000, // 30秒自动保存
    enabled: true,
    onSaveSuccess: () => undefined,
    onSaveError: (error) => {
      console.error('自动保存失败:', error)
    }
  })

  // 数据导入导出对话框状态
  const [showImportExportDialog, setShowImportExportDialog] = useState(false)
  
  // 存储监控 Hook
  const { refresh: refreshStorageUsage } = useStorageMonitor()
  
  // 上下文菜单 Hook
  const {
    isOpen: isContextMenuOpen,
    position: contextMenuPosition,
    closeMenu: closeContextMenu,
    menuItems: contextMenuItems
  } = useContextMenu()
  
  // 批量选择 Hook (用于工作经历)
  const {
    selectedIds: selectedExperienceIds,
    selectionCount: experienceSelectionCount,
    selectAll: selectAllExperiences,
    clearSelection: clearExperienceSelection,
    batchDelete: batchDeleteExperiences,
    batchCopy: batchCopyExperiences,
    batchMove: batchMoveExperiences
  } = useBatchSelection<Experience>()
  
  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'warning' | 'danger' | 'info'
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  })
  
  // 全局加载状态
  const [globalLoading, _setGlobalLoading] = useState(false)
  const [globalLoadingMessage, _setGlobalLoadingMessage] = useState('')
  
  // 处理数据导入
  const handleDataImport = useCallback((data: ImportedData, mode: 'replace' | 'merge') => {
    if (data.resumeData) {
      if (mode === 'replace') {
        setResumeData(data.resumeData as unknown as ResumeData)
      } else {
        // 合并模式：简单覆盖
        setResumeData(data.resumeData as unknown as ResumeData)
      }
    }
    showSuccess(t.editor.messages.exportSuccess || '数据导入成功')
    refreshStorageUsage()
  }, [showSuccess, t, refreshStorageUsage])
  
  // 批量删除工作经历
  const handleBatchDeleteExperiences = useCallback(() => {
    if (experienceSelectionCount === 0) return
    
    const isZh = t.common.edit === '编辑'
    setConfirmDialog({
      isOpen: true,
      title: isZh ? '确认删除' : 'Confirm Delete',
      message: isZh 
        ? `确定要删除选中的 ${experienceSelectionCount} 条工作经历吗？此操作无法撤销。`
        : `Are you sure you want to delete ${experienceSelectionCount} selected experience(s)? This action cannot be undone.`,
      type: 'danger',
      onConfirm: () => {
        const remainingExperiences = batchDeleteExperiences(
          resumeData.experience,
          () => {}
        )
        setResumeData(prev => ({
          ...prev,
          experience: remainingExperiences
        }))
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        showSuccess(isZh ? `已删除 ${experienceSelectionCount} 条工作经历` : `Deleted ${experienceSelectionCount} experience(s)`)
      }
    })
  }, [experienceSelectionCount, batchDeleteExperiences, resumeData.experience, setResumeData, showSuccess, t])
  
  // 批量复制工作经历
  const handleBatchCopyExperiences = useCallback(() => {
    const isZh = t.common.edit === '编辑'
    const copiedExperiences = batchCopyExperiences(
      resumeData.experience,
      () => `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    )
    setResumeData(prev => ({
      ...prev,
      experience: copiedExperiences
    }))
    showSuccess(isZh ? `已复制 ${experienceSelectionCount} 条工作经历` : `Copied ${experienceSelectionCount} experience(s)`)
  }, [batchCopyExperiences, resumeData.experience, experienceSelectionCount, setResumeData, showSuccess, t])
  
  // 批量移动工作经历
  const handleBatchMoveExperiences = useCallback((direction: 'up' | 'down') => {
    const movedExperiences = batchMoveExperiences(resumeData.experience, direction)
    setResumeData(prev => ({
      ...prev,
      experience: movedExperiences
    }))
  }, [batchMoveExperiences, resumeData.experience, setResumeData])
  
  /**
   * 手动保存 - 使用 useCallback 优化
   */
  const handleSave = useCallback(async () => {
    await saveNow()
  }, [saveNow])
  
  /**
   * 从本地存储加载简历数据 - 增强错误恢复
   */
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumeData')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // 验证数据完整性，确保至少有基本的个人信息
        if (parsedData?.personalInfo?.name) {
          setResumeData(parsedData)
        } else {
          logEditorDebug('本地存储数据不完整，使用默认数据')
        }
      }
    } catch (error) {
      console.error('加载数据失败，尝试从备份恢复:', error)
      try {
        const backupData = localStorage.getItem('resumeData_backup')
        if (backupData) {
          const parsedData = JSON.parse(backupData)
          if (parsedData?.personalInfo?.name) {
            setResumeData(parsedData)
            showInfo(t.editor.messages.backupRestored, t.editor.messages.backupRestoredDesc)
          }
        }
      } catch (backupError) {
        console.error('备份恢复也失败:', backupError)
      }
    }
  }, [showInfo, t, logEditorDebug])

  /**
   * 保存当前模板到本地存储
   */
  useEffect(() => {
    if (currentTemplate?.id) {
      localStorage.setItem('currentTemplateId', currentTemplate.id)
    }
  }, [currentTemplate])

  /**
   * 更新简历数据 - 使用 useCallback 优化
   * @param newData - 新的简历数据
   */
  const handleResumeUpdate = useCallback((newData: ResumeData) => {
    setResumeData(newData)
  }, [])

  

  /**
   * 处理模板选择
   * @param template - 选择的模板
   */
  /**
   * 处理模板选择
   * 修复：确保即使删除内容后也能正常切换模板
   */
  const handleTemplateSelect = useCallback((template: TemplateStyle) => {
    // 检查简历数据完整性，如果数据为空或不完整，使用默认数据
    setResumeData(prevData => {
      // 确保至少有基本的个人信息结构
      if (!prevData.personalInfo || !prevData.personalInfo.name) {
        logEditorDebug('[编辑器提示] 检测到简历数据不完整，使用默认数据')
        return {
          personalInfo: {
            name: '请填写姓名',
            title: '请填写职位',
            email: '',
            phone: '',
            location: '',
            website: '',
            summary: '',
            avatar: template.components?.personalInfo?.defaultAvatar || '/avatars/img1.png'
          },
          experience: [],
          education: [],
          skills: [],
          projects: []
        }
      }
      
      // 数据完整，保持原样
      return prevData
    })
    
    setCurrentTemplate(template)
    
    setShowTemplateSelector(false)
  }, [logEditorDebug])

  /**
   * 应用AI优化建议
   * @param content - 优化后的内容
   * @param section - 要更新的部分
   */
  const applyAISuggestionToResume = useCallback((
    content: string,
    section: string,
    silent = false
  ) => {
    if (!content?.trim()) return

    /**
     * 清洗 AI 返回行内容
     * 统一去除列表符号，避免脏数据入库
     */
    const normalizedLines = content
      .split('\n')
      .map((line) => line.replace(/^[\d\-\*\•\.\s]+/, '').trim())
      .filter(Boolean)

    const messageMap: Record<string, string> = {
      summary: '个人简介已更新',
      experience: '工作经历已更新',
      skills: '专业技能已更新',
      projects: '项目经验已更新',
      education: '教育经历已更新'
    }

    // summary 允许纯文本，其他模块要求至少有一行有效内容
    if (section !== 'summary' && normalizedLines.length === 0) {
      return
    }
    if (!messageMap[section]) {
      return
    }

    setResumeData((prev) => {
      const next: ResumeData = {
        ...prev,
        personalInfo: { ...prev.personalInfo },
        experience: prev.experience.map((item) => ({ ...item, description: [...item.description] })),
        education: prev.education.map((item) => ({ ...item })),
        skills: prev.skills.map((item) => ({ ...item })),
        projects: prev.projects.map((item) => ({ ...item, technologies: [...item.technologies], highlights: [...item.highlights] }))
      }

      switch (section) {
        case 'summary':
          next.personalInfo.summary = content.trim()
          break
        case 'experience': {
          if (next.experience.length === 0) {
            next.experience.push({
              id: `exp-${Date.now()}`,
              company: '待补充公司',
              position: '待补充职位',
              startDate: '',
              endDate: '',
              current: false,
              description: normalizedLines
            })
          } else {
            next.experience[0].description = normalizedLines
          }
          break
        }
        case 'skills': {
          const existingSkillMap = new Map(next.skills.map((skill) => [skill.name.toLowerCase(), skill]))
          normalizedLines.forEach((line, index) => {
            const normalized = line.replace(/\(\d+%?\)/g, '').trim()
            if (!normalized) return
            const key = normalized.toLowerCase()
            if (!existingSkillMap.has(key)) {
              existingSkillMap.set(key, {
                id: `skill-${Date.now()}-${index}`,
                name: normalized,
                level: 75,
                category: '技术技能'
              })
            }
          })
          next.skills = Array.from(existingSkillMap.values())
          break
        }
        case 'projects': {
          if (next.projects.length === 0) {
            next.projects.push({
              id: `proj-${Date.now()}`,
              name: 'AI优化项目',
              description: normalizedLines[0],
              technologies: [],
              startDate: '',
              endDate: '',
              highlights: normalizedLines.slice(1).length > 0 ? normalizedLines.slice(1) : [normalizedLines[0]]
            })
          } else {
            next.projects[0].description = normalizedLines[0]
            next.projects[0].highlights = normalizedLines.slice(1).length > 0 ? normalizedLines.slice(1) : [normalizedLines[0]]
          }
          break
        }
        case 'education': {
          if (next.education.length === 0) {
            next.education.push({
              id: `edu-${Date.now()}`,
              school: normalizedLines[0] || '待补充学校',
              degree: '待补充学位',
              major: '待补充专业',
              startDate: '',
              endDate: '',
              description: normalizedLines.slice(1).join('；')
            })
          } else {
            next.education[0].description = normalizedLines.join('；')
          }
          break
        }
      }

      return next
    })

    if (!silent && messageMap[section]) {
      showSuccess(messageMap[section])
    }
  }, [showSuccess])

  const handleApplyAISuggestion = useCallback((content: string, section: string) => {
    applyAISuggestionToResume(content, section, false)
  }, [applyAISuggestionToResume])

  /**
   * 应用所有 JD 建议
   * @param suggestions - JD 优化建议数组
   */
  const handleApplyAllJDSuggestions = useCallback((suggestions: JDSuggestion[]) => {
    let appliedCount = 0
    suggestions.forEach((suggestion) => {
      const content = (suggestion as JDSuggestion & { optimized?: string }).suggestedText || (suggestion as JDSuggestion & { optimized?: string }).optimized || ''
      if (!content || !suggestion.section) return
      applyAISuggestionToResume(content, suggestion.section, true)
      appliedCount += 1
    })

    if (appliedCount > 0) {
      showSuccess(`已应用 ${appliedCount} 条 JD 优化建议`)
    }
  }, [applyAISuggestionToResume, showSuccess])

  /**
   * 处理AI生成完成
   * @param data - 生成的简历数据
   */
  const handleAIGenerateComplete = useCallback((data: Partial<ResumeData>) => {
    setResumeData(prev => ({
      ...prev,
      ...data,
      personalInfo: data.personalInfo ? { ...prev.personalInfo, ...data.personalInfo } : prev.personalInfo,
      experience: data.experience ?? prev.experience,
      education: data.education ?? prev.education,
      skills: data.skills ?? prev.skills,
      projects: data.projects ?? prev.projects
    }))
    showSuccess('AI 生成内容已应用到简历')
  }, [showSuccess])

  /**
   * 处理 AI 配置保存
   * 用于统一 AI 配置入口的成功反馈
   */
  const handleAIConfigSave = useCallback((_config: AIConfig) => {
    showSuccess('AI 配置已保存')
  }, [showSuccess])

  /**
   * 处理预览区章节点击
   * 点击预览中的模块后，自动定位到对应编辑模块，并在小屏切换到编辑视图。
   */
  const handlePreviewSectionClick = useCallback((section: string) => {
    const normalizedMap: Record<string, string> = {
      personalInfo: 'personal',
      skill: 'skills',
      project: 'projects',
      experiences: 'experience',
      educations: 'education'
    }
    const normalizedSection = normalizedMap[section] || section
    const validSections = new Set(['personal', 'experience', 'education', 'skills', 'projects'])
    if (!validSections.has(normalizedSection)) {
      return
    }

    setActiveSection(normalizedSection)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('switchToEditor', {
          detail: { section: normalizedSection }
        })
      )

      if (window.innerWidth < 1280) {
        setIsPreviewMode(false)
      }
    }
  }, [])

  // 键盘快捷键配置 - 使用 useMemo 优化
  const shortcuts = useMemo(() => createEditorShortcuts({
    onSave: saveNow,
    onExport: () => setShowExportDialog(true),
    onTogglePreview: () => setIsPreviewMode(prev => !prev),
    onToggleFullscreen: () => setIsFullscreen(prev => !prev),
    onOpenAI: () => setShowUnifiedAI(true),
  }), [saveNow])

  // 添加滑动手势支持
  const { ...swipeHandlers } = useHorizontalSwipe(
    () => {
      // 左滑：切换到预览模式（仅在移动端且当前为编辑模式时）
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && !isPreviewMode) {
        setIsPreviewMode(true)
      }
    },
    () => {
      // 右滑：切换到编辑模式（仅在移动端且当前为预览模式时）
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && isPreviewMode) {
        setIsPreviewMode(false)
      }
    },
    {
      minSwipeDistance: 80, // 增加最小滑动距离，避免误触
      minSwipeVelocity: 0.4, // 适中的滑动速度要求
      preventDefault: false, // 不阻止默认行为，保持滚动功能
    }
  )
  // 使用键盘快捷键
  const { getShortcutHelp } = useKeyboardShortcuts(shortcuts)

  return (
      <StyleProvider>
          <TemplateStyleSync currentTemplate={currentTemplate} />
          <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 text-gray-900 flex flex-col overflow-hidden">
            {!isFullscreen && <Header />}

          {/* 主要内容区域 - 固定高度，禁止页面滚动 */}
          <main className="flex-1 flex flex-col py-4 lg:py-6 overflow-hidden min-h-0">
            {/* 顶部工具栏 */}
            <EditorToolbar
              resumeData={resumeData}
              onUpdate={setResumeData}
              isSaving={isSaving}
              hasUnsavedChanges={hasUnsavedChanges}
              lastSavedAt={lastSavedAt}
              isPreviewMode={isPreviewMode}
              onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              onShowAIAssistant={() => setShowUnifiedAI(true)}
              onShowAIConfig={() => setShowAIConfig(true)}
              onShowShortcutHelp={() => setShowShortcutHelp(true)}
              onShowTemplateSelector={() => setShowTemplateSelector(true)}
              onShowExportDialog={() => setShowExportDialog(true)}
              onExport={handleExport}
              onSave={handleSave}
            />

            {/* 编辑器和预览区域 - 使用三栏布局 */}
            <div 
              className="flex-1 flex flex-col mx-4 mt-3 sm:mx-6 lg:mx-8 overflow-hidden min-h-0"
              {...swipeHandlers}
            >
              {/* 移动端切换按钮 */}
              <div className="xl:hidden flex-shrink-0 flex items-center justify-center gap-2 px-2 sm:px-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 py-2 border-b border-gray-200">
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className={`flex-1 max-w-28 sm:max-w-32 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    !isPreviewMode 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                      : 'bg-white/50 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200/60 active:scale-95 backdrop-blur-sm'
                  }`}
                >
                  {t.common.edit}
                </button>
                <button
                  onClick={() => setIsPreviewMode(true)}
                  className={`flex-1 max-w-28 sm:max-w-32 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isPreviewMode 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                      : 'bg-white/50 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200/60 active:scale-95 backdrop-blur-sm'
                  }`}
                >
                  {t.common.preview}
                </button>
              </div>

              {/* 三栏布局 - 桌面端 (>=1280px) */}
              <div className="hidden xl:flex flex-1 min-h-0 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <ThreeColumnLayout
                  className="h-full w-full"
                  leftPanel={
                    <SectionNavigation
                      activeSection={activeSection}
                      onSectionChange={setActiveSection}
                      onShowTemplateSelector={() => setShowTemplateSelector(true)}
                    />
                  }
                  centerPanel={
                    <ResumeEditor
                      resumeData={resumeData}
                      onUpdateResumeData={handleResumeUpdate}
                      activeSection={activeSection}
                      onSectionChange={setActiveSection}
                      onShowTemplateSelector={() => setShowTemplateSelector(true)}
                      hideNavigation={true}
                    />
                  }
                  rightPanel={
                    <PreviewPanel
                      resumeData={previewData}
                      template={currentTemplate}
                      zoom={previewZoom}
                      onZoomChange={setPreviewZoom}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      onExport={handleExport}
                      isLoading={false}
                      isDarkMode={false}
                      isUpdating={isUpdating}
                    >
                      <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}>
                        <ResumePreview 
                          key={currentTemplate.id}
                          resumeData={previewData} 
                          className="resume-preview" 
                          currentTemplate={currentTemplate}
                          isExporting={isExporting}
                          onSectionClick={handlePreviewSectionClick}
                        />
                      </div>
                    </PreviewPanel>
                  }
                  defaultWidths={{ left: 15, center: 45, right: 40 }}
                  storageKey="editor-column-widths"
                />
              </div>

              {/* 双栏/单栏布局 - 平板和移动端 (<1280px) */}
              <div className="xl:hidden flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
                {/* 左侧编辑器 */}
                <div className={`${isPreviewMode ? 'hidden lg:flex' : 'flex'} flex-1 min-h-0 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex-col`}>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ResumeEditor
                      resumeData={resumeData}
                      onUpdateResumeData={handleResumeUpdate}
                      activeSection={activeSection}
                      onSectionChange={setActiveSection}
                      onShowTemplateSelector={() => setShowTemplateSelector(true)}
                    />
                  </div>
                </div>

                {/* 右侧预览 */}
                <div className={`${isPreviewMode ? 'flex' : 'hidden lg:flex'} flex-1 min-h-0 lg:w-1/2 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex-col`}>
                  <PreviewPanel
                    resumeData={previewData}
                    template={currentTemplate}
                    zoom={previewZoom}
                    onZoomChange={setPreviewZoom}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onExport={handleExport}
                    isLoading={false}
                    isDarkMode={false}
                    isUpdating={isUpdating}
                    className="h-full"
                  >
                    <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}>
                      <ResumePreview 
                        key={currentTemplate.id}
                        resumeData={previewData} 
                        className="resume-preview" 
                        currentTemplate={currentTemplate}
                        isExporting={isExporting}
                        onSectionClick={handlePreviewSectionClick}
                      />
                    </div>
                  </PreviewPanel>
                </div>
              </div>
            </div>

          </main>

        {/* 统一 AI 助手面板 */}
        {showUnifiedAI && (
          <UnifiedAIPanel
            isOpen={showUnifiedAI}
            onClose={() => setShowUnifiedAI(false)}
            resumeData={resumeData}
            onOpenAIConfig={() => setShowAIConfig(true)}
            onApplySuggestion={handleApplyAISuggestion}
            onApplyJDSuggestions={handleApplyAllJDSuggestions}
            onGenerateComplete={handleAIGenerateComplete}
          />
        )}

        {/* AI 配置弹窗 - 统一入口 */}
        <AIConfigModal
          isOpen={showAIConfig}
          onClose={() => setShowAIConfig(false)}
          onSave={handleAIConfigSave}
        />

        {/* 快捷键帮助弹窗 */}
        {showShortcutHelp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg max-w-md w-full mx-4 overflow-hidden border border-gray-200/60 transform transition-all duration-300 scale-100">
              <div className="flex items-center justify-between p-5 border-b border-gray-200/50 bg-white/50 backdrop-blur-md">
                <h3 className="text-lg font-bold text-gray-900">键盘快捷键</h3>
                <button
                  onClick={() => setShowShortcutHelp(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all p-2 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {getShortcutHelp().map((item, index) => (
                    <div key={index} className="flex items-center justify-between group p-2 hover:bg-white/50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{item.description}</span>
                      <kbd className="px-2.5 py-1 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg transition-all font-mono">
                        {item.shortcut}
                      </kbd>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    提示：在输入框中时，某些快捷键可能不会生效
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 模板选择器 - 仅在打开时渲染 */}
        {showTemplateSelector && (
          <TemplateSelector
            isOpen={showTemplateSelector}
            currentTemplate={currentTemplate.id}
            onSelectTemplate={handleTemplateSelect}
            onUpdateResumeData={(data) => {
              setResumeData(data)
            }}
            onClose={() => setShowTemplateSelector(false)}
          />
        )}
        
        {/* 导出预览对话框 - 仅在打开时渲染 */}
        {showExportDialog && (
          <ExportPreviewDialog
            isOpen={showExportDialog}
            onClose={() => setShowExportDialog(false)}
            onExport={handleExportByFormat}
            resumeName={resumeData.personalInfo.name}
            onOptionsChange={(opts) => {
              setExportOptions(opts)
            }}
          />
        )}

        {/* 导出进度指示器 */}
        <AnimatePresence>
          {isExportInProgress && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 z-50 w-80"
            >
              <ExportProgressIndicator
                progress={exportProgress.percentage}
                currentStep={exportProgress.step}
                currentPage={exportProgress.currentPage}
                totalPages={exportProgress.totalPages}
                estimatedTimeRemaining={estimatedTimeRemaining}
                cancellable={canCancel}
                onCancel={cancelExport}
                status={exportStatus}
                errorMessage={exportProgress.error}
                onRetry={() => {
                  resetExportProgress()
                  setShowExportDialog(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 数据导入导出对话框 - 仅在打开时渲染 */}
        {showImportExportDialog && (
          <ImportExportDialog
            isOpen={showImportExportDialog}
            onClose={() => setShowImportExportDialog(false)}
            resumeData={{
              personalInfo: resumeData.personalInfo,
              experience: resumeData.experience.map(exp => ({
                company: exp.company,
                position: exp.position,
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: Array.isArray(exp.description) ? exp.description.join('\n') : exp.description
              })),
              education: resumeData.education.map(edu => ({
                school: edu.school,
                degree: edu.degree,
                major: edu.major,
                startDate: edu.startDate,
                endDate: edu.endDate
              })),
              skills: resumeData.skills.map(skill => ({
                name: skill.name,
                level: skill.level
              })),
              projects: resumeData.projects.map(proj => ({
                name: proj.name,
                description: proj.description,
                technologies: proj.technologies?.join(', '),
                link: proj.url
              }))
            }}
            styleConfig={{
              colors: {
                primary: '#2563eb',
                secondary: '#4b5563',
                accent: '#3b82f6'
              },
              fontFamily: 'Inter',
              fontSize: {
                content: 14,
                title: 18,
                name: 28
              },
              spacing: {
                section: 24,
                item: 16,
                line: 22
              }
            }}
            onImport={handleDataImport}
          />
        )}

        {/* 上下文菜单 */}
        <ContextMenu
          items={contextMenuItems}
          position={contextMenuPosition}
          onClose={closeContextMenu}
          isOpen={isContextMenuOpen}
        />

        {/* 批量编辑工具栏 */}
        <BatchEditToolbar
          selectedCount={experienceSelectionCount}
          onBatchDelete={handleBatchDeleteExperiences}
          onBatchMove={handleBatchMoveExperiences}
          onBatchCopy={handleBatchCopyExperiences}
          onClearSelection={clearExperienceSelection}
          onSelectAll={() => selectAllExperiences(resumeData.experience.map(e => e.id))}
          canMoveUp={selectedExperienceIds.length > 0 && !selectedExperienceIds.includes(resumeData.experience[0]?.id)}
          canMoveDown={selectedExperienceIds.length > 0 && !selectedExperienceIds.includes(resumeData.experience[resumeData.experience.length - 1]?.id)}
        />

        {/* 确认对话框 */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        />

        {/* 全局加载遮罩 */}
        {globalLoading && (
          <LoadingOverlay
            isLoading={globalLoading}
            message={globalLoadingMessage}
            fullScreen={true}
          />
        )}

        </div>
      </StyleProvider>
  )
}
