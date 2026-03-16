/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 */


import { aiService } from './aiService'
import { ResumeData } from '@/types/resume'

/**
 * AI简历生成器服务
 * 提供一键生成完整简历的功能
 */
export class AIResumeGenerator {
  /**
   * 生成完整简历数据
   * @param userInfo 用户基本信息（姓名、职位等）
   * @returns 完整的简历数据
   */
  static async generateCompleteResume(userInfo: {
    name?: string
    targetPosition?: string
    industry?: string
    experience?: string
  }): Promise<ResumeData> {
    const { name = '张三', targetPosition = '软件工程师', industry = 'IT', experience = '3年' } = userInfo

    try {
      // 并行生成各个模块的内容
      const [summary, skills, experience1, experience2, education, project1, project2] = await Promise.all([
        // 生成个人简介
        aiService.generateSuggestions('summary', '', `为${name}生成一份${industry}行业${targetPosition}职位的个人简介，突出${experience}工作经验和核心优势`),
        
        // 生成技能列表
        aiService.generateSuggestions('skills', '', `为${industry}行业${targetPosition}职位生成相关的专业技能列表，包括编程语言、框架、工具等`),
        
        // 生成工作经历1
        aiService.generateSuggestions('experience', '', `为${industry}行业${targetPosition}生成一份${experience}的工作经历，包括公司名称、职位、工作内容和成果`),
        
        // 生成工作经历2
        aiService.generateSuggestions('experience', '', `为${industry}行业${targetPosition}生成另一份工作经历，体现职业发展和技能提升`),
        
        // 生成教育背景
        aiService.generateSuggestions('education', '', `为${industry}行业${targetPosition}生成合适的教育背景，包括学校、专业、学位等信息`),
        
        // 生成项目经验1
        aiService.generateSuggestions('projects', '', `为${industry}行业${targetPosition}生成一个技术项目经验，包括项目描述、技术栈和核心贡献`),
        
        // 生成项目经验2
        aiService.generateSuggestions('projects', '', `为${industry}行业${targetPosition}生成另一个项目经验，展示不同的技术能力和解决方案`)
      ])

      // 构建完整的简历数据
      const resumeData: ResumeData = {
        personalInfo: {
          name: name,
          title: targetPosition,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          phone: '138-0000-0000',
          location: '北京市',
          website: '',
          summary: summary[0] || '具有丰富经验的专业人士，致力于技术创新和团队协作。'
        },
        experience: this.parseExperienceData([experience1[0], experience2[0]]),
        education: this.parseEducationData([education[0]]),
        skills: this.parseSkillsData([skills[0]]),
        projects: this.parseProjectsData([project1[0], project2[0]])
      }

      return resumeData
    } catch (error) {
      console.error('AI生成简历失败:', error)
      // 返回默认的简历模板
      return this.getDefaultResumeTemplate(name, targetPosition)
    }
  }

  /**
   * 解析工作经历数据
   */
  private static parseExperienceData(experiences: string[]): ResumeData['experience'] {
    return experiences.filter(exp => exp).map((exp, index) => {
      const lines = exp.split('\n').filter(line => line.trim())
      const company = this.extractCompanyName(lines[0]) || `科技公司${index + 1}`
      const position = this.extractPosition(lines[0]) || '软件工程师'
      const description = lines.slice(1).join('\n') || exp
      
      return {
        id: `exp-${Date.now()}-${index}`,
        company,
        position,
        startDate: this.getRandomDate(2020 + index, 2023 + index),
        endDate: index === 0 ? '' : this.getRandomDate(2021 + index, 2024 + index),
        current: index === 0,
        description: [description],
        location: '北京市'
      }
    })
  }

  /**
   * 解析教育背景数据
   */
  private static parseEducationData(educations: string[]): ResumeData['education'] {
    return educations.filter(edu => edu).map((edu, index) => {
      const lines = edu.split('\n').filter(line => line.trim())
      const school = this.extractSchoolName(lines[0]) || '知名大学'
      const degree = this.extractDegree(lines[0]) || '本科'
      const major = this.extractMajor(lines[0]) || '计算机科学与技术'
      
      return {
        id: `edu-${Date.now()}-${index}`,
        school,
        degree,
        major,
        startDate: '2016-09',
        endDate: '2020-06',
        gpa: '3.5',
        description: lines.slice(1).join('\n') || edu
      }
    })
  }

