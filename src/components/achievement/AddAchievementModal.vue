<script setup lang="ts">
import { ref, computed } from 'vue'
import ResourceUploader from './ResourceUploader.vue'
import { researchApi, portfolioApi, competitionAwardApi, type CreatePortfolioFormDTO } from '@/lib/api/achievement'
import { apiRequest } from '@/lib/api/apiClient'
import type { UploadFileResponse } from '@/lib/api/file'

const props = defineProps<{
  show: boolean
  type?: 'PORTFOLIO' | 'AWARD' | 'RESEARCH' | null
  initialData?: any // 用于编辑模式
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
  (e: 'success'): void
}>()

// 成果类型选项
const achievementTypes = [
  { id: 'PORTFOLIO', name: '作品' },
  { id: 'AWARD', name: '获奖' },
  { id: 'RESEARCH', name: '科研成果' }
]

// 错误状态
const error = ref('')

// 表单数据
const formData = ref({
  type: props.type || 'PORTFOLIO',
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  date: props.initialData?.date || '',
  tags: Array.isArray(props.initialData?.tags) ? props.initialData?.tags.join(',') : '',
  portfolioUrl: props.initialData?.portfolioUrl || '',
  competitionName: props.initialData?.competitionName || '',
  awardLevel: props.initialData?.awardLevel || '',
  issuer: props.initialData?.issuer || '',
  publicationType: props.initialData?.publicationType || '',
  publicationVenue: props.initialData?.publicationVenue || '',
  authors: Array.isArray(props.initialData?.authors) ? props.initialData?.authors.join(',') : '',
  attachments: [] as any[], // 存储上传的文件信息
  coverImage: null as File | null, // 添加封面图片字段
  researchFile: null as File | null // 添加研究文件字段
})

// 表单验证状态
const isValid = computed(() => {
  // 基本验证
  if (!formData.value.title || !formData.value.description) {
    return false
  }
  
  // 类型特定验证
  switch (formData.value.type) {
    case 'PORTFOLIO':
      return true // 作品无特殊必填项
    case 'AWARD':
      return !!formData.value.competitionName && !!formData.value.awardLevel
    case 'RESEARCH':
      return !!formData.value.publicationType && !!formData.value.authors
    default:
      return false
  }
})

// 当前成果ID
const currentAchievementId = ref<number | null>(null)

// 处理文件上传成功
const handleFileUploaded = (fileInfo: any) => {
  console.log('收到文件上传事件，文件信息:', {
    type: fileInfo.type,
    file: fileInfo.file ? {
      name: fileInfo.file.name,
      type: fileInfo.file.type,
      size: fileInfo.file.size
    } : null
  })

  // 根据文件类型设置对应的字段
  if (fileInfo.type === 'cover') {
    console.log('设置封面图片:', fileInfo.file.name)
    formData.value.coverImage = fileInfo.file
  } else if (fileInfo.type === 'research') {
    console.log('设置研究文件:', fileInfo.file.name)
    formData.value.researchFile = fileInfo.file
  }

  // 打印当前表单数据中的文件状态
  console.log('当前表单文件状态:', {
    coverImage: formData.value.coverImage ? {
      name: formData.value.coverImage.name,
      type: formData.value.coverImage.type,
      size: formData.value.coverImage.size
    } : null,
    researchFile: formData.value.researchFile ? {
      name: formData.value.researchFile.name,
      type: formData.value.researchFile.type,
      size: formData.value.researchFile.size
    } : null
  })
}

// 处理文件上传错误
const handleUploadError = (error: Error) => {
  console.error('文件上传失败:', error)
}

