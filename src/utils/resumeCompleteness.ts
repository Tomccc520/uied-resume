/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-16
 */

import { ResumeData } from '@/types/resume'

export type ResumeSectionId = 'personal' | 'experience' | 'education' | 'skills' | 'projects'

export interface SectionCompleteness {
  section: ResumeSectionId
  completed: boolean
  score: number
}

export interface ResumeCompletenessResult {
  totalScore: number
  completedSections: number
  totalSections: number
  nextIncompleteSection: ResumeSectionId | null
  sections: SectionCompleteness[]
}

/**
 * 计算个人信息完成度
 * 重点字段权重更高，保证评分更贴近招聘投递场景。
 */
function calculatePersonalScore(resumeData: ResumeData): number {
  const { personalInfo } = resumeData
  const checks = [
    { valid: Boolean(personalInfo.name.trim()), weight: 25 },
    { valid: Boolean(personalInfo.title.trim()), weight: 20 },
    { valid: Boolean(personalInfo.email.trim()), weight: 15 },
    { valid: Boolean(personalInfo.phone.trim()), weight: 15 },
    { valid: Boolean(personalInfo.summary.trim()), weight: 25 }
  ]
  return checks.reduce((sum, item) => sum + (item.valid ? item.weight : 0), 0)
}

/**
 * 计算工作经历完成度
 * 关注“至少有一条高质量经历”而不是纯数量。
 */
function calculateExperienceScore(resumeData: ResumeData): number {
  if (resumeData.experience.length === 0) return 0
  const qualityItems = resumeData.experience.filter((item) => {
    const hasBasic = Boolean(item.company.trim()) && Boolean(item.position.trim())
    const hasDescription = item.description.some((line) => line.trim().length > 10)
    return hasBasic && hasDescription
  })
  const ratio = Math.min(1, qualityItems.length / Math.max(1, resumeData.experience.length))
  return Math.round(100 * ratio)
}

/**
 * 计算教育经历完成度
 */
function calculateEducationScore(resumeData: ResumeData): number {
  if (resumeData.education.length === 0) return 0
  const qualityItems = resumeData.education.filter(
    (item) => Boolean(item.school.trim()) && Boolean(item.degree.trim()) && Boolean(item.major.trim())
  )
  const ratio = Math.min(1, qualityItems.length / Math.max(1, resumeData.education.length))
  return Math.round(100 * ratio)
}

/**
 * 计算技能模块完成度
 * 推荐至少 3 个有效技能，支持快速投递场景。
 */
function calculateSkillsScore(resumeData: ResumeData): number {
  const validSkills = resumeData.skills.filter((item) => item.name.trim().length > 1)
  if (validSkills.length === 0) return 0
  const capped = Math.min(3, validSkills.length)
  return Math.round((capped / 3) * 100)
}

/**
 * 计算项目模块完成度
 */
function calculateProjectsScore(resumeData: ResumeData): number {
  if (resumeData.projects.length === 0) return 0
  const qualityItems = resumeData.projects.filter(
    (item) => Boolean(item.name.trim()) && Boolean(item.description.trim())
  )
  const ratio = Math.min(1, qualityItems.length / Math.max(1, resumeData.projects.length))
  return Math.round(100 * ratio)
}

/**
 * 计算简历整体完成度
 * 返回模块级别与整体评分，便于编辑器做进度提示与跳转。
 */
export function calculateResumeCompleteness(resumeData: ResumeData): ResumeCompletenessResult {
  const sectionScores: Array<{ section: ResumeSectionId; score: number }> = [
    { section: 'personal', score: calculatePersonalScore(resumeData) },
    { section: 'experience', score: calculateExperienceScore(resumeData) },
    { section: 'education', score: calculateEducationScore(resumeData) },
    { section: 'skills', score: calculateSkillsScore(resumeData) },
    { section: 'projects', score: calculateProjectsScore(resumeData) }
  ]

  const sections: SectionCompleteness[] = sectionScores.map((item) => ({
    section: item.section,
    score: item.score,
    completed: item.score >= 80
  }))

  const totalScore = Math.round(
    sections.reduce((sum, item) => sum + item.score, 0) / Math.max(1, sections.length)
  )

  const completedSections = sections.filter((item) => item.completed).length
  const nextIncompleteSection = sections.find((item) => !item.completed)?.section ?? null

  return {
    totalScore,
    completedSections,
    totalSections: sections.length,
    nextIncompleteSection,
    sections
  }
}

export default calculateResumeCompleteness
