import React from 'react'
import { Palette, LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  description: string
}

interface EditorSidebarProps {
  navigationItems: NavigationItem[]
  activeSection: string
  onSectionChange: (section: string) => void
  onShowTemplateSelector: () => void
}

export function EditorSidebar({
  navigationItems,
  activeSection,
  onSectionChange,
  onShowTemplateSelector
}: EditorSidebarProps) {
  const { t } = useLanguage()
  
  return (
    <div className="w-64 bg-white/50 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <div className="space-y-1">
        {/* 内容编辑组 */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">{t.editor.content}</h3>
          <nav className="space-y-1">
            {navigationItems.filter(item => item.id !== 'style').map((item) => {
              const IconComponent = item.icon
              const isActive = item.id === activeSection
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`relative w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-white text-blue-600 ring-1 ring-gray-200 shadow-sm'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:ring-1 hover:ring-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>
        
         {/* 底部操作区 */}
         <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={onShowTemplateSelector}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left text-gray-600 hover:bg-white hover:text-gray-900 hover:ring-1 hover:ring-gray-200 transition-all group"
            >
               <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                 <Palette className="h-5 w-5" />
               </div>
               <div className="text-sm font-medium">{t.editor.template}</div>
            </button>
 </div>
        </div>
      </div>
    </div>
  )
}
