/**
 * AI建议智能排序服务
 * 根据质量、相关性和用户偏好对AI生成的建议进行智能排序
 * 
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-01-27
 */

import { aiQualityChecker, QualityScore } from './aiQualityChecker'

/**
 * 建议项接口
 */
export interface SuggestionItem {
  content: string
  index: number
  qualityScore?: QualityScore
  relevanceScore?: number
  diversityScore?: number
  finalScore?: number
}

/**
 * 排序偏好
 */
export interface SortPreference {
  prioritizeQuality?: boolean // 优先考虑质量
  prioritizeRelevance?: boolean // 优先考虑相关性
  prioritizeDiversity?: boolean // 优先考虑多样性
  weights?: {
    quality: number // 质量权重 0-1
    relevance: number // 相关性权重 0-1
    diversity: number // 多样性权重 0-1
  }
}

/**
 * AI建议智能排序器
 */
export class AISuggestionRanker {
  /**
   * 默认权重配置
   */
  private defaultWeights = {
    quality: 0.5,
    relevance: 0.3,
    diversity: 0.2
  }

  /**
   * 对建议进行智能排序
   */
  rankSuggestions(
    suggestions: string[],
    type: 'summary' | 'experience' | 'skills' | 'education' | 'projects',
    options?: {
      currentContent?: string
      targetKeywords?: string[]
      preference?: SortPreference
    }
  ): SuggestionItem[] {
    // 创建建议项
    const items: SuggestionItem[] = suggestions.map((content, index) => ({
      content,
      index
    }))

    // 计算质量分数
    items.forEach(item => {
      item.qualityScore = aiQualityChecker.evaluateContent(item.content, type)
    })

    // 计算相关性分数
    if (options?.targetKeywords && options.targetKeywords.length > 0) {
      items.forEach(item => {
        item.relevanceScore = this.calculateRelevance(item.content, options.targetKeywords!)
      })
    }

    // 计算多样性分数
    items.forEach((item, idx) => {
      item.diversityScore = this.calculateDiversity(item.content, items, idx)
    })

    // 计算最终分数
    const weights = options?.preference?.weights || this.defaultWeights
    items.forEach(item => {
      const qualityWeight = weights.quality
      const relevanceWeight = item.relevanceScore !== undefined ? weights.relevance : 0
      const diversityWeight = weights.diversity

      // 归一化权重
      const totalWeight = qualityWeight + relevanceWeight + diversityWeight
      const normalizedQuality = qualityWeight / totalWeight
      const normalizedRelevance = relevanceWeight / totalWeight
      const normalizedDiversity = diversityWeight / totalWeight

      item.finalScore = 
        (item.qualityScore?.overall || 0) * normalizedQuality +
        (item.relevanceScore || 0) * normalizedRelevance +
        (item.diversityScore || 0) * normalizedDiversity
    })

    // 排序
    items.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))

    return items
  }

  /**
   * 计算相关性分数
   * 基于目标关键词的匹配程度
   */
  private calculateRelevance(content: string, targetKeywords: string[]): number {
    if (!targetKeywords || targetKeywords.length === 0) return 50

    const contentLower = content.toLowerCase()
    let matchCount = 0
    let totalImportance = 0

    targetKeywords.forEach((keyword, index) => {
      // 关键词越靠前越重要
      const importance = targetKeywords.length - index
      totalImportance += importance

      if (contentLower.includes(keyword.toLowerCase())) {
        matchCount += importance
      }
    })

    return totalImportance > 0 ? (matchCount / totalImportance) * 100 : 0
  }

  /**
   * 计算多样性分数
   * 与其他建议的差异程度
   */
  private calculateDiversity(content: string, allItems: SuggestionItem[], currentIndex: number): number {
    if (allItems.length <= 1) return 100

    const currentWords = new Set(this.tokenize(content))
    let totalSimilarity = 0

    allItems.forEach((item, index) => {
      if (index === currentIndex) return

      const otherWords = new Set(this.tokenize(item.content))
      const similarity = this.calculateJaccardSimilarity(currentWords, otherWords)
      totalSimilarity += similarity
    })

    const avgSimilarity = totalSimilarity / (allItems.length - 1)
    // 相似度越低，多样性越高
    return (1 - avgSimilarity) * 100
  }

  /**
   * 分词
   */
  private tokenize(text: string): string[] {
    // 简单的分词：按空格和标点分割
    return text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1)
  }

  /**
   * 计算Jaccard相似度
   */
  private calculateJaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set(Array.from(set1).filter(x => set2.has(x)))
    const union = new Set([...Array.from(set1), ...Array.from(set2)])
    
    return union.size > 0 ? intersection.size / union.size : 0
  }

  /**
   * 获取推荐的建议
   * 返回质量最高且多样性好的前N个建议
   */
  getTopSuggestions(
    rankedItems: SuggestionItem[],
    count: number = 3
  ): SuggestionItem[] {
    // 确保多样性：选择的建议之间相似度不能太高
    const selected: SuggestionItem[] = []
    const threshold = 0.7 // 相似度阈值

    for (const item of rankedItems) {
      if (selected.length >= count) break

      // 检查与已选择项的相似度
      const isTooSimilar = selected.some(selectedItem => {
        const similarity = this.calculateJaccardSimilarity(
          new Set(this.tokenize(item.content)),
          new Set(this.tokenize(selectedItem.content))
        )
        return similarity > threshold
      })

      if (!isTooSimilar) {
        selected.push(item)
      }
    }

    // 如果选择的数量不够，补充剩余的高分项
    if (selected.length < count) {
      for (const item of rankedItems) {
        if (selected.length >= count) break
        if (!selected.includes(item)) {
          selected.push(item)
        }
      }
    }

    return selected
  }

  /**
   * 生成排序说明
   */
  generateRankingExplanation(item: SuggestionItem): string {
    const explanations: string[] = []

    if (item.qualityScore) {
      const level = aiQualityChecker.getQualityLevel(item.qualityScore.overall)
      explanations.push(`质量${level.level}（${item.qualityScore.overall}分）`)
    }

    if (item.relevanceScore !== undefined) {
      if (item.relevanceScore >= 80) {
        explanations.push('高度相关')
      } else if (item.relevanceScore >= 60) {
        explanations.push('较为相关')
      } else {
        explanations.push('相关性一般')
      }
    }

    if (item.diversityScore !== undefined) {
      if (item.diversityScore >= 70) {
        explanations.push('风格独特')
      } else if (item.diversityScore >= 50) {
        explanations.push('风格适中')
      }
    }

    return explanations.join('，')
  }

  /**
   * 按风格分类建议
   */
  categorizeByStyle(suggestions: string[]): {
    professional: string[]
    creative: string[]
    technical: string[]
    concise: string[]
  } {
    const categories = {
      professional: [] as string[],
      creative: [] as string[],
      technical: [] as string[],
      concise: [] as string[]
    }

    suggestions.forEach(suggestion => {
      const style = this.detectStyle(suggestion)
      categories[style].push(suggestion)
    })

    return categories
  }

  /**
   * 检测建议的风格
   */
  private detectStyle(content: string): 'professional' | 'creative' | 'technical' | 'concise' {
    const length = content.length

    // 技术风格：包含大量技术术语
    const techPattern = /[A-Z][a-z]+(?:[A-Z][a-z]+)*|[a-z]+\.[a-z]+|\d+%/g
    const techMatches = content.match(techPattern)
    const techDensity = techMatches ? techMatches.length / length * 1000 : 0

    if (techDensity > 15) {
      return 'technical'
    }

    // 简洁风格：字数较少
    if (length < 150) {
      return 'concise'
    }

    // 创意风格：使用较多形容词和修饰语
    const creativeWords = ['创新', '独特', '卓越', '突破', '领先', 'innovative', 'unique', 'outstanding', 'breakthrough']
    const hasCreativeWords = creativeWords.some(word => content.includes(word))

    if (hasCreativeWords) {
      return 'creative'
    }

    // 默认为专业风格
    return 'professional'
  }

  /**
   * 根据用户历史偏好调整权重
   */
  adjustWeightsByHistory(
    userHistory: {
      selectedSuggestions: string[]
      rejectedSuggestions: string[]
    }
  ): SortPreference {
    // 分析用户选择的建议特征
    const selectedStyles = userHistory.selectedSuggestions.map(s => this.detectStyle(s))
    const selectedLengths = userHistory.selectedSuggestions.map(s => s.length)

    // 计算平均长度偏好
    const avgLength = selectedLengths.reduce((a, b) => a + b, 0) / selectedLengths.length

    // 统计风格偏好
    const styleCount: Record<string, number> = {}
    selectedStyles.forEach(style => {
      styleCount[style] = (styleCount[style] || 0) + 1
    })

    // 根据历史调整权重
    const weights = { ...this.defaultWeights }

    // 如果用户倾向于选择高质量的建议，增加质量权重
    if (userHistory.selectedSuggestions.length > 5) {
      weights.quality = 0.6
      weights.relevance = 0.25
      weights.diversity = 0.15
    }

    // 根据历史文本长度微调可读性权重
    if (Number.isFinite(avgLength) && avgLength > 0) {
      if (avgLength > 200) {
        weights.quality = Math.min(0.7, weights.quality + 0.05)
      } else if (avgLength < 80) {
        weights.relevance = Math.min(0.5, weights.relevance + 0.05)
      }
    }

    return { weights }
  }
}

// 导出单例
export const aiSuggestionRanker = new AISuggestionRanker()
