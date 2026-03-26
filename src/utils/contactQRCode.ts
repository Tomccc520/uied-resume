/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-26
 */

import { PersonalInfo } from '@/types/resume'

/**
 * 规范化二维码内容
 * 对常见输入（邮箱、域名、手机号）做轻量标准化，提升扫码可用性。
 */
export function normalizeContactQRCodePayload(payload: string): string {
  const next = payload.trim()
  if (!next) {
    return ''
  }

  if (/^(mailto:|tel:|https?:\/\/|weixin:\/\/)/i.test(next)) {
    return next
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
    return `mailto:${next}`
  }

  if (/^\+?[\d\s\-()]{6,}$/.test(next)) {
    return `tel:${next.replace(/\s+/g, '')}`
  }

  if (/^www\./i.test(next)) {
    return `https://${next}`
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(next)) {
    return `https://${next}`
  }

  return next
}

/**
 * 解析联系方式二维码内容
 * 优先使用用户配置的 contactQRCode 字段，未配置时返回 null。
 */
export function resolveContactQRCodePayload(personalInfo: PersonalInfo): string | null {
  const configured = personalInfo.contactQRCode?.trim()
  if (!configured) {
    return null
  }
  const normalized = normalizeContactQRCodePayload(configured)
  return normalized || null
}

/**
 * 生成二维码图片地址
 * 使用免鉴权二维码服务，前端可直接渲染用于预览与导出。
 */
export function createContactQRCodeImageUrl(payload: string, size: number = 136): string {
  const normalizedPayload = normalizeContactQRCodePayload(payload)
  const encoded = encodeURIComponent(normalizedPayload)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=1&format=png&data=${encoded}`
}
