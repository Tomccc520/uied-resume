/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 */

/**
 * 个人信息接口
 */
export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  contactQRCode?: string
  summary: string
  avatar?: string  // 添加头像字段
  avatarBorderRadius?: number  // 头像圆角半径 (0-50)
}

/**
 * 工作经历接口
 */
export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
  location?: string
}

/**
 * 教育经历接口
 */
export interface Education {
  id: string
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

/**
 * 技能接口
 */
export interface Skill {
  id: string
  name: string
  level: number  // 改为数字类型，表示百分比 0-100
  category: string
  color?: string // 技能标签颜色
}

/**
 * 项目经历接口
 */
export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  date?: string
  url?: string
  highlights: string[]
}

/**
 * 证书接口
 */
export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  description?: string
}

/**
 * 语言能力接口
 */
export interface LanguageSkill {
  id: string
  name: string
  level: string
}

/**
 * 奖项接口
 */
export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

/**
 * 完整简历数据接口
 */
export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications?: Certification[]
  languages?: LanguageSkill[]
  awards?: Award[]
}

/**
 * 简历主题接口
 */
export interface ResumeTheme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  layout: 'classic' | 'modern' | 'creative'
}
