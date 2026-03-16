/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026.1.30
 * @description 优化的预览性能工具 - 使用 React 18 并发特性
 */

import { useDeferredValue, useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { ResumeData } from '@/types/resume'
import { StyleConfig } from '@/contexts/StyleContext'

/**
 * 预览缓存管理
 */
interface PreviewCacheItem {
  resumeData: ResumeData
  styleConfig: StyleConfig
  timestamp: number
}

class PreviewCache {
  private cache: Map<string, PreviewCacheItem> = new Map()
  private maxSize: number = 50

  // 生成缓存键
  generateKey(data: unknown): string {
    return JSON.stringify(data)
  }

  // 获取缓存
  get(key: string): PreviewCacheItem | undefined {
    return this.cache.get(key)
  }

  // 设置缓存
  set(key: string, value: PreviewCacheItem): void {
    if (this.cache.size >= this.maxSize) {
      // 删除最旧的缓存项
      const firstKey = this.cache.keys().next().value as string | undefined
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }

  // 清空缓存
  clear(): void {
    this.cache.clear()
  }
}

export const previewCache = new PreviewCache()

/**
 * 使用延迟值优化预览性能
 */
export function useDeferredPreview<T>(value: T): T {
  return useDeferredValue(value)
}

/**
 * 增量更新检测 - 只更新变化的部分
 */
export function useIncrementalUpdate<T extends object>(
  data: T,
  dependencies: (keyof T)[]
): Partial<T> {
  const prevDataRef = useRef<T>(data)
  
  const changedData = useMemo(() => {
    const changes: Partial<T> = {}
    let hasChanges = false
    
    dependencies.forEach((key) => {
      if (JSON.stringify(data[key]) !== JSON.stringify(prevDataRef.current[key])) {
        changes[key] = data[key]
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      prevDataRef.current = data
    }
    
    return hasChanges ? changes : null
  }, [data, dependencies])
  
  return changedData || {}
}

/**
 * 预览数据优化 Hook
 */
export function useOptimizedPreviewData(
  resumeData: ResumeData,
  styleConfig: StyleConfig
) {
  // 使用延迟值减少渲染频率
  const deferredResumeData = useDeferredValue(resumeData)
  const deferredStyleConfig = useDeferredValue(styleConfig)
  
  // 检测增量更新
  const changedSections = useIncrementalUpdate(deferredResumeData, [
    'personalInfo',
    'experience',
    'education',
    'skills',
    'projects'
  ])
  
  // 缓存处理后的数据
  const cachedData = useMemo(() => {
    const cacheKey = previewCache.generateKey({
      resumeData: deferredResumeData,
      styleConfig: deferredStyleConfig
    })
    
    const cached = previewCache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    const processed = {
      resumeData: deferredResumeData,
      styleConfig: deferredStyleConfig,
      timestamp: Date.now()
    }
    
    previewCache.set(cacheKey, processed)
    return processed
  }, [deferredResumeData, deferredStyleConfig])
  
  return {
    resumeData: cachedData.resumeData,
    styleConfig: cachedData.styleConfig,
    changedSections,
    isStale: Date.now() - cachedData.timestamp > 5000 // 5秒后标记为过期
  }
}

/**
 * 防抖 Hook - 减少频繁更新
 */
export function useDebounce<T>(value: T, delay: number = 100): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  
  return debouncedValue
}

/**
 * 节流 Hook - 限制更新频率
 */
export function useThrottle<T>(value: T, interval: number = 100): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(Date.now())
  
  useEffect(() => {
    const now = Date.now()
    
    if (now - lastUpdated.current >= interval) {
      setThrottledValue(value)
      lastUpdated.current = now
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value)
        lastUpdated.current = Date.now()
      }, interval - (now - lastUpdated.current))
      
      return () => clearTimeout(timer)
    }
  }, [value, interval])
  
  return throttledValue
}

/**
 * 性能监控 Hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0)
  const renderTimes = useRef<number[]>([])
  const lastRenderTime = useRef<number>(Date.now())
  
  useEffect(() => {
    renderCount.current++
    const now = Date.now()
    const renderTime = now - lastRenderTime.current
    renderTimes.current.push(renderTime)
    
    // 只保留最近10次渲染时间
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift()
    }
    
    lastRenderTime.current = now
    
    // 开发环境下发送性能调试事件，便于外部工具监听
    if (process.env.NODE_ENV === 'development' && renderCount.current % 10 === 0) {
      const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('preview-performance-debug', {
            detail: {
              componentName,
              renderCount: renderCount.current,
              avgRenderTime,
              lastRenderTime: renderTime
            }
          })
        )
      }
    }
  })
  
  return {
    renderCount: renderCount.current,
    avgRenderTime: renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
  }
}

/**
 * 虚拟化渲染 - 只渲染可见区域
 */
export function useVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight)
    
    // 添加缓冲区，提前渲染上下各2个项目
    return {
      start: Math.max(0, startIndex - 2),
      end: Math.min(itemCount, endIndex + 2)
    }
  }, [scrollTop, itemHeight, containerHeight, itemCount])
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  return {
    visibleRange,
    handleScroll,
    totalHeight: itemCount * itemHeight
  }
}

/**
 * 批量更新 - 合并多个状态更新
 */
export function useBatchUpdate<T extends object>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const pendingUpdates = useRef<Partial<T>[]>([])
  const updateTimer = useRef<NodeJS.Timeout>()
  
  const batchUpdate = useCallback((update: Partial<T>) => {
    pendingUpdates.current.push(update)
    
    if (updateTimer.current) {
      clearTimeout(updateTimer.current)
    }
    
    updateTimer.current = setTimeout(() => {
      if (pendingUpdates.current.length > 0) {
        setValue((prev) => {
          const merged = { ...prev } as T
          pendingUpdates.current.forEach((update) => {
            Object.assign(merged as object, update)
          })
          return merged
        })
        pendingUpdates.current = []
      }
    }, 50) // 50ms 批处理窗口
  }, [])
  
  useEffect(() => {
    return () => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current)
      }
    }
  }, [])
  
  return [value, batchUpdate] as const
}

/**
 * 智能重渲染 - 只在必要时重新渲染
 */
export function useSmartMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  isEqual?: (prev: T, next: T) => boolean
): T {
  const prevValue = useRef<T>()
  const prevDeps = useRef<React.DependencyList>()
  
  const hasChanged = !prevDeps.current || 
    deps.length !== prevDeps.current.length ||
    deps.some((dep, i) => !Object.is(dep, prevDeps.current![i]))
  
  if (hasChanged) {
    const newValue = factory()
    
    if (isEqual && prevValue.current !== undefined) {
      if (!isEqual(prevValue.current, newValue)) {
        prevValue.current = newValue
        prevDeps.current = deps
      }
    } else {
      prevValue.current = newValue
      prevDeps.current = deps
    }
  }
  
  return prevValue.current!
}
