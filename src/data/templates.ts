/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 * @updateDate 2026-01-31 - 优化模板设计，精选6个高质量模板
 * @description 简历模板配置 - 精选实用模板
 */

import { TemplateStyle, TemplateCategory } from '@/types/template'

/**
 * 预定义简历模板 - 实用黑白简历
 * 2026.2.2 更新：专注于不同的布局类型，黑白灰配色，突出内容
 */
export const resumeTemplates: TemplateStyle[] = [
  // 1. 经典居中 - ATS友好 ⭐ 最推荐
  {
    id: 'minimal-text',
    name: '经典居中',
    nameEn: 'Classic Centered',
    description: '经典衬线排版，兼顾 ATS 友好与视觉质感',
    descriptionEn: 'Editorial serif layout with ATS-friendly structure',
    preview: '/templates/minimal-text.svg',
    category: 'general',
    subCategory: 'minimal',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['ATS友好', '居中对齐', '投递首选'],
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#b7791f',
      text: '#0f172a',
      background: '#ffffff'
    },
    fonts: {
      heading: '"Merriweather", "Times New Roman", Georgia, serif',
      body: '"Merriweather", "Times New Roman", Georgia, serif',
      size: { heading: '1.625rem', body: '0.9rem', small: '0.78rem' }
    },
    layout: {
      margins: { top: '2.75rem', right: '2.75rem', bottom: '2.75rem', left: '2.75rem' },
      columns: { count: 1, gap: '1.5rem' },
      spacing: { section: '1.75rem', item: '0.85rem', line: '1.6rem' }
    },
    components: {
      personalInfo: { layout: 'center', showAvatar: true, avatarPosition: 'center', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'none', indentation: '0' },
      dateFormat: { format: 'YYYY.MM', position: 'inline' }
    }
  },
  
  // 2. 商务表格 - 信息密集 ⭐ 推荐
  {
    id: 'table-layout',
    name: '商务表格',
    nameEn: 'Business Table',
    description: '表格式布局，信息密集，适合传统行业',
    descriptionEn: 'Table layout, information-dense, for traditional industries',
    preview: '/templates/table-layout.svg',
    category: 'general',
    subCategory: 'classic',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['表格', '信息密集', '传统行业'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff',
      tableBg: '#f5f5f5',
      borderColor: '#cccccc'
    },
    fonts: {
      heading: '"Microsoft YaHei", "PingFang SC", sans-serif',
      body: '"Microsoft YaHei", "PingFang SC", sans-serif',
      size: { heading: '1.375rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '2rem', right: '2rem', bottom: '2rem', left: '2rem' },
      columns: { count: 1, gap: '1.5rem' },
      spacing: { section: '1.5rem', item: '0.5rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'table', showAvatar: true, avatarPosition: 'right', avatarShape: 'square', avatarBorderRadius: 8, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'background', alignment: 'left' },
      listItem: { bulletStyle: 'none', indentation: '0' },
      dateFormat: { format: 'YYYY.MM', position: 'inline' },
      tableStyle: true
    }
  },
  
  // 3. 现代时间轴 - 职业发展清晰
  {
    id: 'timeline-layout',
    name: '现代时间轴',
    nameEn: 'Modern Timeline',
    description: '标准时间轴结构，突出工作经历与项目成果，适合大多数岗位投递',
    descriptionEn: 'Standard timeline structure focused on work history and project outcomes',
    preview: '/templates/timeline-layout.svg',
    category: 'general',
    subCategory: 'modern',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['时间轴', '标准结构', '投递友好'],
    colors: {
      primary: '#0f172a',
      secondary: '#64748b',
      accent: '#2563eb',
      text: '#0f172a',
      background: '#ffffff',
      timelineBg: '#d1d5db'
    },
    fonts: {
      heading: '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif',
      body: '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '2.25rem', right: '2.25rem', bottom: '2.25rem', left: '2.25rem' },
      columns: { count: 1, gap: '2rem' },
      spacing: { section: '1.8rem', item: '1.1rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'horizontal', showAvatar: true, avatarPosition: 'left', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'timeline', indentation: '2rem' },
      dateFormat: { format: 'YYYY.MM', position: 'left' }
    }
  },

  // 4. 标准双栏 - 左侧信息栏 ⭐ 推荐
  {
    id: 'two-column-standard',
    name: '标准双栏',
    nameEn: 'Two Column',
    description: '深色侧栏 + 浅色主区，信息层级清晰，视觉更现代',
    descriptionEn: 'Dark sidebar with light content zone for modern hierarchy',
    preview: '/templates/two-column-standard.svg',
    category: 'general',
    subCategory: 'modern',
    isPremium: false,
    layoutType: 'left-right',
    tags: ['双栏', '专业', '大气'],
    colors: {
      primary: '#0f172a',
      secondary: '#64748b',
      accent: '#0ea5a4',
      text: '#1e293b',
      background: '#f8fafc',
      sidebarBg: '#10233f'
    },
    fonts: {
      heading: '"Manrope", "PingFang SC", "Hiragino Sans GB", sans-serif',
      body: '"Manrope", "PingFang SC", "Hiragino Sans GB", sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.76rem' }
    },
    layout: {
      margins: { top: '0', right: '0', bottom: '0', left: '0' },
      columns: { count: 2, gap: '0', leftWidth: '32%', rightWidth: '68%' },
      spacing: { section: '1.8rem', item: '1rem', line: '1.35rem' },
      padding: 36
    },
    components: {
      personalInfo: { layout: 'vertical', showAvatar: true, avatarPosition: 'center', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'dot', indentation: '1rem' },
      dateFormat: { format: 'YYYY.MM', position: 'right' }
    }
  },

  // 5. 简约分隔 - 清晰分隔
  {
    id: 'divider-layout',
    name: '简约分隔',
    nameEn: 'Simple Divider',
    description: '粗分隔线分隔章节，层次清晰，简洁大方',
    descriptionEn: 'Bold dividers separate sections, clear and elegant',
    preview: '/templates/divider-layout.svg',
    category: 'general',
    subCategory: 'classic',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['分隔线', '层次清晰', '简约'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff',
      dividerColor: '#000000'
    },
    fonts: {
      heading: 'Inter, -apple-system, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '2.5rem', right: '2.5rem', bottom: '2.5rem', left: '2.5rem' },
      columns: { count: 1, gap: '1.5rem' },
      spacing: { section: '1.75rem', item: '1rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'horizontal', showAvatar: true, avatarPosition: 'left', avatarShape: 'square', avatarBorderRadius: 10, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'underline', alignment: 'left' },
      listItem: { bulletStyle: 'square', indentation: '1rem' },
      dateFormat: { format: 'YYYY.MM', position: 'right' }
    }
  },

  // 6. 高效紧凑 - 信息密度高
  {
    id: 'compact-layout',
    name: '高效紧凑',
    nameEn: 'Efficient Compact',
    description: '紧凑排版，信息密度高，适合经验丰富者',
    descriptionEn: 'Compact layout, high density, for experienced professionals',
    preview: '/templates/compact-layout.svg',
    category: 'general',
    subCategory: 'minimal',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['紧凑', '高密度', '经验丰富'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Inter, -apple-system, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      size: { heading: '1.375rem', body: '0.8125rem', small: '0.6875rem' }
    },
    layout: {
      margins: { top: '1.5rem', right: '2rem', bottom: '1.5rem', left: '2rem' },
      columns: { count: 1, gap: '1rem' },
      spacing: { section: '1.25rem', item: '0.625rem', line: '1.3rem' }
    },
    components: {
      personalInfo: { layout: 'horizontal', showAvatar: true, avatarPosition: 'left', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'dot', indentation: '0.75rem' },
      dateFormat: { format: 'YYYY.MM', position: 'inline' }
    }
  },

  // 7. 创意卡片 - 视觉突出
  {
    id: 'card-layout',
    name: '创意卡片',
    nameEn: 'Creative Card',
    description: '标准卡片分区，信息清晰，适合互联网与通用岗位',
    descriptionEn: 'Standard card sections with clear hierarchy for general applications',
    preview: '/templates/card-layout.svg',
    category: 'general',
    subCategory: 'creative',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['卡片分区', '信息清晰', '通用岗位'],
    colors: {
      primary: '#0f172a',
      secondary: '#64748b',
      accent: '#0f766e',
      text: '#0f172a',
      background: '#ffffff',
      cardBg: '#f8fafc',
      cardBorder: '#cbd5e1'
    },
    fonts: {
      heading: '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif',
      body: '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '2rem', right: '2rem', bottom: '2rem', left: '2rem' },
      columns: { count: 1, gap: '1.5rem' },
      spacing: { section: '1.5rem', item: '0.95rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'horizontal', showAvatar: true, avatarPosition: 'left', avatarShape: 'square', avatarBorderRadius: 10, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'background', alignment: 'left' },
      listItem: { bulletStyle: 'none', indentation: '0' },
      dateFormat: { format: 'YYYY.MM', position: 'right' },
      cardStyle: true
    }
  },

  // 8. 网格布局 - 技能展示
  {
    id: 'grid-layout',
    name: '网格布局',
    nameEn: 'Grid Layout',
    description: '网格式排版，适合展示多项技能和项目',
    descriptionEn: 'Grid-based layout, ideal for showcasing skills and projects',
    preview: '/templates/grid-layout.svg',
    category: 'general',
    subCategory: 'modern',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['网格', '技能展示', '现代'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff',
      gridBg: '#f8f9fa'
    },
    fonts: {
      heading: 'Inter, -apple-system, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '2rem', right: '2rem', bottom: '2rem', left: '2rem' },
      columns: { count: 1, gap: '1.5rem' },
      spacing: { section: '1.75rem', item: '1rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'center', showAvatar: true, avatarPosition: 'center', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'none', indentation: '0' },
      dateFormat: { format: 'YYYY.MM', position: 'inline' },
      skillDisplay: 'grid'
    }
  },

  // 9. 左右对称 - 平衡美观
  {
    id: 'symmetric-layout',
    name: '左右对称',
    nameEn: 'Symmetric Layout',
    description: '左右对称设计，平衡美观，适合设计类岗位',
    descriptionEn: 'Symmetric design, balanced and elegant, for design positions',
    preview: '/templates/symmetric-layout.svg',
    category: 'designer',
    subCategory: 'creative',
    isPremium: false,
    layoutType: 'left-right',
    tags: ['对称', '美观', '设计'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Inter, -apple-system, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '2rem', right: '2rem', bottom: '2rem', left: '2rem' },
      columns: { count: 2, gap: '2rem', leftWidth: '50%', rightWidth: '50%' },
      spacing: { section: '1.75rem', item: '1rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'center', showAvatar: true, avatarPosition: 'center', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'dot', indentation: '1rem' },
      dateFormat: { format: 'YYYY.MM', position: 'right' }
    }
  },

  // 10. 侧边时间轴 - 创新布局
  {
    id: 'sidebar-timeline',
    name: '侧边时间轴',
    nameEn: 'Sidebar Timeline',
    description: '左侧时间轴设计，创新布局，突出时间线',
    descriptionEn: 'Left sidebar timeline, innovative layout, highlights timeline',
    preview: '/templates/sidebar-timeline.svg',
    category: 'general',
    subCategory: 'modern',
    isPremium: false,
    layoutType: 'left-right',
    tags: ['时间轴', '创新', '侧边栏'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff',
      sidebarBg: '#f8f9fa'
    },
    fonts: {
      heading: 'Inter, -apple-system, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '0', right: '0', bottom: '0', left: '0' },
      columns: { count: 2, gap: '0', leftWidth: '25%', rightWidth: '75%' },
      spacing: { section: '1.75rem', item: '1rem', line: '1.5rem' },
      padding: 40
    },
    components: {
      personalInfo: { layout: 'vertical', showAvatar: true, avatarPosition: 'center', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'timeline', indentation: '1.5rem' },
      dateFormat: { format: 'YYYY.MM', position: 'left' }
    }
  },

  // 11. 简历横幅 - 顶部突出
  {
    id: 'banner-layout',
    name: '简历横幅',
    nameEn: 'Banner Layout',
    description: '顶部信息栏 + 标准正文分区，简洁专业，适合在线投递',
    descriptionEn: 'Top info header with standard sections, clean and professional',
    preview: '/templates/banner-layout.svg',
    category: 'general',
    subCategory: 'modern',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['清晰头部', '标准结构', 'ATS友好'],
    colors: {
      primary: '#0f172a',
      secondary: '#64748b',
      accent: '#2563eb',
      text: '#0f172a',
      background: '#ffffff',
      bannerBg: '#f1f5f9'
    },
    fonts: {
      heading: '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif',
      body: '"Inter", "PingFang SC", "Hiragino Sans GB", sans-serif',
      size: { heading: '1.68rem', body: '0.88rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '0', right: '2rem', bottom: '2rem', left: '2rem' },
      columns: { count: 1, gap: '1.5rem' },
      spacing: { section: '1.75rem', item: '0.95rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'banner', showAvatar: true, avatarPosition: 'left', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'plain', alignment: 'left' },
      listItem: { bulletStyle: 'dot', indentation: '1rem' },
      dateFormat: { format: 'YYYY.MM', position: 'right' }
    }
  },

  // 12. 极简线条 - 线条美学
  {
    id: 'line-minimal',
    name: '极简线条',
    nameEn: 'Line Minimal',
    description: '细线条装饰，极简美学，适合追求简约的求职者',
    descriptionEn: 'Thin line decoration, minimal aesthetics, for minimalists',
    preview: '/templates/line-minimal.svg',
    category: 'general',
    subCategory: 'minimal',
    isPremium: false,
    layoutType: 'top-bottom',
    tags: ['线条', '极简', '美学'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff',
      lineColor: '#e5e5e5'
    },
    fonts: {
      heading: 'Inter, -apple-system, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      size: { heading: '1.5rem', body: '0.875rem', small: '0.75rem' }
    },
    layout: {
      margins: { top: '2.5rem', right: '2.5rem', bottom: '2.5rem', left: '2.5rem' },
      columns: { count: 1, gap: '1.5rem' },
      spacing: { section: '1.75rem', item: '1rem', line: '1.5rem' }
    },
    components: {
      personalInfo: { layout: 'horizontal', showAvatar: true, avatarPosition: 'left', avatarShape: 'circle', avatarBorderRadius: 50, defaultAvatar: '/avatars/img1.png' },
      sectionTitle: { style: 'border', alignment: 'left' },
      listItem: { bulletStyle: 'dash', indentation: '1rem' },
      dateFormat: { format: 'YYYY.MM', position: 'right' }
    }
  }

]

/**
 * 职业分类配置 - 简化版
 */
export const careerCategories = [
  {
    id: 'general',
    name: '通用模板',
    nameEn: 'General',
    icon: 'FileText',
    subCategories: [
      { id: 'modern', name: '现代风格', nameEn: 'Modern' },
      { id: 'classic', name: '经典风格', nameEn: 'Classic' },
      { id: 'minimal', name: '极简风格', nameEn: 'Minimal' }
    ]
  },
  {
    id: 'designer',
    name: '设计创意',
    nameEn: 'Design & Creative',
    icon: 'Palette',
    subCategories: [
      { id: 'minimal', name: '极简设计', nameEn: 'Minimal Design' },
      { id: 'creative', name: '创意设计', nameEn: 'Creative Design' }
    ]
  }
]

/**
 * 模板分类（按职业岗位）
 */
export const templateCategories: TemplateCategory[] = careerCategories.map(career => ({
  id: career.id,
  name: career.name,
  nameEn: career.nameEn,
  description: `适合${career.name}岗位的简历模板`,
  descriptionEn: `Resume templates for ${career.nameEn} positions`,
  icon: career.icon,
  templates: resumeTemplates.filter(t => t.category === career.id && !t.hidden)
}))

/**
 * 获取默认模板
 */
export const getDefaultTemplate = (): TemplateStyle => {
  return resumeTemplates.find(t => t.id === 'two-column-standard') || resumeTemplates[0]
}

/**
 * 根据ID获取模板
 */
export const getTemplateById = (id: string): TemplateStyle | undefined => {
  return resumeTemplates.find(t => t.id === id)
}

/**
 * 获取免费模板（排除隐藏）
 */
export const getFreeTemplates = (): TemplateStyle[] => {
  return resumeTemplates.filter(t => !t.isPremium && !t.hidden)
}

/**
 * 获取高级模板（排除隐藏）
 */
export const getPremiumTemplates = (): TemplateStyle[] => {
  return resumeTemplates.filter(t => t.isPremium && !t.hidden)
}

/**
 * 流行模板ID列表
 */
export const popularTemplateIds = [
  'two-column-standard',
  'minimal-text',
  'table-layout',
  'timeline-layout',
  'divider-layout',
  'compact-layout',
  'card-layout',
  'grid-layout',
  'banner-layout',
  'line-minimal'
]

/**
 * 有效的模板分类（职业类型）
 */
export const VALID_CATEGORIES = ['designer', 'general'] as const
export type ValidCategory = typeof VALID_CATEGORIES[number]

/**
 * 获取可用模板（排除隐藏模板）
 */
export const getAvailableTemplates = (): TemplateStyle[] => {
  return resumeTemplates.filter(t => !t.hidden)
}

/**
 * 按分类获取可用模板
 */
export const getTemplatesByCategory = (category: string): TemplateStyle[] => {
  return resumeTemplates.filter(t => t.category === category && !t.hidden)
}

/**
 * 按子分类获取模板
 */
export const getTemplatesBySubCategory = (subCategory: string): TemplateStyle[] => {
  return resumeTemplates.filter(t => t.subCategory === subCategory && !t.hidden)
}

/**
 * 获取按分类组织的模板
 */
export const getTemplatesGroupedByCategory = (): Record<string, TemplateStyle[]> => {
  const templates = getAvailableTemplates()
  return templates.reduce((acc, template) => {
    const category = template.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(template)
    return acc
  }, {} as Record<string, TemplateStyle[]>)
}

/**
 * 获取职业分类信息
 */
export const getCareerCategory = (categoryId: string) => {
  return careerCategories.find(c => c.id === categoryId)
}

/**
 * 获取子分类信息
 */
export const getSubCategory = (categoryId: string, subCategoryId: string) => {
  const career = careerCategories.find(c => c.id === categoryId)
  return career?.subCategories.find(s => s.id === subCategoryId)
}
