<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">章节资源管理</h3>
      <button 
        @click="showAddResource = true" 
        class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        添加资源
      </button>
    </div>
    
    <div v-if="loading" class="py-4 flex justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="py-4 text-center text-red-500">
      {{ error }}
    </div>
    
    <div v-else-if="chapterResources.length === 0" class="py-4 text-center text-gray-500">
      暂无关联资源
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="resource in chapterResources" 
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
            <div class="font-medium text-gray-800">{{ resource.title || `资源 ${resource.id}` }}</div>
            <div class="text-xs text-gray-500 mt-1">
              {{ resource.fileSize ? formatFileSize(resource.fileSize) : '未知大小' }} · {{ resource.resourceType ? getFileTypeText(resource.resourceType) : '未知类型' }}
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button 
            @click="downloadResource(resource.id, resource.title)"
            class="text-blue-600 hover:text-blue-800 p-1"
            title="下载"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          
          <button 
            @click="removeResource(resource.id)" 
            class="text-red-600 hover:text-red-800 p-1"
            title="移除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 添加资源对话框 -->
    <div 
      v-if="showAddResource" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加资源到章节</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择资源</label>
          <div v-if="availableResourcesLoading" class="py-4 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
          
          <div v-else-if="availableResources.length === 0" class="py-4 text-center text-gray-500">
            暂无可添加的资源
          </div>
          
          <div v-else class="space-y-2 max-h-60 overflow-y-auto">
            <div 
              v-for="resource in availableResources" 
              :key="resource.id"
              :class="[
                'p-3 border rounded-lg cursor-pointer',
                selectedResourceId === resource.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              ]"
              @click="selectedResourceId = resource.id"
            >
              <div class="flex items-center">
                <input 
                  type="radio" 
                  :value="resource.id" 
                  v-model="selectedResourceId"
                  class="mr-3"
                />
                <div>
                  <div class="font-medium text-gray-800">{{ resource.title }}</div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ formatFileSize(resource.fileSize) }} · {{ getFileTypeText(resource.resourceType) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="showAddResource = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            @click="addResource"
            :disabled="!selectedResourceId || addingResource"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="addingResource" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              添加中...
            </span>
            <span v-else>添加</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType, watch } from 'vue'
import { 
  getChapterResources,
  getResourcesByCourseId,
  // addChapterResource,
  associateResourceToChapter,
  removeChapterResource,
  getResourceDownloadUrl,
  CourseResourceVO
} from '@/lib/api/classroom'

// 属性定义
const props = defineProps({
  chapterId: {
    type: Number,
    required: true
  },
  courseId: {
    type: Number,
    required: true
  }
})

// 事件
const emit = defineEmits(['resource-added', 'resource-removed'])

// 状态
const loading = ref(false)
const error = ref('')
const chapterResources = ref<CourseResourceVO[]>([])
const showAddResource = ref(false)
const availableResources = ref<CourseResourceVO[]>([])
const availableResourcesLoading = ref(false)
const selectedResourceId = ref<number | null>(null)
const addingResource = ref(false)

// 方法
const loadChapterResources = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getChapterResources(props.chapterId)
    if (res.code === 200) {
      // 兼容后端返回id数组的情况
      if (Array.isArray(res.data) && typeof res.data[0] === 'number') {
        // 获取所有课程资源，然后根据ID过滤
        const allResourcesRes = await getResourcesByCourseId(props.courseId, 1, 1000)
        if (allResourcesRes.code === 200) {
          const allResources = allResourcesRes.data.records
          const resourceIdSet = new Set(res.data)
          chapterResources.value = allResources.filter(r => resourceIdSet.has(r.id))
        } else {
          // 如果获取完整资源失败，至少显示ID
          chapterResources.value = res.data.map(id => ({ id }))
        }
      } else {
        chapterResources.value = res.data
      }
    } else {
      error.value = res.message || '获取章节资源失败'
    }
  } catch (err) {
    console.error('加载章节资源错误:', err)
    error.value = '加载章节资源时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

const loadAvailableResources = async () => {
  availableResourcesLoading.value = true
  
  try {
    const res = await getResourcesByCourseId(props.courseId, 1, 100)
    if (res.code === 200) {
      // 过滤掉已经添加到章节的资源
      const chapterResourceIds = chapterResources.value.map(r => r.id)
      availableResources.value = res.data.records.filter(r => !chapterResourceIds.includes(r.id))
    }
  } catch (err) {
    console.error('加载可用资源错误:', err)
  } finally {
    availableResourcesLoading.value = false
  }
}

const addResource = async () => {
  if (!selectedResourceId.value) return
  
  addingResource.value = true
  
  try {
    const res = await associateResourceToChapter(props.chapterId, selectedResourceId.value)
    
    if (res.code === 200) {
      // 重新加载章节资源
      await loadChapterResources()
      // 重新加载可用资源
      await loadAvailableResources()
      
      emit('resource-added', selectedResourceId.value)
      
      // 重置状态
      showAddResource.value = false
      selectedResourceId.value = null
    } else {
      error.value = res.message || '添加资源失败'
    }
  } catch (err) {
    console.error('添加资源错误:', err)
    error.value = '添加资源时出错，请稍后再试'
  } finally {
    addingResource.value = false
  }
}

const removeResource = async (resourceId: number) => {
  if (!confirm('确定要移除这个资源吗？')) return
  
  loading.value = true
  
  try {
    const res = await removeChapterResource(props.chapterId, resourceId)
    
    if (res.code === 200) {
      // 重新加载章节资源
      await loadChapterResources()
      // 重新加载可用资源
      await loadAvailableResources()
      
      emit('resource-removed', resourceId)
    } else {
      error.value = res.message || '移除资源失败'
    }
  } catch (err) {
    console.error('移除资源错误:', err)
    error.value = '移除资源时出错，请稍后再试'
  } finally {
    loading.value = false
  }
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

// 获取资源下载链接
const getDownloadUrl = (resourceId: number) => {
  const token = localStorage.getItem('token') || ''
  const baseUrl = getResourceDownloadUrl(resourceId)
  return token ? `${baseUrl}?token=${token}` : baseUrl
}

// 下载资源
const downloadResource = async (resourceId: number, title?: string) => {
  try {
    const token = localStorage.getItem('token') || ''
    const url = `http://192.168.58.74:8081/api/v1/course-resources/download/${resourceId}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`)
    }
    
    // 获取文件名
    const contentDisposition = response.headers.get('content-disposition')
    let filename = title || `resource_${resourceId}`
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }
    
    // 创建blob并下载
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
    
  } catch (error) {
    console.error('下载资源错误:', error)
    alert('下载失败，请稍后再试')
  }
}

// 监听对话框显示状态
watch(showAddResource, (newVal) => {
  if (newVal) {
    loadAvailableResources()
  }
})

// 生命周期
onMounted(() => {
  loadChapterResources()
})
</script> 