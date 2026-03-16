/**
 * JD Matcher Service
 * 职位描述匹配服务 - 分析 JD 并优化简历内容
 * 
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-01-15
 * @updateDate 2026-01-16 - 添加行业特定术语库和关键词重要性分类
 */

import { ResumeData } from '@/types/resume'

/**
 * 关键词重要性级别
 */
export type KeywordImportance = 'required' | 'preferred' | 'niceToHave'

/**
 * 分类后的关键词接口
 */
export interface CategorizedKeywords {
  required: string[]    // 必需关键词
  preferred: string[]   // 优先关键词
  niceToHave: string[]  // 加分项
}

/**
 * JD 匹配结果接口
 */
export interface JDMatchResult {
  score: number                   // 0-100 匹配分数
  matchedKeywords: string[]       // 匹配的关键词
  missingKeywords: string[]       // 缺失的关键词
  suggestions: JDSuggestion[]     // 优化建议
  categorizedMatched?: CategorizedKeywords   // 分类后的匹配关键词
  categorizedMissing?: CategorizedKeywords   // 分类后的缺失关键词
}

/**
 * JD 优化建议接口
 */
export interface JDSuggestion {
  section: 'summary' | 'experience' | 'skills' | 'projects'
  originalText?: string
  suggestedText: string
  reason: string
  keywords: string[]
}

/**
 * 行业类型
 */
export type IndustryType = 
  | 'tech' 
  | 'finance' 
  | 'healthcare' 
  | 'marketing' 
  | 'design' 
  | 'data' 
  | 'product' 
  | 'general'

/**
 * JD 匹配服务类
 */
export class JDMatcherService {
  // ==================== 行业特定术语库 ====================
  
  // 技术/软件开发行业术语
  private techIndustryKeywords: string[] = [
    // 编程语言
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'perl', 'lua', 'dart', 'elixir', 'clojure', 'haskell',
    // 前端框架
    'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby', 'remix', 'solid.js', 'qwik', 'astro', 'preact',
    // 后端框架
    'node.js', 'express', 'nestjs', 'spring', 'spring boot', 'django', 'flask', 'fastapi', 'rails', 'laravel', 'asp.net', 'gin', 'fiber', 'koa', 'fastify',
    // 数据库
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle', 'sql server', 'dynamodb', 'cassandra', 'neo4j', 'couchdb', 'mariadb', 'cockroachdb',
    // 云服务
    'aws', 'azure', 'gcp', 'google cloud', 'aliyun', 'tencent cloud', 'heroku', 'vercel', 'netlify', 'cloudflare', 'digitalocean', 'linode',
    // DevOps
    'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab ci', 'github actions', 'terraform', 'ansible', 'ci/cd', 'helm', 'prometheus', 'grafana', 'argocd', 'circleci', 'travis ci',
    // 工具
    'git', 'webpack', 'vite', 'babel', 'eslint', 'prettier', 'jest', 'cypress', 'playwright', 'selenium', 'postman', 'swagger', 'jira', 'confluence',
    // 移动开发
    'react native', 'flutter', 'ios', 'android', 'swift ui', 'jetpack compose', 'xamarin', 'ionic', 'cordova',
    // API
    'rest api', 'graphql', 'grpc', 'websocket', 'microservices', 'api gateway', 'oauth', 'jwt', 'openapi',
    // 其他技术
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material ui', 'antd', 'chakra ui', 'styled-components'
  ]

  // 金融行业术语
  private financeIndustryKeywords: string[] = [
    'risk management', 'portfolio management', 'financial modeling', 'valuation', 'derivatives', 'fixed income', 'equity', 'hedge fund', 'private equity', 'venture capital',
    'investment banking', 'asset management', 'wealth management', 'compliance', 'regulatory', 'basel', 'ifrs', 'gaap', 'audit', 'due diligence',
    'quantitative analysis', 'algorithmic trading', 'high frequency trading', 'bloomberg', 'reuters', 'fintech', 'blockchain', 'cryptocurrency', 'defi',
    'credit analysis', 'underwriting', 'securitization', 'structured products', 'market risk', 'credit risk', 'operational risk', 'var', 'stress testing',
    'cfa', 'frm', 'cpa', 'acca', 'series 7', 'series 63', 'financial planning', 'budgeting', 'forecasting', 'p&l', 'balance sheet', 'cash flow'
  ]

