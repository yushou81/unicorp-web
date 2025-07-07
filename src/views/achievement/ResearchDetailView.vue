<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { researchApi, type ResearchVO } from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const research = ref<ResearchVO | null>(null)

// 判断是否为作者（从路由参数获取）
const isAuthor = computed(() => {
  return route.query.isAuthor === 'true'
})

const fetchResearchDetail = async () => {
  const id = parseInt(route.params.id as string)
  if (!id) return
  
  loading.value = true
  error.value = ''
  try {
    const response = await researchApi.getResearchById(id)
    if (response.data) {
      research.value = response.data
    }
  } catch (err: any) {
    console.error('获取科研成果详情失败:', err)
    error.value = err.message || '获取科研成果详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 删除研究成果
const handleDelete = async () => {
  if (!research.value?.id) return
  
  if (!confirm('确定要删除这个研究成果吗？')) return
  
  loading.value = true
  try {
    await researchApi.deleteResearch(research.value.id)
    router.push('/achievement')
  } catch (err: any) {
    error.value = err.message || '删除失败'
  } finally {
    loading.value = false
  }
}

// 编辑研究成果
const handleEdit = async () => {
  if (!research.value?.id) return
  
  // 如果已认证，不允许编辑
  if (research.value.isVerified) {
    error.value = '已认证的科研成果不允许修改'
    return
  }
  
  loading.value = true
  error.value = ''
  try {
    const formData = new FormData()
    const data = {
      title: research.value.title || '',
      description: research.value.description || '',
      type: research.value.type || '',
      authors: research.value.authors || [],
      publisher: research.value.publisher || '',
      publicationDate: research.value.publicationDate || '',
      isPublic: research.value.isPublic ?? false
    }
    
    // 将数据添加到FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // 处理数组（如authors）
          formData.append(key, JSON.stringify(value))
        } else if (typeof value === 'boolean') {
          // 处理布尔值
          formData.append(key, value.toString())
        } else {
          // 处理其他值
          formData.append(key, String(value))
        }
      }
    })

    await researchApi.updateResearch(research.value.id, formData)
    await fetchResearchDetail() // 刷新数据
  } catch (err: any) {
    error.value = err.message || '更新失败'
  } finally {
    loading.value = false
  }
}

// 上传资源文件
const handleUploadFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !research.value?.id) return
  
  // 如果已认证，不允许上传
  if (research.value.isVerified) {
    error.value = '已认证的科研成果不允许修改'
    input.value = ''  // 清空input
    return
  }
  
  const file = input.files[0]
  loading.value = true
  try {
    await researchApi.uploadResearchFile(research.value.id, file)
    await fetchResearchDetail()
  } catch (err: any) {
    error.value = err.message || '上传资源文件失败'
  } finally {
    loading.value = false
    input.value = ''  // 清空input
  }
}

// 上传封面图片
const handleUploadCover = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !research.value?.id) return
  
  // 如果已认证，不允许上传
  if (research.value.isVerified) {
    error.value = '已认证的科研成果不允许修改'
    input.value = ''  // 清空input
    return
  }
  
  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    input.value = ''
    return
  }
  
  console.log('准备上传封面图片:', {
    name: file.name,
    type: file.type,
    size: file.size
  })
  
  loading.value = true
  try {
    console.log('开始上传封面图片...')
    await researchApi.uploadResearchCover(research.value.id, file)
    console.log('封面图片上传成功')
    await fetchResearchDetail()
  } catch (err: any) {
    console.error('上传封面图片失败:', err)
    error.value = err.message || '上传封面图片失败'
  } finally {
    loading.value = false
    input.value = ''  // 清空input
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

onMounted(() => {
  fetchResearchDetail()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <div v-else-if="research" class="bg-white shadow rounded-lg overflow-hidden">
      <!-- 操作按钮 - 仅作者可见 -->
      <div v-if="isAuthor" class="px-6 py-4 bg-gray-50 border-b flex justify-end space-x-4">
        <!-- 上传资源文件 - 仅未认证时可见 -->
        <template v-if="!research.isVerified">
        <input
          type="file"
          id="fileUpload"
          class="hidden"
          @change="handleUploadFile"
        />
        <label
          for="fileUpload"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
            上传资源文件
          </label>

          <!-- 上传封面图片 - 仅未认证时可见 -->
          <input
            type="file"
            id="coverUpload"
            class="hidden"
            accept="image/*"
            @change="handleUploadCover"
          />
          <label
            for="coverUpload"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            上传封面图片
        </label>
        <button
          @click="handleEdit"
          class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          编辑
        </button>
        </template>
        <!-- 删除按钮始终可见 -->
        <button
          @click="handleDelete"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          删除
        </button>
      </div>

      <div class="px-6 py-4">
        <div class="flex justify-between items-start mb-4">
          <h1 class="text-2xl font-bold text-gray-900">{{ research.title }}</h1>
          <span 
            class="px-2 py-1 rounded-full text-xs"
            :class="research.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ research.isPublic ? '公开' : '不公开' }}
          </span>
        </div>
        
        <div class="flex items-center space-x-4 text-sm text-gray-500 mb-6">
          <span>发布日期：{{ formatDate(research.publicationDate) }}</span>
          <span>状态：
            <span class="px-2 py-0.5 rounded-full text-xs" 
                  :class="research.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
              {{ research.isVerified ? '已认证' : '待认证' }}
            </span>
          </span>
          <span>创建时间：{{ formatDate(research.createdAt) }}</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
            <div class="space-y-3">
              <div class="flex">
                <span class="w-24 text-gray-500">成果类型</span>
                <span class="text-gray-800">{{ research.type }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">作者</span>
                <span class="text-gray-800">{{ research.authors }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">提交人</span>
                <span class="text-gray-800">{{ research.userName }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">所属组织</span>
                <span class="text-gray-800">{{ research.organizationName }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">发表单位</span>
                <span class="text-gray-800">{{ research.publisher || '未提供' }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="research.coverImageUrl" class="flex justify-center items-center">
            <img 
              :src="research.coverImageUrl" 
              alt="封面图片" 
              class="max-w-full max-h-64 rounded-lg shadow-sm object-contain"
            >
          </div>
        </div>
        
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">成果描述</h3>
          <p class="text-gray-600 whitespace-pre-line">{{ research.description }}</p>
        </div>
        
        <div v-if="research.isVerified" class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">认证信息</h3>
          <div class="space-y-3">
            <div class="flex">
              <span class="w-24 text-gray-500">认证人</span>
              <span class="text-gray-800">{{ research.verifierName || '未知' }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-gray-500">认证时间</span>
              <span class="text-gray-800">{{ research.verifyDate ? formatDate(research.verifyDate) : '未知' }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="research.fileUrl" class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">相关文件</h3>
          <a 
            :href="research.fileUrl" 
            target="_blank"
            class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            下载文件
          </a>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-between text-sm text-gray-500">
            <span>最后更新时间：{{ formatDate(research.updatedAt) }}</span>
            <span>ID: {{ research.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      未找到科研成果信息
    </div>
  </div>
</template> 