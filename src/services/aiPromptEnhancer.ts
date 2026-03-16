/**
 * AI提示词增强服务
 * 根据用户输入和上下文智能生成更精准的AI提示词
 * 
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-01-27
 */

import { ResumeData } from '@/types/resume'

/**
 * 用户意图类型
 */
export type UserIntent = 
  | 'optimize' // 优化现有内容
  | 'expand' // 扩展内容
  | 'quantify' // 添加量化数据
  | 'highlight' // 突出重点
  | 'simplify' // 简化表达
  | 'professional' // 提升专业性
  | 'creative' // 创意表达
  | 'technical' // 技术深度
  | 'general' // 通用优化

/**
 * 上下文信息接口
 */
interface ContextInfo {
  sectionType: 'summary' | 'experience' | 'skills' | 'education' | 'projects'
  currentContent?: string
  resumeData?: ResumeData
  targetPosition?: string
  industry?: string
  experienceLevel?: string
}

/**
 * AI提示词增强服务类
 */
export class AIPromptEnhancer {
  /**
   * 检测用户意图
   * 根据用户输入的关键词判断用户想要做什么
   */
  detectIntent(userPrompt: string): UserIntent {
    const prompt = userPrompt.toLowerCase()
    
    // 优化意图
    if (prompt.includes('优化') || prompt.includes('改进') || prompt.includes('提升') || 
        prompt.includes('optimize') || prompt.includes('improve') || prompt.includes('enhance')) {
      return 'optimize'
    }
    
    // 扩展意图
    if (prompt.includes('扩展') || prompt.includes('详细') || prompt.includes('补充') ||
        prompt.includes('expand') || prompt.includes('elaborate') || prompt.includes('detail')) {
      return 'expand'
    }
    
    // 量化意图
    if (prompt.includes('量化') || prompt.includes('数据') || prompt.includes('数字') ||
        prompt.includes('quantify') || prompt.includes('metrics') || prompt.includes('numbers')) {
      return 'quantify'
    }
    
    // 突出重点意图
    if (prompt.includes('突出') || prompt.includes('强调') || prompt.includes('重点') ||
        prompt.includes('highlight') || prompt.includes('emphasize') || prompt.includes('focus')) {
      return 'highlight'
    }
    
    // 简化意图
    if (prompt.includes('简化') || prompt.includes('精简') || prompt.includes('简洁') ||
        prompt.includes('simplify') || prompt.includes('concise') || prompt.includes('brief')) {
      return 'simplify'
    }
    
    // 专业性意图
    if (prompt.includes('专业') || prompt.includes('正式') || prompt.includes('规范') ||
        prompt.includes('professional') || prompt.includes('formal')) {
      return 'professional'
    }
    
    // 创意意图
    if (prompt.includes('创意') || prompt.includes('新颖') || prompt.includes('独特') ||
        prompt.includes('creative') || prompt.includes('unique') || prompt.includes('innovative')) {
      return 'creative'
    }
    
    // 技术深度意图
    if (prompt.includes('技术') || prompt.includes('深度') || prompt.includes('架构') ||
        prompt.includes('technical') || prompt.includes('architecture') || prompt.includes('in-depth')) {
      return 'technical'
    }
    
    return 'general'
  }

  /**
   * 增强用户提示词
   * 根据上下文和意图生成更精准的提示词
   */
  enhancePrompt(userPrompt: string, context: ContextInfo): string {
    const intent = this.detectIntent(userPrompt)
    const { sectionType, currentContent, targetPosition, industry, experienceLevel } = context
    
    // 构建上下文信息
    let contextStr = ''
    if (targetPosition) {
      contextStr += `目标职位：${targetPosition}\n`
    }
    if (industry) {
      contextStr += `所在行业：${industry}\n`
    }
    if (experienceLevel) {
      const levelMap: Record<string, string> = {
        'junior': '初级（0-2年）',
        'mid': '中级（3-5年）',
        'senior': '高级（5-8年）',
        'lead': '资深（8年以上）'
      }
      contextStr += `经验水平：${levelMap[experienceLevel] || experienceLevel}\n`
    }
    
    // 根据意图生成增强提示词
    let enhancedPrompt = ''
    
    switch (intent) {
      case 'optimize':
        enhancedPrompt = this.buildOptimizePrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      case 'expand':
        enhancedPrompt = this.buildExpandPrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      case 'quantify':
        enhancedPrompt = this.buildQuantifyPrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      case 'highlight':
        enhancedPrompt = this.buildHighlightPrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      case 'simplify':
        enhancedPrompt = this.buildSimplifyPrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      case 'professional':
        enhancedPrompt = this.buildProfessionalPrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      case 'creative':
        enhancedPrompt = this.buildCreativePrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      case 'technical':
        enhancedPrompt = this.buildTechnicalPrompt(userPrompt, sectionType, currentContent, contextStr)
        break
      default:
        enhancedPrompt = this.buildGeneralPrompt(userPrompt, sectionType, currentContent, contextStr)
    }
    
    return enhancedPrompt
  }