  // 医疗健康行业术语
  private healthcareIndustryKeywords: string[] = [
    'clinical trials', 'fda', 'ema', 'gcp', 'gmp', 'regulatory affairs', 'pharmacovigilance', 'drug safety', 'medical affairs', 'clinical research',
    'healthcare it', 'ehr', 'emr', 'hl7', 'fhir', 'hipaa', 'telemedicine', 'digital health', 'medical devices', 'diagnostics',
    'biotechnology', 'genomics', 'proteomics', 'bioinformatics', 'drug discovery', 'pharmaceutical', 'oncology', 'immunology', 'neurology',
    'patient care', 'nursing', 'physician', 'surgeon', 'radiology', 'pathology', 'laboratory', 'quality assurance', 'sop', 'validation'
  ]

  // 市场营销行业术语
  private marketingIndustryKeywords: string[] = [
    'digital marketing', 'content marketing', 'social media marketing', 'seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'instagram', 'tiktok', 'linkedin',
    'email marketing', 'marketing automation', 'hubspot', 'salesforce', 'marketo', 'mailchimp', 'crm', 'lead generation', 'conversion optimization',
    'brand management', 'brand strategy', 'market research', 'consumer insights', 'competitive analysis', 'positioning', 'messaging', 'storytelling',
    'analytics', 'google analytics', 'data-driven', 'kpi', 'roi', 'cac', 'ltv', 'attribution', 'a/b testing', 'growth hacking',
    'public relations', 'pr', 'media relations', 'influencer marketing', 'affiliate marketing', 'partnership marketing', 'event marketing'
  ]

  // 设计行业术语
  private designIndustryKeywords: string[] = [
    'ui design', 'ux design', 'user interface', 'user experience', 'interaction design', 'visual design', 'graphic design', 'product design',
    'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'principle', 'framer', 'protopie', 'axure',
    'photoshop', 'illustrator', 'after effects', 'premiere', 'indesign', 'lightroom', 'cinema 4d', 'blender', '3d modeling',
    'design system', 'component library', 'style guide', 'wireframe', 'prototype', 'mockup', 'user research', 'usability testing',
    'typography', 'color theory', 'layout', 'responsive design', 'mobile design', 'web design', 'app design', 'branding', 'logo design'
  ]

  // 数据科学/AI 行业术语
  private dataIndustryKeywords: string[] = [
    'machine learning', 'deep learning', 'artificial intelligence', 'neural network', 'nlp', 'natural language processing', 'computer vision',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'plotly',
    'data analysis', 'data visualization', 'data engineering', 'data pipeline', 'etl', 'data warehouse', 'data lake', 'big data',
    'spark', 'hadoop', 'hive', 'kafka', 'airflow', 'dbt', 'snowflake', 'databricks', 'redshift', 'bigquery',
    'statistics', 'regression', 'classification', 'clustering', 'recommendation system', 'time series', 'forecasting', 'a/b testing',
    'llm', 'gpt', 'bert', 'transformer', 'rag', 'fine-tuning', 'prompt engineering', 'langchain', 'vector database'
  ]

  // 产品管理行业术语
  private productIndustryKeywords: string[] = [
    'product management', 'product strategy', 'product roadmap', 'product lifecycle', 'product launch', 'go-to-market', 'gtm',
    'agile', 'scrum', 'kanban', 'sprint', 'backlog', 'user story', 'acceptance criteria', 'mvp', 'iteration',
    'stakeholder management', 'cross-functional', 'prioritization', 'okr', 'kpi', 'metrics', 'north star metric',
    'customer discovery', 'user research', 'market analysis', 'competitive analysis', 'swot', 'business model', 'monetization',
    'wireframe', 'prototype', 'specification', 'prd', 'brd', 'feature request', 'feedback loop', 'customer journey'
  ]

