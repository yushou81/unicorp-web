<script setup lang="ts">
import { ref, computed } from 'vue'
import ResourceUploader from './ResourceUploader.vue'

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
  attachments: props.initialData?.attachments || []
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

// 处理表单提交
const handleSubmit = () => {
  if (!isValid.value) return

  // 根据类型处理不同字段
  const baseData = {
    type: formData.value.type,
    title: formData.value.title,
    description: formData.value.description,
    date: formData.value.date,
    tags: formData.value.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
    attachments: formData.value.attachments
  }

  let submitData: any = { ...baseData }

  // 添加类型特定字段
  switch (formData.value.type) {
    case 'PORTFOLIO':
      submitData = {
        ...submitData,
        portfolioUrl: formData.value.portfolioUrl
      }
      break
    case 'AWARD':
      submitData = {
        ...submitData,
        competitionName: formData.value.competitionName,
        awardLevel: formData.value.awardLevel,
        issuer: formData.value.issuer
      }
      break
    case 'RESEARCH':
      submitData = {
        ...submitData,
        publicationType: formData.value.publicationType,
        publicationVenue: formData.value.publicationVenue,
        authors: formData.value.authors.split(',').map((author: string) => author.trim()).filter((author: string) => author)
      }
      break
  }

  emit('submit', submitData)
}

// 处理文件上传
const handleFileUploaded = (fileInfo: any) => {
  formData.value.attachments.push(fileInfo)
}

// 重置表单
const resetForm = () => {
  formData.value = {
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
    attachments: props.initialData?.attachments || []
  }
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
            <ResourceUploader @uploaded="handleFileUploaded" />
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