  /**
   * 构建优化提示词
   */
  private buildOptimizePrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    const sectionGuides: Record<string, string> = {
      summary: '使用STAR法则重新组织内容，突出核心竞争力和量化成果',
      experience: '使用动作词开头，添加具体的量化数据和业务影响',
      skills: '按重要性和熟练程度重新排序，添加具体应用场景',
      education: '突出学术成就、相关课程和实践经历',
      projects: '强调技术难点、创新点和项目成果'
    }
    
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

优化要求：
${userPrompt}

优化指导：
${sectionGuides[sectionType] || '全面优化内容质量和表达'}

请生成5个优化后的版本，每个版本风格不同，都要包含具体的量化数据和成果。`
  }

  /**
   * 构建扩展提示词
   */
  private buildExpandPrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

扩展要求：
${userPrompt}

扩展方向：
1. 添加更多具体细节和背景信息
2. 补充量化数据和成果指标
3. 说明使用的方法和技术
4. 体现个人贡献和影响力
5. 增加相关的技能和经验

请生成5个扩展后的版本，内容更加丰富和具体。`
  }

  /**
   * 构建量化提示词
   */
  private buildQuantifyPrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

量化要求：
${userPrompt}

量化指标示例：
- 性能提升：页面加载速度提升40%、响应时间减少60%
- 业务影响：用户增长30%、转化率提升25%、GMV增长200%
- 规模数据：日活10万+、处理100万+请求、管理15人团队
- 效率提升：开发效率提升50%、部署时间缩短70%
- 成本节省：服务器成本降低30%、人力成本节省20%

请生成5个版本，每个版本都包含丰富的量化数据。`
  }

  /**
   * 构建突出重点提示词
   */
  private buildHighlightPrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

突出重点：
${userPrompt}

重点突出策略：
1. 将最重要的成就放在最前面
2. 使用强有力的动作词和形容词
3. 添加具体的量化数据支撑
4. 突出与目标职位最相关的技能和经验
5. 强调独特的价值和贡献

请生成5个版本，每个版本都清晰突出核心亮点。`
  }

  /**
   * 构建简化提示词
   */
  private buildSimplifyPrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

简化要求：
${userPrompt}

简化原则：
1. 删除冗余和重复的内容
2. 使用简洁有力的表达
3. 保留最重要的信息和数据
4. 每句话都要有价值
5. 控制在合适的字数范围内

请生成5个简化后的版本，简洁但不失重点。`
  }

  /**
   * 构建专业性提示词
   */
  private buildProfessionalPrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

专业化要求：
${userPrompt}

专业化标准：
1. 使用行业标准术语和专业表达
2. 采用正式的商务写作风格
3. 突出专业能力和职业素养
4. 体现系统性思维和方法论
5. 展现专业的问题解决能力

请生成5个专业化的版本，体现高度的职业素养。`
  }

  /**
   * 构建创意提示词
   */
  private buildCreativePrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

创意要求：
${userPrompt}

创意方向：
1. 使用新颖独特的表达方式
2. 从不同角度展示个人价值
3. 讲述有吸引力的职业故事
4. 突出创新思维和解决方案
5. 展现个人特色和差异化优势

请生成5个富有创意的版本，让人眼前一亮。`
  }

  /**
   * 构建技术深度提示词
   */
  private buildTechnicalPrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

技术深度要求：
${userPrompt}

技术深度展示：
1. 详细说明使用的技术栈和架构
2. 解释技术选型的原因和考量
3. 描述解决的技术难点和挑战
4. 展示对技术原理的深入理解
5. 体现技术创新和最佳实践

请生成5个版本，充分展现技术深度和专业能力。`
  }

  /**
   * 构建通用提示词
   */
  private buildGeneralPrompt(userPrompt: string, sectionType: string, currentContent?: string, context?: string): string {
    return `${context ? context + '\n' : ''}当前内容：
${currentContent || '无'}

用户需求：
${userPrompt}

优化方向：
1. 提升内容质量和专业性
2. 添加具体的量化数据
3. 突出核心竞争力和亮点
4. 优化表达方式和结构
5. 确保与目标职位匹配

请生成5个优化后的版本，全面提升简历质量。`
  }

  /**
   * 提取关键信息
   * 从简历数据中提取有用的上下文信息
   */
  extractKeyInfo(resumeData: ResumeData): {
    targetPosition?: string
    industry?: string
    experienceLevel?: string
    keySkills: string[]
    yearsOfExperience?: number
  } {
    const keySkills: string[] = []
    
    // 提取技能
    if (resumeData.skills && resumeData.skills.length > 0) {
      resumeData.skills.forEach(skill => {
        keySkills.push(skill.name)
      })
    }
    
    // 计算工作年限
    let yearsOfExperience = 0
    if (resumeData.experience && resumeData.experience.length > 0) {
      resumeData.experience.forEach(exp => {
        const start = new Date(exp.startDate)
        const end = exp.current ? new Date() : new Date(exp.endDate)
        const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
        yearsOfExperience += years
      })
    }
    
    // 推断经验水平
    let experienceLevel = 'mid'
    if (yearsOfExperience < 2) {
      experienceLevel = 'junior'
    } else if (yearsOfExperience >= 2 && yearsOfExperience < 5) {
      experienceLevel = 'mid'
    } else if (yearsOfExperience >= 5 && yearsOfExperience < 8) {
      experienceLevel = 'senior'
    } else if (yearsOfExperience >= 8) {
      experienceLevel = 'lead'
    }
    
    return {
      targetPosition: resumeData.personalInfo?.title,
      keySkills,
      yearsOfExperience: Math.round(yearsOfExperience),
      experienceLevel
    }
  }
}

// 导出单例
export const aiPromptEnhancer = new AIPromptEnhancer()
