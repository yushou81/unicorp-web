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
const handleEdit = () => {
  if (!research.value?.id) return
  router.push({
    path: '/achievement',
    query: {
      edit: 'true',
      type: 'RESEARCH',
      id: research.value.id
    }
  })
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

    <div v-else-if="research" class="w-3/4 mx-auto">
      <!-- 标题栏 -->
      <div class="bg-white shadow-lg rounded-t-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-3xl">🔬</span>
              <h1 class="text-2xl font-bold text-white">{{ research.title}}</h1>
            </div>
            <div class="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white">
              {{ research.isVerified ? '已认证' : '待认证' }}
            </div>
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="px-8 py-4 bg-gray-50 border-b flex justify-between text-sm text-gray-600">
          <div class="flex space-x-8">
            <div class="flex items-center space-x-2">
              <span class="text-xl">📅</span>
              <span>发表日期：{{ formatDate(research.publicationDate) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xl">⏱️</span>
              <span>提交时间：{{ formatDate(research.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-lg rounded-b-2xl p-8">
        <!-- 基本信息卡片 -->
        <div class="bg-indigo-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-indigo-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            基本信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">成果类型</span>
                <span>{{ research.type }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">作者</span>
                <span>{{ research.authors }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">提交人</span>
                <span>{{ research.userName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">所属组织</span>
                <span>{{ research.organizationName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">发表单位</span>
                <span>{{ research.publisher || '未提供' }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">发布日期</span>
                <span>{{ formatDate(research.publicationDate) }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">创建时间</span>
                <span>{{ formatDate(research.createdAt) }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-indigo-700 font-medium w-24">更新时间</span>
                <span>{{ formatDate(research.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 封面图片 -->
        <div v-if="research.coverImageUrl" class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            封面图片
          </h2>
          <div class="flex justify-center">
            <img 
              :src="research.coverImageUrl" 
              alt="封面图片" 
              class="max-w-full max-h-96 rounded-lg shadow-lg object-contain"
            >
          </div>
        </div>

        <!-- 成果描述 -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            成果描述
          </h2>
          <p class="text-gray-600 whitespace-pre-line">{{ research.description }}</p>
        </div>

        <!-- 认证信息 -->
        <div v-if="research.isVerified" class="bg-green-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-green-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            认证信息
          </h2>
          <div class="space-y-4">
            <div class="flex items-center">
              <span class="text-green-700 font-medium w-24">认证人</span>
              <span>{{ research.verifierName || '未知' }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-700 font-medium w-24">认证时间</span>
              <span>{{ research.verifyDate ? formatDate(research.verifyDate) : '未知' }}</span>
            </div>
          </div>
        </div>

        <!-- 相关文件 -->
        <div v-if="research.fileUrl" class="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            相关文件
          </h2>
          <div class="flex items-center justify-between p-3 bg-white rounded-lg">
            <div class="flex items-center space-x-3">
              <span class="text-xl">{{ research.fileUrl.toLowerCase().endsWith('.pdf') ? '📄' : 
                                    research.fileUrl.toLowerCase().endsWith('.doc') || research.fileUrl.toLowerCase().endsWith('.docx') ? '📝' : 
                                    research.fileUrl.toLowerCase().endsWith('.jpg') || research.fileUrl.toLowerCase().endsWith('.png') ? '🖼️' : '📎' }}</span>
              <div>
                <p class="text-gray-800 font-medium">{{ research.fileUrl.split('/').pop() || '资源文件' }}</p>
                <p class="text-sm text-gray-500">类型：{{ research.fileUrl.split('.').pop().toUpperCase() || '未知' }}</p>
              </div>
            </div>
            <a 
              :href="research.fileUrl" 
              target="_blank"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载
            </a>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-between text-sm text-gray-500">
            <span>ID: {{ research.id }}</span>
          </div>
        </div>

        <!-- 操作按钮 - 仅作者可见 -->
        <div v-if="isAuthor" class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-end space-x-4">
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
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
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
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                上传封面图片
              </label>
              <button
                @click="handleEdit"
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>
            </template>
            <!-- 删除按钮始终可见 -->
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      未找到科研成果信息
    </div>
  </div>
</template> 