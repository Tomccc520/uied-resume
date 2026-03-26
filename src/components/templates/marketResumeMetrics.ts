/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-26
 */

import { getUnifiedResumeMetrics, UnifiedResumeMetrics } from './resumePrintMetrics'

interface MarketResumeMetricOptions {
  baseContentSize: number
  sectionSpacing?: number
}

/**
 * 获取市场化投递模板参数
 * 在统一参数基础上进一步收敛标题比例、时间列宽与段落密度，保证三套模板导出观感一致。
 */
export const getMarketResumeMetrics = ({
  baseContentSize,
  sectionSpacing
}: MarketResumeMetricOptions): UnifiedResumeMetrics => {
  const safeBase = Math.max(12, baseContentSize)
  const baseMetrics = getUnifiedResumeMetrics({
    baseContentSize: safeBase,
    sectionSpacing
  })

  return {
    ...baseMetrics,
    nameSize: Math.round(safeBase * 1.92),
    roleSize: Math.round(safeBase * 1.14),
    sectionTitleSize: Math.round(safeBase * 0.98),
    itemTitleSize: Math.round(safeBase * 1.02),
    metaSize: Math.round(safeBase * 0.82),
    bodyLineHeight: 1.53,
    summaryLineHeight: 1.58,
    sectionGap: Math.min(Math.max(sectionSpacing || 22, 18), 22),
    sectionTitlePaddingBottom: 5,
    sectionTitleMarginBottom: 9,
    entryGap: 10,
    bulletGap: 5,
    dateColumnWidth: 132,
    headerAvatarSize: 66,
    nameWeight: 680,
    roleWeight: 530,
    sectionTitleWeight: 680,
    itemTitleWeight: 620,
    metaWeight: 510
  }
}
