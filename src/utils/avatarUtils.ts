/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026.2.2
 * @description 头像样式工具函数
 */

import { StyleConfig } from '@/contexts/StyleContext'

/**
 * 获取头像圆角样式
 * @param borderRadius 圆角半径（0-50），优先使用此参数
 * @param styleConfig 样式配置（备用）
 * @param size 头像大小（像素），用于计算圆形时的圆角
 * @returns 圆角样式字符串
 */
export const getAvatarBorderRadius = (
  borderRadius?: number,
  styleConfig?: StyleConfig,
  size: number = 96
): string => {
  // 优先使用传入的 borderRadius 参数（来自 personalInfo.avatarBorderRadius）
  if (borderRadius !== undefined) {
    // 如果圆角值大于等于50，则为圆形
    if (borderRadius >= 50) {
      return '50%'
    }
    return `${borderRadius}px`
  }
  
  // 如果没有自定义圆角，则根据 shape 判断
  const shape = styleConfig?.avatar?.shape || 'circle'
  if (shape === 'circle') {
    return '50%'  // 圆形
  }
  if (shape === 'rounded') {
    // 根据头像尺寸动态计算圆角，避免小尺寸头像圆角过大
    return `${Math.max(6, Math.round(size * 0.08))}px`
  }
  return '0px'
}

/**
 * 获取头像形状的 CSS 类名（已废弃，建议使用 getAvatarStyle）
 * @deprecated 使用 getAvatarStyle 代替
 */
export const getAvatarShapeClass = (styleConfig?: StyleConfig): string => {
  const shape = styleConfig?.avatar?.shape || 'circle'
  return shape === 'circle' ? 'rounded-full' : 'rounded-lg'
}

/**
 * 获取头像样式对象
 * @param borderRadius 圆角半径（0-50），优先使用此参数
 * @param styleConfig 样式配置（备用）
 * @param size 头像大小（像素）
 * @param borderColor 边框颜色
 * @param borderWidth 边框宽度（像素）
 * @returns 样式对象
 */
export const getAvatarStyle = (
  borderRadius?: number,
  styleConfig?: StyleConfig,
  size: number = 120,
  borderColor: string = '#e5e5e5',
  borderWidth: number = 2
): React.CSSProperties => {
  return {
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover' as const,
    border: `${borderWidth}px solid ${borderColor}`,
    borderRadius: getAvatarBorderRadius(borderRadius, styleConfig, size)
  }
}

/**
 * 获取完整的头像类名（不包含圆角，圆角通过 style 设置）
 * @param styleConfig 样式配置
 * @param sizeClass Tailwind 尺寸类名，如 'w-24 h-24'
 * @returns 完整的类名字符串
 */
export const getAvatarClassName = (
  styleConfig?: StyleConfig,
  sizeClass: string = 'w-24 h-24'
): string => {
  // 不再添加 rounded 类，圆角通过 style 的 borderRadius 设置
  return `${sizeClass} object-cover`
}

/**
 * 获取头像的内联样式（包含圆角）
 * @param borderRadius 圆角半径（0-50），优先使用此参数
 * @param styleConfig 样式配置（备用）
 * @param size 头像大小（像素）
 * @param additionalStyles 额外的样式
 * @returns 样式对象
 */
export const getAvatarInlineStyle = (
  borderRadius?: number,
  styleConfig?: StyleConfig,
  size: number = 96,
  additionalStyles?: React.CSSProperties
): React.CSSProperties => {
  return {
    borderRadius: getAvatarBorderRadius(borderRadius, styleConfig, size),
    ...additionalStyles
  }
}
