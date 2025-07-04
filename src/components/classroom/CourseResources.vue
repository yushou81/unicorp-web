<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">课程资源</h2>
      <div class="flex space-x-2">
        <div class="relative">
          <select 
            v-model="resourceType" 
            @change="filterResources"
            class="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">全部类型</option>
            <option value="document">文档</option>
            <option value="video">视频</option>
            <option value="code">代码</option>
            <option value="other">其他</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        
        <button 
          v-if="isTeacher"
          @click="showUploadDialog = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          上传资源
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="py-10 flex justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="py-6 text-center text-red-500">
      {{ error }}
    </div>
    
    <div v-else-if="resources.length === 0" class="py-6 text-center text-gray-500">
      暂无课程资源
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="resource in resources" 
        :key="resource.id" 
        class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
      >
        <div class="flex items-center">
          <!-- 文档图标 -->
          <svg v-if="resource.resourceType === 'document'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          
          <!-- 视频图标 -->
          <svg v-else-if="resource.resourceType === 'video'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          
          <!-- 代码图标 -->
          <svg v-else-if="resource.resourceType === 'code'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          
          <!-- 其他文件图标 -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          
          <div>
            <div class="font-medium text-gray-800">{{ resource.title }}</div>
            <div class="text-xs text-gray-500 mt-1">
              {{ formatFileSize(resource.fileSize) }} · {{ getFileTypeText(resource.resourceType) }}
              <span class="ml-2">上传者: {{ resource.uploaderName }}</span>
              <span class="ml-2">{{ formatDate(resource.createdAt) }}</span>
            </div>
            <div v-if="resource.description" class="text-xs text-gray-600 mt-1">
              {{ resource.description }}
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <!-- 直接超链接下载 -->
          <a
            :href="getDownloadUrl(resource.id)"
            target="_blank"
            class="text-blue-600 hover:text-blue-800 p-1 flex items-center"
            title="下载"
            download
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          
          <button 
            v-if="isTeacher && (resource.uploaderId === currentUserId || isResourceManager)"
            @click="confirmDeleteResource(resource)"
            class="text-red-600 hover:text-red-800 p-1"
            title="删除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 分页 -->
    <div v-if="totalPages > 1" class="mt-4 flex justify-center">
      <nav class="flex items-center">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 mx-1 rounded-md', 
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          上一页
        </button>
        
        <div v-for="page in paginationRange" :key="page" class="mx-1">
          <button 
            v-if="page !== '...'"
            @click="changePage(Number(page))" 
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === Number(page) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-3 py-1">...</span>
        </div>
        
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-1 mx-1 rounded-md', 
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          下一页
        </button>
      </nav>
    </div>
    
    <!-- 上传资源对话框 -->
    <div 
      v-if="showUploadDialog" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">上传课程资源</h3>
        <form @submit.prevent="uploadResource">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">资源标题</label>
            <input 
              v-model="resourceForm.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">资源描述</label>
            <textarea 
              v-model="resourceForm.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">资源类型</label>
            <select 
              v-model="resourceForm.resourceType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="document">文档</option>
              <option value="video">视频</option>
              <option value="code">代码</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">文件</label>
            <div 
              @dragover.prevent 
              @drop.prevent="onFileDrop"
              class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
              :class="{'border-blue-500': isDragging}"
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
            >
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden"
                @change="onFileChange"
              />
              
              <div v-if="!resourceFile">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="mt-1 text-sm text-gray-600">
                  将文件拖到此处，或
                  <button type="button" @click="$refs.fileInput.click()" class="text-blue-600 hover:text-blue-800">
                    浏览文件
                  </button>
                </p>
                <p class="mt-1 text-xs text-gray-500">
                  支持各种文件类型，最大 50MB
                </p>
              </div>
              
              <div v-else class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div class="flex-1 truncate text-left">
                  {{ resourceFile ? resourceFile.name : '无' }}
                </div>
                <button 
                  type="button" 
                  @click="resourceFile = null"
                  class="ml-2 text-gray-500 hover:text-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              type="button"
              @click="cancelUpload"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              :disabled="uploading || !resourceFile || !resourceForm.title.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
              :class="{'opacity-50 cursor-not-allowed': uploading || !resourceFile || !resourceForm.title.trim()}"
            >
              <svg v-if="uploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ uploading ? '上传中...' : '上传' }}
            </button>
          </div>
          <!-- 调试输出：实时显示file和title -->
          <div class="mt-2 text-xs text-gray-500">file: {{ resourceFile ? resourceFile.name : '无' }} | title: {{ resourceForm.title }}</div>
          <div class="mt-2 text-xs text-red-500">resourceForm: {{ JSON.stringify(resourceForm) }}</div>
        </form>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div 
      v-if="deletingResource" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-2">确认删除</h3>
        <p class="text-gray-600 mb-4">
          确定要删除资源 "{{ deletingResource.title }}" 吗？此操作不可撤销。
        </p>
        <div class="flex justify-end space-x-2">
          <button 
            @click="deletingResource = null"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            @click="deleteResource"
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('CourseResources setup')
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { 
  getResourcesByCourseId, 
  uploadResource as uploadResourceApi, 
  deleteResource as deleteResourceApi,
  getResourceDownloadUrl,
  CourseResourceVO
} from '@/lib/api/classroom'
import { getToken } from '@/lib/api/apiClient'

