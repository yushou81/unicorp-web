<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <Loading />
      </div>
      
      <template v-else-if="achievement">
        <!-- 返回按钮 -->
        <button 
          @click="router.back()" 
          class="mb-6 flex items-center text-gray-600 hover:text-gray-800"
        >
          <span class="mr-2">←</span> 返回列表
        </button>

        <!-- 成果基本信息 -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-2xl font-bold mb-2">{{ achievement.title }}</h1>
              <div class="flex items-center space-x-4 text-gray-500">
                <span>提交时间：{{ formatDate(achievement.createdAt) }}</span>
                <span>更新时间：{{ formatDate(achievement.updatedAt) }}</span>
                <span>ID: {{ achievement.id }}</span>
              </div>
            </div>
            <div>
              <span 
                :class="getStatusClass(achievement.verifyStatus)"
                class="px-3 py-1 rounded-full text-sm"
              >
                {{ formatStatus(achievement.verifyStatus) }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium mb-2">基本信息</h3>
              <div class="space-y-2 text-gray-600">
                <div>类型：{{ formatType(achievement.type) }}</div>
                <div>学生：{{ achievement.studentName }}</div>
                <div>学号：{{ achievement.studentId }}</div>
                <div>公开状态：{{ achievement.isPublic ? '公开' : '不公开' }}</div>
                <div v-if="achievement.viewCount !== undefined">浏览量：{{ achievement.viewCount }}</div>
                <div v-if="achievement.likeCount !== undefined">点赞数：{{ achievement.likeCount }}</div>
              </div>
            </div>

            <div v-if="achievement.verifyStatus !== 'pending'">
              <h3 class="font-medium mb-2">审核信息</h3>
              <div class="space-y-2 text-gray-600">
                <div>审核人：{{ achievement.verifierName || '未知' }}</div>
                <div>审核时间：{{ formatDate(achievement.verifyDate || '') }}</div>
                <div>审核意见：{{ achievement.comment || '无' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 成果详细内容 -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">详细内容</h2>
          
          <!-- 作品集 -->
          <template v-if="achievement.type === 'portfolio'">
            <div class="mb-6">
              <h3 class="font-medium mb-2">项目描述</h3>
              <p class="text-gray-600 whitespace-pre-line">{{ achievement.description }}</p>
            </div>
            
            <div v-if="achievement.projectUrl" class="mb-6">
              <h3 class="font-medium mb-2">项目链接</h3>
              <a 
                :href="achievement.projectUrl" 
                target="_blank"
                class="text-blue-600 hover:text-blue-800 flex items-center"
              >
                {{ achievement.projectUrl }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <div v-if="achievement.teamMembers" class="mb-6">
              <h3 class="font-medium mb-2">团队成员</h3>
              <p class="text-gray-600">{{ achievement.teamMembers }}</p>
            </div>
            
            <div v-if="achievement.category" class="mb-6">
              <h3 class="font-medium mb-2">作品分类</h3>
              <p class="text-gray-600">{{ achievement.category }}</p>
            </div>
            
            <div v-if="achievement.tags && achievement.tags.length" class="mb-6">
              <h3 class="font-medium mb-2">标签</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in achievement.tags" 
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div v-if="achievement.coverImageUrl" class="mb-6">
              <h3 class="font-medium mb-2">封面图片</h3>
              <img 
                :src="achievement.coverImageUrl" 
                alt="封面图片"
                class="max-w-full h-auto rounded-lg max-h-96"
              >
            </div>

            <div v-if="achievement.resources && achievement.resources.length" class="mb-6">
              <h3 class="font-medium mb-2">项目资源</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="resource in achievement.resources" 
                  :key="resource.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p class="font-medium text-gray-800">{{ resource.resourceName || resource.originalFileName || '资源文件' }}</p>
                    <p class="text-xs text-gray-500">{{ resource.description || resource.resourceType }}</p>
                  </div>
                  <a 
                    :href="resource.resourceUrl" 
                    target="_blank"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    查看
                  </a>
                </div>
              </div>
            </div>
          </template>

          <!-- 竞赛获奖 -->
          <template v-else-if="achievement.type === 'award'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-medium mb-2">竞赛信息</h3>
                <div class="space-y-2 text-gray-600">
                  <div>竞赛名称：{{ achievement.competitionName }}</div>
                  <div>获奖等级：{{ achievement.awardLevel }}</div>
                  <div>获奖日期：{{ formatDate(achievement.awardDate) }}</div>
                  <div>主办方：{{ achievement.organizer || '未提供' }}</div>
                  <div v-if="achievement.teamMembers">团队成员：{{ achievement.teamMembers }}</div>
                </div>
              </div>

              <div v-if="achievement.certificateUrl">
                <h3 class="font-medium mb-2">获奖证书</h3>
                <img 
                  :src="achievement.certificateUrl" 
                  alt="获奖证书"
                  class="max-w-full h-auto rounded-lg"
                >
              </div>
            </div>
            
            <div class="mt-6">
              <h3 class="font-medium mb-2">获奖说明</h3>
              <p class="text-gray-600 whitespace-pre-line">{{ achievement.description }}</p>
            </div>
          </template>

          <!-- 科研成果 -->
          <template v-else-if="achievement.type === 'research'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 class="font-medium mb-2">成果信息</h3>
                <div class="space-y-2 text-gray-600">
                  <div>成果类型：{{ achievement.researchType }}</div>
                  <div>发表/获得日期：{{ formatDate(achievement.publicationDate) }}</div>
                  <div>发表机构/期刊：{{ achievement.publisher || '未提供' }}</div>
                </div>
              </div>
              
              <div v-if="achievement.coverImageUrl">
                <h3 class="font-medium mb-2">封面图片</h3>
                <img 
                  :src="achievement.coverImageUrl" 
                  alt="封面图片"
                  class="max-w-full h-auto rounded-lg max-h-64"
                >
              </div>
            </div>

            <div class="mb-6">
              <h3 class="font-medium mb-2">作者列表</h3>
              <p class="text-gray-600">{{ achievement.authors }}</p>
            </div>

            <div class="mb-6">
              <h3 class="font-medium mb-2">成果描述</h3>
              <p class="text-gray-600 whitespace-pre-line">{{ achievement.description }}</p>
            </div>

            <div v-if="achievement.fileUrl">
              <h3 class="font-medium mb-2">相关文件</h3>
              <a 
                :href="achievement.fileUrl" 
                target="_blank"
                class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                下载查看
              </a>
            </div>
          </template>
        </div>

        <!-- 审核操作 -->
        <div v-if="achievement.verifyStatus === 'pending'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">审核操作</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">审核结果</label>
            <select v-model="verifyForm.status" class="w-full rounded-md border-gray-300">
              <option value="verified">通过</option>
              <option value="rejected">拒绝</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">审核意见</label>
            <textarea 
              v-model="verifyForm.comment"
              rows="4"
              class="w-full rounded-md border-gray-300"
              placeholder="请输入审核意见"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button 
              @click="submitVerify"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              提交审核
            </button>
          </div>
        </div>
      </template>

      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Loading from '@/components/ui/Loading.vue'
import { 
  type Achievement,
  type AchievementStatus,
  type AchievementType,
  type VerifyDTO,
  competitionAwardApi,
  portfolioApi,
  researchApi
} from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const achievement = ref<Achievement | null>(null)

// 审核表单
const verifyForm = ref({
  status: 'verified' as AchievementStatus,
  comment: ''
})

// 获取成果详情
const fetchAchievementDetail = async () => {
  const id = Number(route.params.id)
  const type = route.params.type as AchievementType
  
  if (!id || !type) {
    error.value = '参数错误'
    return
  }
  
  loading.value = true
  try {
    let response
    switch (type) {
      case 'award':
        response = await competitionAwardApi.getAwardDetail(id)
        break
      case 'portfolio':
        response = await portfolioApi.getPortfolioItemDetail(id)
        break
      case 'research':
        response = await researchApi.getResearchById(id)
        break
      default:
        throw new Error('不支持的成果类型')
    }
    
    if (response?.data) {
      achievement.value = {
        ...response.data,
        type
      }
    }
  } catch (err) {
    console.error('获取成果详情失败:', err)
    error.value = '获取成果详情失败'
  } finally {
    loading.value = false
  }
}

// 提交审核
const submitVerify = async () => {
  if (!achievement.value) return
  
  loading.value = true
  try {
    const verifyData: VerifyDTO = {
      status: verifyForm.value.status,
      comment: verifyForm.value.comment
    }
    
    switch (achievement.value.type) {
      case 'award':
        await competitionAwardApi.verifyAward(achievement.value.id, {
          isVerified: verifyForm.value.status === 'verified'
        })
        break
      case 'portfolio':
        // 需要后端提供相应的API
        console.warn('Portfolio verification API not available')
        break
      case 'research':
        await researchApi.verifyResearch(achievement.value.id, {
          isVerified: verifyForm.value.status === 'verified'
        })
        break
    }
    
    // 刷新数据
    await fetchAchievementDetail()
  } catch (err) {
    console.error('提交审核失败:', err)
    error.value = '提交审核失败'
  } finally {
    loading.value = false
  }
}

// 格式化状态
const formatStatus = (status: AchievementStatus) => {
  const statusMap: Record<AchievementStatus, string> = {
    'pending': '待审核',
    'verified': '已通过',
    'rejected': '已拒绝'
  }
  return statusMap[status] || '未知状态'
}

// 获取状态样式
const getStatusClass = (status: AchievementStatus) => {
  const classMap: Record<AchievementStatus, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'verified': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classMap[status] || ''
}

// 格式化类型
const formatType = (type: AchievementType) => {
  const typeMap: Record<AchievementType, string> = {
    'portfolio': '作品集',
    'award': '竞赛获奖',
    'research': '科研成果'
  }
  return typeMap[type] || '未知类型'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchAchievementDetail()
})
</script> 