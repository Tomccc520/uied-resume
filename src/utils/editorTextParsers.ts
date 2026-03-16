/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-16
 */

/**
 * 将多行文本解析为列表项
 * 支持去除常见项目符号前缀（如 `-`、`•`、`1.`）。
 */
export function parseLineItems(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+\.)\s*/, '').trim())
    .filter(Boolean)
}

/**
 * 将数组格式化为多行文本
 * 保证编辑器展示与存储格式可逆。
 */
export function formatLineItems(items: string[]): string {
  return items.join('\n')
}

/**
 * 将逗号文本解析为标签列表
 * 同时支持中文逗号与分号分隔，自动去重。
 */
export function parseTagItems(text: string): string[] {
  const normalized = new Set<string>()
  const result: string[] = []

  text
    .split(/[,，;；]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const key = part.toLowerCase()
      if (normalized.has(key)) return
      normalized.add(key)
      result.push(part)
    })

  return result
}

/**
 * 将标签数组格式化为逗号文本
 */
export function formatTagItems(items: string[]): string {
  return items.join(', ')
}
