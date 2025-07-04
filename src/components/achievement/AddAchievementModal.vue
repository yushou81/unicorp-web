<script setup lang="ts">
import { ref, computed } from 'vue'
import ResourceUploader from './ResourceUploader.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

// 成果类型选项
const achievementTypes = [
  { id: 'portfolio', name: '作品' },
  { id: 'award', name: '获奖' },
  { id: 'research', name: '科研成果' }
]

// 表单数据
const formData = ref({
  type: 'portfolio',
  title: '',
  description: '',
  date: '',
  tags: '',
  // 作品特有字段
  portfolioUrl: '',
  // 获奖特有字段
  competitionName: '',
  awardLevel: '',
  issuer: '',
  // 科研成果特有字段
  publicationType: '',
  publicationVenue: '',
  authors: '',
  // 通用
  attachments: []
})

// 表单验证状态
const isValid = computed(() => {
  // 基本验证
  if (!formData.value.title || !formData.value.description) {
    return false
  }
  
  // 类型特定验证
  switch (formData.value.type) {
    case 'portfolio':
      return true // 作品无特殊必填项
    case 'award':
      return !!formData.value.competitionName && !!formData.value.awardLevel
    case 'research':
      return !!formData.value.publicationType && !!formData.value.authors
    default:
      return false
  }
})

// 处理表单提交
const handleSubmit = () => {
  if (!isValid.value) return

  // 根据类型处理不同字段
  const submitData = {
    type: formData.value.type,
    title: formData.value.title,
    description: formData.value.description,
    date: formData.value.date,
    tags: formData.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    attachments: formData.value.attachments
  }

  // 添加类型特定字段
  switch (formData.value.type) {
    case 'portfolio':
      Object.assign(submitData, {
        portfolioUrl: formData.value.portfolioUrl
      })
      break
    case 'award':
      Object.assign(submitData, {
        competitionName: formData.value.competitionName,
        awardLevel: formData.value.awardLevel,
        issuer: formData.value.issuer
      })
      break
    case 'research':
      Object.assign(submitData, {
        publicationType: formData.value.publicationType,
        publicationVenue: formData.value.publicationVenue,
        authors: formData.value.authors.split(',').map(author => author.trim()).filter(author => author)
      })
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
    type: 'portfolio',
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
    attachments: []
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
          <template v-if="formData.type === 'portfolio'">
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
          <template v-if="formData.type === 'award'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">竞赛名称</label>
              <input 
                v-model="formData.competitionName"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="竞赛或荣誉名称"
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
                placeholder="颁发机构名称"
              />
            </div>
          </template>
          
          <!-- 科研成果特有字段 -->
          <template v-if="formData.type === 'research'">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">附件上传</label>
            <ResourceUploader @file-uploaded="handleFileUploaded" />
            
            <!-- 显示已上传的文件 -->
            <div v-if="formData.attachments.length > 0" class="mt-2">
              <div v-for="(file, index) in formData.attachments" :key="index" class="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-1">
                <span class="text-sm text-gray-700">{{ file.name }}</span>
                <button 
                  type="button"
                  @click="formData.attachments.splice(index, 1)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- 模态框底部 -->
      <div class="px-6 py-4 border-t bg-gray-50 flex justify-end">
        <button 
          type="button"
          @click="handleClose"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
        >
          取消
        </button>
        <button 
          type="button"
          @click="handleSubmit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          :disabled="!isValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isValid }"
        >
          提交
        </button>
      </div>
    </div>
  </div>
</template> 