// 属性定义
const props = defineProps({
  courseId: {
    type: Number,
    required: true
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  isResourceManager: {
    type: Boolean,
    default: false
  },
  currentUserId: {
    type: Number,
    default: null
  }
})

// 事件
const emit = defineEmits(['resource-uploaded', 'resource-deleted'])

// 状态
const loading = ref(false)
const error = ref('')
const resources = ref<CourseResourceVO[]>([])
const resourceType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showUploadDialog = ref(false)
const uploading = ref(false)
const isDragging = ref(false)
const deletingResource = ref<CourseResourceVO | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const downloadingId = ref<number | null>(null)

const resourceForm = reactive({
  title: '',
  description: '',
  resourceType: 'document' as 'document' | 'video' | 'code' | 'other'
})
const resourceFile = ref<File | null>(null)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const paginationRange = computed(() => {
  const range: (number | string)[] = []
  const maxPages = 5 // 最多显示的页码数
  
  if (totalPages.value <= maxPages) {
    // 总页数较少，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i)
    }
  } else {
    // 总页数较多，需要省略部分页码
    range.push(1) // 始终显示第一页
    
    if (currentPage.value <= 3) {
      // 当前页靠近开始
      for (let i = 2; i <= 4; i++) {
        range.push(i)
      }
      range.push('...')
    } else if (currentPage.value >= totalPages.value - 2) {
      // 当前页靠近结束
      range.push('...')
      for (let i = totalPages.value - 3; i < totalPages.value; i++) {
        range.push(i)
      }
    } else {
      // 当前页在中间
      range.push('...')
      range.push(currentPage.value - 1)
      range.push(currentPage.value)
      range.push(currentPage.value + 1)
      range.push('...')
    }
    
    range.push(totalPages.value) // 始终显示最后一页
  }
  
  return range
})

// 方法
const loadResources = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const res = await getResourcesByCourseId(
      props.courseId, 
      currentPage.value, 
      pageSize.value,
      resourceType.value || undefined
    )
    
    if (res.code === 200) {
      resources.value = res.data.records
      total.value = res.data.total
    } else {
      error.value = res.message || '获取资源失败'
    }
  } catch (err) {
    console.error('加载资源错误:', err)
    error.value = '加载资源时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

const filterResources = () => {
  currentPage.value = 1 // 重置到第一页
  loadResources()
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadResources()
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    resourceFile.value = input.files[0]
    console.log('文件已选择:', resourceFile.value)
  } else {
    resourceFile.value = null
  }
}

const onFileDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    resourceFile.value = event.dataTransfer.files[0]
    console.log('拖拽文件已选择:', resourceFile.value)
  }
}

const cancelUpload = () => {
  showUploadDialog.value = false
  resourceForm.title = ''
  resourceForm.description = ''
  resourceForm.resourceType = 'document'
  resourceFile.value = null
}

const uploadResource = async () => {
  console.log('点击上传', resourceForm, resourceFile.value)
  if (!resourceFile.value || !resourceForm.title.trim()) {
    error.value = '请填写完整信息并选择文件';
    return
  }
  uploading.value = true
  error.value = ''
  try {
    const formData = new FormData()
    formData.append('file', resourceFile.value)
    formData.append('courseId', props.courseId.toString())
    formData.append('title', resourceForm.title.trim())
    formData.append('description', resourceForm.description.trim())
    formData.append('resourceType', resourceForm.resourceType)
    // 输出FormData所有内容
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`FormData: ${key}`, value, `name: ${value.name}, size: ${value.size}`)
      } else {
        console.log(`FormData: ${key}`, value)
      }
    }
    const res = await uploadResourceApi(formData)
    if (res.code === 200) {
      cancelUpload()
      loadResources()
      emit('resource-uploaded', res.data)
    } else {
      error.value = res.message || '上传资源失败'
    }
  } catch (err) {
    console.error('上传资源错误:', err)
    error.value = '上传资源时出错，请稍后再试'
  } finally {
    uploading.value = false
  }
}

const confirmDeleteResource = (resource: CourseResourceVO) => {
  deletingResource.value = resource
}

const deleteResource = async () => {
  if (!deletingResource.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await deleteResourceApi(deletingResource.value.id)
    
    if (res.code === 200) {
      resources.value = resources.value.filter(r => r.id !== deletingResource.value?.id)
      emit('resource-deleted', deletingResource.value)
      deletingResource.value = null
    } else {
      error.value = res.message || '删除资源失败'
    }
  } catch (err) {
    console.error('删除资源错误:', err)
    error.value = '删除资源时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 获取资源下载链接
const getDownloadUrl = (resourceId: number) => {
  return getResourceDownloadUrl(resourceId)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + ' B'
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB'
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }
}

// 获取文件类型文本
const getFileTypeText = (resourceType: string) => {
  const typeTexts: Record<string, string> = {
    'document': '文档',
    'video': '视频',
    'code': '代码',
    'other': '其他'
  }
  return typeTexts[resourceType] || '未知类型'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 监听属性变化
watch(() => props.courseId, () => {
  if (props.courseId) {
    currentPage.value = 1
    loadResources()
  }
}, { immediate: true })
</script> 