  // 软技能关键词库
  private softSkillKeywords: string[] = [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'problem solving',
    'agile', 'scrum', 'kanban', 'project management', 'mentoring', 'coaching',
    'collaboration', 'critical thinking', 'time management', 'adaptability',
    'creativity', 'innovation', 'analytical', 'strategic thinking', 'decision making',
    'presentation', 'negotiation', 'conflict resolution', 'stakeholder management',
    '领导力', '沟通能力', '团队协作', '问题解决', '敏捷开发', '项目管理',
    '协作', '批判性思维', '时间管理', '适应能力', '创新', '分析能力'
  ]

  // 职位相关关键词
  private roleKeywords: string[] = [
    'frontend', 'backend', 'full stack', 'fullstack', 'devops', 'sre', 'data engineer',
    'data scientist', 'machine learning engineer', 'mobile developer', 'ios developer',
    'android developer', 'qa engineer', 'test engineer', 'security engineer',
    'cloud engineer', 'platform engineer', 'software engineer', 'senior', 'lead', 'principal',
    'staff engineer', 'architect', 'tech lead', 'engineering manager', 'director', 'vp',
    '前端', '后端', '全栈', '运维', '数据工程师', '数据科学家', '移动开发', '测试工程师'
  ]

  // 必需关键词指示模式
  private requiredPatterns: RegExp[] = [
    /required/i, /must have/i, /essential/i, /mandatory/i, /必须/i, /必备/i, /要求/i
  ]

  // 优先关键词指示模式
  private preferredPatterns: RegExp[] = [
    /preferred/i, /desired/i, /strong/i, /proficient/i, /优先/i, /熟练/i, /精通/i
  ]

  // 加分项关键词指示模式
  private niceToHavePatterns: RegExp[] = [
    /nice to have/i, /bonus/i, /plus/i, /advantage/i, /加分/i, /了解/i, /熟悉/i
  ]

  /**
   * 获取所有技术关键词（向后兼容）
   */
  get techKeywords(): string[] {
    return this.techIndustryKeywords
  }

  /**
   * 判断关键词是否为噪声关键词
   * 单字符英文关键词（如 "r"）会导致误匹配，这里统一过滤。
   */
  private isNoiseKeyword(keyword: string): boolean {
    const normalized = keyword.trim().toLowerCase()
    return /^[a-z]$/.test(normalized)
  }

