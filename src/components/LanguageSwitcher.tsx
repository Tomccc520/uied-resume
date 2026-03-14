/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 */

'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Locale } from '@/types/i18n'

// 支持的语言列表
const SUPPORTED_LANGUAGES = [
  { code: 'zh' as Locale, name: '中文', short: 'ZH' },
  { code: 'en' as Locale, name: 'English', short: 'EN' }
]

/**
 * 语言切换器组件
 * 提供语言选择功能，支持下拉菜单形式的语言切换
 */
export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  /**
   * 处理语言切换
   * @param language - 要切换到的语言
   */
  const handleLanguageChange = (language: Locale) => {
    setLocale(language)
    setIsOpen(false)
  }

  const currentLangConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === locale)

  return (
    <div className="relative">
      {/* 语言切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-md flex items-center space-x-2"
        aria-label="选择语言"
      >
        <span className="text-xs font-semibold text-gray-500">{currentLangConfig?.short}</span>
        <span>{currentLangConfig?.name}</span>
        <svg
          className={`icon icon-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 语言选择下拉菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 z-20 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`btn ${
                    locale === language.code
                      ? 'btn-primary'
                      : 'btn-ghost'
                  } btn-sm w-full justify-start space-x-3`}
                >
                  <span className="text-xs font-semibold text-gray-500">{language.short}</span>
                  <span className="font-medium">{language.name}</span>
                  {locale === language.code && (
                    <svg
                      className="w-4 h-4 ml-auto text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