  /**
   * 解析技能数据
   */
  private static parseSkillsData(skillsArray: string[]): ResumeData['skills'] {
    const skillsText = skillsArray.join('\n')
    const lines = skillsText.split('\n').filter(line => line.trim())
    
    return lines.map((skill, index) => {
      const cleanSkill = skill.replace(/^[\-\*\•\d\.\s]+/, '').trim()
      const level = this.inferSkillLevel(cleanSkill, index)
      const category = this.inferSkillCategory(cleanSkill)
      
      return {
        id: `skill-${Date.now()}-${index}`,
        name: cleanSkill,
        level,
        category,
        color: '#3B82F6' // 默认蓝色
      }
    }).filter(skill => skill.name.length > 0)
  }

  /**
   * 解析项目数据
   */
  private static parseProjectsData(projects: string[]): ResumeData['projects'] {
    return projects.filter(proj => proj).map((proj, index) => {
      const lines = proj.split('\n').filter(line => line.trim())
      const name = this.extractProjectName(lines[0]) || `项目${index + 1}`
      const description = lines[0] || proj
      const highlights = lines.slice(1)
        .filter(line => line.match(/^[\-\*\•\d\.]/))
        .map(line => line.replace(/^[\-\*\•\d\.\s]+/, '').trim())
        .filter(highlight => highlight.length > 0)
      
      return {
        id: `proj-${Date.now()}-${index}`,
        name,
        description,
        technologies: this.extractTechnologies(proj),
        startDate: this.getRandomDate(2022, 2023),
        endDate: this.getRandomDate(2023, 2024),
        highlights: highlights.length > 0 ? highlights : ['项目核心功能实现', '性能优化和用户体验提升']
      }
    })
  }

  /**
   * 提取公司名称
   */
  private static extractCompanyName(text: string): string {
    const companyPatterns = [
      /公司[：:]\s*([^，,。.\n]+)/,
      /在([^，,。.\n]*公司)/,
      /([^，,。.\n]*科技[有限]*公司)/,
      /([^，,。.\n]*集团)/
    ]
    
    for (const pattern of companyPatterns) {
      const match = text.match(pattern)
      if (match) return match[1].trim()
    }
    return ''
  }

  /**
   * 提取职位名称
   */
  private static extractPosition(text: string): string {
    const positionPatterns = [
      /职位[：:]\s*([^，,。.\n]+)/,
      /担任([^，,。.\n]*工程师)/,
      /([^，,。.\n]*开发[工程]*师)/,
      /(高级|中级|初级)*\s*(前端|后端|全栈|移动|测试|运维)*\s*[开发]*工程师/
    ]
    
    for (const pattern of positionPatterns) {
      const match = text.match(pattern)
      if (match) return match[1] || match[0]
    }
    return ''
  }

  /**
   * 提取学校名称
   */
  private static extractSchoolName(text: string): string {
    const schoolPatterns = [
      /([^，,。.\n]*大学)/,
      /([^，,。.\n]*学院)/,
      /学校[：:]\s*([^，,。.\n]+)/
    ]
    
    for (const pattern of schoolPatterns) {
      const match = text.match(pattern)
      if (match) return match[1].trim()
    }
    return ''
  }

  /**
   * 提取学位
   */
  private static extractDegree(text: string): string {
    const degreePatterns = [
      /(博士|硕士|本科|学士|专科)/,
      /学位[：:]\s*([^，,。.\n]+)/
    ]
    
    for (const pattern of degreePatterns) {
      const match = text.match(pattern)
      if (match) return match[1] || match[0]
    }
    return ''
  }

  /**
   * 提取专业
   */
  private static extractMajor(text: string): string {
    const majorPatterns = [
      /专业[：:]\s*([^，,。.\n]+)/,
      /(计算机[科学与技术]*)/,
      /(软件工程)/,
      /(信息[管理与]*系统)/
    ]
    
    for (const pattern of majorPatterns) {
      const match = text.match(pattern)
      if (match) return match[1].trim()
    }
    return ''
  }

  /**
   * 提取项目名称
   */
  private static extractProjectName(text: string): string {
    const projectPatterns = [
      /项目[：:]\s*([^，,。.\n]+)/,
      /([^，,。.\n]*系统)/,
      /([^，,。.\n]*平台)/,
      /([^，,。.\n]*应用)/
    ]
    
    for (const pattern of projectPatterns) {
      const match = text.match(pattern)
      if (match) return match[1].trim()
    }
    return text.split(/[，,。.\n]/)[0].trim()
  }

