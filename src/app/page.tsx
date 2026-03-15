/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2026-03-14
 */

'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUp,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  GraduationCap,
  LayoutTemplate,
  Shield,
  Sparkles,
  Star,
  Target,
  Wand2,
  Workflow,
  Zap
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollFadeIn, { StaggerFadeIn } from '@/components/ScrollFadeIn'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * 模板展示卡片
 * 使用统一结构渲染模板卖点，保持样式一致
 */
function TemplateShowcaseCard({
  title,
  desc,
  tags,
  gradient
}: {
  title: string
  desc: string
  tags: string[]
  gradient: string
}) {
  return (
    <motion.article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className={`h-24 rounded-lg ${gradient} p-3`}>
          <div className="space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/90" />
            <div className="h-2 w-32 rounded-full bg-white/70" />
            <div className="h-2 w-20 rounded-full bg-white/70" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-1.5 rounded-full bg-white/70" />
            <div className="h-1.5 rounded-full bg-white/70" />
            <div className="h-1.5 rounded-full bg-white/70" />
          </div>
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  )
}

/**
 * 首页
 * 重构为“模板展示 + AI能力 + 工作流”三段式落地页
 */
export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { t, locale } = useLanguage()

  /**
   * 监听滚动位置
   * 控制右下角返回顶部按钮显隐
   */
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      window.requestAnimationFrame(() => {
        setShowScrollTop(window.scrollY > 520)
        ticking = false
      })
      ticking = true
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * 模板展示数据
   * 根据语言环境提供简短可读的模板定位文案
   */
  const templateHighlights = useMemo(() => {
    if (locale === 'en') {
      return [
        {
          title: 'Metro Sidebar',
          desc: 'A strong two-column hierarchy for recruiters who scan quickly.',
          tags: ['Two Column', 'ATS Friendly', 'Modern'],
          gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600'
        },
        {
          title: 'Editorial Center',
          desc: 'Serif-led one-column structure for elegant storytelling resumes.',
          tags: ['One Column', 'Premium Tone', 'Readable'],
          gradient: 'bg-gradient-to-br from-amber-500 to-orange-500'
        },
        {
          title: 'Creative Cards',
          desc: 'Modular blocks for portfolios, project-heavy and product roles.',
          tags: ['Card Layout', 'Visual', 'Project First'],
          gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600'
        }
      ]
    }

    return [
      {
        title: '都会侧栏',
        desc: '深色侧栏 + 明亮内容区，适合招聘方快速扫描关键经历。',
        tags: ['双栏', 'ATS友好', '现代感'],
        gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600'
      },
      {
        title: '叙事居中',
        desc: '衬线排版单栏结构，兼顾专业感与阅读舒适度。',
        tags: ['单栏', '高级感', '可读性'],
        gradient: 'bg-gradient-to-br from-amber-500 to-orange-500'
      },
      {
        title: '创意卡片',
        desc: '模块化信息块，适合项目驱动型岗位与作品导向型候选人。',
        tags: ['卡片', '视觉化', '项目优先'],
        gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600'
      }
    ]
  }, [locale])

  /**
   * 招聘场景入口
   * 提供面向真实投递场景的快捷入口，帮助用户直接进入对应编辑路径。
   */
  const workflowEntries = useMemo(() => {
    if (locale === 'en') {
      return [
        {
          title: 'Campus Application',
          desc: 'Start from education and projects, then complete skills and summary.',
          href: '/editor?focus=education',
          icon: GraduationCap
        },
        {
          title: 'Engineering Role',
          desc: 'Jump to experience and skills first, keep technical highlights concise.',
          href: '/editor?focus=experience',
          icon: Workflow
        },
        {
          title: 'Product / Operation',
          desc: 'Build project impact first, then polish wording with AI panel.',
          href: '/editor?focus=projects&panel=ai',
          icon: Target
        },
        {
          title: 'Universal Delivery',
          desc: 'Open template panel directly and choose ATS-friendly layout first.',
          href: '/editor?panel=template',
          icon: Building2
        }
      ]
    }

    return [
      {
        title: '校招应届投递',
        desc: '优先完善教育、项目与技能模块，再补个人总结。',
        href: '/editor?focus=education',
        icon: GraduationCap
      },
      {
        title: '技术岗社招',
        desc: '先写工作经历与核心技能，突出复杂项目与性能指标。',
        href: '/editor?focus=experience',
        icon: Workflow
      },
      {
        title: '产品/运营岗位',
        desc: '先整理项目成果，再打开 AI 面板打磨表达与关键词。',
        href: '/editor?focus=projects&panel=ai',
        icon: Target
      },
      {
        title: '通用模板起步',
        desc: '直接打开模板面板，先定 ATS 友好的版式再填内容。',
        href: '/editor?panel=template',
        icon: Building2
      }
    ]
  }, [locale])

  /**
   * 返回顶部
   * 用平滑滚动提升页面交互体验
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-[#f8fafc] to-[#eef6ff] px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="pointer-events-none absolute -left-16 top-12 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
            <ScrollFadeIn direction="up">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t.home.hero.tag}
                </div>
                <h1 className="mt-6 text-4xl font-bold leading-[1.14] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  <span className="text-cyan-700">AI</span> {t.home.hero.titlePrefix}
                  <span className="ml-2 text-amber-600">{t.home.hero.titleSuffix}</span>
                </h1>
                <p className="mt-4 text-lg font-medium text-slate-500 sm:text-xl">{t.home.hero.subtitle}</p>
                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 lg:mx-0">{t.home.hero.desc}</p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/editor"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Wand2 className="h-4 w-4" />
                    {t.home.hero.start}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#template-showcase"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    {locale === 'en' ? 'View Templates' : '查看模板'}
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 text-center lg:text-left">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">12+</p>
                    <p className="mt-1 text-xs text-slate-500">{locale === 'en' ? 'Template Styles' : '模板风格'}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">98%</p>
                    <p className="mt-1 text-xs text-slate-500">{locale === 'en' ? 'ATS Pass Focus' : 'ATS通过导向'}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">&lt; 5m</p>
                    <p className="mt-1 text-xs text-slate-500">{locale === 'en' ? 'First Draft' : '首版生成'}</p>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn direction="up">
              <div className="mx-auto w-full max-w-[460px]">
                <div className="relative rounded-3xl border border-slate-200 bg-white p-6" style={{ aspectRatio: '1 / 1.33' }}>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="h-2.5 w-32 rounded-full bg-slate-900" />
                    <div className="mt-2 h-2 w-24 rounded-full bg-slate-400" />
                    <div className="mt-4 grid gap-2">
                      <div className="h-2 rounded-full bg-slate-200" />
                      <div className="h-2 rounded-full bg-slate-200" />
                      <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-500">{locale === 'en' ? 'Template Match' : '模板匹配'}</div>
                      <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">98</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" />
                      <div className="h-2 w-5/6 rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
                      <div className="h-2 w-4/6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
                    </div>
                  </div>
                  <div className="absolute -right-5 top-8 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-800">
                    <div className="flex items-center gap-1">
                      <Bot className="h-3.5 w-3.5" />
                      {locale === 'en' ? 'AI Rewrite' : 'AI重写'}
                    </div>
                  </div>
                  <div className="absolute -left-5 bottom-10 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                    <div className="flex items-center gap-1">
                      <FileCheck2 className="h-3.5 w-3.5" />
                      {locale === 'en' ? 'ATS Ready' : 'ATS就绪'}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto w-full max-w-7xl">
            <ScrollFadeIn direction="up">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {locale === 'en' ? 'Start by Hiring Scenario' : '按投递场景快速开始'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {locale === 'en'
                      ? 'Choose one entry and land directly on the right editing path.'
                      : '从真实招聘流程出发，直接进入对应模块，减少无效点击。'}
                  </p>
                </div>
              </div>
            </ScrollFadeIn>

            <StaggerFadeIn className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" staggerDelay={0.08} direction="up">
              {workflowEntries.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300"
                  >
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-2 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                      {locale === 'en' ? 'Open editor' : '进入编辑器'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                )
              })}
            </StaggerFadeIn>
          </div>
        </section>

        <section id="template-showcase" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-7xl">
            <ScrollFadeIn direction="up">
              <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  {locale === 'en' ? 'Template Library' : '模板库升级'}
                </div>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {locale === 'en' ? 'Not Generic Templates, But Hiring-Focused Layouts' : '不是“套模板”，而是面向招聘筛选的版式'}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600">
                  {locale === 'en'
                    ? 'Each template now has a stronger hierarchy, clearer section rhythm, and faster readability for HR and ATS systems.'
                    : '每套模板都强调信息层级、章节节奏和快速可扫读性，让 HR 与 ATS 都更容易抓到你的关键价值。'}
                </p>
              </div>
            </ScrollFadeIn>

            <StaggerFadeIn className="grid gap-5 md:grid-cols-3" staggerDelay={0.1} direction="up">
              {templateHighlights.map((template) => (
                <TemplateShowcaseCard
                  key={template.title}
                  title={template.title}
                  desc={template.desc}
                  tags={template.tags}
                  gradient={template.gradient}
                />
              ))}
            </StaggerFadeIn>
          </div>
        </section>

        <section id="features" className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-7xl">
            <ScrollFadeIn direction="up">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.home.features.title}</h2>
                <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600">{t.home.features.desc}</p>
              </div>
            </ScrollFadeIn>

            <StaggerFadeIn className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" staggerDelay={0.08} direction="up">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="inline-flex rounded-lg bg-cyan-100 p-2 text-cyan-700">
                  <Bot className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{t.home.features.ai.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t.home.features.ai.desc}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-cyan-600" />
                    {t.home.features.ai.list1}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-cyan-600" />
                    {t.home.features.ai.list2}
                  </li>
                </ul>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{t.home.features.realtime.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t.home.features.realtime.desc}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
                    {t.home.features.realtime.list1}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
                    {t.home.features.realtime.list2}
                  </li>
                </ul>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{t.home.features.export.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t.home.features.export.desc}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-600" />
                    {t.home.features.export.list1}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-600" />
                    {t.home.features.export.list2}
                  </li>
                </ul>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="inline-flex rounded-lg bg-violet-100 p-2 text-violet-700">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{t.home.features.privacy.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t.home.features.privacy.desc}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-violet-600" />
                    {t.home.features.privacy.list1}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-violet-600" />
                    {t.home.features.privacy.list2}
                  </li>
                </ul>
              </article>
            </StaggerFadeIn>
          </div>
        </section>

        <section className="bg-[#f8fafc] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <ScrollFadeIn direction="up">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  {locale === 'en' ? 'Three-Step Editing Workflow' : '三步完成高质量简历编辑'}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  {locale === 'en'
                    ? 'Designed for speed and quality: structure first, language next, then export.'
                    : '先结构、再语言、后导出。减少来回返工，把编辑节奏固定下来。'}
                </p>
              </div>
            </ScrollFadeIn>

            <StaggerFadeIn className="grid gap-4 md:grid-cols-3" staggerDelay={0.1} direction="up">
              {[
                {
                  title: locale === 'en' ? '1. Build Structure' : '1. 先搭结构',
                  desc: locale === 'en' ? 'Fill core sections with quick template switch.' : '先确定模板，再填核心模块，减少后续返工。',
                  icon: LayoutTemplate,
                  tone: 'from-cyan-500 to-blue-600'
                },
                {
                  title: locale === 'en' ? '2. AI Polish' : '2. AI润色',
                  desc: locale === 'en' ? 'Use AI panel to rewrite and boost keyword relevance.' : '使用 AI 面板提升表达和关键词匹配度。',
                  icon: Wand2,
                  tone: 'from-amber-500 to-orange-500'
                },
                {
                  title: locale === 'en' ? '3. Export Delivery' : '3. 导出交付',
                  desc: locale === 'en' ? 'Finalize as PDF/PNG/JSON for delivery and backup.' : '导出 PDF/PNG/JSON，兼顾投递与备份。',
                  icon: FileCheck2,
                  tone: 'from-emerald-500 to-teal-600'
                }
              ].map((step) => (
                <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className={`inline-flex rounded-xl bg-gradient-to-br p-2 text-white ${step.tone}`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
                </article>
              ))}
            </StaggerFadeIn>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <ScrollFadeIn direction="up">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.home.testimonials.title}</h2>
                <p className="mt-3 text-base text-slate-600">{t.home.testimonials.desc}</p>
              </div>
            </ScrollFadeIn>

            <StaggerFadeIn className="grid gap-5 md:grid-cols-3" staggerDelay={0.08} direction="up">
              {[t.home.testimonials.user1, t.home.testimonials.user2, t.home.testimonials.user3].map((user) => (
                <article key={user.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-3 flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, index) => (
                      <Star key={`${user.name}-${index}`} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-slate-700">“{user.text}”</p>
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.role}</div>
                  </div>
                </article>
              ))}
            </StaggerFadeIn>
          </div>
        </section>

        <section className="bg-[#f8fafc] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-4xl">
            <ScrollFadeIn direction="up">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.home.faq.title}</h2>
                <p className="mt-3 text-base text-slate-600">{t.home.faq.desc}</p>
              </div>
            </ScrollFadeIn>

            <StaggerFadeIn className="space-y-3" staggerDelay={0.06} direction="up">
              {[
                { q: t.home.faq.q1, a: t.home.faq.a1 },
                { q: t.home.faq.q2, a: t.home.faq.a2 },
                { q: t.home.faq.q3, a: t.home.faq.a3 },
                { q: t.home.faq.q4, a: t.home.faq.a4 },
                { q: t.home.faq.q5, a: t.home.faq.a5 }
              ].map((item, index) => (
                <article key={item.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-slate-900 sm:text-base">{item.q}</span>
                    <motion.div animate={{ rotate: openFaqIndex === index ? 180 : 0 }}>
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24 }}
                      >
                        <div className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600">{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              ))}
            </StaggerFadeIn>
          </div>
        </section>

        <section className="relative overflow-hidden bg-slate-900 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.home.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">{t.home.cta.desc}</p>
            <div className="mt-8">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <Sparkles className="h-4 w-4" />
                {t.home.cta.button}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-7 right-7 z-50 rounded-xl bg-slate-900 p-3 text-white transition hover:bg-slate-800"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