  /**
   * 判断文本是否匹配指定关键词
   * 优先使用边界匹配，符号类关键词再用包含匹配兜底，提升稳定性。
   */
  private matchesKeyword(text: string, keyword: string): boolean {
    const normalizedKeyword = keyword.trim().toLowerCase()
    if (!normalizedKeyword || this.isNoiseKeyword(normalizedKeyword)) {
      return false
    }

    // 中文关键词不适合英文单词边界，直接走包含匹配
    if (/[\u4e00-\u9fff]/.test(normalizedKeyword)) {
      return text.includes(normalizedKeyword)
    }

    const escapedKeyword = this.escapeRegex(normalizedKeyword).replace(/\s+/g, '\\s+')
    const boundaryRegex = new RegExp(`(?:^|[^a-z0-9])${escapedKeyword}(?=$|[^a-z0-9])`, 'i')

    if (boundaryRegex.test(text)) {
      return true
    }

    // 对包含符号的关键词做兜底，兼容 "ci/cd"、"node.js"、"c++" 等写法
    const hasSymbol = /[/.+#-]/.test(normalizedKeyword)
    return hasSymbol ? text.includes(normalizedKeyword) : false
  }

  /**
   * 统计行业关键词命中数量
   * 用统一匹配规则计分，避免不同行业检测逻辑分叉。
   */
  private countIndustryKeywordMatches(text: string, keywords: string[]): number {
    return keywords.reduce((score, keyword) => {
      return score + (this.matchesKeyword(text, keyword) ? 1 : 0)
    }, 0)
  }

  /**
   * 检测 JD 文本的行业类型
   * @param jdText - 职位描述文本
   * @returns 检测到的行业类型
   */
  detectIndustry(jdText: string): IndustryType {
    const text = jdText.toLowerCase().trim()
    if (!text) {
      return 'general'
    }
    
    const industryScores: Record<IndustryType, number> = {
      tech: 0,
      finance: 0,
      healthcare: 0,
      marketing: 0,
      design: 0,
      data: 0,
      product: 0,
      general: 0
    }

    // 计算各行业关键词匹配数
    industryScores.tech = this.countIndustryKeywordMatches(text, this.techIndustryKeywords)
    industryScores.finance = this.countIndustryKeywordMatches(text, this.financeIndustryKeywords)
    industryScores.healthcare = this.countIndustryKeywordMatches(text, this.healthcareIndustryKeywords)
    industryScores.marketing = this.countIndustryKeywordMatches(text, this.marketingIndustryKeywords)
    industryScores.design = this.countIndustryKeywordMatches(text, this.designIndustryKeywords)
    industryScores.data = this.countIndustryKeywordMatches(text, this.dataIndustryKeywords)
    industryScores.product = this.countIndustryKeywordMatches(text, this.productIndustryKeywords)

    // 找出得分最高的行业
    let maxScore = 0
    let detectedIndustry: IndustryType = 'general'
    
    for (const [industry, score] of Object.entries(industryScores)) {
      if (score > maxScore) {
        maxScore = score
        detectedIndustry = industry as IndustryType
      }
    }

    return maxScore > 0 ? detectedIndustry : 'general'
  }

  /**
   * 获取行业特定关键词库
   * @param industry - 行业类型
   * @returns 关键词数组
   */
  getIndustryKeywords(industry: IndustryType): string[] {
    switch (industry) {
      case 'tech':
        return this.techIndustryKeywords
      case 'finance':
        return this.financeIndustryKeywords
      case 'healthcare':
        return this.healthcareIndustryKeywords
      case 'marketing':
        return this.marketingIndustryKeywords
      case 'design':
        return this.designIndustryKeywords
      case 'data':
        return this.dataIndustryKeywords
      case 'product':
        return this.productIndustryKeywords
      default:
        return [...this.techIndustryKeywords, ...this.softSkillKeywords]
    }
  }

  /**
   * 从 JD 文本中提取关键词
   * @param jdText - 职位描述文本
   * @returns 提取的关键词数组
   */
  extractKeywords(jdText: string): string[] {
    const text = jdText.toLowerCase().trim()
    if (!text) {
      return []
    }
    const foundKeywords = new Set<string>()

    // 检测行业并获取相关关键词库
    const industry = this.detectIndustry(jdText)
    const industryKeywords = this.getIndustryKeywords(industry)

    // 行业关键词 + 技术/数据兜底词库，降低行业误判导致的漏提取
    const candidateKeywords = new Set<string>([
      ...industryKeywords,
      ...this.techIndustryKeywords,
      ...this.dataIndustryKeywords
    ])

    // 匹配行业关键词
    candidateKeywords.forEach(keyword => {
      if (this.matchesKeyword(text, keyword)) {
        foundKeywords.add(keyword)
      }
    })

    // 匹配软技能关键词
    this.softSkillKeywords.forEach(keyword => {
      if (this.matchesKeyword(text, keyword)) {
        foundKeywords.add(keyword)
      }
    })

    // 匹配职位相关关键词
    this.roleKeywords.forEach(keyword => {
      if (this.matchesKeyword(text, keyword)) {
        foundKeywords.add(keyword)
      }
    })

    // 提取年限要求 (如 "3+ years", "5 years experience", "3年以上")
    const yearsPatterns = [
      /(\d+)\+?\s*years?/gi,
      /(\d+)\s*年[以上经验]*/gi
    ]
    yearsPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => foundKeywords.add(match.toLowerCase()))
      }
    })

    return Array.from(foundKeywords)
  }

  /**
   * 确定关键词的重要性级别
   * @param keyword - 关键词
   * @param jdText - 完整的 JD 文本
   * @returns 重要性级别
   */
  determineKeywordImportance(keyword: string, jdText: string): KeywordImportance {
    const context = this.getKeywordContext(keyword, jdText)
    
    // 检查是否在必需部分
    if (this.requiredPatterns.some(p => p.test(context))) {
      return 'required'
    }
    
    // 检查是否在优先部分
    if (this.preferredPatterns.some(p => p.test(context))) {
      return 'preferred'
    }
    
    // 检查是否在加分项部分
    if (this.niceToHavePatterns.some(p => p.test(context))) {
      return 'niceToHave'
    }
    
    // 默认根据关键词类型判断
    // 技术关键词默认为 preferred，软技能默认为 niceToHave
    if (this.techIndustryKeywords.some(tk => tk.toLowerCase() === keyword.toLowerCase()) ||
        this.dataIndustryKeywords.some(dk => dk.toLowerCase() === keyword.toLowerCase())) {
      return 'preferred'
    }
    
    return 'niceToHave'
  }

  /**
   * 获取关键词周围的上下文
   * @param keyword - 关键词
   * @param text - 完整文本
   * @returns 上下文字符串
   */
  private getKeywordContext(keyword: string, text: string): string {
    const lowerText = text.toLowerCase()
    const lowerKeyword = keyword.toLowerCase()
    const index = lowerText.indexOf(lowerKeyword)
    
    if (index === -1) return ''
    
    const start = Math.max(0, index - 150)
    const end = Math.min(text.length, index + keyword.length + 150)
    return text.slice(start, end)
  }

  /**
   * 提取并分类关键词
   * @param jdText - 职位描述文本
   * @returns 分类后的关键词
   */
  extractAndCategorizeKeywords(jdText: string): CategorizedKeywords {
    const allKeywords = this.extractKeywords(jdText)
    
    const categorized: CategorizedKeywords = {
      required: [],
      preferred: [],
      niceToHave: []
    }

    allKeywords.forEach(keyword => {
      const importance = this.determineKeywordImportance(keyword, jdText)
      categorized[importance].push(keyword)
    })

    return categorized
  }

  /**
   * 分类关键词列表
   * @param keywords - 关键词数组
   * @param jdText - JD 文本（用于确定重要性）
   * @returns 分类后的关键词
   */
  categorizeKeywords(keywords: string[], jdText: string): CategorizedKeywords {
    const categorized: CategorizedKeywords = {
      required: [],
      preferred: [],
      niceToHave: []
    }

    keywords.forEach(keyword => {
      const importance = this.determineKeywordImportance(keyword, jdText)
      categorized[importance].push(keyword)
    })

    return categorized
  }

  /**
   * 分析简历与 JD 的匹配度
   * @param resumeData - 简历数据
   * @param keywords - JD 关键词
   * @param jdText - 原始 JD 文本（可选，用于分类）
   * @returns 匹配结果
   */
  analyzeResume(resumeData: ResumeData, keywords: string[], jdText?: string): JDMatchResult {
    const resumeText = this.extractResumeText(resumeData).toLowerCase()

    const matchedKeywords: string[] = []
    const missingKeywords: string[] = []

    keywords.forEach(keyword => {
      if (this.matchesKeyword(resumeText, keyword)) {
        matchedKeywords.push(keyword)
      } else {
        missingKeywords.push(keyword)
      }
    })

    const score = this.calculateMatchScore(matchedKeywords.length, keywords.length)
    const suggestions = this.generateSuggestions(resumeData, missingKeywords)

    const result: JDMatchResult = {
      score,
      matchedKeywords,
      missingKeywords,
      suggestions
    }

    // 如果提供了 JD 文本，添加分类信息
    if (jdText) {
      result.categorizedMatched = this.categorizeKeywords(matchedKeywords, jdText)
      result.categorizedMissing = this.categorizeKeywords(missingKeywords, jdText)
    }

    return result
  }

  /**
   * 计算匹配分数
   * @param matched - 匹配的关键词数量
   * @param total - 总关键词数量
   * @returns 0-100 的匹配分数
   */
  calculateMatchScore(matched: number, total: number): number {
    if (total === 0) return 0
    const score = (matched / total) * 100
    return Math.round(Math.min(100, Math.max(0, score)))
  }

  /**
   * 生成优化建议
   * @param resumeData - 简历数据
   * @param missingKeywords - 缺失的关键词
   * @returns 优化建议数组
   */
  generateSuggestions(resumeData: ResumeData, missingKeywords: string[]): JDSuggestion[] {
    const suggestions: JDSuggestion[] = []

    // 分类缺失的关键词
    const techMissing = missingKeywords.filter(k =>
      this.techIndustryKeywords.some(tk => tk.toLowerCase() === k.toLowerCase()) ||
      this.dataIndustryKeywords.some(dk => dk.toLowerCase() === k.toLowerCase())
    )
    const softMissing = missingKeywords.filter(k =>
      this.softSkillKeywords.some(sk => sk.toLowerCase() === k.toLowerCase())
    )
    const roleMissing = missingKeywords.filter(k =>
      this.roleKeywords.some(rk => rk.toLowerCase() === k.toLowerCase())
    )

    // 技能建议
    if (techMissing.length > 0) {
      suggestions.push({
        section: 'skills',
        suggestedText: `建议添加以下技术技能: ${techMissing.join(', ')}`,
        reason: '这些技术技能在职位描述中被提及，添加它们可以提高匹配度',
        keywords: techMissing
      })
    }

    // 经验描述建议
    if (softMissing.length > 0) {
      suggestions.push({
        section: 'experience',
        suggestedText: `在工作经历中突出您的 ${softMissing.join(', ')} 能力`,
        reason: '这些软技能是雇主看重的，在工作描述中体现它们会更有说服力',
        keywords: softMissing
      })
    }

    // 个人简介建议
    if (roleMissing.length > 0 || (techMissing.length > 0 && techMissing.length <= 3)) {
      const keywordsToAdd = [...roleMissing, ...techMissing.slice(0, 3)]
      suggestions.push({
        section: 'summary',
        suggestedText: `在个人简介中提及您在 ${keywordsToAdd.join(', ')} 方面的经验`,
        reason: '个人简介是招聘者首先看到的内容，突出相关经验可以吸引注意',
        keywords: keywordsToAdd
      })
    }

    // 项目经验建议
    if (techMissing.length > 3) {
      const projectKeywords = techMissing.slice(0, 5)
      suggestions.push({
        section: 'projects',
        suggestedText: `考虑添加使用 ${projectKeywords.join(', ')} 技术的项目经验`,
        reason: '项目经验可以具体展示您的技术能力和实践经验',
        keywords: projectKeywords
      })
    }

    return suggestions
  }

  /**
   * 从简历数据中提取所有文本内容
   * @param resumeData - 简历数据
   * @returns 合并后的文本
   */
  private extractResumeText(resumeData: ResumeData): string {
    const parts: string[] = []

    // 个人信息
    if (resumeData.personalInfo) {
      parts.push(resumeData.personalInfo.summary || '')
      parts.push(resumeData.personalInfo.title || '')
    }

    // 工作经历
    if (resumeData.experience) {
      resumeData.experience.forEach(exp => {
        parts.push(exp.position || '')
        parts.push(exp.company || '')
        if (Array.isArray(exp.description)) {
          parts.push(...exp.description)
        } else if (typeof exp.description === 'string') {
          parts.push(exp.description)
        }
      })
    }

    // 技能
    if (resumeData.skills) {
      resumeData.skills.forEach(skill => {
        parts.push(skill.name || '')
        parts.push(skill.category || '')
      })
    }

    // 项目经历
    if (resumeData.projects) {
      resumeData.projects.forEach(project => {
        parts.push(project.name || '')
        parts.push(project.description || '')
        if (project.technologies) {
          parts.push(...project.technologies)
        }
        if (project.highlights) {
          parts.push(...project.highlights)
        }
      })
    }

    // 教育经历
    if (resumeData.education) {
      resumeData.education.forEach(edu => {
        parts.push(edu.school || '')
        parts.push(edu.degree || '')
        parts.push(edu.major || '')
        parts.push(edu.description || '')
      })
    }

    return parts.filter(Boolean).join(' ')
  }

  /**
   * 转义正则表达式特殊字符
   * @param str - 输入字符串
   * @returns 转义后的字符串
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * 获取匹配等级描述
   * @param score - 匹配分数
   * @returns 等级描述
   */
  getMatchLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 70) return 'high'
    if (score >= 40) return 'medium'
    return 'low'
  }
}

// 导出单例实例
export const jdMatcherService = new JDMatcherService()

export default JDMatcherService
