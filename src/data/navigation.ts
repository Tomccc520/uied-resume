import { User, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

export const navigationItems = [
  {
    id: 'personal',
    label: '个人信息',
    icon: User,
    description: '基本信息和联系方式'
  },
  {
    id: 'experience',
    label: '工作经历',
    icon: Briefcase,
    description: '工作经验和职业发展'
  },
  {
    id: 'education',
    label: '教育背景',
    icon: GraduationCap,
    description: '学历和教育经历'
  },
  {
    id: 'skills',
    label: '技能专长',
    icon: Code,
    description: '专业技能和能力'
  },
  {
    id: 'projects',
    label: '项目经历',
    icon: FolderOpen,
    description: '项目作品和成果'
  }
]
