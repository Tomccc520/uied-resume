/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026.1.28
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Shield, 
  Palette, 
  Download,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Code,
  Cpu,
  Layout,
  Image as ImageIcon,
  FileJson,
  Globe,
  ChevronDown,
  ChevronRight,
  Bug,
  Wrench,
  Gift,
  Rocket
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

interface UpdateLog {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  title: string
  description: string
  features?: string[]
  improvements?: string[]
  bugfixes?: string[]
  breaking?: string[]
}

const updateLogs: UpdateLog[] = [
  {
    version: '1.2.0',
    date: '2026-01-28',
    type: 'minor',
    title: '导出功能全面优化',
    description: '重构导出系统，大幅提升导出速度和成功率，修复导出空白问题',
    features: [
      '新增多格式导出支持（PDF、PNG、JPG）',
      '支持多页PDF自动分页',
      '导出进度实时显示',
      '导出前样式预检功能'
    ],
    improvements: [
      '导出速度提升 80%（从 10-30秒 降至 2-5秒）',
      '简化导出逻辑，移除复杂的样式处理服务',
      '优化 html2canvas 配置，提高兼容性',
      '改进父元素 transform 处理，确保导出正确'
    ],
    bugfixes: [
      '修复导出文件为空白的问题',
      '修复导出内容颜色丢失的问题',
      '修复导出时样式不一致的问题',
      '修复缩放变换影响导出的问题'
    ]
  },
  {
    version: '1.1.0',
    date: '2026-01-20',
    type: 'minor',
    title: 'AI 功能增强',
    description: '新增 AI 分步生成和 JD 匹配功能，提升简历质量',
    features: [
      'AI 分步生成简历内容',
      'JD 岗位描述智能匹配',
      'AI 内容优化建议',
      '简历评分系统'
    ],
    improvements: [
      '优化 AI 响应速度',
      '改进 AI 生成内容质量',
      '增强 AI 建议的准确性'
    ]
  },
  {
    version: '1.0.0',
    date: '2026-01-01',
    type: 'major',
    title: '正式版发布',
    description: 'UIED 简历生成器正式上线，提供专业的简历制作服务',
    features: [
      '多种精美模板',
      '实时预览编辑',
      '响应式设计',
      '本地数据存储',
      '自动保存功能',
      '键盘快捷键支持'
    ]
  }
]

const features = [
  {
    icon: Sparkles,
    title: 'AI 智能生成',
    description: '基于 GPT-4 的智能简历生成，自动优化内容表达',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Palette,
    title: '多种模板',
    description: '8+ 精美模板，支持自定义颜色、字体和布局',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Download,
    title: '多格式导出',
    description: '支持 PDF、PNG、JPG 格式，高质量输出',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Zap,
    title: '实时预览',
    description: '所见即所得，编辑内容实时更新预览',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: Shield,
    title: '数据安全',
    description: '本地存储，数据不上传服务器，保护隐私',
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50'
  },
  {
    icon: Layout,
    title: '响应式设计',
    description: '完美适配桌面、平板和手机，随时随地编辑',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50'
  }
]

const stats = [
  { label: '用户数量', value: '10,000+', icon: TrendingUp },
  { label: '简历生成', value: '50,000+', icon: FileText },
  { label: '平均评分', value: '4.9/5.0', icon: Star },
  { label: '导出成功率', value: '99.8%', icon: CheckCircle }
]

export default function UpdatesPage() {
  const { t, locale } = useLanguage()
  const [expandedVersion, setExpandedVersion] = useState<string | null>(updateLogs[0].version)

  const getTypeColor = (type: UpdateLog['type']) => {
    switch (type) {
      case 'major':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'minor':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'patch':
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getTypeLabel = (type: UpdateLog['type']) => {
    switch (type) {
      case 'major':
        return locale === 'zh' ? '重大更新' : 'Major'
      case 'minor':
        return locale === 'zh' ? '功能更新' : 'Minor'
      case 'patch':
        return locale === 'zh' ? '修复更新' : 'Patch'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              {locale === 'zh' ? '持续更新中' : 'Continuous Updates'}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {locale === 'zh' ? '更新日志' : 'Updates & Changelog'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === 'zh' 
                ? '记录每一次进步，见证产品成长' 
                : 'Track every improvement, witness product growth'}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {locale === 'zh' ? '核心功能' : 'Core Features'}
            </h2>
            <p className="text-lg text-gray-600">
              {locale === 'zh' 
                ? '强大的功能，简单的操作' 
                : 'Powerful features, simple operation'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`${feature.bgColor} rounded-xl p-6 border border-gray-200`}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Update Logs Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {locale === 'zh' ? '版本历史' : 'Version History'}
            </h2>
            <p className="text-lg text-gray-600">
              {locale === 'zh' 
                ? '查看所有版本的更新内容' 
                : 'View all version updates'}
            </p>
          </motion.div>

          <div className="space-y-4">
            {updateLogs.map((log, index) => (
              <motion.div
                key={log.version}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedVersion(expandedVersion === log.version ? null : log.version)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {expandedVersion === log.version ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-2xl font-bold text-gray-900">{log.version}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(log.type)}`}>
                      {getTypeLabel(log.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {log.date}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedVersion === log.version && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="px-6 py-6 space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{log.title}</h3>
                          <p className="text-gray-600">{log.description}</p>
                        </div>

                        {log.features && log.features.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Gift className="h-5 w-5 text-green-600" />
                              <h4 className="font-semibold text-gray-900">
                                {locale === 'zh' ? '新增功能' : 'New Features'}
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {log.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700">
                                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {log.improvements && log.improvements.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-gray-900">
                                {locale === 'zh' ? '功能改进' : 'Improvements'}
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {log.improvements.map((improvement, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700">
                                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span>{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {log.bugfixes && log.bugfixes.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Wrench className="h-5 w-5 text-orange-600" />
                              <h4 className="font-semibold text-gray-900">
                                {locale === 'zh' ? 'Bug 修复' : 'Bug Fixes'}
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {log.bugfixes.map((bugfix, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700">
                                  <Bug className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                  <span>{bugfix}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {log.breaking && log.breaking.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Shield className="h-5 w-5 text-red-600" />
                              <h4 className="font-semibold text-red-900">
                                {locale === 'zh' ? '破坏性变更' : 'Breaking Changes'}
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {log.breaking.map((change, i) => (
                                <li key={i} className="flex items-start gap-2 text-red-700">
                                  <span className="text-red-600">!</span>
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {locale === 'zh' ? '立即开始制作简历' : 'Start Creating Your Resume'}
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              {locale === 'zh' 
                ? '使用最新版本，体验更快更稳定的简历制作服务' 
                : 'Use the latest version for faster and more stable resume creation'}
            </p>
            <Link href="/editor">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="h-5 w-5" />
                {locale === 'zh' ? '开始制作' : 'Get Started'}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
