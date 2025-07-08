<template>
  <div class="space-y-4">
    <!-- 文件上传区域 -->
    <div 
      class="border-2 border-dashed rounded-lg p-6 text-center"
      :class="[
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500',
        'transition-colors duration-200'
      ]"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div class="space-y-2">
        <div class="text-4xl mb-2">📁</div>
        <p class="text-gray-700">
          将文件拖放到此处，或
          <button 
            type="button"
            class="text-blue-600 hover:text-blue-700 font-medium"
            @click="triggerFileInput"
          >
            点击上传
          </button>
        </p>
        <p class="text-sm text-gray-500">
          支持的文件类型: {{ allowedTypes.join(', ') }}
        </p>
        <p class="text-sm text-gray-500">
          单个文件大小限制: {{ formatFileSize(maxSize) }}
        </p>
      </div>
      <input
        ref="fileInput"
        type="file"
        :accept="allowedTypes.join(',')"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- 文件列表 -->
    <div v-if="files.length > 0" class="space-y-2">
      <div 
        v-for="(file, index) in files" 
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <span class="text-xl">{{ getFileIcon(file.type) }}</span>
          <div>
            <p class="text-sm font-medium text-gray-700">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <button
          type="button"
          class="text-red-600 hover:text-red-700"
          @click="removeFile(index)"
        >
          删除
        </button>
      </div>
    </div>

    <!-- 上传按钮 -->
    <div v-if="files.length > 0" class="flex justify-end">
      <button
        type="button"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        :disabled="uploading"
        @click="uploadFiles"
      >
        {{ uploading ? '上传中...' : '开始上传' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { researchApi, portfolioApi, competitionAwardApi } from '@/lib/api/achievement'

interface Props {
  allowedTypes?: string[]
  maxSize?: number // 单位：字节
  multiple?: boolean
  type?: 'PORTFOLIO' | 'AWARD' | 'RESEARCH' // 添加成果类型
  achievementId?: number // 添加成果ID
}

interface FileInfo {
  id: number
  resourceName: string
  resourceUrl: string
  resourceType: string
  uploadTime: string
}

const props = withDefaults(defineProps<Props>(), {
  allowedTypes: () => ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  maxSize: 10 * 1024 * 1024, // 默认10MB
  multiple: true, // 默认支持多文件上传
  type: undefined,
  achievementId: undefined
})

const emit = defineEmits<{
  (e: 'uploaded', fileInfo: FileInfo): void
  (e: 'upload-error', error: Error): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const files = ref<File[]>([])
const uploading = ref(false)
const error = ref('')

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    addFiles(Array.from(input.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (newFiles: File[]) => {
  const validFiles = newFiles.filter(file => {
    const isValidType = props.allowedTypes.some(type => 
      file.name.toLowerCase().endsWith(type.toLowerCase())
    )
    const isValidSize = file.size <= props.maxSize
    return isValidType && isValidSize
  })

  if (!props.multiple) {
    files.value = validFiles.slice(0, 1)
  } else {
    files.value = [...files.value, ...validFiles]
  }

  // 如果没有 achievementId，说明是在创建成果时上传文件
  if (!props.achievementId) {
    validFiles.forEach(file => {
      const isImage = file.type.startsWith('image/')
      console.log('立即处理文件:', file.name, '是否为图片:', isImage)
      
      if (props.type === 'RESEARCH') {
        // 科研成果的文件处理
        if (isImage) {
          console.log('发送科研成果封面图片事件')
          emit('uploaded', { file, type: 'cover' })
        } else {
          console.log('发送研究文件事件')
          emit('uploaded', { file, type: 'research' })
        }
      } else if (props.type === 'PORTFOLIO') {
        // 作品集的文件处理
        if (isImage) {
          console.log('发送作品集封面图片事件')
          emit('uploaded', { file, type: 'cover' })
        }
      }
    })
  }
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const uploadFiles = async () => {
  if (files.value.length === 0) return
  
  uploading.value = true
  error.value = ''
  
  try {
    // 如果没有achievementId，说明是在创建成果时上传文件
    if (!props.achievementId) {
      console.log('准备处理文件上传，文件列表:', files.value.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size
      })))
      
      files.value.forEach(file => {
        // 判断是否为图片文件
        const isImage = file.type.startsWith('image/')
        console.log('处理文件:', file.name, '是否为图片:', isImage)
        
        if (props.type === 'RESEARCH') {
          if (isImage) {
            console.log('发送封面图片事件')
            emit('uploaded', { file, type: 'cover' })
          } else {
            console.log('发送研究文件事件')
            emit('uploaded', { file, type: 'research' })
          }
        }
      })
      // 清空文件列表
      files.value = []
      uploading.value = false
      return
    }

    // 如果有achievementId，按原来的逻辑处理
    const uploadPromises = files.value.map(async (file) => {
      let response
      if (props.type === 'RESEARCH') {
        const isImage = file.type.startsWith('image/')
        if (isImage) {
          response = await researchApi.uploadResearchCover(props.achievementId!, file)
          emit('uploaded', { file, type: 'cover' })
        } else {
          response = await researchApi.uploadResearchFile(props.achievementId!, file)
          emit('uploaded', { file, type: 'research' })
        }
      } else if (props.type === 'PORTFOLIO') {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('resourceType', file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT')
        response = await portfolioApi.uploadPortfolioResource(props.achievementId!, formData)
        emit('uploaded', response?.data)
      } else if (props.type === 'AWARD') {
        response = await competitionAwardApi.uploadCertificate(props.achievementId!, file)
        emit('uploaded', response?.data)
      }
      return response?.data
    })

    const results = await Promise.all(uploadPromises)
    // 清空文件列表
    files.value = []
  } catch (err: any) {
    console.error('文件上传失败:', err)
    error.value = err.message || '文件上传失败'
    emit('upload-error', err)
  } finally {
    uploading.value = false
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const getFileIcon = (type: string) => {
  if (type.includes('image')) return '🖼️'
  if (type.includes('pdf')) return '📄'
  if (type.includes('word')) return '📝'
  return '📁'
}
</script> 