  /**
   * 提取技术栈
   */
  private static extractTechnologies(text: string): string[] {
    const techPatterns = [
      /React/gi, /Vue/gi, /Angular/gi, /JavaScript/gi, /TypeScript/gi,
      /Node\.js/gi, /Python/gi, /Java/gi, /Spring/gi, /MySQL/gi,
      /MongoDB/gi, /Redis/gi, /Docker/gi, /Kubernetes/gi, /AWS/gi
    ]
    
    const technologies: string[] = []
    for (const pattern of techPatterns) {
      const matches = text.match(pattern)
      if (matches) {
        technologies.push(...matches.map(match => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()))
      }
    }
    
    return Array.from(new Set(technologies)).slice(0, 5)
  }

  /**
   * 提取成就
   */
  private static extractAchievements(text: string): string[] {
    const lines = text.split('\n')
    return lines
      .filter(line => line.match(/^[\-\*\•\d\.]/))
      .map(line => line.replace(/^[\-\*\•\d\.\s]+/, '').trim())
      .filter(achievement => achievement.length > 0)
      .slice(0, 3)
  }

  /**
   * 推断技能等级
   */
  /**
   * 推断技能等级
   * @copyright Tomda (https://www.tomda.top)
   * @copyright UIED技术团队 (https://fsuied.com)
   * @author UIED技术团队
   * @createDate 2025-9-22
   */
  private static inferSkillLevel(skill: string, index: number): number {
    const levels: number[] = [90, 80, 70, 50] // expert, advanced, intermediate, beginner
    return levels[index % levels.length]
  }

  /**
   * 推断技能分类
   */
  private static inferSkillCategory(skill: string): string {
    const categories = {
      '编程语言': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust'],
      '前端框架': ['React', 'Vue', 'Angular', 'Svelte'],
      '后端框架': ['Node.js', 'Express', 'Spring', 'Django', 'Flask'],
      '数据库': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
      '云服务': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
      '工具': ['Git', 'Webpack', 'Vite', 'Jest', 'Cypress']
    }
    
    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
        return category
      }
    }
    
    return '其他'
  }

  /**
   * 生成随机日期
   */
  private static getRandomDate(startYear: number, endYear: number): string {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear
    const month = Math.floor(Math.random() * 12) + 1
    return `${year}-${month.toString().padStart(2, '0')}`
  }

  /**
   * 获取默认简历模板
   */
  private static getDefaultResumeTemplate(name: string, position: string): ResumeData {
    return {
      personalInfo: {
        name,
        title: position,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: '138-0000-0000',
        location: '北京市',
        website: '',
        summary: `具有丰富经验的${position}，擅长技术创新和团队协作，致力于为用户提供优质的产品和服务。`
      },
      experience: [
        {
          id: `exp-${Date.now()}`,
          company: '科技有限公司',
          position: position,
          startDate: '2021-03',
          endDate: '',
          current: true,
          description: [`负责${position}相关工作，包括需求分析、技术方案设计、代码开发和项目管理等。`],
          location: '北京市'
        }
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          school: '知名大学',
          degree: '本科',
          major: '计算机科学与技术',
          startDate: '2016-09',
          endDate: '2020-06',
          gpa: '3.5',
          description: '主修计算机相关课程，具备扎实的理论基础和实践能力。'
        }
      ],
      skills: [
        { id: `skill-${Date.now()}-1`, name: 'JavaScript', level: 90, category: '编程语言' },
        { id: `skill-${Date.now()}-2`, name: 'React', level: 80, category: '前端框架' },
        { id: `skill-${Date.now()}-3`, name: 'Node.js', level: 70, category: '后端技术' }
      ],
      projects: [
        {
          id: `proj-${Date.now()}`,
          name: '项目管理系统',
          description: '基于现代技术栈开发的项目管理系统，提供完整的项目生命周期管理功能。',
          technologies: ['React', 'Node.js', 'MySQL'],
          startDate: '2023-01',
          endDate: '2023-06',
          highlights: ['实现了完整的用户权限管理', '优化了数据查询性能', '提升了系统的可维护性']
        }
      ]
    }
  }
}

export default AIResumeGenerator
