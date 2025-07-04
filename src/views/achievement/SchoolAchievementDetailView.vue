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
              <div class="text-gray-500">
                提交时间：{{ formatDate(achievement.createdAt) }}
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
              </div>
            </div>

            <div v-if="achievement.verifyStatus !== 'pending'">
              <h3 class="font-medium mb-2">审核信息</h3>
              <div class="space-y-2 text-gray-600">
                <div>审核人：{{ achievement.verifierName }}</div>
                <div>审核时间：{{ formatDate(achievement.verifyDate) }}</div>
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
              <p class="text-gray-600">{{ achievement.description }}</p>
            </div>
            
            <div class="mb-6">
              <h3 class="font-medium mb-2">项目链接</h3>
              <a 
                :href="achievement.projectUrl" 
                target="_blank"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ achievement.projectUrl }}
              </a>
            </div>

            <div>
              <h3 class="font-medium mb-2">项目资源</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  v-for="resource in achievement.resources" 
                  :key="resource.id"
                  class="relative group"
                >
                  <img 
                    :src="resource.resourceUrl" 
                    :alt="resource.description"
                    class="w-full h-32 object-cover rounded-lg"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a 
                      :href="resource.resourceUrl" 
                      target="_blank"
                      class="text-white hover:underline"
                    >
                      查看原图
                    </a>
                  </div>
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
                  <div>主办方：{{ achievement.organizer }}</div>
                </div>
              </div>

              <div>
                <h3 class="font-medium mb-2">获奖证书</h3>
                <img 
                  :src="achievement.certificateUrl" 
                  alt="获奖证书"
                  class="max-w-full h-auto rounded-lg"
                >
              </div>
            </div>
          </template>

          <!-- 科研成果 -->
          <template v-else-if="achievement.type === 'research'">
            <div class="mb-6">
              <h3 class="font-medium mb-2">成果信息</h3>
              <div class="space-y-2 text-gray-600">
                <div>成果类型：{{ achievement.researchType }}</div>
                <div>发表/获得日期：{{ formatDate(achievement.publicationDate) }}</div>
                <div>发表机构/期刊：{{ achievement.publisher }}</div>
                <div>作者列表：{{ achievement.authors.join(', ') }}</div>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="font-medium mb-2">成果描述</h3>
              <p class="text-gray-600">{{ achievement.description }}</p>
            </div>

            <div>
              <h3 class="font-medium mb-2">相关文件</h3>
              <a 
                :href="achievement.fileUrl" 
                target="_blank"
                class="text-blue-600 hover:text-blue-800"
              >
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
import { achievementApi } from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const achievement = ref<any>(null)

// 审核表单
const verifyForm = ref({
  status: 'verified' as const,
  comment: ''
})

// 获取成果详情
const fetchAchievementDetail = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await achievementApi.getDetail(route.params.id as string)
    achievement.value = response.data
  } catch (err) {
    error.value = '获取成果详情失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 提交审核
const submitVerify = async () => {
  if (!achievement.value) return
  
  try {
    await achievementApi.verifyAchievement(achievement.value.id, verifyForm.value)
    router.push('/achievement/school')
  } catch (error) {
    console.error('提交审核失败:', error)
  }
}

// 格式化函数
const formatType = (type: string) => {
  const typeMap: Record<string, string> = {
    portfolio: '作品集',
    award: '竞赛获奖',
    research: '科研成果'
  }
  return typeMap[type] || type
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待认证',
    verified: '已认证',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classMap[status] || ''
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(fetchAchievementDetail)
</script> 