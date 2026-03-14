/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-15
 */

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
} as const

export type Breakpoint = keyof typeof BREAKPOINTS
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface ResponsiveState {
  width: number
  height: number
}

interface UseResponsiveResult extends ResponsiveState {
  breakpoint: Breakpoint
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isBelow: (breakpoint: Breakpoint) => boolean
  isAbove: (breakpoint: Breakpoint) => boolean
  isBetween: (start: Breakpoint, end: Breakpoint) => boolean
}

/**
 * 获取当前窗口尺寸
 * SSR 场景下返回兜底值，避免访问 window 报错。
 */
const getViewportSize = (): ResponsiveState => {
  if (typeof window === 'undefined') {
    return { width: BREAKPOINTS.lg, height: 768 }
  }
  return { width: window.innerWidth, height: window.innerHeight }
}

/**
 * 根据宽度计算断点
 * 断点划分与测试预期保持一致。
 */
const getBreakpointByWidth = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * 根据宽度识别设备类型
 * md 以下为 mobile，md~lg 为 tablet，lg 及以上为 desktop。
 */
const getDeviceTypeByWidth = (width: number): DeviceType => {
  if (width < BREAKPOINTS.md) return 'mobile'
  if (width < BREAKPOINTS.lg) return 'tablet'
  return 'desktop'
}

/**
 * 响应式状态主 Hook
 * 提供窗口尺寸、断点、设备类型以及常用区间判断函数。
 */
export const useResponsive = (): UseResponsiveResult => {
  const [viewport, setViewport] = useState<ResponsiveState>(() => getViewportSize())

  useEffect(() => {
    if (typeof window === 'undefined') return

    /**
     * 处理窗口尺寸变化
     * 在 resize 事件中同步最新宽高。
     */
    const handleResize = () => {
      setViewport(getViewportSize())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const breakpoint = useMemo(() => getBreakpointByWidth(viewport.width), [viewport.width])
  const deviceType = useMemo(() => getDeviceTypeByWidth(viewport.width), [viewport.width])

  /**
   * 判断当前宽度是否小于指定断点
   */
  const isBelow = useCallback((target: Breakpoint) => viewport.width < BREAKPOINTS[target], [viewport.width])

  /**
   * 判断当前宽度是否大于等于指定断点
   */
  const isAbove = useCallback((target: Breakpoint) => viewport.width >= BREAKPOINTS[target], [viewport.width])

  /**
   * 判断当前宽度是否落在两个断点区间内（含左不含右）
   */
  const isBetween = useCallback(
    (start: Breakpoint, end: Breakpoint) =>
      viewport.width >= BREAKPOINTS[start] && viewport.width < BREAKPOINTS[end],
    [viewport.width]
  )

  return {
    width: viewport.width,
    height: viewport.height,
    breakpoint,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isBelow,
    isAbove,
    isBetween
  }
}

/**
 * 媒体查询 Hook
 * 监听 media query 变化并返回当前匹配状态。
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mediaQueryList = window.matchMedia(query)

    /**
     * 同步媒体查询匹配结果
     */
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', handleChange)
    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

/**
 * 移动端判断 Hook
 * 复用 useResponsive，统一响应式判断口径。
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive()
  return isMobile
}
