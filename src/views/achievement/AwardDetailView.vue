<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { competitionAwardApi, type CompetitionAwardVO } from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const award = ref<CompetitionAwardVO | null>(null)

// 判断是否为作者（从路由参数获取）
const isAuthor = computed(() => {
  return route.query.isAuthor === 'true'
})

const fetchAwardDetail = async () => {
  const id = parseInt(route.params.id as string)
  if (!id) return
  
  loading.value = true
  error.value = ''
  try {
    const response = await competitionAwardApi.getAwardDetail(id)
    if (response.data) {
      award.value = response.data
    }
  } catch (err: any) {
    console.error('获取获奖详情失败:', err)
    error.value = err.message || '获取获奖详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 删除获奖
const handleDelete = async () => {
  if (!award.value?.id) return
  
  if (!confirm('确定要删除这个获奖记录吗？')) return
  
  loading.value = true
  try {
    await competitionAwardApi.deleteAward(award.value.id)
    router.push('/achievement')
  } catch (err: any) {
    error.value = err.message || '删除失败'
  } finally {
    loading.value = false
  }
}

// 编辑获奖
const handleEdit = async () => {
  if (!award.value?.id) return
  
  loading.value = true
  error.value = ''
  try {
    const formData = new FormData()
    const data = {
      competitionName: award.value.competitionName || '',
      description: award.value.description || '',
      awardLevel: award.value.awardLevel || '',
      organizer: award.value.organizer || '',
      awardDate: award.value.awardDate || '',
      teamMembers: award.value.teamMembers || [],
      isPublic: award.value.isPublic ?? false
    }
    
    // 将数据添加到FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // 处理数组（如teamMembers）
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

    await competitionAwardApi.updateAward(award.value.id, formData)
    await fetchAwardDetail() // 刷新数据
  } catch (err: any) {
    error.value = err.message || '更新失败'
  } finally {
    loading.value = false
  }
}

// 上传证书
const handleUploadCertificate = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !award.value?.id) return
  
  const file = input.files[0]
  loading.value = true
  try {
    await competitionAwardApi.uploadCertificate(award.value.id, file)
    await fetchAwardDetail()
  } catch (err: any) {
    error.value = err.message || '上传失败'
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
  fetchAwardDetail()
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

    <div v-else-if="award" class="bg-white shadow rounded-lg overflow-hidden">
      <!-- 操作按钮 - 仅作者可见 -->
      <div v-if="isAuthor" class="px-6 py-4 bg-gray-50 border-b flex justify-end space-x-4">
        <input
          type="file"
          id="certificateUpload"
          class="hidden"
          accept="image/*,.pdf"
          @change="handleUploadCertificate"
        />
        <label
          for="certificateUpload"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          上传证书
        </label>
        <button
          @click="handleEdit"
          class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          编辑
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          删除
        </button>
      </div>

      <div class="px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ award.competitionName }}</h1>
        
        <div class="flex items-center space-x-4 text-sm text-gray-500 mb-6">
          <span>获奖日期：{{ formatDate(award.awardDate) }}</span>
          <span>状态：
            <span class="px-2 py-0.5 rounded-full text-xs" 
                  :class="award.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
              {{ award.isVerified ? '已认证' : '待认证' }}
            </span>
          </span>
          <span>提交时间：{{ formatDate(award.createdAt) }}</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900">基本信息</h3>
            <div class="mt-2 space-y-2">
              <div class="flex">
                <span class="w-24 text-gray-500">获奖级别</span>
                <span class="text-gray-800">{{ award.awardLevel }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">主办方</span>
                <span class="text-gray-800">{{ award.organizer || '未提供' }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">学生姓名</span>
                <span class="text-gray-800">{{ award.userName }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">所属组织</span>
                <span class="text-gray-800">{{ award.organizationName }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">公开状态</span>
                <span class="text-gray-800">{{ award.isPublic ? '公开' : '不公开' }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="award.isVerified">
            <h3 class="text-lg font-medium text-gray-900">认证信息</h3>
            <div class="mt-2 space-y-2">
              <div class="flex">
                <span class="w-24 text-gray-500">认证人</span>
                <span class="text-gray-800">{{ award.verifierName || '未知' }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">认证时间</span>
                <span class="text-gray-800">{{ award.verifyDate ? formatDate(award.verifyDate) : '未知' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">获奖说明</h3>
            <p class="mt-1 text-gray-600 whitespace-pre-line">{{ award.description }}</p>
          </div>
          
          <div v-if="award.teamMembers">
            <h3 class="text-lg font-medium text-gray-900">团队成员</h3>
            <p class="mt-1 text-gray-600">{{ award.teamMembers }}</p>
          </div>
          
          <div v-if="award.certificateUrl">
            <h3 class="text-lg font-medium text-gray-900">获奖证书</h3>
            <img :src="award.certificateUrl" alt="获奖证书" class="mt-2 max-w-full h-auto rounded-lg shadow-sm">
          </div>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-between text-sm text-gray-500">
            <span>最后更新时间：{{ formatDate(award.updatedAt) }}</span>
            <span>ID: {{ award.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      未找到获奖信息
    </div>
  </div>
</template> 