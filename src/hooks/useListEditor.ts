/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-16
 */

import { useCallback } from 'react'

/**
 * 列表编辑项基础结构
 * 约束所有编辑项都包含唯一 id，便于复用增删改逻辑。
 */
interface ListEditorItem {
  id: string
}

interface UseListEditorOptions<T extends ListEditorItem> {
  items: T[]
  onChange: (nextItems: T[]) => void
  createId?: () => string
}

/**
 * 通用列表编辑 Hook
 * 统一处理新增、更新、删除、复制、移动等高频编辑动作，减少表单层重复代码。
 */
export function useListEditor<T extends ListEditorItem>({
  items,
  onChange,
  createId
}: UseListEditorOptions<T>) {
  /**
   * 生成列表项唯一标识
   * 默认用时间戳+随机串，避免同毫秒下重复。
   */
  const buildId = useCallback(() => {
    if (createId) {
      return createId()
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }, [createId])

  /**
   * 新增列表项
   */
  const addItem = useCallback((item: T) => {
    onChange([...items, item])
  }, [items, onChange])

  /**
   * 更新指定字段
   * 通过泛型约束 value 类型，避免 any 导致的隐式错误。
   */
  const updateItemField = useCallback(
    <K extends keyof T>(id: string, field: K, value: T[K]) => {
      const nextItems = items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      onChange(nextItems)
    },
    [items, onChange]
  )

  /**
   * 按函数更新整项
   * 适合需要同时修改多个字段的场景。
   */
  const updateItem = useCallback((id: string, updater: (item: T) => T) => {
    const nextItems = items.map((item) => (item.id === id ? updater(item) : item))
    onChange(nextItems)
  }, [items, onChange])

  /**
   * 删除列表项
   */
  const deleteItem = useCallback((id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }, [items, onChange])

  /**
   * 复制列表项
   * 默认会生成新 id，避免和原项冲突。
   */
  const duplicateItem = useCallback((id: string, patch?: Partial<T>) => {
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return

    const source = items[index]
    const duplicated = {
      ...source,
      ...patch,
      id: buildId()
    } as T

    const nextItems = [...items]
    nextItems.splice(index + 1, 0, duplicated)
    onChange(nextItems)
  }, [items, onChange, buildId])

  /**
   * 移动列表项
   * 用于上移/下移操作，保持编辑顺序可控。
   */
  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const nextItems = [...items]
    const [movedItem] = nextItems.splice(index, 1)
    nextItems.splice(targetIndex, 0, movedItem)
    onChange(nextItems)
  }, [items, onChange])

  return {
    addItem,
    updateItem,
    updateItemField,
    deleteItem,
    duplicateItem,
    moveItem
  }
}

export default useListEditor
