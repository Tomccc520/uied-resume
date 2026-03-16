/**
 * @copyright Tomda (https://www.tomda.top)
 * @copyright UIED技术团队 (https://fsuied.com)
 * @author UIED技术团队
 * @createDate 2025-09-22
 */


/**
 * 文件操作工具
 * 提供本地文件保存和加载功能，突出数据不存储在服务器上
 */

import { ResumeData } from '@/types/resume'

/**
 * 将简历数据保存为JSON文件到本地（带保存对话框）
 * @param resumeData 简历数据
 * @param filename 文件名（可选）
 */
export function saveResumeToFile(resumeData: ResumeData, filename?: string): void {
  try {
    // 生成文件名
    const defaultFilename = `${resumeData.personalInfo.name || '我的简历'}_${new Date().toISOString().split('T')[0]}.json`
    const finalFilename = filename || defaultFilename
    
    // 创建包含元数据的完整数据结构
    const fileData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      resumeData: resumeData,
      metadata: {
        appName: '简历助手',
        description: '此文件包含您的简历数据，可以重新导入到简历助手中继续编辑'
      }
    }
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(fileData, null, 2)
    
    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = finalFilename
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('保存简历失败:', error)
    throw new Error('保存简历失败，请重试')
  }
}

/**
 * 显示保存对话框（新的保存方式）
 * 这个函数用于触发保存对话框的显示
 */
export function showSaveDialog(): void {
  // 这个函数将由组件调用来显示保存对话框
  // 实际的保存逻辑在SaveDialog组件中处理
}

/**
 * 从本地JSON文件加载简历数据
 * @returns Promise<ResumeData> 简历数据
 */
export function loadResumeFromFile(): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    try {
      // 创建文件输入元素
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) {
          reject(new Error('未选择文件'))
          return
        }
        
        // 验证文件类型
        if (!file.name.endsWith('.json')) {
          reject(new Error('请选择JSON格式的文件'))
          return
        }
        
        // 读取文件内容
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const fileData = JSON.parse(content)
            
            // 验证文件格式
            if (fileData.resumeData) {
              // 新格式文件（包含元数据）
              resolve(fileData.resumeData)
            } else if (fileData.personalInfo) {
              // 旧格式文件（直接是简历数据）
              resolve(fileData as ResumeData)
            } else {
              reject(new Error('文件格式不正确，请选择有效的简历数据文件'))
            }
          } catch (parseError) {
            reject(new Error('文件内容解析失败，请检查文件格式'))
          }
        }
        
        reader.onerror = () => {
          reject(new Error('文件读取失败'))
        }
        
        reader.readAsText(file)
      }
      
      // 触发文件选择
      input.click()
    } catch (error) {
      reject(new Error('加载文件失败，请重试'))
    }
  })
}

/**
 * 验证简历数据格式
 * @param data 待验证的数据
 * @returns boolean 是否为有效的简历数据
 */
export function validateResumeData(data: unknown): data is ResumeData {
  if (!data || typeof data !== 'object') {
    return false
  }

  const candidate = data as Partial<ResumeData>
  return (
    Boolean(candidate.personalInfo) &&
    typeof candidate.personalInfo === 'object' &&
    Array.isArray(candidate.experience) &&
    Array.isArray(candidate.education) &&
    Array.isArray(candidate.skills) &&
    Array.isArray(candidate.projects)
  )
}

/**
 * 获取文件大小的友好显示
 * @param bytes 字节数
 * @returns string 格式化的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