// 处理表单提交
const handleSubmit = async () => {
  if (!isValid.value) {
    console.log('表单验证未通过:', formData.value)
    return
  }

  try {
    let response
    // 根据类型处理不同字段
    switch (formData.value.type) {
      case 'PORTFOLIO': {
        // 检查文件对象
        console.log('formData.value:', formData.value)
        console.log('coverImage:', formData.value.coverImage)
        if (formData.value.coverImage) {
          console.log('coverImage type:', Object.prototype.toString.call(formData.value.coverImage))
          console.log('是否为File实例:', formData.value.coverImage instanceof File)
          console.log('coverImage详情:', {
            name: formData.value.coverImage.name,
            type: formData.value.coverImage.type,
            size: formData.value.coverImage.size,
            lastModified: formData.value.coverImage.lastModified
          })
        }

        // 处理标签 - 确保是非空字符串
        const tags = formData.value.tags
          ? formData.value.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag)
              .join(',')
          : ''
        
        // 创建作品集数据
        const portfolioData: CreatePortfolioFormDTO = {
          title: formData.value.title.trim(),
          description: formData.value.description.trim(),
          projectUrl: formData.value.portfolioUrl?.trim() || '',
          category: 'other',
          isPublic: 'true',
          tags: tags
        }

        // 如果有封面图片，直接添加到数据中
        if (formData.value.coverImage instanceof File) {
          console.log('添加封面图片:', {
            name: formData.value.coverImage.name,
            type: formData.value.coverImage.type,
            size: formData.value.coverImage.size
          })
          portfolioData.coverImage = formData.value.coverImage
        } else {
          console.log('没有找到有效的封面图片文件')
        }

        // 打印详细的请求数据
        console.log('创建作品集，提交数据（详细）:', {
          title: {
            value: portfolioData.title,
            type: typeof portfolioData.title
          },
          description: {
            value: portfolioData.description,
            type: typeof portfolioData.description
          },
          projectUrl: {
            value: portfolioData.projectUrl,
            type: typeof portfolioData.projectUrl
          },
          category: {
            value: portfolioData.category,
            type: typeof portfolioData.category
          },
          isPublic: {
            value: portfolioData.isPublic,
            type: typeof portfolioData.isPublic
          },
          tags: {
            value: portfolioData.tags,
            type: typeof portfolioData.tags
          },
          coverImage: portfolioData.coverImage ? {
            name: portfolioData.coverImage.name,
            type: portfolioData.coverImage.type,
            size: portfolioData.coverImage.size
          } : null
        })
        
        response = await portfolioApi.createPortfolioItem(portfolioData)
        break
      }
      case 'AWARD': {
        const awardData = {
          competitionName: formData.value.competitionName,
          awardLevel: formData.value.awardLevel,
          awardDate: formData.value.date,
          description: formData.value.description,
          isPublic: true
        }
        response = await competitionAwardApi.createAward(awardData)
        break
      }
      case 'RESEARCH': {
        console.log('=== 开始准备科研成果表单数据 ===')
        console.log('原始表单数据:', {
          title: formData.value.title,
          publicationType: formData.value.publicationType,
          authors: formData.value.authors,
          date: formData.value.date,
          description: formData.value.description,
          coverImage: formData.value.coverImage ? {
            name: formData.value.coverImage.name,
            type: formData.value.coverImage.type,
            size: formData.value.coverImage.size
          } : null,
          researchFile: formData.value.researchFile ? {
            name: formData.value.researchFile.name,
            type: formData.value.researchFile.type,
            size: formData.value.researchFile.size
          } : null
        })

        const researchFormData = new FormData()
        
        // 添加基本字段，确保与 CreateResearchDTO 完全匹配
        console.log('\n=== 开始构建 FormData ===')
        
        // 标题
        console.log('设置 title:', formData.value.title)
        researchFormData.append('title', formData.value.title)
        
        // 类型
        console.log('设置 type:', formData.value.publicationType)
        researchFormData.append('type', formData.value.publicationType)
        
        // 作者列表处理
        const authors = formData.value.authors
          .split(',')
          .map((author: string) => author.trim())
          .filter((author: string) => author)
          .join(',')
        console.log('设置 authors:', authors)
        researchFormData.append('authors', authors)
        
        // 发布日期
        console.log('设置 publicationDate:', formData.value.date)
        researchFormData.append('publicationDate', formData.value.date)
        
        // 摘要和描述
        console.log('设置 abstract:', formData.value.description)
        researchFormData.append('abstract', formData.value.description)
        console.log('设置 description:', formData.value.description)
        researchFormData.append('description', formData.value.description)
        
        // 是否公开
        console.log('设置 isPublic:', true)
        researchFormData.append('isPublic', 'true')
        
        // 封面图片（可选）
        if (formData.value.coverImage instanceof File) {
          console.log('设置 coverImage:', formData.value.coverImage.name)
          researchFormData.append('coverImage', formData.value.coverImage)
        } else {
          console.log('未设置 coverImage')
        }
        
        // 研究文件（可选）
        if (formData.value.researchFile instanceof File) { 
          const file = formData.value.researchFile  
          console.log('设置 file:', {
            name: file.name,
            type: file.type,
            size: file.size
          })
          researchFormData.append('file', file)
        } else {
          console.warn('未设置研究文件或文件格式不正确')
        }
        
        // 打印最终的 FormData 内容
        console.log('\n=== FormData 最终内容 ===')
        for (const [key, value] of researchFormData.entries()) {
          if (value instanceof File) {
            console.log(key + ':', {
              name: value.name,
              type: value.type,
              size: value.size
            })
          } else {
            console.log(key + ':', value)
          }
        }
        
        console.log('\n=== 开始发送请求... ===')
        response = await researchApi.createResearch(researchFormData)
        console.log('请求成功，响应:', response)
        break
      }
    }

    // 保存成果ID，用于后续文件上传
    if (response?.code === 200 || response?.success === true) { // 根据你API返回的成功标识来判断
      console.log('成功创建成果:', response.data)
      
      emit('success') // 1. 发出“成功”信号，给父组件听
      handleClose()   // 2. 调用现有的关闭方法，它会重置表单并发出“关闭”信号
      
    } else {
      // 可选：处理后端返回业务错误的情况
      const errorMsg = response?.message || '创建失败，但服务器未返回明确错误'
      console.error(errorMsg)
      error.value = errorMsg
    }
  } catch (err: any) {
    console.error('创建成果失败:', err)
    console.error('错误详情:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    error.value = err.message || '创建成果失败'
    
    // 显示错误提示
    alert('创建失败：' + error.value)
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    type: props.type || 'PORTFOLIO',
    title: '',
    description: '',
    date: '',
    tags: '',
    portfolioUrl: '',
    competitionName: '',
    awardLevel: '',
    issuer: '',
    publicationType: '',
    publicationVenue: '',
    authors: '',
    attachments: [],
    coverImage: null,
    researchFile: null
  }
  error.value = ''
}

