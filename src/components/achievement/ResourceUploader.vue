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

interface Props {
  allowedTypes?: string[]
  maxSize?: number // 单位：字节
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowedTypes: () => ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  maxSize: 10 * 1024 * 1024, // 默认10MB
  multiple: false
})

const emit = defineEmits<{
  (e: 'upload-success', files: File[]): void
  (e: 'upload-error', error: Error): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const files = ref<File[]>([])
const uploading = ref(false)

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
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const uploadFiles = async () => {
  try {
    uploading.value = true
    // TODO: 实现文件上传逻辑
    emit('upload-success', files.value)
  } catch (error) {
    emit('upload-error', error as Error)
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