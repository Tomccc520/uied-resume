/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-15
 */

import { ResumeData, Skill } from '@/types/resume'

export type AISection = 'summary' | 'experience' | 'skills' | 'education' | 'projects'
export type EditorSection = 'personal' | 'experience' | 'education' | 'skills' | 'projects'

interface ApplySuggestionResult {
  nextResumeData: ResumeData
  changed: boolean
  message: string
}

/**
 * 规范化外部 section 到 AI 模块
 * 支持编辑器、预览区和历史命名的兼容映射。
 */
export function normalizeSectionToAISection(section: string): AISection {
  const normalizedMap: Record<string, AISection> = {
    personal: 'summary',
    personalInfo: 'summary',
    summary: 'summary',
    experience: 'experience',
    experiences: 'experience',
    skills: 'skills',
    skill: 'skills',
    education: 'education',
    educations: 'education',
    projects: 'projects',
    project: 'projects'
  }
  return normalizedMap[section] || 'summary'
}

/**
 * 规范化预览区 section 到编辑器模块
 * 用于“点击预览块 -> 定位编辑区”场景。
 */
export function normalizePreviewSectionToEditor(section: string): EditorSection | null {
  const normalizedMap: Record<string, EditorSection> = {
    personalInfo: 'personal',
    personal: 'personal',
    skill: 'skills',
    skills: 'skills',
    project: 'projects',
    projects: 'projects',
    experiences: 'experience',
    experience: 'experience',
    educations: 'education',
    education: 'education'
  }
  return normalizedMap[section] || null
}

/**
 * 合并 AI 生成结果到现有简历
 * 仅覆盖 AI 返回的字段，未返回字段保持不变。
 */
export function mergeGeneratedResumeData(
  resumeData: ResumeData,
  generatedData: Partial<ResumeData>
): ResumeData {
  return {
    ...resumeData,
    ...generatedData,
    personalInfo: generatedData.personalInfo
      ? { ...resumeData.personalInfo, ...generatedData.personalInfo }
      : resumeData.personalInfo,
    experience: generatedData.experience ?? resumeData.experience,
    education: generatedData.education ?? resumeData.education,
    skills: generatedData.skills ?? resumeData.skills,
    projects: generatedData.projects ?? resumeData.projects
  }
}

/**
 * 应用 AI 建议到简历
 * 将文案映射到对应模块并返回更新后的简历数据。
 */
export function applyAISuggestionToResumeData(
  resumeData: ResumeData,
  content: string,
  section: string
): ApplySuggestionResult {
  const trimmedContent = content?.trim()
  if (!trimmedContent) {
    return {
      nextResumeData: resumeData,
      changed: false,
      message: ''
    }
  }

  const aiSection = normalizeSectionToAISection(section)
  const messageMap: Record<AISection, string> = {
    summary: '个人简介已更新',
    experience: '工作经历已更新',
    skills: '专业技能已更新',
    projects: '项目经验已更新',
    education: '教育经历已更新'
  }

  const normalizedLines = trimmedContent
    .split('\n')
    .map((line) => line.replace(/^[\d\-\*\•\.\s]+/, '').trim())
    .filter(Boolean)

  if (aiSection !== 'summary' && normalizedLines.length === 0) {
    return {
      nextResumeData: resumeData,
      changed: false,
      message: ''
    }
  }

  const next: ResumeData = {
    ...resumeData,
    personalInfo: { ...resumeData.personalInfo },
    experience: resumeData.experience.map((item) => ({ ...item, description: [...item.description] })),
    education: resumeData.education.map((item) => ({ ...item })),
    skills: resumeData.skills.map((item) => ({ ...item })),
    projects: resumeData.projects.map((item) => ({
      ...item,
      technologies: [...item.technologies],
      highlights: [...item.highlights]
    }))
  }

  switch (aiSection) {
    case 'summary': {
      next.personalInfo.summary = trimmedContent
      break
    }
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
          const newSkill: Skill = {
            id: `skill-${Date.now()}-${index}`,
            name: normalized,
            level: 75,
            category: '技术技能'
          }
          existingSkillMap.set(key, newSkill)
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

  return {
    nextResumeData: next,
    changed: true,
    message: messageMap[aiSection]
  }
}