// 关闭模态框
const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- 模态框头部 -->
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">添加成果</h3>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- 模态框内容 -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit">
          <!-- 成果类型 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">成果类型</label>
            <select 
              v-model="formData.type"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="type in achievementTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>
          
          <!-- 通用字段 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input 
              v-model="formData.title"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="成果标题"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="成果详细描述"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input 
              v-model="formData.date"
              type="date"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
            <input 
              v-model="formData.tags"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="用逗号分隔多个标签"
            />
          </div>
          
          <!-- 作品特有字段 -->
          <template v-if="formData.type === 'PORTFOLIO'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">作品链接</label>
              <input 
                v-model="formData.portfolioUrl"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="作品展示链接(可选)"
              />
            </div>
          </template>
          
          <!-- 获奖特有字段 -->
          <template v-if="formData.type === 'AWARD'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">竞赛名称</label>
              <input 
                v-model="formData.competitionName"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="竞赛或比赛名称"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">获奖级别</label>
              <select 
                v-model="formData.awardLevel"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择获奖级别</option>
                <option value="national">国家级</option>
                <option value="provincial">省级</option>
                <option value="municipal">市级</option>
                <option value="school">校级</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">颁发机构</label>
              <input 
                v-model="formData.issuer"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="颁发奖项的机构名称"
              />
            </div>
          </template>
          
          <!-- 科研特有字段 -->
          <template v-if="formData.type === 'RESEARCH'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">成果类型</label>
              <select 
                v-model="formData.publicationType"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择成果类型</option>
                <option value="paper">论文</option>
                <option value="patent">专利</option>
                <option value="book">著作</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">发表venue</label>
              <input 
                v-model="formData.publicationVenue"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="期刊/会议名称或专利申请号"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">作者</label>
              <input 
                v-model="formData.authors"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="用逗号分隔多个作者"
              />
            </div>
          </template>
          
          <!-- 文件上传 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">附件</label>
            <ResourceUploader 
              :type="formData.type"
              :achievementId="currentAchievementId"
              @uploaded="handleFileUploaded" 
              @upload-error="handleUploadError"
            />
          </div>
          
          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="handleClose"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="submit"
              :disabled="!isValid"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 