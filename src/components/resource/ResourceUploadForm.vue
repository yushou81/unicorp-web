<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h2 class="text-xl font-bold text-blue-700 mb-6">上传资源</h2>
    
    <form @submit.prevent="submitForm">
      <!-- 资源标题 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          资源标题 <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          v-model="formData.title"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="请输入资源标题（2-100字）"
          required
          minlength="2"
          maxlength="100"
        />
      </div>
      
      <!-- 资源类型 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          资源类型 <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div v-for="type in resourceTypes" :key="type" class="flex items-center">
            <input 
              type="radio" 
              :id="'type-' + type" 
              :value="type" 
              v-model="formData.resourceType"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              required
            />
            <label :for="'type-' + type" class="ml-2 text-sm text-gray-700">{{ type }}</label>
          </div>
        </div>
      </div>
      
      <!-- 资源描述 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          资源描述
        </label>
        <textarea 
          v-model="formData.description"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="请详细描述该资源的内容、用途和特点（500字以内）"
          maxlength="500"
        ></textarea>
      </div>
      
      <!-- 可见性 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          可见范围
        </label>
        <div class="space-y-2">
          <div class="flex items-center">
            <input 
              type="radio" 
              id="visibility-public" 
              value="public" 
              v-model="formData.visibility"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="visibility-public" class="ml-2 text-gray-700">
              公开 - 所有用户可见
            </label>
          </div>
          <div class="flex items-center">
            <input 
              type="radio" 
              id="visibility-organization" 
              value="organization_only" 
              v-model="formData.visibility"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500" 
            />
            <label for="visibility-organization" class="ml-2 text-gray-700">
              组织内 - 仅本组织内用户可见
            </label>
          </div>
          <div class="flex items-center">
            <input 
              type="radio" 
              id="visibility-private" 
              value="private" 
              v-model="formData.visibility"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="visibility-private" class="ml-2 text-gray-700">
              私有 - 仅自己可见
            </label>
          </div>
        </div>
      </div>
      
      <!-- 文件上传 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          上传文件 <span class="text-red-500">*</span>
        </label>
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
          :class="{'border-blue-500 bg-blue-50': isDragging}"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onFileDrop"
          @click="triggerFileInput"
        >
          <input 
            type="file" 
            ref="fileInput" 
            @change="onFileChange" 
            class="hidden" 
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.zip,.rar"
          />
          
          <div v-if="!selectedFile">
            <p class="text-sm text-gray-600">
              拖放文件到此处，或 <span class="text-blue-600 font-medium">点击上传</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">支持PDF、Word、PPT、Excel、图片、视频等格式</p>
          </div>
          
          <div v-else class="text-left">
            <div class="flex items-center">
              <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-gray-700 font-medium">{{ selectedFile.name }}</span>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span>{{ formatFileSize(selectedFile.size) }}</span>
              <button 
                type="button" 
                @click.stop="clearSelectedFile" 
                class="ml-2 text-red-600 hover:text-red-800"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 专利/著作权图片上传（可选） -->
      <div class="mb-6" v-if="['专利', '著作权'].includes(formData.resourceType)">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          专利/著作权图片上传（可选）
        </label>
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
          :class="{'border-blue-500 bg-blue-50': isImageDragging}"
          @dragover.prevent="isImageDragging = true"
          @dragleave.prevent="isImageDragging = false"
          @drop.prevent="onImageDrop"
          @click="triggerImageInput"
        >
          <input 
            type="file" 
            ref="imageInput" 
            @change="onImageChange" 
            class="hidden" 
            accept=".jpg,.jpeg,.png,.gif"
          />
          
          <div v-if="!selectedImage">
            <p class="text-sm text-gray-600">
              拖放图片到此处，或 <span class="text-blue-600 font-medium">点击上传</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">支持JPG、PNG、GIF等图片格式</p>
          </div>
          
          <div v-else class="text-left">
            <div class="flex items-center">
              <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-700 font-medium">{{ selectedImage.name }}</span>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span>{{ formatFileSize(selectedImage.size) }}</span>
              <button 
                type="button" 
                @click.stop="clearSelectedImage" 
                class="ml-2 text-red-600 hover:text-red-800"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 提交按钮 -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="uploading"
        >
          {{ uploading ? '上传中...' : '提交' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadResource } from '@/lib/api/resource'

// 表单数据
const formData = ref({
  title: '',
  resourceType: '',
  description: '',
  visibility: 'public' as 'public' | 'private' | 'organization_only'
})

// 资源类型列表
const resourceTypes = [
  '实验设备',
  '技术文档',
  '数据集',
  '教学案例',
  '课件',
  '精品课程',
  '著作权',
  '专利'
]

// 文件上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)

// 图片上传相关（专利/著作权）
const imageInput = ref<HTMLInputElement | null>(null)
const selectedImage = ref<File | null>(null)
const isImageDragging = ref(false)

// 上传状态
const uploading = ref(false)

// 文件拖放处理
const onFileDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files.length) {
    handleFileSelection(event.dataTransfer.files[0])
  }
}

// 文件选择处理
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    handleFileSelection(target.files[0])
  }
}

// 处理文件选择
const handleFileSelection = (file: File) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  
  if (file.size > maxSize) {
    alert('文件大小不能超过100MB')
    return
  }
  
  selectedFile.value = file
}

// 清除选择的文件
const clearSelectedFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 触发文件选择器
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 图片拖放处理
const onImageDrop = (event: DragEvent) => {
  isImageDragging.value = false
  if (event.dataTransfer?.files.length) {
    handleImageSelection(event.dataTransfer.files[0])
  }
}

// 图片选择处理
const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    handleImageSelection(target.files[0])
  }
}

// 处理图片选择
const handleImageSelection = (file: File) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (file.size > maxSize) {
    alert('图片大小不能超过10MB')
    return
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    alert('请上传有效的图片文件(JPG, PNG, GIF)')
    return
  }
  
  selectedImage.value = file
}

// 清除选择的图片
const clearSelectedImage = () => {
  selectedImage.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// 触发图片选择器
const triggerImageInput = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 提交表单
const submitForm = async () => {
  if (!selectedFile.value && !['专利', '著作权'].includes(formData.value.resourceType)) {
    alert('请上传资源文件')
    return
  }
  
  uploading.value = true
  
  try {
    const data = {
      title: formData.value.title,
      resourceType: formData.value.resourceType,
      description: formData.value.description,
      visibility: formData.value.visibility,
      file: selectedFile.value || undefined,
      image: selectedImage.value || undefined
    }
    
    console.log('提交数据:', data)
    
    const response = await uploadResource(data)
    
    if (response && response.code === 200) {
      alert('资源上传成功')
      // 重置表单
      formData.value = {
        title: '',
        resourceType: '',
        description: '',
        visibility: 'public'
      }
      clearSelectedFile()
      clearSelectedImage()
    } else {
      alert('上传失败: ' + (response?.message || '未知错误'))
    }
  } catch (error: any) {
    console.error('上传资源失败:', error)
    alert('上传失败: ' + (error.message || '未知错误'))
  } finally {
    uploading.value = false
  }
}

// 对外提供的函数
defineExpose({
  resetForm: () => {
    formData.value = {
      title: '',
      resourceType: '',
      description: '',
      visibility: 'public'
    }
    clearSelectedFile()
    clearSelectedImage()
  }
})
</script> 